import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { productId: string; email: string; price: string }
}) {
  const product = await db.product.findUnique({
    where: { id: searchParams.productId },
  })
  if (product == null) return notFound()

  const isSuccess = await createOrder(
    searchParams.email,
    searchParams.productId,
    parseInt(searchParams.price)
  )

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? "Order Placed Successfully!" : "Error!"}
      </h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInPiasters / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
          <Button className="mt-4" size="lg" asChild>
            {isSuccess ? (
              <a
                href={`/products/download/${await createDownloadVerification(
                  product.id
                )}`}
              >
                Download
              </a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
            )}
          </Button>
        </div>
      </div>
      {isSuccess && (
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Payment Instructions</h2>
          <p className="text-muted-foreground">
            You have selected Cash on Delivery. Please have the exact amount of{" "}
            <strong>{formatCurrency(product.priceInPiasters / 100)}</strong> ready when your order arrives.
          </p>
          <p className="text-muted-foreground mt-2">
            A confirmation email has been sent to <strong>{searchParams.email}</strong>.
          </p>
        </div>
      )}
    </div>
  )
}

async function createDownloadVerification(productId: string) {
  return (
    await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  ).id
}

async function createOrder(email: string, productId: string, pricePaidInPiasters: number) {
  try {
    const product = await db.product.findUnique({ where: { id: productId } })
    if (product == null) return false

    // Check if product is in stock
    if (product.stockQuantity <= 0) {
      console.error("Product out of stock")
      return false
    }

    const userFields = {
      email,
      orders: { create: { productId, pricePaidInPiasters } },
    }

    // Create order and decrement stock in a transaction
    await db.$transaction([
      db.user.upsert({
        where: { email },
        create: userFields,
        update: userFields,
      }),
      db.product.update({
        where: { id: productId },
        data: { stockQuantity: { decrement: 1 } }
      })
    ])

    return true
  } catch (error) {
    console.error("Error creating order:", error)
    return false
  }
}


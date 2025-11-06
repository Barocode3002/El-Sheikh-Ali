import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ShoppingBag, CheckCircle } from "lucide-react"

type OrderItem = {
  productId: string
  quantity: number
  priceInPiasters: number
}

export default async function CartSuccessPage({
  searchParams,
}: {
  searchParams: { email: string; total: string; items: string }
}) {
  if (!searchParams.email || !searchParams.items) {
    return notFound()
  }

  const items: OrderItem[] = JSON.parse(searchParams.items)
  const total = parseInt(searchParams.total)

  const isSuccess = await createCartOrders(searchParams.email, items)

  // Fetch product details for display
  const products = await db.product.findMany({
    where: {
      id: { in: items.map(item => item.productId) }
    }
  })

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8 px-4 py-8">
      <div className="text-center space-y-4">
        {isSuccess ? (
          <>
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
            <h1 className="text-4xl font-bold">Order Placed Successfully!</h1>
            <p className="text-muted-foreground text-lg">
              Thank you for your order. We&apos;ll deliver it soon!
            </p>
          </>
        ) : (
          <>
            <ShoppingBag className="w-20 h-20 text-red-600 mx-auto" />
            <h1 className="text-4xl font-bold">Error!</h1>
            <p className="text-muted-foreground text-lg">
              There was an error processing your order. Some items may be out of stock.
            </p>
          </>
        )}
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Order Summary</h2>
          {items.map((item) => {
            const product = products.find(p => p.id === item.productId)
            if (!product) return null

            return (
              <div key={item.productId} className="flex gap-4 items-center p-4 border rounded-lg">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={product.imagePath}
                    fill
                    alt={product.name}
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.priceInPiasters / 100)} × {item.quantity}
                  </p>
                </div>
                <div className="font-semibold">
                  {formatCurrency((item.priceInPiasters * item.quantity) / 100)}
                </div>
              </div>
            )
          })}
          
          <div className="border-t pt-4 flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>{formatCurrency(total / 100)}</span>
          </div>
        </CardContent>
      </Card>

      {isSuccess && (
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Payment Instructions</h2>
          <p className="text-muted-foreground">
            You have selected Cash on Delivery. Please have the exact amount of{" "}
            <strong>{formatCurrency(total / 100)}</strong> ready when your order arrives.
          </p>
          <p className="text-muted-foreground mt-2">
            A confirmation email has been sent to <strong>{searchParams.email}</strong>.
          </p>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>
        {!isSuccess && (
          <Button asChild variant="outline" size="lg">
            <Link href="/cart">Back to Cart</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

async function createCartOrders(email: string, items: OrderItem[]) {
  try {
    // Check stock availability for all items
    const products = await db.product.findMany({
      where: {
        id: { in: items.map(item => item.productId) }
      },
      select: {
        id: true,
        stockQuantity: true
      }
    })

    // Verify all items have sufficient stock
    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (!product || product.stockQuantity < item.quantity) {
        console.error(`Insufficient stock for product ${item.productId}`)
        return false
      }
    }

    // Create all orders and update stock in a transaction
    await db.$transaction([
      // Upsert user and create orders
      db.user.upsert({
        where: { email },
        create: {
          email,
          orders: {
            create: items.map(item => ({
              productId: item.productId,
              pricePaidInPiasters: item.priceInPiasters * item.quantity
            }))
          }
        },
        update: {
          orders: {
            create: items.map(item => ({
              productId: item.productId,
              pricePaidInPiasters: item.priceInPiasters * item.quantity
            }))
          }
        }
      }),
      // Update stock for all products
      ...items.map(item =>
        db.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } }
        })
      )
    ])

    return true
  } catch (error) {
    console.error("Error creating cart orders:", error)
    return false
  }
}


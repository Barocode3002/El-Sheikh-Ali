import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import db from "@/db/db"
import { cache } from "@/lib/cache"
import { ShoppingBag } from "lucide-react"
import { Suspense } from "react"

const getProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: "asc" },
  })
}, ["/products", "getProducts"])

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-coffee-dark to-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <ShoppingBag className="w-12 h-12 text-accent" />
            <h1 className="text-5xl md:text-6xl font-bold">Order Online</h1>
          </div>
          <p className="text-xl text-cream max-w-2xl">
            Browse our full selection and order your favorites for pickup or delivery
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          }
        >
          <ProductsSuspense />
        </Suspense>
      </div>
    </main>
  )
}

async function ProductsSuspense() {
  const products = await getProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground">
          No products available at the moment. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => <ProductCard key={product.id} {...product} />)}
    </div>
  )
}

import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
// Temporarily disabled until Vercel Postgres is set up
// import db from "@/db/db"
// import { cache } from "@/lib/cache"
import { ShoppingBag } from "lucide-react"
import { Suspense } from "react"

// Temporarily disabled until Vercel Postgres is set up
// const getProducts = cache(() => {
//   return db.product.findMany({
//     where: { isAvailableForPurchase: true },
//     orderBy: { name: "asc" },
//   })
// }, ["/products", "getProducts"])

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
        <div className="text-center py-20 bg-secondary/30 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Online Ordering Coming Soon</h2>
          <p className="text-xl text-muted-foreground mb-6">
            We're currently setting up our online ordering system. Please check back soon or call us to place an order!
          </p>
          <p className="text-sm text-muted-foreground">
            📍 123 Coffee Street, Your City | ☎️ +20 1211162791
          </p>
        </div>
      </div>

      {/* Temporarily disabled until Vercel Postgres is set up */}
      {/* <div className="container mx-auto px-4 py-16">
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
      </div> */}
    </main>
  )
}

// Temporarily disabled until Vercel Postgres is set up
// async function ProductsSuspense() {
//   const products = await getProducts()

//   if (products.length === 0) {
//     return (
//       <div className="text-center py-20">
//         <p className="text-xl text-muted-foreground">
//           No products available at the moment. Check back soon!
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {products.map(product => <ProductCard key={product.id} {...product} />)}
//     </div>
//   )
// }

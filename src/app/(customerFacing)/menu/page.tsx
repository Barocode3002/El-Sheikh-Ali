import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
// Temporarily disabled until Vercel Postgres is set up
// import db from "@/db/db"
// import { cache } from "@/lib/cache"
import { Coffee, Croissant, Gift, Leaf } from "lucide-react"
import { Suspense } from "react"

// Temporarily disabled until Vercel Postgres is set up
// const getProductsByCategory = cache((category: string) => {
//   return db.product.findMany({
//     where: { 
//       isAvailableForPurchase: true,
//       category: category
//     },
//     orderBy: { name: "asc" },
//   })
// }, ["/menu", "getProductsByCategory"])

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-coffee-dark to-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-cream max-w-2xl">
            Explore our carefully curated selection of premium beverages, delicious treats, and exclusive merchandise
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-12 bg-secondary/30 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Menu Coming Soon</h2>
          <p className="text-muted-foreground text-lg mb-6">
            We're currently setting up our online menu. Please check back soon or visit us in person to see our full selection!
          </p>
          <p className="text-sm text-muted-foreground">
            📍 123 Coffee Street, Your City | ☎️ +20 1211162791
          </p>
        </div>
      </div>

      {/* Temporarily disabled until Vercel Postgres is set up */}
      {/* <div className="container mx-auto px-4 py-16 space-y-20">
        <MenuSection
          title="Coffee & Espresso"
          description="Handcrafted beverages made with premium beans"
          icon={<Coffee className="w-10 h-10" />}
          category="coffee"
        />

        <MenuSection
          title="Tea & More"
          description="Refreshing teas and specialty drinks"
          icon={<Leaf className="w-10 h-10" />}
          category="tea"
        />

        <MenuSection
          title="Food & Treats"
          description="Delicious pastries and snacks"
          icon={<Croissant className="w-10 h-10" />}
          category="food"
        />

        <MenuSection
          title="Merchandise"
          description="Take El Sheikh Ali home with you"
          icon={<Gift className="w-10 h-10" />}
          category="merchandise"
        />
      </div> */}
    </main>
  )
}

// Temporarily disabled until Vercel Postgres is set up
// type MenuSectionProps = {
//   title: string
//   description: string
//   icon: React.ReactNode
//   category: string
// }

// function MenuSection({ title, description, icon, category }: MenuSectionProps) {
//   return (
//     <section className="space-y-6">
//       <div className="flex items-start gap-4 pb-4 border-b-2 border-accent/30">
//         <div className="text-coffee-medium mt-1">{icon}</div>
//         <div>
//           <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{title}</h2>
//           <p className="text-muted-foreground text-lg">{description}</p>
//         </div>
//       </div>
//       <Suspense
//         fallback={
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <ProductCardSkeleton />
//             <ProductCardSkeleton />
//             <ProductCardSkeleton />
//           </div>
//         }
//       >
//         <ProductGrid category={category} />
//       </Suspense>
//     </section>
//   )
// }

// async function ProductGrid({ category }: { category: string }) {
//   const products = await getProductsByCategory(category)
  
//   if (products.length === 0) {
//     return (
//       <div className="text-center py-12 bg-secondary/30 rounded-lg">
//         <p className="text-muted-foreground text-lg">
//           No items available in this category yet. Check back soon!
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {products.map(product => (
//         <ProductCard key={product.id} {...product} />
//       ))}
//     </div>
//   )
// }

import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import { Hero } from "@/components/Hero"
import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { cache } from "@/lib/cache"
import { Product } from "@prisma/client"
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    })
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 }
)

const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  })
}, ["/", "getNewestProducts"])

const getFeaturedProducts = cache(() => {
  return db.product.findMany({
    where: {
      isAvailableForPurchase: true,
      featured: true
    },
    take: 3,
  })
}, ["/", "getFeaturedProducts"])

export default function HomePage() {
  return (
    <main>
      <Hero />
      <div className="container mx-auto px-4 py-16 space-y-20">
        <ProductGridSection
          title="Customer Favorites"
          subtitle="Our most loved beverages"
          icon={<TrendingUp className="w-8 h-8" />}
          productsFetcher={getMostPopularProducts}
        />
        <ProductGridSection
          title="New Arrivals"
          subtitle="Fresh additions to our menu"
          icon={<Sparkles className="w-8 h-8" />}
          productsFetcher={getNewestProducts}
        />
      </div>
    </main>
  )
}

type ProductGridSectionProps = {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  productsFetcher: () => Promise<Product[]>
}

function ProductGridSection({
  productsFetcher,
  title,
  subtitle,
  icon,
}: ProductGridSectionProps) {
  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-coffee-medium">
            {icon}
            <h2 className="text-4xl font-bold text-foreground">{title}</h2>
          </div>
          {subtitle && (
            <p className="text-muted-foreground text-lg">{subtitle}</p>
          )}
        </div>
        <Button
          variant="outline"
          asChild
          className="border-2 border-primary hover:bg-primary hover:text-primary-foreground rounded-full font-semibold"
        >
          <Link href="/products" className="flex items-center gap-2">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </section>
  )
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>
}) {
  return (await productsFetcher()).map(product => (
    <ProductCard key={product.id} {...product} />
  ))
}

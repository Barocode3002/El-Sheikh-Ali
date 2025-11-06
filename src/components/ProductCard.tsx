import { formatCurrency } from "@/lib/formatters"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Star, Plus, AlertCircle } from "lucide-react"
import { AddToCartButton } from "./AddToCartButton"

type ProductCardProps = {
  id: string
  name: string
  priceInPiasters: number
  description: string
  imagePath: string
  stockQuantity: number
}

export function ProductCard({
  id,
  name,
  priceInPiasters,
  description,
  imagePath,
  stockQuantity,
}: ProductCardProps) {
  const isOutOfStock = stockQuantity === 0
  const isLowStock = stockQuantity > 0 && stockQuantity <= 3

  return (
    <Card className="group flex overflow-hidden flex-col hover:shadow-2xl transition-all duration-300 border-2 hover:border-accent/50 bg-card">
      <div className="relative w-full h-auto aspect-video overflow-hidden bg-gradient-to-br from-coffee-light to-cream">
        <Image
          src={imagePath}
          fill
          alt={name}
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!isOutOfStock && (
          <div className="absolute top-3 right-3 bg-accent text-espresso px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {formatCurrency(priceInPiasters / 100)}
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-xl">
              Out of Stock
            </div>
          </div>
        )}
      </div>
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl group-hover:text-coffee-medium transition-colors">
          {name}
        </CardTitle>
        <div className="flex items-center gap-1 text-accent">
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
        </div>
        {isLowStock && (
          <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
            <AlertCircle className="w-4 h-4" />
            Only {stockQuantity} item{stockQuantity !== 1 ? 's' : ''} available
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
      <CardFooter className="pt-4 flex gap-2">
        <AddToCartButton
          product={{ id, name, priceInPiasters, imagePath }}
          className="flex-1"
          disabled={isOutOfStock}
        />
        <Button
          asChild={!isOutOfStock}
          size="lg"
          variant="outline"
          className="px-4"
          disabled={isOutOfStock}
        >
          {!isOutOfStock ? (
            <Link href={`/products/${id}/purchase`}>
              <ShoppingCart className="w-5 h-5" />
            </Link>
          ) : (
            <ShoppingCart className="w-5 h-5" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col animate-pulse">
      <div className="w-full aspect-video bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
          <div className="w-1/2 h-4 rounded-full bg-gray-300" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-3/4 h-4 rounded-full bg-gray-300" />
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled size="lg">
          <span className="opacity-0">Add to Cart</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

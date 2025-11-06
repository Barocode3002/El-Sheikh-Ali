"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { Button } from "./ui/button"
import Link from "next/link"

export function CartIcon() {
  const { state } = useCart()
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  // Prevent hydration mismatch by not rendering count on server
  if (typeof window === 'undefined') {
    return (
      <Button asChild variant="ghost" size="sm" className="relative">
        <Link href="/cart">
          <ShoppingCart className="w-5 h-5" />
        </Link>
      </Button>
    )
  }

  return (
    <Button asChild variant="ghost" size="sm" className="relative">
      <Link href="/cart">
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-espresso text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}

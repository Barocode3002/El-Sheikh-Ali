"use client"

import { Button } from "./ui/button"
import { Plus, Check } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type AddToCartButtonProps = {
  product: {
    id: string
    name: string
    priceInPiasters: number
    imagePath: string
  }
  className?: string
  disabled?: boolean
}

export function AddToCartButton({ product, className, disabled = false }: AddToCartButtonProps) {
  const { dispatch } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    if (disabled) return
    dispatch({ type: "ADD_ITEM", payload: product })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  // Prevent hydration mismatch by not rendering state on server
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Button
        size="lg"
        disabled={disabled}
        className={cn(
          "bg-primary hover:bg-coffee-dark text-primary-foreground font-semibold rounded-full transition-all duration-300",
          className
        )}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add to Cart
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      size="lg"
      disabled={disabled}
      className={cn(
        "bg-primary hover:bg-coffee-dark text-primary-foreground font-semibold rounded-full transition-all duration-300",
        isAdded && "bg-green-600 hover:bg-green-700",
        className
      )}
    >
      {isAdded ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          Added!
        </>
      ) : (
        <>
          <Plus className="w-5 h-5 mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  )
}

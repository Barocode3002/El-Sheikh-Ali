"use client"

import { userOrderExists, checkCartStockAvailability } from "@/app/actions/orders"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/formatters"
import { useCart } from "@/contexts/CartContext"
import Image from "next/image"
import { FormEvent, useState } from "react"

type CartItem = {
  id: string
  name: string
  priceInPiasters: number
  imagePath: string
  quantity: number
}

type CartCheckoutFormProps = {
  cartItems: CartItem[]
  total: number
}

export function CartCheckoutForm({ cartItems, total }: CartCheckoutFormProps) {
  const { dispatch } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (email == null || email === "") {
      setErrorMessage("Please enter your email address")
      return
    }

    setIsLoading(true)

    // Check stock availability for all items
    const stockCheck = await checkCartStockAvailability(
      cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    )

    if (!stockCheck.available) {
      setErrorMessage(
        `The following items are out of stock or have insufficient quantity: ${stockCheck.outOfStock.join(", ")}`
      )
      setIsLoading(false)
      return
    }

    // Check if user already has any of these products
    const existingOrders = await Promise.all(
      cartItems.map(item => userOrderExists(email, item.id))
    )

    const alreadyPurchased = cartItems.filter((_, index) => existingOrders[index])

    if (alreadyPurchased.length > 0) {
      setErrorMessage(
        `You have already purchased: ${alreadyPurchased.map(p => p.name).join(", ")}. Try downloading from My Orders page.`
      )
      setIsLoading(false)
      return
    }

    // Create order data for multiple items
    const orderData = {
      email,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        priceInPiasters: item.priceInPiasters
      })),
      total
    }

    // Redirect to COD success page with cart data
    const params = new URLSearchParams({
      email,
      total: total.toString(),
      items: JSON.stringify(orderData.items)
    })

    dispatch({ type: "CLEAR_CART" })
    window.location.href = `/cod/cart-success?${params.toString()}`
  }

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      {/* Order Summary */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Checkout</h1>
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 items-center p-4 border rounded-lg">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={item.imagePath}
                fill
                alt={item.name}
                className="object-cover rounded"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(item.priceInPiasters / 100)} × {item.quantity}
              </p>
            </div>
            <div className="font-semibold">
              {formatCurrency((item.priceInPiasters * item.quantity) / 100)}
            </div>
          </div>
        ))}
        <div className="text-right text-xl font-bold">
          Total: {formatCurrency(total / 100)}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Cash on Delivery Checkout</CardTitle>
            <CardDescription>
              You will pay when you receive your order
            </CardDescription>
            {errorMessage && (
              <CardDescription className="text-destructive">
                {errorMessage}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
              <p className="text-sm text-muted-foreground">
                We&apos;ll send your order confirmation to this email
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              disabled={isLoading}
              type="submit"
            >
              {isLoading
                ? "Processing..."
                : `Place Order - ${formatCurrency(total / 100)}`}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

"use client"

import { userOrderExists } from "@/app/actions/orders"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/formatters"
import Image from "next/image"
import { FormEvent, useState } from "react"

type CheckoutFormProps = {
  product: {
    id: string
    imagePath: string
    name: string
    priceInPiasters: number
    description: string
    stockQuantity: number
  }
}

export function CheckoutForm({ product }: CheckoutFormProps) {
  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
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
        </div>
      </div>
      <Form
        priceInPiasters={product.priceInPiasters}
        productId={product.id}
        stockQuantity={product.stockQuantity}
      />
    </div>
  )
}

function Form({
  priceInPiasters,
  productId,
  stockQuantity,
}: {
  priceInPiasters: number
  productId: string
  stockQuantity: number
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [formData, setFormData] = useState({
    email: "",
    customerName: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    notes: ""
  })

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    // Validate required fields
    if (!formData.email || !formData.customerName || !formData.phoneNumber || !formData.address || !formData.city) {
      setErrorMessage("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    // Check stock availability
    if (stockQuantity <= 0) {
      setErrorMessage("This product is currently out of stock")
      setIsLoading(false)
      return
    }

    const orderExists = await userOrderExists(formData.email, productId)

    if (orderExists) {
      setErrorMessage(
        "You have already purchased this product. Try downloading it from the My Orders page"
      )
      setIsLoading(false)
      return
    }

    // Redirect to COD success page with all customer info
    const params = new URLSearchParams({
      productId,
      email: formData.email,
      price: priceInPiasters.toString(),
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      notes: formData.notes
    })

    window.location.href = `/cod/purchase-success?${params.toString()}`
  }

  return (
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
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
            />
            <p className="text-sm text-muted-foreground">
              We&apos;ll send your order confirmation to this email
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name</Label>
            <Input
              type="text"
              id="customerName"
              name="customerName"
              required
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Postal code"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any special instructions for your order"
              className="w-full p-2 border rounded-md"
              rows={3}
            />
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
              : `Place Order - ${formatCurrency(priceInPiasters / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

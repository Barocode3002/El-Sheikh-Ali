"use client"

import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/formatters"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { state, dispatch } = useCart()

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Add some delicious items to get started!</p>
          <Button asChild size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.imagePath}
                      fill
                      alt={item.name}
                      className="object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-muted-foreground">
                      {formatCurrency(item.priceInPiasters / 100)} each
                    </p>
                    
                    <div className="flex items-center gap-3 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => dispatch({
                          type: "UPDATE_QUANTITY",
                          payload: { id: item.id, quantity: item.quantity - 1 }
                        })}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span className="font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => dispatch({
                          type: "UPDATE_QUANTITY",
                          payload: { id: item.id, quantity: item.quantity + 1 }
                        })}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                        className="ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {formatCurrency((item.priceInPiasters * item.quantity) / 100)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(state.total / 100)}</span>
              </div>
              
              <Button asChild className="w-full" size="lg">
                <Link href="/cart/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/products">
                  Continue Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

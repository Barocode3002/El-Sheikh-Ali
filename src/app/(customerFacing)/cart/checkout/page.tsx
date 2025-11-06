"use client"

import { useCart } from "@/contexts/CartContext"
import { CartCheckoutForm } from "./_components/CartCheckoutForm"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function CartCheckoutPage() {
  const { state } = useCart()

  useEffect(() => {
    if (state.items.length === 0) {
      redirect("/cart")
    }
  }, [state.items.length])

  if (state.items.length === 0) {
    return null
  }

  return <CartCheckoutForm cartItems={state.items} total={state.total} />
}

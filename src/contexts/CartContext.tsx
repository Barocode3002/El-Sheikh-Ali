"use client"

import { createContext, useContext, useReducer, ReactNode } from "react"

type CartItem = {
  id: string
  name: string
  priceInPiasters: number
  imagePath: string
  quantity: number
}

type CartState = {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(item => item.id === action.payload.id)

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        newState = {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.priceInPiasters * item.quantity), 0)
        }
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }]
        newState = {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.priceInPiasters * item.quantity), 0)
        }
      }
      break
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(item => item.id !== action.payload)
      newState = {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.priceInPiasters * item.quantity), 0)
      }
      break
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0)

      newState = {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.priceInPiasters * item.quantity), 0)
      }
      break
    }

    case "CLEAR_CART":
      newState = { items: [], total: 0 }
      break

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }

  // Save to localStorage whenever state changes (except for LOAD_CART)
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(newState))
  }

  return newState
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 }, (initial) => {
    // Load cart from localStorage on initial render
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          return JSON.parse(savedCart)
        } catch (e) {
          console.error("Failed to parse cart from localStorage:", e)
          return initial
        }
      }
    }
    return initial
  })

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
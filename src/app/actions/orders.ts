"use server"

import db from "@/db/db"

export async function userOrderExists(email: string, productId: string) {
  return (
    (await db.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  )
}

export async function checkStockAvailability(productId: string, quantity: number = 1) {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { stockQuantity: true }
  })

  if (!product) return false
  return product.stockQuantity >= quantity
}

export async function checkCartStockAvailability(items: { productId: string; quantity: number }[]) {
  const productIds = items.map(item => item.productId)
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, stockQuantity: true, name: true }
  })

  const outOfStock: string[] = []

  for (const item of items) {
    const product = products.find(p => p.id === item.productId)
    if (!product || product.stockQuantity < item.quantity) {
      outOfStock.push(product?.name || item.productId)
    }
  }

  return {
    available: outOfStock.length === 0,
    outOfStock
  }
}

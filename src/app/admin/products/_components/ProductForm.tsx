"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatters"
import { useState } from "react"
import { addProduct, updateProduct } from "../../_actions/products"
import { useFormState, useFormStatus } from "react-dom"
import { Product } from "@prisma/client"
import Image from "next/image"

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  )
  const [priceInPiasters, setPriceInPiasters] = useState<number | undefined>(
    product?.priceInPiasters
  )

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
        />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInPiasters">Price In Piasters</Label>
        <Input
          type="number"
          id="priceInPiasters"
          name="priceInPiasters"
          required
          value={priceInPiasters}
          onChange={e => setPriceInPiasters(Number(e.target.value) || undefined)}
        />
        <div className="text-muted-foreground">
          {formatCurrency((priceInPiasters || 0) / 100)}
        </div>
        {error.priceInPiasters && (
          <div className="text-destructive">{error.priceInPiasters}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description}
        />
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="stockQuantity">Stock Quantity</Label>
        <Input
          type="number"
          id="stockQuantity"
          name="stockQuantity"
          required
          min="0"
          defaultValue={product?.stockQuantity ?? 0}
        />
        <div className="text-muted-foreground text-sm">
          Number of items available in stock
        </div>
        {error.stockQuantity && (
          <div className="text-destructive">{error.stockQuantity}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={product == null} />
        {product != null && (
          <div className="text-muted-foreground">{product.filePath}</div>
        )}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product != null && (
          <Image
            src={product.imagePath}
            height="400"
            width="400"
            alt="Product Image"
          />
        )}
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  )
}

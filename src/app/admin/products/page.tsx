import { Button } from "@/components/ui/button"
import { PageHeader } from "../_components/PageHeader"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import db from "@/db/db"
import { CheckCircle2, MoreVertical, XCircle, Plus, Coffee } from "lucide-react"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "./_components/ProductActions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Products</h1>
          <p className="text-muted-foreground text-lg">Manage your menu items and inventory</p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-coffee-dark text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Link href="/admin/products/new" className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </Link>
        </Button>
      </div>
      <ProductsTable />
    </div>
  )
}

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInPiasters: true,
      isAvailableForPurchase: true,
      category: true,
      stockQuantity: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  })

  if (products.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Coffee className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No products found</p>
          <p className="text-sm text-muted-foreground mt-2">Get started by adding your first product</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">All Products</CardTitle>
        <CardDescription>Manage your product catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="w-0">
                  <span className="sr-only">Available For Purchase</span>
                </TableHead>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Price</TableHead>
                <TableHead className="font-bold">Stock</TableHead>
                <TableHead className="font-bold">Orders</TableHead>
                <TableHead className="w-0">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id} className="hover:bg-secondary/30">
                  <TableCell>
                    {product.isAvailableForPurchase ? (
                      <>
                        <span className="sr-only">Available</span>
                        <CheckCircle2 className="text-green-600" />
                      </>
                    ) : (
                      <>
                        <span className="sr-only">Unavailable</span>
                        <XCircle className="stroke-destructive" />
                      </>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-coffee-light/20 text-coffee-dark capitalize">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(product.priceInPiasters / 100)}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${
                      product.stockQuantity === 0
                        ? 'text-red-600'
                        : product.stockQuantity <= 3
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }`}>
                      {formatNumber(product.stockQuantity)}
                    </span>
                  </TableCell>
                  <TableCell>{formatNumber(product._count.orders)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="hover:bg-secondary p-2 rounded-lg transition-colors">
                        <MoreVertical />
                        <span className="sr-only">Actions</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <a download href={`/admin/products/${product.id}/download`}>
                            Download
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <ActiveToggleDropdownItem
                          id={product.id}
                          isAvailableForPurchase={product.isAvailableForPurchase}
                        />
                        <DropdownMenuSeparator />
                        <DeleteDropdownItem
                          id={product.id}
                          disabled={product._count.orders > 0}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

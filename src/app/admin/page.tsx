import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import {
  Banknote,
  Users,
  Coffee,
  ShoppingCart,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from "lucide-react"
import Link from "next/link"

async function getSalesData() {
  const [totalSales, todaySales, monthlySales] = await Promise.all([
    db.order.aggregate({
      _sum: { pricePaidInPiasters: true },
      _count: true,
    }),
    db.order.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      _sum: { pricePaidInPiasters: true },
      _count: true,
    }),
    db.order.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { pricePaidInPiasters: true },
      _count: true,
    })
  ])

  return {
    total: {
      amount: (totalSales._sum.pricePaidInPiasters || 0) / 100,
      numberOfSales: totalSales._count,
    },
    today: {
      amount: (todaySales._sum.pricePaidInPiasters || 0) / 100,
      numberOfSales: todaySales._count,
    },
    monthly: {
      amount: (monthlySales._sum.pricePaidInPiasters || 0) / 100,
      numberOfSales: monthlySales._count,
    }
  }
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInPiasters: true },
    }),
  ])

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInPiasters || 0) / userCount / 100,
  }
}

async function getProductData() {
  const [activeCount, inactiveCount, categoryStats, lowStockCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
    db.product.groupBy({
      by: ['category'],
      _count: true,
      where: { isAvailableForPurchase: true }
    }),
    db.product.count({
      where: {
        isAvailableForPurchase: true,
        stockQuantity: { lte: 3 }
      }
    })
  ])

  return {
    activeCount,
    inactiveCount,
    categoryStats,
    lowStockProducts: lowStockCount,
    totalProducts: activeCount + inactiveCount
  }
}

async function getRecentOrders() {
  return db.order.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      product: {
        select: {
          name: true,
          category: true,
          imagePath: true
        }
      },
    },
  })
}

async function getTopProducts() {
  return db.product.findMany({
    take: 5,
    include: {
      _count: {
        select: { orders: true }
      }
    },
    where: { isAvailableForPurchase: true },
    orderBy: {
      orders: {
        _count: 'desc'
      }
    }
  })
}

export default async function AdminDashboard() {
  const [salesData, userData, productData, recentOrders, topProducts] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
    getRecentOrders(),
    getTopProducts(),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here&apos;s your store overview for today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" size="lg">
            <Link href="/admin/products/new" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Product
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/admin/orders" className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              View Orders
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(salesData.today.amount)}
          subtitle={`${formatNumber(salesData.today.numberOfSales)} orders today`}
          icon={<TrendingUp className="w-6 h-6" />}
          trend={{ value: 12.5, isPositive: true }}
          iconBg="bg-green-500/10"
          iconColor="text-green-600"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(salesData.total.amount)}
          subtitle={`${formatNumber(salesData.total.numberOfSales)} total orders`}
          icon={<Banknote className="w-6 h-6" />}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Products"
          value={formatNumber(productData.activeCount)}
          subtitle={`${formatNumber(productData.inactiveCount)} inactive`}
          icon={<Coffee className="w-6 h-6" />}
          iconBg="bg-coffee-medium/10"
          iconColor="text-coffee-medium"
        />
        <StatCard
          title="Total Customers"
          value={formatNumber(userData.userCount)}
          subtitle={`${formatCurrency(userData.averageValuePerUser)} avg. value`}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 8.2, isPositive: true }}
          iconBg="bg-purple-500/10"
          iconColor="text-purple-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-coffee-medium" />
              Product Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {productData.categoryStats.map((category) => (
              <div key={category.category} className="flex justify-between items-center">
                <span className="capitalize font-medium">{category.category}</span>
                <span className="text-sm bg-secondary px-2 py-1 rounded-full">
                  {category._count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <span className="font-semibold">{formatCurrency(salesData.monthly.amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Orders</span>
              <span className="font-semibold">{formatNumber(salesData.monthly.numberOfSales)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg. Order</span>
              <span className="font-semibold">
                {formatCurrency(salesData.monthly.numberOfSales > 0 ? salesData.monthly.amount / salesData.monthly.numberOfSales : 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Products</span>
              <span className="font-semibold">{formatNumber(productData.totalProducts)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active</span>
              <span className="font-semibold text-green-600">{formatNumber(productData.activeCount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Low Stock</span>
              <span className="font-semibold text-orange-600">{formatNumber(productData.lowStockProducts)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Recent Orders</CardTitle>
                <CardDescription>Latest transactions from your store</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-coffee-light to-cream flex items-center justify-center">
                      <Coffee className="w-6 h-6 text-coffee-dark" />
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{order.product.name}</p>
                        <span className="text-xs bg-coffee-light/20 text-coffee-dark px-2 py-0.5 rounded-full capitalize">
                          {order.product.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(order.pricePaidInPiasters / 100)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Top Products</CardTitle>
                <CardDescription>Best selling items this period</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/products">Manage Products</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No products yet</p>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent text-espresso flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-coffee-light to-cream flex items-center justify-center">
                      <Coffee className="w-6 h-6 text-coffee-dark" />
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{product.name}</p>
                        <span className="text-xs bg-coffee-light/20 text-coffee-dark px-2 py-0.5 rounded-full capitalize">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(product.priceInPiasters / 100)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatNumber(product._count.orders)}</p>
                      <p className="text-xs text-muted-foreground">orders</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

type StatCardProps = {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  iconBg: string
  iconColor: string
}

function StatCard({ title, value, subtitle, icon, trend, iconBg, iconColor }: StatCardProps) {
  return (
    <Card className="border-2 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{value}</p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{subtitle}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-xs font-semibold ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                <span>{trend.value}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

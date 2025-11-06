"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Coffee,
  Users,
  ShoppingCart,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function AdminNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-gradient-to-b from-espresso via-coffee-dark to-primary text-white border-r-2 border-accent/20">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-accent/20">
            <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="El Sheikh Ali Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-xl font-bold">El Sheikh Ali</h1>
                <p className="text-xs text-cream/60">Admin Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            <AdminNavLink href="/admin" icon={<LayoutDashboard className="w-5 h-5" />}>
              Dashboard
            </AdminNavLink>
            <AdminNavLink href="/admin/products" icon={<Coffee className="w-5 h-5" />}>
              Products
            </AdminNavLink>
            <AdminNavLink href="/admin/users" icon={<Users className="w-5 h-5" />}>
              Customers
            </AdminNavLink>
            <AdminNavLink href="/admin/orders" icon={<ShoppingCart className="w-5 h-5" />}>
              Orders
            </AdminNavLink>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-accent/20 space-y-2">
            <Link 
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/20 transition-colors text-cream/80 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-gradient-to-r from-espresso to-coffee-dark text-white border-b-2 border-accent/20">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="El Sheikh Ali Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold">Admin</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="border-t border-accent/20 p-4 space-y-2">
            <AdminNavLink href="/admin" icon={<LayoutDashboard className="w-5 h-5" />}>
              Dashboard
            </AdminNavLink>
            <AdminNavLink href="/admin/products" icon={<Coffee className="w-5 h-5" />}>
              Products
            </AdminNavLink>
            <AdminNavLink href="/admin/users" icon={<Users className="w-5 h-5" />}>
              Customers
            </AdminNavLink>
            <AdminNavLink href="/admin/orders" icon={<ShoppingCart className="w-5 h-5" />}>
              Orders
            </AdminNavLink>
            <Link 
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/20 transition-colors text-cream/80"
            >
              <LogOut className="w-5 h-5" />
              <span>Back to Store</span>
            </Link>
          </nav>
        )}
      </div>
    </>
  )
}

type AdminNavLinkProps = {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}

function AdminNavLink({ href, icon, children }: AdminNavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
        isActive 
          ? "bg-accent text-espresso shadow-lg" 
          : "text-cream/80 hover:bg-accent/20 hover:text-white"
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}


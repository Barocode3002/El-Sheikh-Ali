import { Nav, NavLink } from "@/components/Nav"
import { CartProvider } from "@/contexts/CartContext"
import { CartIcon } from "@/components/CartIcon"
import { MapPin, Heart, Instagram, Facebook, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DynamicYear } from "@/components/DynamicYear"

export const dynamic = "force-dynamic"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <CartProvider>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/menu">Menu</NavLink>
        <NavLink href="/products">Order</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/orders">My Orders</NavLink>
        <div className="ml-auto">
          <CartIcon />
        </div>
      </Nav>
      <div className="min-h-screen">{children}</div>
      <Footer />
    </CartProvider>
  )
}

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-espresso via-coffee-dark to-primary text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="El Sheikh Ali Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-2xl font-bold">El Sheikh Ali</span>
            </div>
            <p className="text-cream/80 leading-relaxed">
              Premium coffee and handcrafted beverages, made with passion and served with care.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="text-cream/80 hover:text-accent transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-cream/80 hover:text-accent transition-colors">
                  Order Online
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-cream/80 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-cream/80 hover:text-accent transition-colors">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Hours</h3>
            <ul className="space-y-2 text-cream/80">
              <li>Saturday - Thursday: 9am - 12am</li>
              <li>Friday: 4pm - 12am</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact</h3>
            <ul className="space-y-2 text-cream/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>123 Coffee Street, Your City, 12345</span>
              </li>
              <li>Phone: +20 1211162791</li>
              <li>Email: mohsen.m.barokha@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-12 pt-8 text-center text-cream/60">
          <p>&copy; <DynamicYear /> El Sheikh Ali. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

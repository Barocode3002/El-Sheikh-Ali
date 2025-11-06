"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps, ReactNode } from "react"
import Image from "next/image"
import Logo from "@/assets/alilogo.jpg"

export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg border-b-2 border-accent/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 py-4 hover:opacity-80 transition-opacity">
            <Image
              src={Logo}
              alt="El Sheikh Ali Logo"
              width={42}
              height={42}
              className="w-8 h-8 rounded-md"
              priority
            />
            <span className="text-xl font-bold hidden sm:inline">El Sheikh Ali</span>
          </Link>
          <div className="flex items-center">
            {children}
          </div>
        </div>
      </div>
    </nav>
  )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname()
  
  // Handle the case where pathname might be undefined during SSR
  const isActive = pathname ? pathname === props.href : false
  
  return (
    <Link
      {...props}
      className={cn(
        "px-4 py-6 hover:bg-accent/20 hover:text-accent focus-visible:bg-accent/20 focus-visible:text-accent transition-all duration-200 font-medium border-b-2 border-transparent",
        isActive && "border-accent text-accent"
      )}
    />
  )
}

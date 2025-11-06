import { Button } from "./ui/button"
import Link from "next/link"
import { Coffee, Award, Heart } from "lucide-react"
import Image from "next/image"
import Logo from "@/assets/alilogo.jpg"

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-coffee-dark via-primary to-espresso text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Brand */}
          <div className="inline-block">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image src={Logo} className="w-12 h-12 md:w-16 md:h-16 rounded-lg" alt={"El Sheikh ali logo"} sizes="(max-width: 768px) 48px, 64px" />
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                El Sheikh Ali
              </h1>
            </div>
            <div className="h-1 w-32 bg-accent mx-auto rounded-full" />
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-cream font-light max-w-2xl mx-auto">
            Where Every Cup Tells a Story
          </p>

          <p className="text-base md:text-lg text-cream/90 max-w-2xl mx-auto leading-relaxed">
            Experience the finest handcrafted coffee, made with passion and served with care. 
            From our signature espresso to artisanal treats, every moment at El Sheikh Ali is special.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-espresso font-semibold px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/products">Order Now</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-espresso font-semibold px-8 py-6 text-lg rounded-full shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/menu">View Menu</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Coffee className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Premium Quality</h3>
              <p className="text-sm text-cream/80">Ethically sourced beans</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Expert Baristas</h3>
              <p className="text-sm text-cream/80">Crafted with expertise</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Heart className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">Made with Love</h3>
              <p className="text-sm text-cream/80">Every cup, every time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </div>
  )
}

import { Coffee, Heart, Award, Users, Globe, Leaf } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-coffee-dark via-primary to-espresso text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">Our Story</h1>
            <p className="text-xl md:text-2xl text-cream leading-relaxed">
              A passion for coffee, a commitment to excellence, and a dedication to community
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <Coffee className="w-16 h-16 text-coffee-medium mx-auto" />
              <h2 className="text-4xl font-bold">Our Mission</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              At El Sheikh Ali, we believe that every cup of coffee tells a story. Our mission is to bring people together
              through exceptional coffee experiences, sourced ethically and crafted with care. We&apos;re more than just a coffee shop –
              we&apos;re a community hub where connections are made and memories are created.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ValueCard
              icon={<Award className="w-12 h-12" />}
              title="Quality First"
              description="We source only the finest beans and ingredients, ensuring every product meets our high standards."
            />
            <ValueCard
              icon={<Heart className="w-12 h-12" />}
              title="Made with Love"
              description="Every beverage is handcrafted by our expert baristas who pour their passion into every cup."
            />
            <ValueCard
              icon={<Users className="w-12 h-12" />}
              title="Community Focus"
              description="We're committed to creating a welcoming space where everyone feels at home."
            />
            <ValueCard
              icon={<Globe className="w-12 h-12" />}
              title="Ethical Sourcing"
              description="We partner with farmers who share our commitment to sustainability and fair trade practices."
            />
            <ValueCard
              icon={<Leaf className="w-12 h-12" />}
              title="Sustainability"
              description="From our packaging to our practices, we're dedicated to minimizing our environmental impact."
            />
            <ValueCard
              icon={<Coffee className="w-12 h-12" />}
              title="Innovation"
              description="We constantly explore new flavors and techniques to bring you unique coffee experiences."
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-center">The El Sheikh Ali Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Founded with a simple dream – to create a space where exceptional coffee meets genuine hospitality. 
                El Sheikh Ali began as a small neighborhood café with a big vision: to serve the finest coffee while 
                building lasting relationships with our community.
              </p>
              <p>
                Our founder, inspired by traditional coffee culture and modern innovation, set out to create a unique 
                experience that honors the rich heritage of coffee while embracing contemporary tastes and preferences. 
                Every detail, from our carefully selected beans to our thoughtfully designed spaces, reflects this commitment.
              </p>
              <p>
                Today, El Sheikh Ali has grown into more than just a coffee shop. We&apos;re a gathering place, a workspace,
                a celebration venue, and most importantly, a home away from home for our valued customers. Our success
                is measured not just in cups served, but in the smiles we create and the connections we foster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-coffee-dark to-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">Join Our Journey</h2>
            <p className="text-xl text-cream">
              Experience the El Sheikh Ali difference. Visit us today and become part of our story.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

type ValueCardProps = {
  icon: React.ReactNode
  title: string
  description: string
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-transparent hover:border-accent/30">
      <div className="text-coffee-medium mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}


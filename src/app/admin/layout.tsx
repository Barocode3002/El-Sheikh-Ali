import { AdminNav } from "@/components/AdminNav"

export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-background">
      <AdminNav />
      <div className="lg:pl-64">
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

import { Catalog } from "@/components/catalog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold font-poppins">Catalogo Digital Venta Mayorista</CardTitle>
            <p className="text-sm text-gray-500 mt-1">ComboHome v3 2025</p>
          </CardHeader>
        </Card>
        <Catalog />
      </main>
    </div>
  )
}


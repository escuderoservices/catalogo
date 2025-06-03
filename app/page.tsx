import { Catalog } from "@/components/catalog"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 font-poppins">Catálogo de Productos al por Mayor</h1>
        <Catalog />
      </main>
    </div>
  )
}


import { Package } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-gray-700" />
          <span className="font-semibold text-xl font-poppins">Combo Home Mayorista</span>
        </div>
        <div className="ml-auto text-sm text-gray-500">Versión Demo</div>
      </div>
    </header>
  )
}


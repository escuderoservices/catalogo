"use client"

import { useState } from "react"
import Image from "next/image"
import { products } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { OrderSummary } from "@/components/order-summary"
import { formatPrice } from "@/lib/utils"
import { ImageModal } from "@/components/image-modal"
import { Search } from "lucide-react"

function ProductCard({ product, quantity, onQuantityChange, onImageClick }: {
  product: any
  quantity: number
  onQuantityChange: (id: string, value: string) => void
  onImageClick: (url: string, alt: string) => void
}) {
  return (
    <Card className="p-3 space-y-3">
      <div className="flex gap-3">
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity shrink-0 relative group"
          onClick={() => onImageClick(product.image, product.name)}
        >
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
            <Search className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
          <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
            <div className="truncate">
              <span className="text-gray-500">SKU:</span> {product.sku}
            </div>
            <div className="truncate">
              <span className="text-gray-500">Terminación:</span> {product.finish}
            </div>
            <div>
              <span className="text-gray-500">CBM:</span> {product.cbm.toFixed(2)}
            </div>
            <div>
              <span className="text-gray-500">Total CBM:</span> {product.totalCbm.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="space-y-0.5">
          <p className="text-xs text-gray-500">Precio mayorista</p>
          <p className="font-bold">{formatPrice(product.price)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-500">Precio sugerido</p>
          <p>{formatPrice(product.suggestedRetailPrice)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-500">Margen bruto</p>
          <p className={`font-medium ${
            product.grossMargin >= 50 ? 'text-emerald-600' :
            product.grossMargin >= 40 ? 'text-green-500' :
            product.grossMargin >= 30 ? 'text-lime-500' :
            product.grossMargin >= 20 ? 'text-yellow-500' :
            'text-orange-500'
          }`}>
            {`${product.grossMargin.toFixed(1)}%`}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-bold">{formatPrice(product.totalPrice)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(product.id, String(Math.max(0, quantity - 5)))}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
        >
          -
        </button>
        <Input
          type="number"
          min="0"
          step="5"
          value={quantity}
          onChange={(e) => onQuantityChange(product.id, e.target.value)}
          className="flex-1 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => onQuantityChange(product.id, String(quantity + 5))}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
        >
          +
        </button>
      </div>
    </Card>
  )
}

export function Catalog() {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(products.map((product) => [product.id, 0])),
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null)

  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = Number.parseInt(value) || 0

    // Si la cantidad es menor que 5 pero mayor que 0, establecerla a 0
    const newQuantity = quantity < 5 && quantity > 0 ? 0 : quantity

    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }))
  }

  const handleImageClick = (url: string, alt: string) => {
    setSelectedImage({ url, alt })
  }

  // Calcular totales para cada producto
  const productsWithTotals = products.map((product) => {
    const quantity = quantities[product.id] || 0
    const totalCbm = product.cbm * quantity
    const totalWeight = product.weight * quantity
    const totalPrice = product.price * quantity
    const grossMargin = ((product.suggestedRetailPrice - product.price) / product.suggestedRetailPrice) * 100

    return {
      ...product,
      quantity,
      totalCbm,
      totalWeight,
      totalPrice,
      grossMargin,
    }
  })

  // Calcular totales del pedido
  const orderTotals = {
    totalCbm: productsWithTotals.reduce((sum, p) => sum + p.totalCbm, 0),
    totalPrice: productsWithTotals.reduce((sum, p) => sum + p.totalPrice, 0),
    totalItems: productsWithTotals.reduce((sum, p) => sum + p.quantity, 0),
    totalRetailValue: productsWithTotals.reduce((sum, p) => sum + p.suggestedRetailPrice * p.quantity, 0),
  }

  const averageGrossMargin =
    orderTotals.totalPrice > 0
      ? ((orderTotals.totalRetailValue - orderTotals.totalPrice) / orderTotals.totalRetailValue) * 100
      : 0

  // Filtrar productos basado en el término de búsqueda
  const filteredProducts = productsWithTotals.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4 px-2">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-base font-semibold mb-3 font-poppins">Información importante sobre tu compra:</h3>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• Compra mínima: $20.000 para acceder a los precios mayoristas.</li>
          <li>• Cantidades mínima: 5 unidades por producto.</li>
          <li>• Retiro en zona ex Mercado Modelo (Montevideo).</li>
          <li>• Envíos: En caso de requerir, se calcula según el volumen total y el destino.</li>
          <li>• Pago por transferencia bancaria a cuentas Santander o Itaú.</li>
          <li>• Todos los precios incluyen IVA.</li>
        </ul>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Buscar productos por nombre, colección o SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm"
        />
      </div>

      {/* Vista móvil */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={product.quantity}
            onQuantityChange={handleQuantityChange}
            onImageClick={handleImageClick}
          />
        ))}
      </div>

      {/* Vista desktop */}
      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="h-12 md:h-14">
                <TableHead className="w-[60px] md:w-[80px] text-center">Imagen</TableHead>
                <TableHead className="w-[200px] md:w-[300px] text-center">Descripción</TableHead>
                <TableHead className="text-center">Precio mayorista</TableHead>
                <TableHead className="text-center">Precio sugerido</TableHead>
                <TableHead className="text-center">Margen bruto</TableHead>
                <TableHead className="w-[80px] md:w-[100px] text-center">Terminación</TableHead>
                <TableHead className="w-[80px] md:w-[100px] text-center">SKU</TableHead>
                <TableHead className="w-[80px] md:w-[100px] text-center">Volumen (CBM)</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead className="text-center">Total CBM</TableHead>
                <TableHead className="text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="h-12 md:h-14">
                  <TableCell>
                    <div 
                      className="cursor-pointer hover:opacity-80 transition-opacity relative group"
                      onClick={() => handleImageClick(product.image, product.name)}
                    >
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right bg-gray-50 font-bold">{formatPrice(product.price)}</TableCell>
                  <TableCell className="text-right">{formatPrice(product.suggestedRetailPrice)}</TableCell>
                  <TableCell className="text-right bg-gray-100">
                    <span className={`font-medium ${
                      product.grossMargin >= 50 ? 'text-emerald-600' :
                      product.grossMargin >= 40 ? 'text-green-500' :
                      product.grossMargin >= 30 ? 'text-lime-500' :
                      product.grossMargin >= 20 ? 'text-yellow-500' :
                      'text-orange-500'
                    }`}>
                      {`${product.grossMargin.toFixed(1)}%`}
                    </span>
                  </TableCell>
                  <TableCell>{product.finish}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell className="text-right">{product.cbm.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(product.id, String(Math.max(0, product.quantity - 5)))}
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                      >
                        -
                      </button>
                      <Input
                        type="number"
                        min="0"
                        step="5"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => handleQuantityChange(product.id, String(product.quantity + 5))}
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right bg-gray-50">{product.totalCbm.toFixed(2)}</TableCell>
                  <TableCell className="text-right bg-gray-50 font-bold">{formatPrice(product.totalPrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <OrderSummary
        totalItems={orderTotals.totalItems}
        totalCbm={orderTotals.totalCbm}
        totalPrice={orderTotals.totalPrice}
        totalRetailValue={orderTotals.totalRetailValue}
        averageGrossMargin={averageGrossMargin}
        productsWithTotals={productsWithTotals}
      />

      {selectedImage && (
        <ImageModal
          isOpen={true}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          alt={selectedImage.alt}
        />
      )}
    </div>
  )
}


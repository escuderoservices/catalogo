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
    <div className="flex flex-col gap-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 font-poppins">Información importante sobre tu compra:</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Compra mínima: $20.000 para acceder a los precios mayoristas.</li>
          <li>• Cantidades mínima: 5 unidades por producto.</li>
          <li>• Retiro en zona ex Mercado Modelo (Montevideo).</li>
          <li>• Envíos: En caso de requerir, se calcula según el volumen total y el destino.</li>
          <li>• Pago por transferencia bancaria a cuentas Santander o Itaú.</li>
          <li>• Todos los precios incluyen IVA.</li>
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Buscar productos por nombre, colección o SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Colección</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Terminación</TableHead>
                <TableHead className="text-right">Volumen (CBM)</TableHead>
                <TableHead className="text-right">Precio mayorista</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio sugerido</TableHead>
                <TableHead className="text-right">Margen bruto</TableHead>
                <TableHead className="text-right">Total CBM</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedImage({ url: product.image, alt: product.name })}
                    >
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.collection}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.finish}</TableCell>
                  <TableCell className="text-right">{product.cbm.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="5"
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      className="w-20 text-right"
                    />
                  </TableCell>
                  <TableCell className="text-right">{formatPrice(product.suggestedRetailPrice)}</TableCell>
                  <TableCell className="text-right">
                    {`${product.grossMargin.toFixed(1)}%`}
                  </TableCell>
                  <TableCell className="text-right bg-gray-50">{product.totalCbm.toFixed(2)}</TableCell>
                  <TableCell className="text-right bg-gray-50">{formatPrice(product.totalPrice)}</TableCell>
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

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ""}
        alt={selectedImage?.alt || ""}
      />
    </div>
  )
}


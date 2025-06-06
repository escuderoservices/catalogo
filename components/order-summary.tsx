"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown, MessageSquare } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface OrderSummaryProps {
  totalItems: number
  totalCbm: number
  totalPrice: number
  totalRetailValue: number
  averageGrossMargin: number
  productsWithTotals: Array<{
    id: string
    name: string
    collection: string
    sku: string
    finish: string
    cbm: number
    price: number
    quantity: number
    totalCbm: number
    totalPrice: number
    suggestedRetailPrice: number
  }>
}

export function OrderSummary({
  totalItems,
  totalCbm,
  totalPrice,
  totalRetailValue,
  averageGrossMargin,
  productsWithTotals,
}: OrderSummaryProps) {
  // Función para exportar el pedido a CSV
  const handleExportOrder = () => {
    // Filtrar solo los productos con cantidad > 0
    const filteredProducts = productsWithTotals.filter(p => p.quantity > 0)
    
    // Crear el encabezado del CSV
    const headers = [
      'Descripción',
      'Precio mayorista',
      'Precio sugerido',
      'Margen bruto',
      'Terminación',
      'SKU',
      'Volumen (CBM)',
      'Cantidad',
      'Total CBM',
      'Total'
    ].join(',')

    // Crear las filas del CSV
    const rows = filteredProducts.map(product => [
      `"${product.name}"`,
      formatPrice(product.price).replace(/[$,]/g, ''),
      formatPrice(product.suggestedRetailPrice).replace(/[$,]/g, ''),
      `${((product.suggestedRetailPrice - product.price) / product.suggestedRetailPrice * 100).toFixed(1)}%`,
      `"${product.finish}"`,
      `"${product.sku}"`,
      product.cbm.toFixed(2),
      product.quantity,
      product.totalCbm.toFixed(2),
      formatPrice(product.totalPrice).replace(/[$,]/g, '')
    ].join(','))

    // Crear el contenido completo del CSV
    const csvContent = [headers, ...rows].join('\n')

    // Crear el blob y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `pedido_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Función para enviar por WhatsApp
  const handleWhatsApp = () => {
    // Filtrar solo los productos con cantidad > 0
    const filteredProducts = productsWithTotals.filter(p => p.quantity > 0)
    
    // Crear el mensaje con los detalles del pedido
    let message = `¡Hola! Me gustaría hacer un pedido con los siguientes detalles:\n\n`
    
    // Agregar resumen general
    message += `*Resumen del Pedido:*\n`
    message += `• Total de productos: ${totalItems}\n`
    message += `• Volumen total: ${totalCbm.toFixed(2)} CBM\n`
    message += `• Costo total: ${formatPrice(totalPrice)}\n\n`
    
    // Agregar lista de productos
    message += `*Productos solicitados:*\n`
    filteredProducts.forEach(product => {
      message += `• ${product.name} (${product.sku})\n`
      message += `  Cantidad: ${product.quantity}\n`
      message += `  Precio unitario: ${formatPrice(product.price)}\n`
      message += `  Subtotal: ${formatPrice(product.totalPrice)}\n\n`
    })
    
    // Codificar el mensaje para la URL
    const encodedMessage = encodeURIComponent(message)
    
    // Crear el enlace de WhatsApp con el número específico
    const whatsappUrl = `https://wa.me/59891284128?text=${encodedMessage}`
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins">Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Total Productos</p>
              <p className="text-2xl font-bold font-poppins">{totalItems}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Volumen Total (CBM)</p>
              <p className="text-2xl font-bold font-poppins">{totalCbm.toFixed(2)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Costo Total ($)</p>
              <p className="text-2xl font-bold text-gray-900 font-poppins">{formatPrice(totalPrice)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Margen Bruto Estimado</p>
              <div className="flex items-end gap-2">
                <p className={`text-2xl font-bold font-poppins ${
                  averageGrossMargin >= 50 ? 'text-emerald-600' :
                  averageGrossMargin >= 40 ? 'text-green-500' :
                  averageGrossMargin >= 30 ? 'text-lime-500' :
                  averageGrossMargin >= 20 ? 'text-yellow-500' :
                  'text-orange-500'
                }`}>
                  {totalItems > 0 ? `${averageGrossMargin.toFixed(1)}%` : "-"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Ganancia Estimada</p>
              <p className="text-2xl font-bold text-emerald-600 font-poppins">{formatPrice(totalRetailValue - totalPrice)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-poppins">Hacer el pedido</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Exporta el Excel con tu pedido y envíalo por WhatsApp a nuestro agente</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="secondary" className="w-full" size="lg" onClick={handleExportOrder}>
              <FileDown className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            <Button className="w-full" size="lg" onClick={handleWhatsApp}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Enviar por WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


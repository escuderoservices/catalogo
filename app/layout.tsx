import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { WhatsAppButton } from "@/components/whatsapp-button"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: "Catálogo de Productos al por Mayor",
  description: "Plataforma para revendedores",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${poppins.variable}`}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}



import './globals.css'
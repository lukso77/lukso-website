import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import CartDrawer from '@/components/CartDrawer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LUKSO — Fragancias Premium · Medellín, Colombia',
  description:
    'Tienda de fragancias premium originales en Medellín, Colombia. Más de 16 marcas y 40 referencias. Dior, Carolina Herrera, Versace, Lattafa y más. @LUKSO.COL',
  keywords: ['perfumes', 'fragancias', 'Medellín', 'Colombia', 'originales', 'LUKSO'],
  openGraph: {
    title: 'LUKSO — Lo Premium, A Tu Precio',
    description: 'Fragancias premium originales en Medellín, Colombia. +16 marcas · +40 referencias. @LUKSO.COL',
    type: 'website',
    locale: 'es_CO',
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%230a0a0a'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='14' font-weight='bold' fill='%23c8ff00'>LK</text></svg>",
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}

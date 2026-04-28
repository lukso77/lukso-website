'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useCart } from '@/lib/cart-context'

export default function PedidoConfirmado() {
  const { clear } = useCart()
  useEffect(() => { clear() }, []) // eslint-disable-line

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', padding: '24px', textAlign: 'center' }}>
      <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(200,255,0,0.1)', border: '1px solid var(--neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>✓</div>
      <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--neon)' }}>Pago procesado</p>
      <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 300 }}>¡Gracias por tu compra!</h1>
      <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', maxWidth: '380px', lineHeight: 1.7 }}>
        Recibirás una confirmación en tu correo y te contactaremos por WhatsApp para coordinar la entrega. 🛍️
      </p>
      <Link href="/" style={{ marginTop: '8px', padding: '12px 28px', background: 'var(--neon)', color: '#0a0a0a', fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
        Volver a la tienda
      </Link>
    </div>
  )
}

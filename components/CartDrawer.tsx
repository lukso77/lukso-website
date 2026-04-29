'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { useDiscounts } from '@/lib/discount-context'

const fmt = (n: number) => `$${n.toLocaleString('es-CO')}.000`

export default function CartDrawer() {
  const { items, open, totalItems, totalPrice, remove, inc, dec, closeCart } = useCart()
  const { getDiscount } = useDiscounts()

  // Total con descuentos aplicados
  const discountedTotal = items.reduce((sum, { product, qty }) => {
    const d = getDiscount(product)
    return sum + (d ? d.final : product.price) * qty
  }, 0)

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 8000,
          }}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        aria-label="Carrito de compras"
        style={{
          position: 'fixed',
          top: 0, right: 0,
          height: '100dvh',
          width: 'min(100vw, 420px)',
          background: '#0f0f0f',
          borderLeft: '1px solid var(--border)',
          zIndex: 8001,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', fontWeight: 300 }}>
              Tu carrito
            </h2>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--gray)', letterSpacing: '0.15em', marginTop: '2px' }}>
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'white')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)')}
          >✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '60px' }}>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.4rem', fontWeight: 300, color: 'rgba(255,255,255,0.2)', marginBottom: '8px' }}>
                Tu carrito está vacío
              </p>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>
                Agrega fragancias desde el catálogo
              </p>
              <button
                onClick={closeCart}
                style={{
                  marginTop: '24px', padding: '10px 24px',
                  background: 'var(--neon)', color: '#0a0a0a',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem',
                  fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                }}
              >
                Ver catálogo →
              </button>
            </div>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} style={{
                display: 'flex', gap: '14px', alignItems: 'flex-start',
                paddingBottom: '16px', borderBottom: '1px solid var(--border)',
              }}>
                {/* Image */}
                <div style={{ position: 'relative', width: '72px', height: '96px', flexShrink: 0, background: '#111' }}>
                  <Image src={product.image} alt={product.name} fill sizes="72px" style={{ objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {product.brand}
                  </p>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: 400, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--gray)', marginTop: '2px' }}>
                    {product.volume}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)' }}>
                      <button onClick={() => dec(product.id)} style={qtyBtn}>−</button>
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', minWidth: '20px', textAlign: 'center' }}>{qty}</span>
                      <button onClick={() => inc(product.id)} style={qtyBtn}>+</button>
                    </div>
                    {(() => {
                      const d = getDiscount(product)
                      return (
                        <div style={{ textAlign: 'right' }}>
                          {d && <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: 'var(--gray)', textDecoration: 'line-through' }}>{fmt(product.price * qty)}</p>}
                          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.85rem', fontWeight: 600, color: d ? 'var(--magenta)' : 'white' }}>
                            {fmt((d ? d.final : product.price) * qty)}
                          </p>
                        </div>
                      )
                    })()}
                </div>

                {/* Remove */}
                <button
                  onClick={() => remove(product.id)}
                  aria-label={`Eliminar ${product.name}`}
                  style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0, transition: 'color 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#ff5555')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.2)')}
                >✕</button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: 'var(--gray)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Total</span>
              <div style={{ textAlign: 'right' }}>
                {discountedTotal !== totalPrice && (
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', color: 'var(--gray)', textDecoration: 'line-through', display: 'block' }}>{fmt(totalPrice)}</span>
                )}
                <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--neon)' }}>{fmt(discountedTotal)}</span>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
              Envío calculado en el checkout · Pago 100% seguro
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              style={{
                display: 'block', textAlign: 'center',
                padding: '14px',
                background: 'var(--neon)', color: '#0a0a0a',
                fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem',
                fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                textDecoration: 'none', transition: 'opacity 0.2s',
              }}
            >
              Finalizar compra →
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}

const qtyBtn: React.CSSProperties = {
  background: 'transparent', border: 'none',
  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
  padding: '4px 10px', fontSize: '1rem',
  transition: 'color 0.2s',
}

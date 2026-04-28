'use client'

import Image from 'next/image'
import { Product } from '@/types'
import { useCart } from '@/lib/cart-context'

interface Props {
  product: Product
  featured?: boolean
}

const fmt = (n: number) => `$${n}.000`

export default function ProductCard({ product, featured = false }: Props) {
  const { add } = useCart()

  const genderLabel: Record<Product['gender'], string> = {
    mujer:  'Mujer',
    hombre: 'Hombre',
    unisex: 'Unisex',
  }

  return (
    <article className="product-card flex flex-col h-full">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: '#0d0d0d' }}>
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
          style={{ transition: 'transform 0.4s ease' }}
          onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)')}
          onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
        />
        {/* Gender badge */}
        <div className="absolute top-3 right-3 px-2 py-1" style={{ fontFamily: 'var(--font-montserrat)', background: 'rgba(10,10,10,0.85)', color: 'var(--gray)', fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
          {genderLabel[product.gender]}
        </div>
        {/* Quick-add hover overlay */}
        <button
          onClick={() => add(product)}
          aria-label={`Añadir ${product.name} al carrito`}
          className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 transition-opacity duration-200 hover:opacity-100"
          style={{ background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0a0a0a', background: 'var(--neon)', padding: '8px 20px' }}>
            + Añadir al carrito
          </span>
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-1">
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          {product.brand}
        </span>
        <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: featured ? '1.5rem' : '1.25rem', fontWeight: 400, color: 'white', lineHeight: 1.15 }}>
          {product.name}
        </h3>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: 'var(--gray)', marginTop: '2px' }}>
          {product.volume}
        </span>
        {product.notes?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {product.notes.slice(0, 3).map(note => (
              <span key={note} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(200,255,0,0.6)', border: '1px solid rgba(200,255,0,0.2)', padding: '1px 6px', textTransform: 'uppercase' }}>
                {note}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-3">
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>
            {fmt(product.price)}
          </span>
          <button
            onClick={() => add(product)}
            aria-label={`Añadir ${product.name} al carrito`}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--neon)', cursor: 'pointer', padding: '4px 10px', fontSize: '0.9rem', transition: 'all 0.2s' }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'var(--neon)'; b.style.color = '#0a0a0a' }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'transparent'; b.style.color = 'var(--neon)' }}
          >+</button>
        </div>
      </div>
    </article>
  )
}

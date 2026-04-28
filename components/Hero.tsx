'use client'

import { products } from '@/data/products'
import ProductCard from './ProductCard'

const WA_URL =
  "https://wa.me/573006023544?text=Hola!%20Vi%20el%20cat%C3%A1logo%20de%20LUKSO%20y%20quiero%20hacer%20un%20pedido%20"

// Featured: Dior Sauvage + Carolina Herrera La Bomba
const featured = [
  products.find(p => p.name === 'Sauvage')!,
  products.find(p => p.name === 'La Bomba')!,
]

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden" style={{ paddingTop: '5rem' }}>
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(200,255,0,0.04) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(26,111,255,0.05) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left column — copy */}
        <div style={{ animation: 'fadeInUp 0.7s ease both' }}>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-6"
            style={{
              fontFamily: 'var(--font-montserrat)',
              color: 'var(--gray)',
              letterSpacing: '0.18em',
            }}
          >
            Medellín · Colombia · Est.&nbsp;2026
          </p>

          <h1
            className="leading-none mb-6"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              fontWeight: 300,
              lineHeight: 1.0,
            }}
          >
            Lo{' '}
            <em
              style={{
                color: 'var(--neon)',
                fontStyle: 'italic',
                fontWeight: 600,
              }}
            >
              premium,
            </em>
            <br />
            a tu precio.
          </h1>

          <p
            className="mb-10 max-w-md leading-relaxed"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.45)',
              fontWeight: 300,
            }}
          >
            Fragancias 100&nbsp;% originales de las mejores marcas del mundo, disponibles en Medellín. Más de&nbsp;40&nbsp;referencias para todos los gustos.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#catalogo"
              className="px-7 py-3.5 text-sm font-semibold tracking-wider uppercase transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
              style={{
                fontFamily: 'var(--font-montserrat)',
                background: 'var(--neon)',
                color: 'var(--bg)',
                letterSpacing: '0.12em',
              }}
              aria-label="Ver catálogo de fragancias"
            >
              Ver catálogo
            </a>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 text-sm font-semibold tracking-wider uppercase transition-all duration-200 hover:bg-white/10"
              style={{
                fontFamily: 'var(--font-montserrat)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                letterSpacing: '0.12em',
              }}
              aria-label="Pedir por WhatsApp"
            >
              Pedir por WhatsApp
            </a>
          </div>
        </div>

        {/* Right column — featured cards */}
        <div
          className="grid grid-cols-2 gap-4"
          style={{ animation: 'fadeInUp 0.9s ease both' }}
        >
          {featured.map((p, i) => (
            <div
              key={p.id}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <ProductCard product={p} featured />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: 'fadeIn 1.5s ease 1s both' }}
        aria-hidden="true"
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: 'var(--gray)', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.2em' }}
        >
          Scroll
        </span>
        <div
          className="w-px h-8"
          style={{ background: 'linear-gradient(to bottom, var(--gray), transparent)' }}
        />
      </div>
    </section>
  )
}

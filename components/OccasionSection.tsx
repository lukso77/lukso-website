'use client'

import { useState } from 'react'
import { products } from '@/data/products'
import ProductCard from './ProductCard'
import { Occasion } from '@/types'

interface OccasionMeta {
  value: Occasion
  label: string
  subtitle: string
  emoji: string
  accent: string
}

const occasions: OccasionMeta[] = [
  {
    value:    'noche',
    label:    'Noche',
    subtitle: 'Para brillar después del sol',
    emoji:    '🌙',
    accent:   'var(--magenta)',
  },
  {
    value:    'cita',
    label:    'Cita',
    subtitle: 'Deja una huella imborrable',
    emoji:    '🌹',
    accent:   'var(--neon)',
  },
  {
    value:    'trabajo',
    label:    'Trabajo',
    subtitle: 'Profesional sin ser aburrido',
    emoji:    '💼',
    accent:   'var(--blue)',
  },
  {
    value:    'casual',
    label:    'Casual',
    subtitle: 'Para cada momento del día',
    emoji:    '☀️',
    accent:   'var(--orange)',
  },
]

export default function OccasionSection() {
  const [active, setActive] = useState<Occasion>('noche')

  const filtered = products
    .filter(p => p.occasions?.includes(active))
    .slice(0, 4)

  const meta = occasions.find(o => o.value === active)!

  return (
    <section
      id="ocasiones"
      className="py-24"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12">
          <div>
            <p
              className="uppercase tracking-widest text-xs mb-3"
              style={{
                fontFamily: 'var(--font-montserrat)',
                color: 'var(--gray)',
                letterSpacing: '0.2em',
              }}
            >
              Por ocasión
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 300,
                lineHeight: 1.1,
              }}
            >
              ¿Para qué{' '}
              <em style={{ color: meta.accent, fontStyle: 'italic' }}>
                momento?
              </em>
            </h2>
          </div>

          {/* Occasion tabs */}
          <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Filtrar por ocasión">
            {occasions.map(o => (
              <button
                key={o.value}
                role="tab"
                aria-selected={active === o.value}
                onClick={() => setActive(o.value)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  letterSpacing: '0.1em',
                  background: active === o.value ? o.accent : 'transparent',
                  color: active === o.value ? '#0a0a0a' : 'rgba(255,255,255,0.4)',
                  border: `1px solid ${active === o.value ? o.accent : 'var(--border)'}`,
                  cursor: 'pointer',
                }}
              >
                <span aria-hidden="true">{o.emoji}</span>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subtitle */}
        <p
          className="mb-8"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.05em',
          }}
          role="status"
        >
          {meta.emoji} {meta.subtitle} — {filtered.length} fragancias recomendadas
        </p>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ transition: 'opacity 0.2s ease' }}
        >
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href="#catalogo"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'white')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.35)')}
          >
            Ver todo el catálogo →
          </a>
        </div>
      </div>
    </section>
  )
}

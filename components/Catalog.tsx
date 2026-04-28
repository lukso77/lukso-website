'use client'

import { useState, useEffect, useRef } from 'react'
import { products } from '@/data/products'
import ProductCard from './ProductCard'
import { Product } from '@/types'

type Filter = 'todos' | Product['gender']

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'todos',   label: 'Todos' },
  { value: 'mujer',   label: 'Mujer' },
  { value: 'hombre',  label: 'Hombre' },
  { value: 'unisex',  label: 'Unisex' },
]

const PAGE_SIZE = 8

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState<Filter>('todos')
  const [visible, setVisible]           = useState(PAGE_SIZE)
  const [fading, setFading]             = useState(false)
  const [query, setQuery]               = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const gridRef    = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  // Filtrar por género + búsqueda de texto
  const filtered = products.filter(p => {
    const matchGender = activeFilter === 'todos' || p.gender === activeFilter
    if (!query.trim()) return matchGender
    const q = query.toLowerCase().trim()
    return (
      matchGender && (
        p.name.toLowerCase().includes(q)  ||
        p.brand.toLowerCase().includes(q) ||
        p.notes?.some(n => n.toLowerCase().includes(q)) ||
        p.description?.toLowerCase().includes(q)
      )
    )
  })

  const shown = filtered.slice(0, visible)

  const handleFilter = (f: Filter) => {
    if (f === activeFilter) return
    setFading(true)
    setTimeout(() => {
      setActiveFilter(f)
      setVisible(PAGE_SIZE)
      setFading(false)
    }, 180)
  }

  const handleSearch = (val: string) => {
    setQuery(val)
    setVisible(PAGE_SIZE)
  }

  const clearSearch = () => {
    setQuery('')
    setVisible(PAGE_SIZE)
    inputRef.current?.focus()
  }

  // Intersection Observer para animación de entrada
  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll<HTMLElement>('.card-hidden')
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.remove('card-hidden')
              entry.target.classList.add('card-visible')
            }, idx * 60)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    cards.forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [shown, fading])

  const isSearching = query.trim().length > 0

  return (
    <section id="catalogo" className="py-24 max-w-7xl mx-auto px-6">

      {/* ── Título ─────────────────────────────────────────────── */}
      <div className="mb-10">
        <p
          className="uppercase tracking-widest text-xs mb-3"
          style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--gray)', letterSpacing: '0.2em' }}
        >
          Nuestro catálogo
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 300,
            lineHeight: 1.1,
          }}
        >
          Todas las referencias
        </h2>
      </div>

      {/* ── Barra de búsqueda ──────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          marginBottom: '20px',
          border: `1px solid ${searchFocused ? 'rgba(200,255,0,0.5)' : 'var(--border)'}`,
          background: '#111',
          transition: 'border-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Icono lupa */}
        <span
          style={{
            padding: '0 16px',
            color: searchFocused ? 'var(--neon)' : 'var(--gray)',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Buscar por nombre, marca o nota aromática…"
          aria-label="Buscar fragancias"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '14px 0',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.82rem',
            color: 'white',
            caretColor: 'var(--neon)',
          }}
        />

        {/* Contador de resultados mientras escribe */}
        {isSearching && (
          <span
            style={{
              padding: '0 14px',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              color: filtered.length > 0 ? 'var(--neon)' : 'rgba(255,80,80,0.7)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {filtered.length > 0 ? `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}` : 'Sin resultados'}
          </span>
        )}

        {/* Botón limpiar */}
        {isSearching && (
          <button
            onClick={clearSearch}
            aria-label="Limpiar búsqueda"
            style={{
              padding: '0 16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--gray)',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'white')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--gray)')}
          >
            ✕
          </button>
        )}
      </div>

      {/* Sugerencias de búsqueda rápida */}
      {!isSearching && (
        <div className="flex flex-wrap gap-2 mb-8">
          {['Oud', 'Vainilla', 'Dior', 'Lattafa', 'Montale', 'Eros', 'Sauvage'].map(tag => (
            <button
              key={tag}
              onClick={() => handleSearch(tag)}
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.55rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                border: '1px solid var(--border)',
                background: 'transparent',
                padding: '5px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.borderColor = 'rgba(200,255,0,0.4)'
                b.style.color = 'var(--neon)'
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.borderColor = 'var(--border)'
                b.style.color = 'rgba(255,255,255,0.35)'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* ── Filtros de género ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrar por género">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => handleFilter(f.value)}
              aria-pressed={activeFilter === f.value}
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200"
              style={{
                fontFamily: 'var(--font-montserrat)',
                letterSpacing: '0.12em',
                background: activeFilter === f.value ? 'var(--neon)' : 'transparent',
                color:      activeFilter === f.value ? 'var(--bg)'  : 'rgba(255,255,255,0.4)',
                border:     `1px solid ${activeFilter === f.value ? 'var(--neon)' : 'var(--border)'}`,
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Indicador de búsqueda activa */}
        {isSearching && (
          <p style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.1em',
          }}>
            Buscando: <em style={{ color: 'var(--neon)', fontStyle: 'normal' }}>"{query}"</em>
          </p>
        )}
      </div>

      {/* ── Grid ──────────────────────────────────────────────── */}
      {shown.length > 0 ? (
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ transition: 'opacity 0.18s ease', opacity: fading ? 0 : 1 }}
        >
          {shown.map(p => (
            <div key={`${activeFilter}-${p.id}-${query}`} className="card-hidden">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      ) : (
        /* Sin resultados */
        <div
          className="text-center py-20"
          style={{ border: '1px solid var(--border)', background: '#0f0f0f' }}
        >
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '2rem',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.2)',
            marginBottom: '8px',
          }}>
            Sin resultados
          </p>
          <p style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.1em',
            marginBottom: '20px',
          }}>
            No encontramos fragancias para <em style={{ color: 'rgba(255,255,255,0.4)' }}>"{query}"</em>
          </p>
          <button
            onClick={clearSearch}
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--neon)',
              background: 'transparent',
              border: '1px solid rgba(200,255,0,0.3)',
              padding: '8px 20px',
              cursor: 'pointer',
            }}
          >
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* ── Contador ──────────────────────────────────────────── */}
      {shown.length > 0 && (
        <p
          className="text-center mt-8"
          style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--gray)', fontSize: '0.75rem' }}
        >
          Mostrando {shown.length} de {filtered.length} referencias
        </p>
      )}

      {/* ── Ver más ───────────────────────────────────────────── */}
      {visible < filtered.length && shown.length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisible(v => v + PAGE_SIZE)}
            className="group flex items-center gap-3 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5"
            style={{
              fontFamily: 'var(--font-montserrat)',
              letterSpacing: '0.12em',
              border: '1px solid var(--border)',
              color: 'rgba(255,255,255,0.6)',
              background: 'transparent',
              cursor: 'pointer',
            }}
            aria-label="Cargar más productos"
          >
            Ver más
            <span
              className="transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: 'var(--neon)' }}
              aria-hidden="true"
            >
              ↓
            </span>
          </button>
        </div>
      )}
    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'

const links = [
  { label: 'Finder',   href: '#finder' },
  { label: 'Ocasiones',href: '#ocasiones' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Nosotros', href: '#nosotros' },
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(10,10,10,0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" aria-label="LUKSO inicio" className="flex items-center gap-0">
            <span
              className="text-2xl font-bold tracking-widest"
              style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.18em' }}
            >
              LK
            </span>
            <span
              className="text-2xl font-bold tracking-widest"
              style={{ fontFamily: 'var(--font-montserrat)', color: 'var(--neon)', letterSpacing: '0.18em' }}
            >
              SO
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 tracking-wider uppercase"
                style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', letterSpacing: '0.12em' }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Cart button */}
          <button
            onClick={openCart}
            aria-label={`Abrir carrito (${totalItems} productos)`}
            className="relative flex items-center justify-center w-10 h-10 transition-colors"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'white')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '2px', right: '2px',
                background: 'var(--neon)', color: '#0a0a0a',
                borderRadius: '50%', width: '16px', height: '16px',
                fontSize: '0.55rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-montserrat)',
              }}>{totalItems}</span>
            )}
          </button>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href="https://www.instagram.com/lukso.col"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar Instagram de LUKSO"
              className="group border border-white/20 px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-250 hover:border-transparent"
              style={{
                fontFamily: 'var(--font-montserrat)',
                letterSpacing: '0.14em',
                transition: 'background 0.2s, color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = 'var(--neon)'
                el.style.color = 'var(--bg)'
                el.style.borderColor = 'var(--neon)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = 'transparent'
                el.style.color = 'white'
                el.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
            >
              @LUKSO.COL
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            <span
              className="block w-6 h-0.5 bg-white transition-all duration-300"
              style={{ transform: open ? 'translateY(8px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-6 h-0.5 bg-white transition-all duration-300"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="block w-6 h-0.5 bg-white transition-all duration-300"
              style={{ transform: open ? 'translateY(-8px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className="fixed top-0 right-0 h-full w-72 z-50 md:hidden flex flex-col pt-20 px-8 gap-6"
        style={{
          background: '#0f0f0f',
          borderLeft: '1px solid var(--border)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        aria-label="Menú móvil"
      >
        {links.map(l => (
          <a
            key={l.href}
            href={l.href}
            onClick={close}
            className="text-lg font-medium tracking-widest uppercase text-white/70 hover:text-white transition-colors border-b border-white/5 pb-4"
            style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.12em', fontSize: '0.8rem' }}
          >
            {l.label}
          </a>
        ))}
        <a
          href="https://www.instagram.com/lukso.col"
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
          className="mt-4 text-center py-3 font-semibold text-xs tracking-widest uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            background: 'var(--neon)',
            color: 'var(--bg)',
            letterSpacing: '0.14em',
          }}
        >
          @LUKSO.COL
        </a>
      </div>
    </>
  )
}

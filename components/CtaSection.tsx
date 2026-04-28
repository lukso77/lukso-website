'use client'

import { useEffect, useRef, useState } from 'react'

const WA_URL =
  "https://wa.me/573006023544?text=Hola!%20Vi%20el%20cat%C3%A1logo%20de%20LUKSO%20y%20quiero%20hacer%20un%20pedido%20"

interface Stat {
  value: number
  label: string
  suffix: string
  color: string
}

const stats: Stat[] = [
  { value: 16,  label: 'Marcas',      suffix: '+', color: 'var(--neon)' },
  { value: 40,  label: 'Referencias', suffix: '+', color: 'var(--blue)' },
  { value: 100, label: 'Originales',  suffix: '%', color: 'var(--magenta)' },
]

function useCountUp(target: number, duration = 1400, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)
    const id = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(id)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(id)
  }, [active, target, duration])
  return count
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const n = useCountUp(stat.value, 1400, active)
  return (
    <div
      className="flex flex-col gap-2 p-6"
      style={{ border: '1px solid var(--border)', background: '#0f0f0f' }}
    >
      <span
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '3.5rem',
          fontWeight: 300,
          lineHeight: 1,
          color: stat.color,
        }}
        aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
      >
        {n}{stat.suffix}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
        }}
      >
        {stat.label}
      </span>
    </div>
  )
}

export default function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      className="py-24"
      style={{ background: '#0d0d0d', borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <p
            className="uppercase tracking-widest text-xs mb-4"
            style={{
              fontFamily: 'var(--font-montserrat)',
              color: 'var(--gray)',
              letterSpacing: '0.2em',
            }}
          >
            Por qué LUKSO
          </p>
          <h2
            className="mb-6 leading-tight"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
            }}
          >
            Fragancias de lujo,{' '}
            <em style={{ color: 'var(--neon)', fontStyle: 'italic' }}>accesibles.</em>
          </h2>
          <p
            className="mb-8 leading-relaxed"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.4)',
              fontWeight: 300,
              maxWidth: '420px',
            }}
          >
            Somos una tienda especializada en fragancias de alta gama con garantía de autenticidad. Cada botella llega directamente a tus manos desde Medellín, Colombia.
          </p>

          <a
            href="https://www.instagram.com/lukso.col"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 group"
            aria-label="Ver Instagram de LUKSO"
          >
            {/* Instagram SVG */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--neon)' }}
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            <span
              className="font-medium tracking-widest uppercase transition-colors duration-200 group-hover:text-white"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.15em',
              }}
            >
              @LUKSO.COL
            </span>
          </a>

          <div className="mt-8">
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 font-semibold text-xs tracking-wider uppercase transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
              style={{
                fontFamily: 'var(--font-montserrat)',
                background: 'var(--neon)',
                color: 'var(--bg)',
                letterSpacing: '0.12em',
              }}
              aria-label="Hacer pedido por WhatsApp"
            >
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Hacer pedido
            </a>
          </div>
        </div>

        {/* Right — stats */}
        <div className="grid grid-cols-1 gap-4">
          {stats.map(stat => (
            <StatCard key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { products } from '@/data/products'
import ProductCard from './ProductCard'
import { Product } from '@/types'

/* ── Questions ─────────────────────────────────────────────────────── */
interface Question {
  id: string
  text: string
  options: { label: string; value: string; emoji: string }[]
}

const questions: Question[] = [
  {
    id: 'momento',
    text: '¿Para qué momento buscas tu fragancia?',
    options: [
      { label: 'Noche especial',  value: 'noche',   emoji: '🌙' },
      { label: 'Cita romántica',  value: 'cita',    emoji: '🌹' },
      { label: 'Trabajo / día',   value: 'trabajo', emoji: '💼' },
      { label: 'Día a día casual',value: 'casual',  emoji: '☀️' },
    ],
  },
  {
    id: 'estilo',
    text: '¿Qué perfil te describe mejor?',
    options: [
      { label: 'Intenso y misterioso',   value: 'intenso',  emoji: '🖤' },
      { label: 'Fresco y natural',        value: 'fresco',   emoji: '🌿' },
      { label: 'Dulce y seductor',        value: 'dulce',    emoji: '🍯' },
      { label: 'Elegante y sofisticado',  value: 'elegante', emoji: '👑' },
    ],
  },
  {
    id: 'genero',
    text: '¿A quién va dirigido?',
    options: [
      { label: 'Para mí (mujer)',  value: 'mujer',   emoji: '🌸' },
      { label: 'Para mí (hombre)', value: 'hombre',  emoji: '⚡' },
      { label: 'Para los dos',     value: 'unisex',  emoji: '✨' },
    ],
  },
]

/* ── Matching logic ─────────────────────────────────────────────────── */
function matchProducts(answers: Record<string, string>): Product[] {
  const { momento, estilo, genero } = answers

  const scored = products.map(p => {
    let score = 0

    // Gender match
    if (genero === 'unisex') {
      score += p.gender === 'unisex' ? 3 : 1
    } else if (p.gender === genero || p.gender === 'unisex') {
      score += p.gender === genero ? 3 : 1
    }

    // Occasion match
    if (momento && p.occasions?.includes(momento as any)) score += 3

    // Style match
    const noteMap: Record<string, string[]> = {
      intenso:  ['Oud', 'Cuero', 'Tabaco', 'Café negro', 'Vetiver', 'Resinas', 'Ámbar'],
      fresco:   ['Bergamota', 'Limón', 'Menta', 'Bambú', 'Cedro', 'Pomelo', 'Limón siciliano'],
      dulce:    ['Vainilla', 'Caramelo', 'Tonka', 'Frutos dulces', 'Chicle', 'Coco', 'Musk blanco'],
      elegante: ['Rosa damascena', 'Jazmín', 'Sándalo', 'Ámbar gris', 'Ámbar dorado', 'Azafrán'],
    }
    const styleNotes = noteMap[estilo] || []
    const matches = p.notes?.filter(n =>
      styleNotes.some(sn => n.toLowerCase().includes(sn.toLowerCase()))
    ).length || 0
    score += matches * 2

    return { product: p, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.product)
}

/* ── Component ──────────────────────────────────────────────────────── */
export default function ScentFinder() {
  const [step, setStep]       = useState<'intro' | number | 'result'>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Product[]>([])

  const currentQ = typeof step === 'number' ? questions[step] : null

  const handleAnswer = (qId: string, value: string) => {
    const next = { ...answers, [qId]: value }
    setAnswers(next)
    const nextStep = (step as number) + 1
    if (nextStep >= questions.length) {
      setResults(matchProducts(next))
      setStep('result')
    } else {
      setStep(nextStep)
    }
  }

  const reset = () => {
    setStep('intro')
    setAnswers({})
    setResults([])
  }

  const progress = typeof step === 'number'
    ? Math.round(((step) / questions.length) * 100)
    : step === 'result' ? 100 : 0

  return (
    <section
      id="finder"
      className="py-24"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0d1200 50%, #0a0a0a 100%)' }}
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="uppercase tracking-widest text-xs mb-3"
            style={{
              fontFamily: 'var(--font-montserrat)',
              color: 'var(--neon)',
              letterSpacing: '0.25em',
            }}
          >
            Exclusivo LUKSO
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
            }}
          >
            Descubre tu{' '}
            <em style={{ color: 'var(--neon)', fontStyle: 'italic' }}>fragancia ideal</em>
          </h2>
          <p
            className="mt-3 mx-auto"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.35)',
              maxWidth: '440px',
              lineHeight: 1.7,
            }}
          >
            3 preguntas. Tu aroma perfecto. Sin adivinar.
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            border: '1px solid rgba(200,255,0,0.15)',
            background: '#0f0f0f',
            padding: 'clamp(24px, 5vw, 52px)',
          }}
        >
          {/* INTRO */}
          {step === 'intro' && (
            <div className="text-center" style={{ animation: 'fadeInUp 0.5s ease both' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }} aria-hidden="true">🧴</div>
              <h3
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: 300,
                }}
              >
                ¿No sabes qué fragancia elegir?
              </h3>
              <p
                className="mb-8 mx-auto"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.4)',
                  maxWidth: '380px',
                  lineHeight: 1.7,
                }}
              >
                Responde 3 preguntas rápidas y te recomendaremos las fragancias de LUKSO que más van contigo.
              </p>
              <button
                onClick={() => setStep(0)}
                className="px-8 py-3.5 text-sm font-semibold tracking-wider uppercase transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  background: 'var(--neon)',
                  color: 'var(--bg)',
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Comenzar quiz →
              </button>
            </div>
          )}

          {/* QUESTION */}
          {currentQ && (
            <div key={currentQ.id} style={{ animation: 'fadeInUp 0.35s ease both' }}>
              {/* Progress */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="flex-1 h-px"
                  style={{ background: 'var(--border)' }}
                >
                  <div
                    style={{
                      height: '1px',
                      background: 'var(--neon)',
                      width: `${progress}%`,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.6rem',
                    color: 'var(--gray)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {(step as number) + 1} / {questions.length}
                </span>
              </div>

              <h3
                className="mb-8"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                  fontWeight: 300,
                  lineHeight: 1.2,
                }}
              >
                {currentQ.text}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(currentQ.id, opt.value)}
                    className="group text-left transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      padding: '16px 20px',
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,255,0,0.4)'
                      ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,255,0,0.04)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
                      ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }} aria-hidden="true">{opt.emoji}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-montserrat)',
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.75)',
                        fontWeight: 400,
                      }}
                    >
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RESULT */}
          {step === 'result' && (
            <div style={{ animation: 'fadeInUp 0.5s ease both' }}>
              <div className="text-center mb-10">
                <p
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.65rem',
                    color: 'var(--neon)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  Tu selección personalizada
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                    fontWeight: 300,
                  }}
                >
                  {results.length > 0 ? 'Estas son tus fragancias' : 'Ningún resultado'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {results.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={reset}
                  className="px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-200 hover:text-white"
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    border: '1px solid var(--border)',
                    color: 'rgba(255,255,255,0.4)',
                    background: 'transparent',
                    cursor: 'pointer',
                    letterSpacing: '0.12em',
                  }}
                >
                  ← Repetir quiz
                </button>
                <a
                  href="#catalogo"
                  className="px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-200 hover:opacity-90"
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    background: 'var(--neon)',
                    color: 'var(--bg)',
                    letterSpacing: '0.12em',
                  }}
                >
                  Ver catálogo completo →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

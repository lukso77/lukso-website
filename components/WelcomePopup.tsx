'use client'

import { useEffect, useState } from 'react'

const WA_NUMBER = '573006023544'
const STORAGE_KEY = 'lukso_welcome_seen'

/* Genera un código único por visita, ej: LUKSO-A4K2 */
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'LUKSO-'
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false)
  const [code, setCode]       = useState('')
  const [copied, setCopied]   = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY)
    if (!seen) {
      const newCode = generateCode()
      setCode(newCode)
      // Pequeño delay para que no aparezca en el primer frame
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  const close = () => {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      localStorage.setItem(STORAGE_KEY, '1')
    }, 300)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hola LUKSO! 👋 Quiero usar mi código de descuento del 7% para mi primera compra:\n\n🎁 Código: *${code}*\n\n¿Cómo lo aplico?`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
    close()
  }

  if (!visible) return null

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 9998,
          opacity: closing ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Oferta de bienvenida LUKSO"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: closing
            ? 'translate(-50%, -54%) scale(0.96)'
            : 'translate(-50%, -50%) scale(1)',
          zIndex: 9999,
          width: 'min(92vw, 480px)',
          background: '#0f0f0f',
          border: '1px solid rgba(200,255,0,0.25)',
          padding: 'clamp(28px, 6vw, 48px)',
          opacity: closing ? 0 : 1,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            lineHeight: 1,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'white')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)')}
        >
          ✕
        </button>

        {/* Top accent line */}
        <div
          style={{
            width: '40px',
            height: '2px',
            background: 'var(--neon)',
            marginBottom: '20px',
          }}
          aria-hidden="true"
        />

        {/* Label */}
        <p
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--neon)',
            marginBottom: '10px',
          }}
        >
          Oferta exclusiva · Primera compra
        </p>

        {/* Headline */}
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(2rem, 6vw, 2.8rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: '14px',
            color: 'white',
          }}
        >
          Lleva tu fragancia con{' '}
          <em style={{ color: 'var(--neon)', fontStyle: 'italic' }}>7% OFF</em>
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.7,
            marginBottom: '28px',
          }}
        >
          Tu código personal ya está listo. Envíanoslo por WhatsApp al hacer tu pedido y aplicamos el descuento directo.
        </p>

        {/* Code box */}
        <div
          style={{
            background: 'rgba(200,255,0,0.05)',
            border: '1px dashed rgba(200,255,0,0.35)',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.5rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '4px',
              }}
            >
              Tu código
            </p>
            <span
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '1.4rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'var(--neon)',
              }}
              aria-label={`Código de descuento: ${code}`}
            >
              {code}
            </span>
          </div>

          <button
            onClick={handleCopy}
            aria-label={copied ? 'Código copiado' : 'Copiar código'}
            style={{
              background: copied ? 'rgba(200,255,0,0.15)' : 'transparent',
              border: '1px solid rgba(200,255,0,0.3)',
              color: copied ? 'var(--neon)' : 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '8px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>

        {/* CTA WhatsApp */}
        <button
          onClick={handleWhatsApp}
          style={{
            width: '100%',
            padding: '14px',
            background: 'var(--neon)',
            color: '#0a0a0a',
            border: 'none',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'opacity 0.2s',
            marginBottom: '12px',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.9')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        >
          {/* WhatsApp icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Enviar código por WhatsApp
        </button>

        {/* Skip */}
        <button
          onClick={close}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
            cursor: 'pointer',
            padding: '4px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.2)')}
        >
          No gracias, seguir sin descuento
        </button>
      </div>
    </>
  )
}

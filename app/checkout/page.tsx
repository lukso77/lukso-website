'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

const fmt = (n: number) => `$${n.toLocaleString('es-CO')}.000`

const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_KEY ?? ''
const WOMPI_READY = WOMPI_PUBLIC_KEY.startsWith('pub_')
const SHIPPING_MEDELLIN = 8
const SHIPPING_NACIONAL = 15

export default function CheckoutPage() {
  const { items, totalPrice, clear } = useCart()
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    ciudad: '', direccion: '', notas: '',
  })
  const [envio, setEnvio] = useState<'medellin' | 'nacional'>('medellin')
  const [step, setStep] = useState<'form' | 'pay'>('form')

  const shippingCost = envio === 'medellin' ? SHIPPING_MEDELLIN : SHIPPING_NACIONAL
  const total = totalPrice + shippingCost

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const valid = form.nombre && form.apellido && form.email && form.telefono && form.ciudad && form.direccion

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 300, color: 'rgba(255,255,255,0.3)' }}>Tu carrito está vacío</p>
        <Link href="/" style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', color: 'var(--neon)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>← Volver al catálogo</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0a', paddingTop: '80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>

        {/* ── Columna izquierda: formulario ── */}
        <div>
          <Link href="/" style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', display: 'block', marginBottom: '24px' }}>
            ← Volver a la tienda
          </Link>

          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--neon)', marginBottom: '8px' }}>Checkout</p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.2rem', fontWeight: 300, marginBottom: '32px' }}>Datos de entrega</h1>

          {step === 'form' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Nombre" value={form.nombre}    onChange={v => set('nombre', v)} />
                <Field label="Apellido" value={form.apellido} onChange={v => set('apellido', v)} />
              </div>
              <Field label="Correo electrónico" value={form.email}    onChange={v => set('email', v)}    type="email" />
              <Field label="Teléfono / WhatsApp" value={form.telefono} onChange={v => set('telefono', v)} type="tel" />
              <Field label="Ciudad"    value={form.ciudad}   onChange={v => set('ciudad', v)} />
              <Field label="Dirección" value={form.direccion} onChange={v => set('direccion', v)} />
              <Field label="Notas adicionales (opcional)" value={form.notas} onChange={v => set('notas', v)} />

              {/* Tipo de envío */}
              <div style={{ marginTop: '8px' }}>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '10px' }}>Tipo de envío</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { k: 'medellin', label: 'Medellín y área metropolitana', price: SHIPPING_MEDELLIN, tag: '1-2 días' },
                    { k: 'nacional', label: 'Nacional (toda Colombia)', price: SHIPPING_NACIONAL, tag: '3-5 días' },
                  ].map(opt => (
                    <label key={opt.k} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: `1px solid ${envio === opt.k ? 'var(--neon)' : 'var(--border)'}`, cursor: 'pointer', background: envio === opt.k ? 'rgba(200,255,0,0.04)' : 'transparent', transition: 'all 0.2s' }}>
                      <input type="radio" name="envio" value={opt.k} checked={envio === opt.k} onChange={() => setEnvio(opt.k as any)} style={{ accentColor: 'var(--neon)' }} />
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', flex: 1 }}>{opt.label}</span>
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--gray)' }}>{opt.tag}</span>
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>{fmt(opt.price)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                disabled={!valid}
                onClick={() => setStep('pay')}
                style={{
                  marginTop: '8px', padding: '14px',
                  background: valid ? 'var(--neon)' : 'rgba(255,255,255,0.1)',
                  color: valid ? '#0a0a0a' : 'rgba(255,255,255,0.3)',
                  border: 'none', cursor: valid ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem',
                  fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
              >
                Continuar al pago →
              </button>
            </div>
          )}

          {step === 'pay' && (
            <div>
              {/* Resumen datos */}
              <div style={{ padding: '16px', background: '#111', border: '1px solid var(--border)', marginBottom: '24px' }}>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--gray)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>Enviando a</p>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem' }}>{form.nombre} {form.apellido}</p>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{form.direccion}, {form.ciudad}</p>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{form.email} · {form.telefono}</p>
                <button onClick={() => setStep('form')} style={{ marginTop: '10px', background: 'transparent', border: 'none', color: 'var(--neon)', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.1em', cursor: 'pointer', textDecoration: 'underline' }}>Cambiar</button>
              </div>

              {/* Wompi payment button */}
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '16px' }}>Método de pago</p>
              <div style={{ padding: '20px', background: '#111', border: `1px solid ${WOMPI_READY ? 'var(--border)' : 'rgba(255,165,0,0.3)'}`, marginBottom: '16px' }}>
                {WOMPI_READY ? (
                  <>
                    <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', lineHeight: 1.6 }}>
                      Acepta <strong style={{ color: 'white' }}>PSE · Bancolombia · Tarjetas crédito/débito</strong> — procesado por Wompi de forma 100% segura.
                    </p>
                    <WompiButton
                      publicKey={WOMPI_PUBLIC_KEY}
                      amountInCents={total * 1000 * 100}
                      currency="COP"
                      reference={`LUKSO-${Date.now()}`}
                      customerEmail={form.email}
                      customerFullName={`${form.nombre} ${form.apellido}`}
                      customerPhoneNumber={form.telefono}
                      shippingAddress={form.direccion}
                      shippingCity={form.ciudad}
                    />
                  </>
                ) : (
                  <WompiPending
                    nombre={form.nombre}
                    apellido={form.apellido}
                    telefono={form.telefono}
                    email={form.email}
                    ciudad={form.ciudad}
                    direccion={form.direccion}
                    envio={envio}
                    total={total}
                    items={items}
                  />
                )}
              </div>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', lineHeight: 1.6 }}>
                🔒 Tus datos están protegidos con encriptación SSL. Al finalizar el pago te enviaremos confirmación a tu correo y te contactaremos por WhatsApp para coordinar la entrega.
              </p>
            </div>
          )}
        </div>

        {/* ── Columna derecha: resumen ── */}
        <div style={{ background: '#0f0f0f', border: '1px solid var(--border)', padding: '28px', position: 'sticky', top: '100px' }}>
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '20px' }}>Resumen del pedido</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {items.map(({ product, qty }) => (
              <div key={product.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '56px', height: '72px', flexShrink: 0, background: '#111' }}>
                  <Image src={product.image} alt={product.name} fill sizes="56px" style={{ objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--neon)', color: '#0a0a0a', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', fontWeight: 700 }}>{qty}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{product.brand}</p>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem' }}>{product.name}</p>
                  <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--gray)' }}>{product.volume}</p>
                </div>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmt(product.price * qty)}</p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Row label="Subtotal" value={fmt(totalPrice)} />
            <Row label={`Envío (${envio === 'medellin' ? 'Medellín' : 'Nacional'})`} value={fmt(shippingCost)} />
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--neon)' }}>{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} required={!label.includes('opcional')}
        style={{ background: '#111', border: '1px solid var(--border)', color: 'white', padding: '11px 14px', fontFamily: 'var(--font-montserrat)', fontSize: '0.82rem', outline: 'none', transition: 'border-color 0.2s', caretColor: 'var(--neon)' }}
        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(200,255,0,0.5)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem' }}>{value}</span>
    </div>
  )
}

function WompiButton({ publicKey, amountInCents, currency, reference, customerEmail, customerFullName, customerPhoneNumber, shippingAddress, shippingCity }: {
  publicKey: string; amountInCents: number; currency: string; reference: string
  customerEmail: string; customerFullName: string; customerPhoneNumber: string
  shippingAddress: string; shippingCity: string
}) {
  // Wompi usa un formulario con script embed
  return (
    <div>
      <form action="https://checkout.wompi.co/p/" method="GET">
        <input type="hidden" name="public-key"        value={publicKey} />
        <input type="hidden" name="currency"          value={currency} />
        <input type="hidden" name="amount-in-cents"   value={String(Math.round(amountInCents))} />
        <input type="hidden" name="reference"         value={reference} />
        <input type="hidden" name="customer-data:email"        value={customerEmail} />
        <input type="hidden" name="customer-data:full-name"    value={customerFullName} />
        <input type="hidden" name="customer-data:phone-number" value={customerPhoneNumber} />
        <input type="hidden" name="shipping-address:address-line-1" value={shippingAddress} />
        <input type="hidden" name="shipping-address:city"           value={shippingCity} />
        <input type="hidden" name="shipping-address:country"        value="CO" />
        <input type="hidden" name="redirect-url" value={typeof window !== 'undefined' ? `${window.location.origin}/pedido-confirmado` : ''} />
        <button
          type="submit"
          style={{
            width: '100%', padding: '14px',
            background: '#7b61ff', color: 'white',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem',
            fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.9')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Pagar con Wompi — PSE · Bancolombia · Tarjetas
        </button>
      </form>
      <p style={{ marginTop: '10px', fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
        Serás redirigido a la plataforma segura de Wompi
      </p>
    </div>
  )
}

/* ── Pantalla temporal cuando Wompi aún no está configurado ─────────── */
function WompiPending({ nombre, apellido, telefono, email, ciudad, direccion, envio, total, items }: {
  nombre: string; apellido: string; telefono: string; email: string
  ciudad: string; direccion: string; envio: string; total: number; items: any[]
}) {
  const WA_NUMBER = '573006023544'

  const productLines = items.map(({ product, qty }: any) =>
    `  • ${qty}x ${product.brand} ${product.name} (${product.volume}) — $${(product.price * qty).toLocaleString('es-CO')}.000`
  ).join('\n')

  const envioLabel = envio === 'medellin' ? 'Medellín / Área metro' : 'Nacional (toda Colombia)'

  const msg = encodeURIComponent(
`¡Hola LUKSO! 👋 Quiero confirmar un pedido:

*PRODUCTOS:*
${productLines}

*TOTAL A PAGAR: $${total.toLocaleString('es-CO')}.000 COP*

*DATOS DE ENTREGA:*
👤 ${nombre} ${apellido}
📧 ${email}
📱 ${telefono}
📍 ${direccion}, ${ciudad}
🚚 Envío: ${envioLabel}

Por favor indíquenme cómo realizar el pago. ¡Gracias! 🙏`
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.3)', marginBottom: '16px' }}>
        <span style={{ fontSize: '1rem' }}>⏳</span>
        <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.68rem', color: 'rgba(255,200,80,0.9)', lineHeight: 1.5 }}>
          El pago en línea estará disponible muy pronto. Por ahora coordina tu pedido por WhatsApp.
        </p>
      </div>
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${msg}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          width: '100%', padding: '14px',
          background: '#25D366', color: 'white',
          fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem',
          fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
          textDecoration: 'none', transition: 'opacity 0.2s',
          boxSizing: 'border-box',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Enviar pedido por WhatsApp
      </a>
      <p style={{ marginTop: '10px', fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
        Cuando actives Wompi, el botón de pago aparecerá aquí automáticamente
      </p>
    </div>
  )
}

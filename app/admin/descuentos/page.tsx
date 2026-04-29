'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { products } from '@/data/products'

const BRANDS = [...new Set(products.map(p => p.brand))].sort()

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Productos', href: '/admin/productos' },
  { label: 'Pedidos', href: '/admin/pedidos' },
  { label: 'Descuentos', href: '/admin/descuentos' },
]

const emptyForm = {
  label: '',
  type: 'tienda' as 'tienda' | 'marca' | 'producto',
  pct: 10,
  brand: '',
  productId: '' as number | '',
  active: true,
}

export default function DescuentosAdmin() {
  const [token] = useState(() =>
    typeof window !== 'undefined' ? sessionStorage.getItem('lukso_admin_token') ?? '' : ''
  )
  const [discounts, setDiscounts] = useState<any[]>([])
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!token) { window.location.href = '/admin'; return }
    fetch('/api/discounts').then(r => r.json()).then(setDiscounts)
  }, [token])

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.label || !form.pct) { setMsg('⚠️ Completa etiqueta y porcentaje'); return }
    if (form.type === 'marca' && !form.brand) { setMsg('⚠️ Selecciona una marca'); return }
    if (form.type === 'producto' && !form.productId) { setMsg('⚠️ Selecciona un producto'); return }
    setSaving(true)
    const body = {
      ...form,
      pct: Number(form.pct),
      productId: form.productId !== '' ? Number(form.productId) : undefined,
      brand: form.type === 'marca' ? form.brand : undefined,
    }
    const res = await fetch('/api/discounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const updated = await fetch('/api/discounts').then(r => r.json())
      setDiscounts(updated)
      setForm({ ...emptyForm })
      setMsg('✓ Descuento creado')
    } else {
      setMsg('❌ Error al guardar')
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const toggle = async (d: any) => {
    await fetch('/api/discounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ id: d.id, active: !d.active }),
    })
    setDiscounts(prev => prev.map(x => x.id === d.id ? { ...x, active: !x.active } : x))
  }

  const del = async (id: number) => {
    if (!confirm('¿Eliminar este descuento?')) return
    await fetch('/api/discounts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ id }),
    })
    setDiscounts(prev => prev.filter(x => x.id !== id))
  }

  const typeLabel = (d: any) => {
    if (d.type === 'tienda') return 'Toda la tienda'
    if (d.type === 'marca') return `Marca: ${d.brand}`
    const p = products.find(x => x.id === d.productId)
    return p ? `${p.brand} ${p.name}` : `Producto #${d.productId}`
  }

  if (!token) return null

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0a' }}>
      <header style={{ background: '#0f0f0f', borderBottom: '1px solid var(--border)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', gap: '32px', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.18em' }}>
          LK<span style={{ color: 'var(--neon)' }}>SO</span>{' '}
          <span style={{ fontSize: '0.6rem', color: 'var(--gray)', fontWeight: 400 }}>Admin</span>
        </span>
        <nav style={{ display: 'flex', gap: '24px' }}>
          {ADMIN_NAV.map(l => (
            <Link key={l.href} href={l.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: l.href === '/admin/descuentos' ? 'var(--neon)' : 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
              {l.label}
            </Link>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '40px', alignItems: 'start' }}>

          {/* ── Formulario ── */}
          <div style={{ background: '#0f0f0f', border: '1px solid var(--border)', padding: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 300, marginBottom: '24px' }}>
              + Nuevo descuento
            </h2>

            {msg && (
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', padding: '10px 14px', background: msg.startsWith('✓') ? 'rgba(200,255,0,0.1)' : 'rgba(255,80,80,0.1)', border: `1px solid ${msg.startsWith('✓') ? 'var(--neon)' : '#ff5555'}`, color: msg.startsWith('✓') ? 'var(--neon)' : '#ff8888', marginBottom: '16px' }}>
                {msg}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Etiqueta */}
              <div>
                <label style={lbl}>Etiqueta del descuento</label>
                <input value={form.label} onChange={e => set('label', e.target.value)} style={inp} placeholder="Ej: Rebajas de verano, 2x1 Dior..." />
              </div>

              {/* Tipo */}
              <div>
                <label style={lbl}>Aplica a</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {([
                    { v: 'tienda', icon: '🏪', text: 'Toda la tienda' },
                    { v: 'marca', icon: '🏷️', text: 'Una marca' },
                    { v: 'producto', icon: '🧴', text: 'Un perfume' },
                  ] as const).map(t => (
                    <button key={t.v} onClick={() => set('type', t.v)} style={{ flex: 1, padding: '10px 6px', border: `1px solid ${form.type === t.v ? 'var(--neon)' : 'var(--border)'}`, background: form.type === t.v ? 'rgba(200,255,0,0.1)' : 'transparent', color: form.type === t.v ? 'var(--neon)' : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span>{t.icon}</span>
                      <span>{t.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de marca */}
              {form.type === 'marca' && (
                <div>
                  <label style={lbl}>Marca</label>
                  <select value={form.brand} onChange={e => set('brand', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                    <option value="">Seleccionar marca...</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              )}

              {/* Selector de producto */}
              {form.type === 'producto' && (
                <div>
                  <label style={lbl}>Perfume</label>
                  <select value={form.productId} onChange={e => set('productId', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                    <option value="">Seleccionar perfume...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.brand} — {p.name} ({p.volume})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Porcentaje */}
              <div>
                <label style={lbl}>Descuento (%)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range" min={5} max={70} step={5}
                    value={form.pct}
                    onChange={e => set('pct', Number(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--neon)' }}
                  />
                  <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 300, color: 'var(--magenta)', minWidth: '60px', textAlign: 'right' }}>
                    {form.pct}%
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {[5, 10, 15, 20, 30, 50].map(n => (
                    <button key={n} onClick={() => set('pct', n)} style={{ padding: '4px 10px', border: `1px solid ${form.pct === n ? 'var(--neon)' : 'var(--border)'}`, background: 'transparent', color: form.pct === n ? 'var(--neon)' : 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', cursor: 'pointer' }}>
                      {n}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Activo */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} style={{ accentColor: 'var(--neon)', width: '16px', height: '16px' }} />
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>Activar descuento inmediatamente</span>
              </label>

              <button onClick={save} disabled={saving} style={{ padding: '12px', background: 'var(--neon)', color: '#0a0a0a', border: 'none', fontFamily: 'var(--font-montserrat)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', marginTop: '4px' }}>
                {saving ? 'Guardando...' : 'Crear descuento'}
              </button>
            </div>
          </div>

          {/* ── Lista de descuentos ── */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 300, marginBottom: '20px' }}>
              Descuentos activos ({discounts.filter(d => d.active).length})
            </h2>

            {discounts.length === 0 ? (
              <div style={{ padding: '40px', border: '1px dashed var(--border)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>Sin descuentos aún</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {discounts.map((d: any) => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', background: '#0f0f0f', border: `1px solid ${d.active ? 'rgba(200,255,0,0.2)' : 'var(--border)'}`, opacity: d.active ? 1 : 0.5 }}>
                    {/* Pct badge */}
                    <div style={{ minWidth: '52px', textAlign: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 300, color: 'var(--magenta)' }}>-{d.pct}%</span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', fontWeight: 600 }}>{d.label}</p>
                      <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', color: 'var(--gray)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{typeLabel(d)}</p>
                    </div>

                    {/* Toggle activo */}
                    <button onClick={() => toggle(d)} style={{ background: d.active ? 'rgba(200,255,0,0.15)' : 'transparent', border: `1px solid ${d.active ? 'var(--neon)' : 'var(--border)'}`, color: d.active ? 'var(--neon)' : 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '5px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {d.active ? '✓ Activo' : 'Inactivo'}
                    </button>

                    <button onClick={() => del(d.id)} style={{ background: 'transparent', border: '1px solid rgba(255,80,80,0.3)', color: '#ff8888', padding: '5px 10px', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(200,255,0,0.04)', border: '1px solid rgba(200,255,0,0.1)' }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
                💡 Los descuentos se aplican automáticamente en el catálogo, carrito y checkout.<br />
                Si un producto tiene varios descuentos activos, se aplica el mayor.<br />
                Los precios tachados aparecen en las tarjetas de producto.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

const lbl: React.CSSProperties = { fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '6px' }
const inp: React.CSSProperties = { width: '100%', background: '#111', border: '1px solid var(--border)', color: 'white', padding: '10px 12px', fontFamily: 'var(--font-montserrat)', fontSize: '0.78rem', outline: 'none', caretColor: 'var(--neon)', boxSizing: 'border-box' }

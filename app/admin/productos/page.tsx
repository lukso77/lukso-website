'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { products as baseProducts } from '@/data/products'
import { Product } from '@/types'

const GENDERS = ['mujer', 'hombre', 'unisex'] as const
const OCCASIONS = ['noche', 'cita', 'trabajo', 'casual']

const emptyForm = {
  brand: '', name: '', volume: '100 ml', price: 0,
  gender: 'unisex' as Product['gender'],
  image: '', notes: '', occasions: [] as string[], description: '',
}

export default function ProductosAdmin() {
  const [token]       = useState(() => typeof window !== 'undefined' ? sessionStorage.getItem('lukso_admin_token') ?? '' : '')
  const [custom, setCustom]   = useState<any[]>([])
  const [form, setForm]       = useState({ ...emptyForm })
  const [editing, setEditing] = useState<number | null>(null)
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState('')
  const [preview, setPreview] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!token) { window.location.href = '/admin'; return }
    fetch('/api/products').then(r => r.json()).then(setCustom)
  }, [token])

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const toggleOccasion = (o: string) =>
    setForm(f => ({ ...f, occasions: f.occasions.includes(o) ? f.occasions.filter(x => x !== o) : [...f.occasions, o] }))

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    // In production: upload to /api/upload and get back the path
    // For now, use the object URL (works in dev)
    set('image', `/img/${file.name}`)
  }

  const save = async () => {
    if (!form.brand || !form.name || !form.price) { setMsg('⚠️ Completa marca, nombre y precio'); return }
    setSaving(true)
    const notes = form.notes.split(',').map(s => s.trim()).filter(Boolean)
    const body = { ...form, notes, price: Number(form.price), image: form.image || '/img/AGREGAR_FOTO_ILMIN.jpg' }
    const method = editing !== null ? 'PUT' : 'POST'
    const payload = editing !== null ? { ...body, id: editing } : body
    const res = await fetch('/api/products', { method, headers: { 'Content-Type': 'application/json', 'x-admin-token': token }, body: JSON.stringify(payload) })
    if (res.ok) {
      const updated = await fetch('/api/products').then(r => r.json())
      setCustom(updated)
      setForm({ ...emptyForm }); setEditing(null); setPreview('')
      setMsg(editing !== null ? '✓ Producto actualizado' : '✓ Producto agregado')
    } else {
      setMsg('❌ Error al guardar')
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const del = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return
    await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-admin-token': token }, body: JSON.stringify({ id }) })
    setCustom(c => c.filter(p => p.id !== id))
  }

  const edit = (p: any) => {
    setEditing(p.id)
    setForm({ ...p, notes: Array.isArray(p.notes) ? p.notes.join(', ') : p.notes, occasions: p.occasions ?? [] })
    setPreview(p.image ?? '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!token) return null

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0a' }}>
      {/* Topbar */}
      <header style={{ background: '#0f0f0f', borderBottom: '1px solid var(--border)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.18em' }}>LK<span style={{ color: 'var(--neon)' }}>SO</span> <span style={{ fontSize: '0.6rem', color: 'var(--gray)', fontWeight: 400 }}>Admin</span></span>
          <nav style={{ display: 'flex', gap: '24px' }}>
            {[{ label: 'Dashboard', href: '/admin' }, { label: 'Productos', href: '/admin/productos' }, { label: 'Pedidos', href: '/admin/pedidos' }].map(l => (
              <Link key={l.href} href={l.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: l.href === '/admin/productos' ? 'var(--neon)' : 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{l.label}</Link>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '40px', alignItems: 'start' }}>

          {/* ── Formulario ── */}
          <div style={{ background: '#0f0f0f', border: '1px solid var(--border)', padding: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 300, marginBottom: '24px' }}>
              {editing !== null ? '✏️ Editar producto' : '+ Nuevo producto'}
            </h2>

            {msg && <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', padding: '10px 14px', background: msg.startsWith('✓') ? 'rgba(200,255,0,0.1)' : 'rgba(255,80,80,0.1)', border: `1px solid ${msg.startsWith('✓') ? 'var(--neon)' : '#ff5555'}`, color: msg.startsWith('✓') ? 'var(--neon)' : '#ff8888', marginBottom: '16px' }}>{msg}</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Foto */}
              <div>
                <label style={lbl}>Foto del producto</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{ border: '2px dashed var(--border)', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(200,255,0,0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  {preview ? (
                    <div style={{ position: 'relative', width: '60px', height: '80px', flexShrink: 0 }}>
                      <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '60px', height: '80px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)', fontSize: '1.5rem' }}>📷</div>
                  )}
                  <div>
                    <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{preview ? 'Cambiar foto' : 'Subir foto'}</p>
                    <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--gray)', marginTop: '2px' }}>JPG, PNG, WebP</p>
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                <input type="text" value={form.image} onChange={e => { set('image', e.target.value); setPreview(e.target.value) }} placeholder="O pega la ruta: /img/nombre.jpg" style={{ ...inputStyle, marginTop: '8px', width: '100%', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><label style={lbl}>Marca *</label><input value={form.brand} onChange={e => set('brand', e.target.value)} style={inputStyle} placeholder="Ej: Dior" /></div>
                <div><label style={lbl}>Nombre *</label><input value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} placeholder="Ej: Sauvage" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><label style={lbl}>Volumen</label><input value={form.volume} onChange={e => set('volume', e.target.value)} style={inputStyle} placeholder="100 ml" /></div>
                <div><label style={lbl}>Precio (miles COP) *</label><input type="number" value={form.price || ''} onChange={e => set('price', e.target.value)} style={inputStyle} placeholder="350" /></div>
              </div>

              <div>
                <label style={lbl}>Género</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {GENDERS.map(g => (
                    <button key={g} onClick={() => set('gender', g)} style={{ flex: 1, padding: '8px', border: `1px solid ${form.gender === g ? 'var(--neon)' : 'var(--border)'}`, background: form.gender === g ? 'rgba(200,255,0,0.1)' : 'transparent', color: form.gender === g ? 'var(--neon)' : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', textTransform: 'uppercase', cursor: 'pointer' }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={lbl}>Ocasiones</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {OCCASIONS.map(o => (
                    <button key={o} onClick={() => toggleOccasion(o)} style={{ padding: '6px 14px', border: `1px solid ${form.occasions.includes(o) ? 'var(--neon)' : 'var(--border)'}`, background: form.occasions.includes(o) ? 'rgba(200,255,0,0.1)' : 'transparent', color: form.occasions.includes(o) ? 'var(--neon)' : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', textTransform: 'uppercase', cursor: 'pointer' }}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <div><label style={lbl}>Notas aromáticas (separadas por coma)</label><input value={form.notes} onChange={e => set('notes', e.target.value)} style={inputStyle} placeholder="Oud, Vainilla, Ámbar, Musk" /></div>
              <div><label style={lbl}>Descripción corta</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical', height: 'auto' }} placeholder="Una frase que describa el perfume..." /></div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={save} disabled={saving} style={{ flex: 1, padding: '12px', background: 'var(--neon)', color: '#0a0a0a', border: 'none', fontFamily: 'var(--font-montserrat)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  {saving ? 'Guardando...' : editing !== null ? 'Actualizar' : 'Guardar producto'}
                </button>
                {editing !== null && (
                  <button onClick={() => { setEditing(null); setForm({ ...emptyForm }); setPreview('') }} style={{ padding: '12px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Lista de productos custom ── */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 300, marginBottom: '16px' }}>
              Productos agregados desde admin ({custom.length})
            </h2>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: 'var(--gray)', marginBottom: '20px' }}>
              Los {baseProducts.length} productos base del catálogo se gestionan en <code style={{ color: 'var(--neon)' }}>data/products.ts</code>
            </p>
            {custom.length === 0 ? (
              <div style={{ padding: '40px', border: '1px dashed var(--border)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>Aún no has agregado productos desde aquí</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {custom.map((p: any) => (
                  <div key={p.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 16px', background: '#0f0f0f', border: '1px solid var(--border)' }}>
                    <div style={{ position: 'relative', width: '48px', height: '64px', flexShrink: 0, background: '#111' }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{p.brand}</p>
                      <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem' }}>{p.name}</p>
                      <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--neon)' }}>${p.price}.000</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => edit(p)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.4)', padding: '6px 12px', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', cursor: 'pointer' }}>✏️</button>
                      <button onClick={() => del(p.id)} style={{ background: 'transparent', border: '1px solid rgba(255,80,80,0.3)', color: '#ff8888', padding: '6px 12px', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', cursor: 'pointer' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

const lbl: React.CSSProperties = { fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '6px' }
const inputStyle: React.CSSProperties = { width: '100%', background: '#111', border: '1px solid var(--border)', color: 'white', padding: '10px 12px', fontFamily: 'var(--font-montserrat)', fontSize: '0.78rem', outline: 'none', caretColor: 'var(--neon)', boxSizing: 'border-box' }

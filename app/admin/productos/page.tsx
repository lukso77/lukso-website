'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const GENDERS = ['mujer', 'hombre', 'unisex'] as const
const OCCASIONS = ['noche', 'cita', 'trabajo', 'casual'] as const

const ADMIN_NAV = [
  { label: 'Dashboard',   href: '/admin' },
  { label: 'Productos',   href: '/admin/productos' },
  { label: 'Pedidos',     href: '/admin/pedidos' },
  { label: 'Descuentos',  href: '/admin/descuentos' },
]

const emptyForm = {
  brand: '',
  name: '',
  volume: '100 ml',
  price: '' as number | '',
  gender: 'unisex' as 'mujer' | 'hombre' | 'unisex',
  image: '',
  notes: '',
  occasions: [] as string[],
  description: '',
}

export default function ProductosAdmin() {
  const [token]           = useState(() => typeof window !== 'undefined' ? sessionStorage.getItem('lukso_admin_token') ?? '' : '')
  const [custom, setCustom]   = useState<any[]>([])
  const [form, setForm]       = useState({ ...emptyForm })
  const [editing, setEditing] = useState<number | null>(null)
  const [saving, setSaving]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg]         = useState('')
  const [preview, setPreview] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!token) { window.location.href = '/admin'; return }
    fetch('/api/products').then(r => r.json()).then(setCustom)
  }, [token])

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const toggleOccasion = (o: string) =>
    setForm(f => ({
      ...f,
      occasions: f.occasions.includes(o)
        ? f.occasions.filter(x => x !== o)
        : [...f.occasions, o],
    }))

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Preview local inmediato
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: fd,
      })
      if (res.ok) {
        const { url } = await res.json()
        set('image', url)
      } else {
        setMsg('⚠️ Error subiendo imagen — pega la URL manualmente')
      }
    } catch {
      setMsg('⚠️ Error subiendo imagen — pega la URL manualmente')
    }
    setUploading(false)
  }

  const save = async () => {
    if (!form.brand || !form.name || !form.price) {
      setMsg('⚠️ Completa al menos marca, nombre y precio')
      return
    }
    setSaving(true)
    const notes = form.notes.split(',').map(s => s.trim()).filter(Boolean)
    const body = {
      ...form,
      notes,
      price: Number(form.price),
      image: form.image || '/img/AGREGAR_FOTO_ILMIN.jpg',
    }
    const method  = editing !== null ? 'PUT' : 'POST'
    const payload = editing !== null ? { ...body, id: editing } : body
    const res = await fetch('/api/products', {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const updated = await fetch('/api/products').then(r => r.json())
      setCustom(updated)
      setForm({ ...emptyForm })
      setEditing(null)
      setPreview('')
      setMsg(editing !== null ? '✓ Producto actualizado' : '✓ Producto agregado — aparecerá en el catálogo')
    } else {
      setMsg('❌ Error al guardar')
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 4000)
  }

  const del = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ id }),
    })
    setCustom(c => c.filter(p => p.id !== id))
  }

  const edit = (p: any) => {
    setEditing(p.id)
    setForm({
      ...p,
      notes: Array.isArray(p.notes) ? p.notes.join(', ') : (p.notes ?? ''),
      occasions: p.occasions ?? [],
      price: p.price ?? '',
    })
    setPreview(p.image ?? '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!token) return null

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0a' }}>
      {/* Topbar */}
      <header style={{ background: '#0f0f0f', borderBottom: '1px solid var(--border)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', gap: '32px', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.18em' }}>
          LK<span style={{ color: 'var(--neon)' }}>SO</span>{' '}
          <span style={{ fontSize: '0.6rem', color: 'var(--gray)', fontWeight: 400 }}>Admin</span>
        </span>
        <nav style={{ display: 'flex', gap: '24px' }}>
          {ADMIN_NAV.map(l => (
            <Link key={l.href} href={l.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: l.href === '/admin/productos' ? 'var(--neon)' : 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
              {l.label}
            </Link>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px', alignItems: 'start' }}>

          {/* ── Formulario ── */}
          <div style={{ background: '#0f0f0f', border: '1px solid var(--border)', padding: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 300, marginBottom: '6px' }}>
              {editing !== null ? '✏️ Editar producto' : '+ Nuevo producto'}
            </h2>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--gray)', marginBottom: '24px' }}>
              Completa todos los campos para que el perfume quede igual que los del catálogo
            </p>

            {msg && (
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', padding: '10px 14px', background: msg.startsWith('✓') ? 'rgba(200,255,0,0.1)' : 'rgba(255,80,80,0.1)', border: `1px solid ${msg.startsWith('✓') ? 'var(--neon)' : '#ff5555'}`, color: msg.startsWith('✓') ? 'var(--neon)' : '#ff8888', marginBottom: '16px' }}>
                {msg}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* ── Foto ── */}
              <div>
                <label style={lbl}>📷 Foto del producto <span style={{ color: 'var(--gray)' }}>(JPG, PNG, WebP)</span></label>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{ border: `2px dashed ${uploading ? 'var(--neon)' : 'var(--border)'}`, padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', transition: 'border-color 0.2s', background: '#111' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(200,255,0,0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = uploading ? 'var(--neon)' : 'var(--border)')}
                >
                  {preview ? (
                    <img src={preview} alt="preview" style={{ width: '56px', height: '72px', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '56px', height: '72px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)', fontSize: '1.4rem', flexShrink: 0 }}>📷</div>
                  )}
                  <div>
                    <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.72rem', color: uploading ? 'var(--neon)' : 'rgba(255,255,255,0.6)' }}>
                      {uploading ? 'Subiendo imagen...' : preview ? 'Cambiar foto' : 'Subir foto del perfume'}
                    </p>
                    <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', color: 'var(--gray)', marginTop: '3px' }}>
                      Recomendado: fondo blanco o neutro, proporción 3:4
                    </p>
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={form.image}
                    onChange={e => { set('image', e.target.value); setPreview(e.target.value) }}
                    placeholder="O pega una URL de imagen (https://...)"
                    style={{ ...inp, flex: 1 }}
                  />
                </div>
              </div>

              {/* ── Marca y Nombre ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lbl}>🏷️ Marca *</label>
                  <input value={form.brand} onChange={e => set('brand', e.target.value)} style={inp} placeholder="Ej: Dior, Lattafa, Versace" />
                </div>
                <div>
                  <label style={lbl}>🧴 Nombre del perfume *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} style={inp} placeholder="Ej: Sauvage, Khamrah" />
                </div>
              </div>

              {/* ── Volumen y Precio ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lbl}>📦 Volumen</label>
                  <input value={form.volume} onChange={e => set('volume', e.target.value)} style={inp} placeholder="100 ml" />
                </div>
                <div>
                  <label style={lbl}>💰 Precio (miles COP) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => set('price', e.target.value)}
                    style={inp}
                    placeholder="Ej: 350 = $350.000"
                  />
                </div>
              </div>

              {/* ── Género ── */}
              <div>
                <label style={lbl}>👤 ¿Para quién es?</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {([
                    { v: 'mujer',  icon: '♀', label: 'Mujer' },
                    { v: 'hombre', icon: '♂', label: 'Hombre' },
                    { v: 'unisex', icon: '⚥', label: 'Unisex' },
                  ] as const).map(g => (
                    <button key={g.v} onClick={() => set('gender', g.v)} style={{ flex: 1, padding: '10px 6px', border: `1px solid ${form.gender === g.v ? 'var(--neon)' : 'var(--border)'}`, background: form.gender === g.v ? 'rgba(200,255,0,0.1)' : 'transparent', color: form.gender === g.v ? 'var(--neon)' : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.08em' }}>
                      {g.icon} {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Ocasiones ── */}
              <div>
                <label style={lbl}>🌟 ¿Para qué ocasiones? <span style={{ color: 'var(--gray)' }}>(selecciona todas las que apliquen)</span></label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {([
                    { v: 'noche',   icon: '🌙', label: 'Noche' },
                    { v: 'cita',    icon: '🌹', label: 'Cita' },
                    { v: 'trabajo', icon: '💼', label: 'Trabajo' },
                    { v: 'casual',  icon: '☀️', label: 'Casual' },
                  ] as const).map(o => (
                    <button key={o.v} onClick={() => toggleOccasion(o.v)} style={{ padding: '8px 16px', border: `1px solid ${form.occasions.includes(o.v) ? 'var(--neon)' : 'var(--border)'}`, background: form.occasions.includes(o.v) ? 'rgba(200,255,0,0.1)' : 'transparent', color: form.occasions.includes(o.v) ? 'var(--neon)' : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {o.icon} {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Notas aromáticas ── */}
              <div>
                <label style={lbl}>🌿 Notas aromáticas <span style={{ color: 'var(--gray)' }}>(separadas por coma)</span></label>
                <input
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  style={inp}
                  placeholder="Ej: Oud, Vainilla, Ámbar, Musk, Bergamota"
                />
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: 'var(--gray)', marginTop: '5px' }}>
                  Estas aparecen como etiquetas verdes en la tarjeta del producto
                </p>
              </div>

              {/* ── Descripción ── */}
              <div>
                <label style={lbl}>✍️ Descripción corta</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={2}
                  style={{ ...inp, resize: 'vertical', height: 'auto' }}
                  placeholder="Ej: Un oriental amaderado intenso, perfecto para las noches..."
                />
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: 'var(--gray)', marginTop: '5px' }}>
                  Una frase que describa la esencia del perfume
                </p>
              </div>

              {/* ── Botones ── */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  onClick={save}
                  disabled={saving || uploading}
                  style={{ flex: 1, padding: '13px', background: (saving || uploading) ? 'rgba(200,255,0,0.4)' : 'var(--neon)', color: '#0a0a0a', border: 'none', fontFamily: 'var(--font-montserrat)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: (saving || uploading) ? 'wait' : 'pointer' }}
                >
                  {saving ? 'Guardando...' : uploading ? 'Esperando imagen...' : editing !== null ? 'Actualizar producto' : 'Guardar en catálogo'}
                </button>
                {editing !== null && (
                  <button
                    onClick={() => { setEditing(null); setForm({ ...emptyForm }); setPreview('') }}
                    style={{ padding: '13px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* ── Lista ── */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 300, marginBottom: '20px' }}>
              Productos agregados ({custom.length})
            </h2>

            {custom.length === 0 ? (
              <div style={{ padding: '40px', border: '1px dashed var(--border)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>
                  Aún no has agregado productos desde aquí
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {custom.map((p: any) => (
                  <div key={p.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '12px 16px', background: '#0f0f0f', border: '1px solid var(--border)' }}>
                    <div style={{ width: '48px', height: '64px', flexShrink: 0, background: '#111', overflow: 'hidden' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{p.brand}</p>
                      <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem' }}>{p.name}</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                        <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--neon)' }}>${p.price}.000</p>
                        <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--gray)' }}>{p.volume}</p>
                        <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--gray)' }}>{p.gender}</p>
                      </div>
                      {Array.isArray(p.notes) && p.notes.length > 0 && (
                        <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', color: 'rgba(200,255,0,0.5)', marginTop: '2px' }}>
                          {p.notes.slice(0, 3).join(' · ')}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => edit(p)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.4)', padding: '6px 10px', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', cursor: 'pointer' }}>✏️</button>
                      <button onClick={() => del(p.id)} style={{ background: 'transparent', border: '1px solid rgba(255,80,80,0.3)', color: '#ff8888', padding: '6px 10px', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', cursor: 'pointer' }}>✕</button>
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

const lbl: React.CSSProperties = {
  fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem',
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px',
}
const inp: React.CSSProperties = {
  width: '100%', background: '#111', border: '1px solid var(--border)',
  color: 'white', padding: '10px 12px', fontFamily: 'var(--font-montserrat)',
  fontSize: '0.78rem', outline: 'none', caretColor: 'var(--neon)', boxSizing: 'border-box',
}

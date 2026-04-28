'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  pendiente: 'var(--orange)',
  pagado:    'var(--blue)',
  entregado: 'var(--neon)',
  cancelado: '#ff5555',
}

export default function PedidosAdmin() {
  const [token]   = useState(() => typeof window !== 'undefined' ? sessionStorage.getItem('lukso_admin_token') ?? '' : '')
  const [orders, setOrders]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('todos')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    if (!token) { window.location.href = '/admin'; return }
    fetch('/api/orders', { headers: { 'x-admin-token': token } })
      .then(r => r.json()).then(setOrders).finally(() => setLoading(false))
  }, [token])

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-token': token }, body: JSON.stringify({ id, status }) })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'todos' || o.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || o.nombre?.toLowerCase().includes(q) || o.apellido?.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q) || o.id?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const totalRevenue = orders.filter(o => o.status !== 'cancelado').reduce((s, o) => s + (o.total ?? 0), 0)

  if (!token) return null

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0a' }}>
      <header style={{ background: '#0f0f0f', borderBottom: '1px solid var(--border)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.18em' }}>LK<span style={{ color: 'var(--neon)' }}>SO</span> <span style={{ fontSize: '0.6rem', color: 'var(--gray)', fontWeight: 400 }}>Admin</span></span>
          <nav style={{ display: 'flex', gap: '24px' }}>
            {[{ label: 'Dashboard', href: '/admin' }, { label: 'Productos', href: '/admin/productos' }, { label: 'Pedidos', href: '/admin/pedidos' }].map(l => (
              <Link key={l.href} href={l.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: l.href === '/admin/pedidos' ? 'var(--neon)' : 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{l.label}</Link>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>
        {/* Stats rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {[
            { label: 'Total', value: orders.length, color: 'white' },
            { label: 'Pendientes', value: orders.filter(o => o.status === 'pendiente').length, color: 'var(--orange)' },
            { label: 'Pagados', value: orders.filter(o => o.status === 'pagado').length, color: 'var(--blue)' },
            { label: 'Entregados', value: orders.filter(o => o.status === 'entregado').length, color: 'var(--neon)' },
            { label: 'Ingresos', value: `$${totalRevenue.toLocaleString('es-CO')}.000`, color: 'var(--magenta)' },
          ].map(s => (
            <div key={s.label} style={{ padding: '14px 18px', background: '#0f0f0f', border: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '6px' }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.8rem', fontWeight: 300, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filtros y búsqueda */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cliente, email o ID..."
            style={{ flex: '1 1 240px', background: '#111', border: '1px solid var(--border)', color: 'white', padding: '10px 14px', fontFamily: 'var(--font-montserrat)', fontSize: '0.78rem', outline: 'none', caretColor: 'var(--neon)' }}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            {['todos', 'pendiente', 'pagado', 'entregado', 'cancelado'].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 14px', border: `1px solid ${filter === s ? (STATUS_COLORS[s] ?? 'var(--neon)') : 'var(--border)'}`, background: 'transparent', color: filter === s ? (STATUS_COLORS[s] ?? 'var(--neon)') : 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        {loading ? (
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', color: 'var(--gray)' }}>Cargando pedidos...</p>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>
              {orders.length === 0 ? 'Aún no hay pedidos' : 'Sin resultados'}
            </p>
          </div>
        ) : (
          <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['ID', 'Cliente', 'Ciudad', 'Productos', 'Total', 'Estado', 'Fecha', ''].map(h => (
                    <th key={h} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.52rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', padding: '12px 16px', textAlign: 'left', fontWeight: 400, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={td}><span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--gray)' }}>{o.id}</span></td>
                    <td style={td}>
                      <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{o.nombre} {o.apellido}</p>
                      <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', color: 'var(--gray)' }}>{o.email}</p>
                      <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', color: 'var(--gray)' }}>{o.telefono}</p>
                    </td>
                    <td style={td}><span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{o.ciudad}</span></td>
                    <td style={td}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {(o.items ?? []).map((item: any, i: number) => (
                          <p key={i} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                            {item.qty}× {item.product?.brand} {item.product?.name}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td style={td}><span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>${(o.total ?? 0).toLocaleString('es-CO')}.000</span></td>
                    <td style={td}>
                      <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: STATUS_COLORS[o.status] ?? 'white', border: `1px solid ${STATUS_COLORS[o.status] ?? 'white'}`, padding: '3px 10px', whiteSpace: 'nowrap' }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={td}><span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', color: 'var(--gray)', whiteSpace: 'nowrap' }}>{new Date(o.createdAt).toLocaleDateString('es-CO')}</span></td>
                    <td style={td}>
                      <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} style={{ background: '#111', border: '1px solid var(--border)', color: 'white', padding: '5px 8px', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', cursor: 'pointer' }}>
                        {['pendiente', 'pagado', 'entregado', 'cancelado'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

const td: React.CSSProperties = { padding: '14px 16px', verticalAlign: 'top' }

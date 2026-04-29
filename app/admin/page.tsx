'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { products as baseProducts } from '@/data/products'

/* ── Auth guard ─────────────────────────────────────────────────────── */
function useAdmin() {
  const [token, setToken] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = sessionStorage.getItem('lukso_admin_token')
    setToken(t)
    setReady(true)
  }, [])
  const logout = () => { sessionStorage.removeItem('lukso_admin_token'); setToken(null) }
  return { token, setToken, ready, logout }
}

/* ── Login screen ───────────────────────────────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: (t: string) => void }) {
  const [pw, setPw]   = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setErr('')
    const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })
    if (res.ok) {
      const { token } = await res.json()
      sessionStorage.setItem('lukso_admin_token', token)
      onLogin(token)
    } else {
      setErr('Contraseña incorrecta')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={submit} style={{ width: 'min(90vw, 360px)', border: '1px solid rgba(200,255,0,0.2)', background: '#0f0f0f', padding: '40px' }}>
        <div style={{ width: '32px', height: '2px', background: 'var(--neon)', marginBottom: '20px' }} />
        <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--neon)', marginBottom: '8px' }}>Panel Admin</p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 300, marginBottom: '28px' }}>LUKSO Admin</h1>
        <input
          type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Contraseña"
          style={{ width: '100%', background: '#111', border: '1px solid var(--border)', color: 'white', padding: '12px 14px', fontFamily: 'var(--font-montserrat)', fontSize: '0.82rem', outline: 'none', marginBottom: '16px', caretColor: 'var(--neon)', boxSizing: 'border-box' }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(200,255,0,0.5)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        />
        {err && <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', color: '#ff5555', marginBottom: '12px' }}>{err}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: 'var(--neon)', color: '#0a0a0a', border: 'none', fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
          {loading ? 'Verificando...' : 'Entrar →'}
        </button>
        <p style={{ marginTop: '16px', fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
          Contraseña por defecto: LUKSO2026 — cámbiala en el .env
        </p>
      </form>
    </div>
  )
}

/* ── Dashboard ──────────────────────────────────────────────────────── */
function Dashboard({ token, logout }: { token: string; logout: () => void }) {
  const [orders, setOrders]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders', { headers: { 'x-admin-token': token } })
      .then(r => r.json()).then(setOrders).finally(() => setLoading(false))
  }, [token])

  const totalRevenue  = orders.reduce((s, o) => s + (o.total ?? 0), 0)
  const pendingOrders = orders.filter(o => o.status === 'pendiente').length
  const completedOrders = orders.filter(o => o.status === 'entregado').length

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0a' }}>
      {/* Topbar */}
      <header style={{ background: '#0f0f0f', borderBottom: '1px solid var(--border)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '0.18em' }}>
            LK<span style={{ color: 'var(--neon)' }}>SO</span> <span style={{ fontSize: '0.6rem', color: 'var(--gray)', fontWeight: 400 }}>Admin</span>
          </span>
          <nav style={{ display: 'flex', gap: '24px' }}>
            {[
              { label: 'Dashboard',   href: '/admin' },
              { label: 'Productos',  href: '/admin/productos' },
              { label: 'Pedidos',    href: '/admin/pedidos' },
              { label: 'Descuentos', href: '/admin/descuentos' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'white')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)')}
              >{l.label}</Link>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/" target="_blank" style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--gray)', textDecoration: 'none', letterSpacing: '0.12em' }}>Ver tienda ↗</Link>
          <button onClick={logout} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.12em', padding: '6px 14px', cursor: 'pointer', textTransform: 'uppercase' }}>Salir</button>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>
        <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 300, marginBottom: '32px' }}>Dashboard</h2>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Total pedidos',     value: orders.length,  color: 'var(--neon)',     suffix: '' },
            { label: 'Pendientes',        value: pendingOrders,  color: 'var(--orange)',   suffix: '' },
            { label: 'Entregados',        value: completedOrders,color: 'var(--blue)',     suffix: '' },
            { label: 'Ingresos totales',  value: totalRevenue,   color: 'var(--magenta)',  suffix: '.000', prefix: '$' },
            { label: 'Productos activos', value: baseProducts.length, color: 'var(--neon)', suffix: '' },
          ].map(s => (
            <div key={s.label} style={{ padding: '20px 24px', background: '#0f0f0f', border: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '8px' }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.2rem', fontWeight: 300, color: s.color }}>
                {s.prefix ?? ''}{s.value.toLocaleString('es-CO')}{s.suffix}
              </p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.4rem', fontWeight: 300 }}>Pedidos recientes</h3>
            <Link href="/admin/pedidos" style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--neon)', letterSpacing: '0.12em', textDecoration: 'none' }}>Ver todos →</Link>
          </div>

          {loading ? (
            <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem', color: 'var(--gray)' }}>Cargando...</p>
          ) : orders.length === 0 ? (
            <div style={{ padding: '40px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.4rem', fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>Aún no hay pedidos</p>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', marginTop: '8px' }}>Cuando lleguen los primeros aparecerán aquí</p>
            </div>
          ) : (
            <OrderTable orders={orders.slice(0, 5)} token={token} onUpdate={setOrders} />
          )}
        </div>
      </main>
    </div>
  )
}

/* ── Order table ────────────────────────────────────────────────────── */
const STATUS_COLORS: Record<string, string> = {
  pendiente: 'var(--orange)',
  pagado:    'var(--blue)',
  entregado: 'var(--neon)',
  cancelado: '#ff5555',
}

export function OrderTable({ orders, token, onUpdate }: { orders: any[]; token: string; onUpdate: (o: any[]) => void }) {
  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-token': token }, body: JSON.stringify({ id, status }) })
    const res = await fetch('/api/orders', { headers: { 'x-admin-token': token } })
    onUpdate(await res.json())
  }

  return (
    <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['ID', 'Cliente', 'Total', 'Estado', 'Fecha', 'Acciones'].map(h => (
              <th key={h} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', padding: '12px 16px', textAlign: 'left', fontWeight: 400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={td}><span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: 'var(--gray)' }}>{o.id}</span></td>
              <td style={td}>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.75rem' }}>{o.nombre} {o.apellido}</p>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', color: 'var(--gray)' }}>{o.email}</p>
              </td>
              <td style={td}><span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.8rem', fontWeight: 600 }}>${(o.total ?? 0).toLocaleString('es-CO')}.000</span></td>
              <td style={td}>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: STATUS_COLORS[o.status] ?? 'white', border: `1px solid ${STATUS_COLORS[o.status] ?? 'white'}`, padding: '3px 10px' }}>
                  {o.status}
                </span>
              </td>
              <td style={td}><span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: 'var(--gray)' }}>{new Date(o.createdAt).toLocaleDateString('es-CO')}</span></td>
              <td style={td}>
                <select
                  value={o.status}
                  onChange={e => updateStatus(o.id, e.target.value)}
                  style={{ background: '#111', border: '1px solid var(--border)', color: 'white', padding: '4px 8px', fontFamily: 'var(--font-montserrat)', fontSize: '0.6rem', cursor: 'pointer' }}
                >
                  {['pendiente', 'pagado', 'entregado', 'cancelado'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const td: React.CSSProperties = { padding: '14px 16px', verticalAlign: 'middle' }

/* ── Main export ────────────────────────────────────────────────────── */
export default function AdminPage() {
  const { token, setToken, ready, logout } = useAdmin()
  if (!ready) return null
  if (!token) return <LoginScreen onLogin={setToken} />
  return <Dashboard token={token} logout={logout} />
}

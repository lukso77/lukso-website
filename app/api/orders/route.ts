import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const KEY = 'orders'

async function readOrders(): Promise<any[]> {
  try {
    const data = await kv.get<any[]>(KEY)
    return data ?? []
  } catch { return [] }
}

async function writeOrders(orders: any[]) {
  await kv.set(KEY, orders)
}

function auth(req: NextRequest) {
  return req.headers.get('x-admin-token') === process.env.ADMIN_SECRET
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await readOrders())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const orders = await readOrders()
  const order = {
    ...body,
    id: `ORD-${Date.now()}`,
    status: 'pendiente',
    createdAt: new Date().toISOString(),
  }
  orders.unshift(order)
  await writeOrders(orders)
  return NextResponse.json(order, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status } = await req.json()
  const orders = await readOrders()
  const idx = orders.findIndex((o: any) => o.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  orders[idx].status = status
  await writeOrders(orders)
  return NextResponse.json(orders[idx])
}

import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const FILE = join(process.cwd(), 'data', 'orders.json')

function readOrders() {
  try { return JSON.parse(readFileSync(FILE, 'utf-8')) } catch { return [] }
}

function writeOrders(orders: unknown[]) {
  writeFileSync(FILE, JSON.stringify(orders, null, 2))
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(readOrders())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const orders = readOrders()
  const order = {
    id: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pendiente',
    ...body,
  }
  orders.unshift(order)
  writeOrders(orders)
  return NextResponse.json(order, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, status } = await req.json()
  const orders = readOrders()
  const idx = orders.findIndex((o: any) => o.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  orders[idx].status = status
  writeOrders(orders)
  return NextResponse.json(orders[idx])
}

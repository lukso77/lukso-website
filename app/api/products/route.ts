import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const KEY = 'products-custom'

async function readCustom(): Promise<any[]> {
  try {
    const data = await kv.get<any[]>(KEY)
    return data ?? []
  } catch { return [] }
}

async function writeCustom(products: any[]) {
  await kv.set(KEY, products)
}

function auth(req: NextRequest) {
  return req.headers.get('x-admin-token') === process.env.ADMIN_SECRET
}

export async function GET() {
  return NextResponse.json(await readCustom())
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const products = await readCustom()
  const product = { id: Date.now(), ...body }
  products.push(product)
  await writeCustom(products)
  return NextResponse.json(product, { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const products = await readCustom()
  const idx = products.findIndex((p: any) => p.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  products[idx] = body
  await writeCustom(products)
  return NextResponse.json(products[idx])
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const products = (await readCustom()).filter((p: any) => p.id !== id)
  await writeCustom(products)
  return NextResponse.json({ ok: true })
}

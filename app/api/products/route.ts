import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const FILE = join(process.cwd(), 'data', 'products-custom.json')

function readCustom() {
  if (!existsSync(FILE)) return []
  try { return JSON.parse(readFileSync(FILE, 'utf-8')) } catch { return [] }
}

function writeCustom(products: unknown[]) {
  writeFileSync(FILE, JSON.stringify(products, null, 2))
}

export async function GET() {
  return NextResponse.json(readCustom())
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const products = readCustom()
  const product = { id: Date.now(), ...body }
  products.push(product)
  writeCustom(products)
  return NextResponse.json(product, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const products = readCustom()
  const idx = products.findIndex((p: any) => p.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  products[idx] = body
  writeCustom(products)
  return NextResponse.json(products[idx])
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await req.json()
  const products = readCustom().filter((p: any) => p.id !== id)
  writeCustom(products)
  return NextResponse.json({ ok: true })
}

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'discounts.json')

function read(): any[] {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf-8')) } catch { return [] }
}
function write(data: any[]) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

function auth(req: Request) {
  return req.headers.get('x-admin-token') === process.env.ADMIN_SECRET
}

export async function GET() {
  return NextResponse.json(read())
}

export async function POST(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const data = read()
  const item = { ...body, id: Date.now(), createdAt: new Date().toISOString() }
  data.push(item)
  write(data)
  return NextResponse.json(item)
}

export async function PUT(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const data = read()
  const idx = data.findIndex((d: any) => d.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  data[idx] = { ...data[idx], ...body }
  write(data)
  return NextResponse.json(data[idx])
}

export async function DELETE(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const updated = read().filter((d: any) => d.id !== id)
  write(updated)
  return NextResponse.json({ ok: true })
}

import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const KEY = 'discounts'

async function read(): Promise<any[]> {
  try {
    const data = await kv.get<any[]>(KEY)
    return data ?? []
  } catch { return [] }
}

async function write(data: any[]) {
  await kv.set(KEY, data)
}

function auth(req: Request) {
  return req.headers.get('x-admin-token') === process.env.ADMIN_SECRET
}

export async function GET() {
  return NextResponse.json(await read())
}

export async function POST(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const data = await read()
  const item = { ...body, id: Date.now(), createdAt: new Date().toISOString() }
  data.push(item)
  await write(data)
  return NextResponse.json(item)
}

export async function PUT(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const data = await read()
  const idx = data.findIndex((d: any) => d.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  data[idx] = { ...data[idx], ...body }
  await write(data)
  return NextResponse.json(data[idx])
}

export async function DELETE(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  const updated = (await read()).filter((d: any) => d.id !== id)
  await write(updated)
  return NextResponse.json({ ok: true })
}

import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const blob = await put(`productos/${Date.now()}-${file.name}`, file, {
    access: 'public',
  })

  return NextResponse.json({ url: blob.url })
}

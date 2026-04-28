import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const secret = process.env.ADMIN_SECRET ?? 'LUKSO2026'
  if (password !== secret) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }
  return NextResponse.json({ token: secret })
}

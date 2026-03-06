import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  if (body.email === 'existing@test.com') {
    return NextResponse.json({ message: 'Email already registered' }, { status: 409 })
  }
  return NextResponse.json({
    guest_id: `gst-${Date.now()}`,
    cookie_token: `token-${Date.now()}`,
  })
}

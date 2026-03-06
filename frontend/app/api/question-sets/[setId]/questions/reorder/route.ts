import { NextResponse } from 'next/server'

export async function PUT(req: Request) {
  // body: { orderedIds: string[] }
  await req.json()
  return NextResponse.json({ ok: true })
}

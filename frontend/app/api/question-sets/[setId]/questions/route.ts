import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json({
    question_id: `q-${Date.now()}`,
    ...body,
    created_at: new Date().toISOString(),
  }, { status: 201 })
}

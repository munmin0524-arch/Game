import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { setId: string; questionId: string } }
) {
  const body = await req.json()
  return NextResponse.json({
    question_id: params.questionId,
    set_id: params.setId,
    created_at: new Date().toISOString(),
    ...body,
  })
}

export async function DELETE() {
  return new NextResponse(null, { status: 204 })
}

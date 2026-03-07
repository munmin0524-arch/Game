import { NextResponse } from 'next/server'

export async function POST(_: Request, { params }: { params: { setId: string } }) {
  return NextResponse.json({
    set_id: `set-copy-${Date.now()}`,
    host_member_id: 'host-1',
    title: '(복사본) 퀴즈',
    subject: '수학', grade: '고1', tags: [], is_deleted: false,
    original_set_id: params.setId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    question_count: 4,
  }, { status: 201 })
}

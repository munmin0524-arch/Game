import { NextResponse } from 'next/server'

const MOCK_SETS = [
  {
    set_id: 'set-1',
    host_member_id: 'host-1',
    title: '수학 1단원 — 집합과 명제',
    subject: '수학',
    grade: '고1',
    tags: ['집합', '명제'],
    is_deleted: false,
    original_set_id: null,
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-02-15T14:30:00Z',
    question_count: 12,
  },
  {
    set_id: 'set-2',
    host_member_id: 'host-1',
    title: '영어 단어 퀴즈 — 수능 필수 500',
    subject: '영어',
    grade: '고2',
    tags: ['어휘', '수능'],
    is_deleted: false,
    original_set_id: null,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-02-20T11:00:00Z',
    question_count: 20,
  },
  {
    set_id: 'set-3',
    host_member_id: 'host-1',
    title: '과학 — 세포와 생명',
    subject: '과학',
    grade: '중3',
    tags: ['세포', '생물'],
    is_deleted: false,
    original_set_id: null,
    created_at: '2026-02-01T08:00:00Z',
    updated_at: '2026-02-28T09:00:00Z',
    question_count: 10,
  },
]

export async function GET() {
  return NextResponse.json(MOCK_SETS)
}

export async function POST(req: Request) {
  const body = await req.json()
  const newSet = {
    set_id: `set-${Date.now()}`,
    host_member_id: 'host-1',
    title: body.title ?? '새 세트지',
    subject: null,
    grade: null,
    tags: [],
    is_deleted: false,
    original_set_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    question_count: 0,
  }
  return NextResponse.json(newSet, { status: 201 })
}

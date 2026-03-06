import { NextResponse } from 'next/server'

const MOCK_GROUPS = [
  {
    group_id: 'grp-1',
    host_member_id: 'host-1',
    name: '1학년 A반',
    type: 'manual',
    created_at: '2026-01-03T09:00:00Z',
    member_count: 15,
  },
  {
    group_id: 'grp-2',
    host_member_id: 'host-1',
    name: '2학년 수학 심화반',
    type: 'manual',
    created_at: '2026-01-10T10:00:00Z',
    member_count: 8,
  },
  {
    group_id: 'grp-3',
    host_member_id: 'host-1',
    name: '방과후 영어',
    type: 'manual',
    created_at: '2026-02-01T08:00:00Z',
    member_count: 23,
  },
  {
    group_id: 'grp-4',
    host_member_id: 'host-1',
    name: '수학 기초 퀴즈 — 2026.03.01',
    type: 'auto_live',
    created_at: '2026-03-01T14:00:00Z',
    member_count: 12,
    session_id: 'sess-1',
    session_title: '수학 기초 퀴즈',
    session_status: 'completed',
    session_type: 'live',
  },
  {
    group_id: 'grp-5',
    host_member_id: 'host-1',
    name: '과학 탐구 퀴즈 — 2026.03.04',
    type: 'auto_live',
    created_at: '2026-03-04T10:30:00Z',
    member_count: 8,
    session_id: 'sess-2',
    session_title: '과학 탐구 퀴즈',
    session_status: 'in_progress',
    session_type: 'live',
  },
]

export async function GET() {
  return NextResponse.json(MOCK_GROUPS)
}

export async function POST(req: Request) {
  const body = await req.json()
  const newGroup = {
    group_id: `grp-${Date.now()}`,
    host_member_id: 'host-1',
    name: body.name ?? '새 그룹',
    type: 'manual',
    created_at: new Date().toISOString(),
    member_count: 0,
  }
  return NextResponse.json(newGroup, { status: 201 })
}

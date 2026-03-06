import { NextResponse } from 'next/server'

// 대시보드용 최근 세션 1개
export async function GET() {
  return NextResponse.json({
    session_id: 'sess-1',
    set_id: 'set-1',
    host_member_id: 'host-1',
    group_id: 'grp-1',
    deploy_type: 'existing_group',
    session_type: 'live',
    game_mode: 'tug_of_war',
    status: 'completed',
    time_limit_per_q: 20,
    allow_retry: false,
    allow_hint: true,
    score_policy: 'first_attempt',
    max_attempts: 1,
    open_at: null,
    close_at: null,
    answer_reveal: 'never',
    qr_code: null,
    qr_expires_at: null,
    created_at: '2026-03-01T13:00:00Z',
    updated_at: '2026-03-01T14:00:00Z',
    set_title: '수학 1단원 — 집합과 명제',
  })
}

import { NextResponse } from 'next/server'

const MOCK_SESSIONS: Record<string, object> = {
  'sess-1': {
    session_id: 'sess-1', set_id: 'set-1', host_member_id: 'host-1', group_id: 'grp-1',
    deploy_type: 'existing_group', session_type: 'live', game_mode: 'tug_of_war',
    status: 'completed', time_limit_per_q: 20, allow_retry: false, allow_hint: true,
    score_policy: 'first_attempt', max_attempts: 1, open_at: null, close_at: null,
    answer_reveal: 'never', qr_code: null, qr_expires_at: null,
    created_at: '2026-03-01T13:00:00Z', updated_at: '2026-03-01T14:00:00Z',
    set_title: '수학 1단원 — 집합과 명제',
    question_count: 15,
    question_types: { multiple_choice: 10, ox: 3, short_answer: 2 },
    room_code: 'QUIZ-7382',
  },
  'sess-2': {
    session_id: 'sess-2', set_id: 'set-2', host_member_id: 'host-1', group_id: 'grp-1',
    deploy_type: 'existing_group', session_type: 'assignment', game_mode: 'kickboard_racing',
    status: 'in_progress', time_limit_per_q: 60, allow_retry: false, allow_hint: false,
    score_policy: 'first_attempt', max_attempts: 1,
    open_at: '2026-02-28T09:00:00Z', close_at: '2026-03-07T23:59:00Z',
    answer_reveal: 'after_close', qr_code: null, qr_expires_at: null,
    created_at: '2026-02-27T10:00:00Z', updated_at: '2026-03-01T10:00:00Z',
    set_title: '영어 단어 퀴즈 — 수능 필수 500',
    question_count: 20,
    question_types: { multiple_choice: 15, short_answer: 5 },
    room_code: 'QUIZ-4519',
  },
  'sess-3': {
    session_id: 'sess-3', set_id: 'set-3', host_member_id: 'host-1', group_id: 'grp-2',
    deploy_type: 'existing_group', session_type: 'assignment', game_mode: 'marathon',
    status: 'completed', time_limit_per_q: 45, allow_retry: false, allow_hint: true,
    score_policy: 'first_attempt', max_attempts: 1,
    open_at: '2026-02-20T09:00:00Z', close_at: '2026-02-28T23:59:00Z',
    answer_reveal: 'on_submit', qr_code: null, qr_expires_at: null,
    created_at: '2026-02-19T10:00:00Z', updated_at: '2026-02-28T23:59:00Z',
    set_title: '과학 — 세포와 생명',
    question_count: 12,
    question_types: { multiple_choice: 8, ox: 4 },
    room_code: 'QUIZ-9201',
  },
}

export async function GET(_: Request, { params }: { params: { sessionId: string } }) {
  const session = MOCK_SESSIONS[params.sessionId] ?? {
    ...MOCK_SESSIONS['sess-1'],
    session_id: params.sessionId,
    status: 'waiting',
    qr_code: `https://game-omega-hazel.vercel.app/play/${params.sessionId}`,
  }
  return NextResponse.json(session)
}

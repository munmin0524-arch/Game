import { NextResponse } from 'next/server'

// 학생 입장에서의 과제 목록 (세션 + myResult 포함)
const MOCK_ASSIGNMENTS = [
  {
    session_id: 'sess-2',
    set_id: 'set-2',
    set_title: '영어 단어 퀴즈 — 수능 필수 500',
    session_type: 'assignment',
    status: 'in_progress',
    open_at: '2026-02-28T09:00:00Z',
    close_at: '2026-03-07T23:59:00Z',
    question_count: 20,
    my_result: {
      result_id: 'res-3',
      status: 'in_progress',
      current_q_index: 12,
      total_score: null,
      correct_count: null,
      submitted_at: null,
    },
  },
  {
    session_id: 'sess-3',
    set_id: 'set-3',
    set_title: '과학 — 세포와 생명',
    session_type: 'assignment',
    status: 'completed',
    open_at: '2026-02-20T09:00:00Z',
    close_at: '2026-02-28T23:59:00Z',
    question_count: 10,
    my_result: {
      result_id: 'res-x',
      status: 'submitted',
      current_q_index: 10,
      total_score: 8000,
      correct_count: 8,
      submitted_at: '2026-02-27T15:30:00Z',
    },
  },
  {
    session_id: 'sess-4',
    set_id: 'set-1',
    set_title: '수학 1단원 — 집합과 명제',
    session_type: 'assignment',
    status: 'in_progress',
    open_at: '2026-03-04T00:00:00Z',
    close_at: '2026-03-14T23:59:00Z',
    question_count: 12,
    my_result: null,
  },
]

export async function GET() {
  return NextResponse.json(MOCK_ASSIGNMENTS)
}

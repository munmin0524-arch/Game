import { NextResponse } from 'next/server'

const MOCK_RANKING = [
  { result_id: 'res-1', session_id: 'sess-1', member_id: 'mem-1', guest_id: null, attempt_no: 1, status: 'submitted', current_q_index: 4, total_score: 9500, correct_count: 4, total_response_time_sec: 65, rank: 1, completion_yn: true, started_at: '2026-03-01T13:05:00Z', submitted_at: '2026-03-01T13:06:05Z', nickname: '홍길동', participant_type: 'member' },
  { result_id: 'res-2', session_id: 'sess-1', member_id: null, guest_id: 'gst-1', attempt_no: 1, status: 'submitted', current_q_index: 4, total_score: 7800, correct_count: 3, total_response_time_sec: 83, rank: 2, completion_yn: true, started_at: '2026-03-01T13:05:00Z', submitted_at: '2026-03-01T13:06:23Z', nickname: '이영희', participant_type: 'guest' },
  { result_id: 'res-3', session_id: 'sess-1', member_id: 'mem-2', guest_id: null, attempt_no: 1, status: 'submitted', current_q_index: 4, total_score: 6500, correct_count: 2, total_response_time_sec: 102, rank: 3, completion_yn: true, started_at: '2026-03-01T13:05:00Z', submitted_at: '2026-03-01T13:06:42Z', nickname: '김철수', participant_type: 'member' },
]

export async function GET() {
  return NextResponse.json(MOCK_RANKING)
}

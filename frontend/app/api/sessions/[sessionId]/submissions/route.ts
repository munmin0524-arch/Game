import { NextResponse } from 'next/server'

const MOCK_SUBMISSIONS = [
  { result_id: 'res-1', session_id: 'sess-2', member_id: 'mem-1', guest_id: null, attempt_no: 1, status: 'submitted', current_q_index: 20, total_score: 8500, correct_count: 17, total_response_time_sec: 312, rank: 1, completion_yn: true, started_at: '2026-02-28T10:00:00Z', submitted_at: '2026-03-01T09:15:00Z', nickname: '홍길동', participant_type: 'member' },
  { result_id: 'res-2', session_id: 'sess-2', member_id: 'mem-2', guest_id: null, attempt_no: 1, status: 'submitted', current_q_index: 20, total_score: 7200, correct_count: 14, total_response_time_sec: 428, rank: 2, completion_yn: true, started_at: '2026-02-28T11:30:00Z', submitted_at: '2026-03-01T14:22:00Z', nickname: '김철수', participant_type: 'member' },
  { result_id: 'res-3', session_id: 'sess-2', member_id: null, guest_id: 'gst-1', attempt_no: 1, status: 'in_progress', current_q_index: 12, total_score: null, correct_count: null, total_response_time_sec: null, rank: null, completion_yn: false, started_at: '2026-03-01T08:00:00Z', submitted_at: null, nickname: '이영희', participant_type: 'guest' },
  { result_id: 'res-4', session_id: 'sess-2', member_id: 'mem-3', guest_id: null, attempt_no: 1, status: 'not_started', current_q_index: 0, total_score: null, correct_count: null, total_response_time_sec: null, rank: null, completion_yn: false, started_at: null, submitted_at: null, nickname: '박민준', participant_type: 'member' },
  { result_id: 'res-5', session_id: 'sess-2', member_id: 'mem-4', guest_id: null, attempt_no: 1, status: 'not_started', current_q_index: 0, total_score: null, correct_count: null, total_response_time_sec: null, rank: null, completion_yn: false, started_at: null, submitted_at: null, nickname: '최수아', participant_type: 'member' },
]

export async function GET() {
  return NextResponse.json(MOCK_SUBMISSIONS)
}

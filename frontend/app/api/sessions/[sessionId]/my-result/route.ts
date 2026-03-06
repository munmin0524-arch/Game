import { NextResponse } from 'next/server'

export async function GET() {
  // Mock: 진행 중인 결과 (이어하기 테스트용)
  // status를 'submitted'로 바꾸면 결과 페이지로 리다이렉트됨
  return NextResponse.json({
    result_id: 'res-3',
    status: 'in_progress',
    current_q_index: 3,
    total_score: null,
    correct_count: null,
    total_response_time_sec: null,
    rank: null,
    completion_yn: false,
    submitted_at: null,
  })
}

import { NextResponse } from 'next/server'

const MOCK_QUESTIONS = [
  { question_id: 'q-1', set_id: 'set-1', type: 'multiple_choice', order_index: 1, content: '다음 중 집합의 원소가 될 수 없는 것은?', options: [{ index: 1, text: '자연수 전체' }, { index: 2, text: '1보다 작은 자연수' }, { index: 3, text: '짝수인 소수' }, { index: 4, text: '키가 170cm인 사람' }], answer: '4', hint: null, explanation: null, media_url: null, created_at: '2026-01-10T09:00:00Z' },
  { question_id: 'q-2', set_id: 'set-1', type: 'ox', order_index: 2, content: '공집합은 모든 집합의 부분집합이다.', options: null, answer: 'O', hint: null, explanation: null, media_url: null, created_at: '2026-01-10T09:00:00Z' },
  { question_id: 'q-3', set_id: 'set-1', type: 'multiple_choice', order_index: 3, content: 'A={1,2,3}, B={2,3,4} 일 때, A∩B는?', options: [{ index: 1, text: '{1,2,3,4}' }, { index: 2, text: '{2,3}' }, { index: 3, text: '{1,4}' }, { index: 4, text: '{}' }], answer: '2', hint: null, explanation: null, media_url: null, created_at: '2026-01-10T09:00:00Z' },
  { question_id: 'q-4', set_id: 'set-1', type: 'short_answer', order_index: 4, content: '{x | x는 10 이하의 소수}를 원소나열법으로 쓰시오.', options: null, answer: '{2,3,5,7}', hint: null, explanation: null, media_url: null, created_at: '2026-01-10T09:00:00Z' },
]

const MOCK_STUDENT_REPORTS = [
  {
    result: { result_id: 'res-1', session_id: 'sess-1', member_id: 'mem-1', guest_id: null, attempt_no: 1, status: 'submitted', current_q_index: 4, total_score: 9500, correct_count: 4, total_response_time_sec: 65, rank: 1, completion_yn: true, started_at: '2026-03-01T13:05:00Z', submitted_at: '2026-03-01T13:06:05Z', nickname: '홍길동', participant_type: 'member' },
    responses: [
      { event_id: 'ev-1', session_id: 'sess-1', result_id: 'res-1', question_id: 'q-1', selected_answer: '4', is_correct: true, response_time_sec: 7.2, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:08Z' },
      { event_id: 'ev-2', session_id: 'sess-1', result_id: 'res-1', question_id: 'q-2', selected_answer: 'O', is_correct: true, response_time_sec: 3.1, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:31Z' },
      { event_id: 'ev-3', session_id: 'sess-1', result_id: 'res-1', question_id: 'q-3', selected_answer: '2', is_correct: true, response_time_sec: 12.4, hint_used: true, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:55Z' },
      { event_id: 'ev-4', session_id: 'sess-1', result_id: 'res-1', question_id: 'q-4', selected_answer: '{2,3,5,7}', is_correct: true, response_time_sec: 42.3, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:06:04Z' },
    ],
    questions: MOCK_QUESTIONS,
  },
  {
    result: { result_id: 'res-2', session_id: 'sess-1', member_id: null, guest_id: 'gst-1', attempt_no: 1, status: 'submitted', current_q_index: 4, total_score: 7800, correct_count: 3, total_response_time_sec: 83, rank: 2, completion_yn: true, started_at: '2026-03-01T13:05:00Z', submitted_at: '2026-03-01T13:06:23Z', nickname: '이영희', participant_type: 'guest' },
    responses: [
      { event_id: 'ev-5', session_id: 'sess-1', result_id: 'res-2', question_id: 'q-1', selected_answer: '4', is_correct: true, response_time_sec: 9.1, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: null },
      { event_id: 'ev-6', session_id: 'sess-1', result_id: 'res-2', question_id: 'q-2', selected_answer: 'X', is_correct: false, response_time_sec: 5.8, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: null },
      { event_id: 'ev-7', session_id: 'sess-1', result_id: 'res-2', question_id: 'q-3', selected_answer: '2', is_correct: true, response_time_sec: 14.5, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: null },
      { event_id: 'ev-8', session_id: 'sess-1', result_id: 'res-2', question_id: 'q-4', selected_answer: '{2,3,5,7,11}', is_correct: false, response_time_sec: 53.6, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: null },
    ],
    questions: MOCK_QUESTIONS,
  },
  {
    result: { result_id: 'res-3', session_id: 'sess-1', member_id: 'mem-2', guest_id: null, attempt_no: 1, status: 'submitted', current_q_index: 4, total_score: 6500, correct_count: 2, total_response_time_sec: 102, rank: 3, completion_yn: true, started_at: '2026-03-01T13:05:00Z', submitted_at: '2026-03-01T13:06:42Z', nickname: '김철수', participant_type: 'member' },
    responses: [
      { event_id: 'ev-9', session_id: 'sess-1', result_id: 'res-3', question_id: 'q-1', selected_answer: '3', is_correct: false, response_time_sec: 18.2, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: null },
      { event_id: 'ev-10', session_id: 'sess-1', result_id: 'res-3', question_id: 'q-2', selected_answer: 'O', is_correct: true, response_time_sec: 4.3, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: null },
      { event_id: 'ev-11', session_id: 'sess-1', result_id: 'res-3', question_id: 'q-3', selected_answer: '1', is_correct: false, response_time_sec: 16.7, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: null },
      { event_id: 'ev-12', session_id: 'sess-1', result_id: 'res-3', question_id: 'q-4', selected_answer: '{2,3,5,7}', is_correct: true, response_time_sec: 62.8, hint_used: true, is_skipped: false, attempt_no: 1, answered_at: null },
    ],
    questions: MOCK_QUESTIONS,
  },
  {
    result: { result_id: 'res-4', session_id: 'sess-1', member_id: 'mem-3', guest_id: null, attempt_no: 1, status: 'not_started', current_q_index: 0, total_score: null, correct_count: null, total_response_time_sec: null, rank: null, completion_yn: false, started_at: null, submitted_at: null, nickname: '박민준', participant_type: 'member' },
    responses: [],
    questions: MOCK_QUESTIONS,
  },
]

export async function GET() {
  return NextResponse.json(MOCK_STUDENT_REPORTS)
}

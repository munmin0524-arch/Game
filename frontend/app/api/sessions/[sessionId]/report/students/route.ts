import { NextResponse } from 'next/server'

const MOCK_QUESTIONS = [
  { question_id: 'q-1', set_id: 'set-1', type: 'multiple_choice', order_index: 1, content: '다음 중 집합의 원소가 될 수 없는 것은?', options: [{ index: 1, text: '자연수 전체' }, { index: 2, text: '1보다 작은 자연수' }, { index: 3, text: '짝수인 소수' }, { index: 4, text: '키가 170cm인 사람' }], answer: '4', hint: null, explanation: null, media_url: null, learning_map: { depth1: '수와 연산' }, created_at: '2026-01-10T09:00:00Z' },
  { question_id: 'q-2', set_id: 'set-1', type: 'ox', order_index: 2, content: '공집합은 모든 집합의 부분집합이다.', options: null, answer: 'O', hint: null, explanation: null, media_url: null, learning_map: { depth1: '수와 연산' }, created_at: '2026-01-10T09:00:00Z' },
  { question_id: 'q-3', set_id: 'set-1', type: 'multiple_choice', order_index: 3, content: 'A={1,2,3}, B={2,3,4} 일 때, A∩B는?', options: [{ index: 1, text: '{1,2,3,4}' }, { index: 2, text: '{2,3}' }, { index: 3, text: '{1,4}' }, { index: 4, text: '{}' }], answer: '2', hint: null, explanation: null, media_url: null, learning_map: { depth1: '집합과 명제' }, created_at: '2026-01-10T09:00:00Z' },
  { question_id: 'q-4', set_id: 'set-1', type: 'multiple_choice', order_index: 4, content: '{x | x는 10 이하의 소수}의 원소 개수는?', options: [{ index: 1, text: '3개' }, { index: 2, text: '4개' }, { index: 3, text: '5개' }, { index: 4, text: '6개' }], answer: '2', hint: null, explanation: null, media_url: null, learning_map: { depth1: '수와 연산', depth2: '소수' }, created_at: '2026-01-10T09:00:00Z' },
  { question_id: 'q-5', set_id: 'set-1', type: 'ox', order_index: 5, content: '집합 A = {1, 2, 3}의 부분집합의 개수는 8개이다.', options: null, answer: 'O', hint: null, explanation: null, media_url: null, learning_map: { depth1: '집합과 명제' }, created_at: '2026-01-10T09:00:00Z' },
]

const MOCK_STUDENT_REPORTS = [
  {
    result: { result_id: 'res-1', session_id: 'sess-1', member_id: 'mem-1', guest_id: null, attempt_no: 1, status: 'submitted', current_q_index: 5, total_score: 9500, correct_count: 5, total_response_time_sec: 52, rank: 1, completion_yn: true, started_at: '2026-03-01T13:05:00Z', submitted_at: '2026-03-01T13:05:52Z', nickname: '홍길동', participant_type: 'member' },
    responses: [
      { event_id: 'ev-1', session_id: 'sess-1', result_id: 'res-1', question_id: 'q-1', selected_answer: '4', is_correct: true, response_time_sec: 7.2, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:08Z' },
      { event_id: 'ev-2', session_id: 'sess-1', result_id: 'res-1', question_id: 'q-2', selected_answer: 'O', is_correct: true, response_time_sec: 3.1, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:11Z' },
      { event_id: 'ev-3', session_id: 'sess-1', result_id: 'res-1', question_id: 'q-3', selected_answer: '2', is_correct: true, response_time_sec: 12.4, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:24Z' },
      { event_id: 'ev-4', session_id: 'sess-1', result_id: 'res-1', question_id: 'q-4', selected_answer: '2', is_correct: true, response_time_sec: 15.3, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:39Z' },
      { event_id: 'ev-4b', session_id: 'sess-1', result_id: 'res-1', question_id: 'q-5', selected_answer: 'O', is_correct: true, response_time_sec: 14.0, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:52Z' },
    ],
    questions: MOCK_QUESTIONS,
  },
  {
    result: { result_id: 'res-2', session_id: 'sess-1', member_id: null, guest_id: 'gst-1', attempt_no: 1, status: 'submitted', current_q_index: 5, total_score: 7800, correct_count: 3, total_response_time_sec: 83, rank: 2, completion_yn: true, started_at: '2026-03-01T13:05:00Z', submitted_at: '2026-03-01T13:06:23Z', nickname: '이영희', participant_type: 'guest' },
    responses: [
      { event_id: 'ev-5', session_id: 'sess-1', result_id: 'res-2', question_id: 'q-1', selected_answer: '4', is_correct: true, response_time_sec: 9.1, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:09Z' },
      { event_id: 'ev-6', session_id: 'sess-1', result_id: 'res-2', question_id: 'q-2', selected_answer: 'X', is_correct: false, response_time_sec: 5.8, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:15Z' },
      { event_id: 'ev-7', session_id: 'sess-1', result_id: 'res-2', question_id: 'q-3', selected_answer: '2', is_correct: true, response_time_sec: 14.5, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:30Z' },
      { event_id: 'ev-8', session_id: 'sess-1', result_id: 'res-2', question_id: 'q-4', selected_answer: '3', is_correct: false, response_time_sec: 18.6, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:48Z' },
      { event_id: 'ev-8b', session_id: 'sess-1', result_id: 'res-2', question_id: 'q-5', selected_answer: 'O', is_correct: true, response_time_sec: 35.0, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:06:23Z' },
    ],
    questions: MOCK_QUESTIONS,
  },
  {
    result: { result_id: 'res-3', session_id: 'sess-1', member_id: 'mem-2', guest_id: null, attempt_no: 1, status: 'submitted', current_q_index: 5, total_score: 4000, correct_count: 2, total_response_time_sec: 35, rank: 3, completion_yn: true, started_at: '2026-03-01T13:05:00Z', submitted_at: '2026-03-01T13:05:35Z', nickname: '김철수', participant_type: 'member' },
    responses: [
      { event_id: 'ev-9', session_id: 'sess-1', result_id: 'res-3', question_id: 'q-1', selected_answer: '3', is_correct: false, response_time_sec: 2.1, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:02Z' },
      { event_id: 'ev-10', session_id: 'sess-1', result_id: 'res-3', question_id: 'q-2', selected_answer: 'O', is_correct: true, response_time_sec: 1.8, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:04Z' },
      { event_id: 'ev-11', session_id: 'sess-1', result_id: 'res-3', question_id: 'q-3', selected_answer: '1', is_correct: false, response_time_sec: 3.2, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:07Z' },
      { event_id: 'ev-12', session_id: 'sess-1', result_id: 'res-3', question_id: 'q-4', selected_answer: '2', is_correct: true, response_time_sec: 2.5, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:10Z' },
      { event_id: 'ev-12b', session_id: 'sess-1', result_id: 'res-3', question_id: 'q-5', selected_answer: 'X', is_correct: false, response_time_sec: 25.0, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:35Z' },
    ],
    questions: MOCK_QUESTIONS,
  },
  {
    result: { result_id: 'res-5', session_id: 'sess-1', member_id: 'mem-4', guest_id: null, attempt_no: 1, status: 'submitted', current_q_index: 5, total_score: 6000, correct_count: 3, total_response_time_sec: 78, rank: 4, completion_yn: true, started_at: '2026-03-01T13:05:00Z', submitted_at: '2026-03-01T13:06:18Z', nickname: '최지우', participant_type: 'member' },
    responses: [
      { event_id: 'ev-17', session_id: 'sess-1', result_id: 'res-5', question_id: 'q-1', selected_answer: '4', is_correct: true, response_time_sec: 12.5, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:12Z' },
      { event_id: 'ev-18', session_id: 'sess-1', result_id: 'res-5', question_id: 'q-2', selected_answer: 'X', is_correct: false, response_time_sec: 8.3, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:21Z' },
      { event_id: 'ev-19', session_id: 'sess-1', result_id: 'res-5', question_id: 'q-3', selected_answer: '2', is_correct: true, response_time_sec: 20.1, hint_used: true, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:05:41Z' },
      { event_id: 'ev-20', session_id: 'sess-1', result_id: 'res-5', question_id: 'q-4', selected_answer: '1', is_correct: false, response_time_sec: 19.0, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:06:00Z' },
      { event_id: 'ev-20b', session_id: 'sess-1', result_id: 'res-5', question_id: 'q-5', selected_answer: 'O', is_correct: true, response_time_sec: 18.1, hint_used: false, is_skipped: false, attempt_no: 1, answered_at: '2026-03-01T13:06:18Z' },
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

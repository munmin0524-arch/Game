import { NextResponse } from 'next/server'

const MOCK_QUESTION_REPORTS = [
  {
    question: {
      question_id: 'q-1', set_id: 'set-1', type: 'multiple_choice', order_index: 1,
      content: '다음 중 집합의 원소가 될 수 없는 것은?',
      options: [
        { index: 1, text: '자연수 전체의 집합' },
        { index: 2, text: '1보다 작은 자연수' },
        { index: 3, text: '짝수인 소수' },
        { index: 4, text: '키가 170cm인 사람' },
      ],
      answer: '4', hint: null, explanation: null, media_url: null, created_at: '2026-01-10T09:00:00Z',
    },
    total_participants: 15,
    correct_count: 11,
    correct_rate: 0.73,
    avg_response_time_sec: 8.3,
    distribution: { '1': 1, '2': 2, '3': 1, '4': 11 },
  },
  {
    question: {
      question_id: 'q-2', set_id: 'set-1', type: 'ox', order_index: 2,
      content: '공집합은 모든 집합의 부분집합이다.',
      options: null, answer: 'O', hint: null, explanation: null, media_url: null, created_at: '2026-01-10T09:00:00Z',
    },
    total_participants: 15,
    correct_count: 14,
    correct_rate: 0.93,
    avg_response_time_sec: 5.1,
    distribution: { 'O': 14, 'X': 1 },
  },
  {
    question: {
      question_id: 'q-3', set_id: 'set-1', type: 'multiple_choice', order_index: 3,
      content: 'A = {1,2,3}, B = {2,3,4} 일 때, A∩B는?',
      options: [
        { index: 1, text: '{1,2,3,4}' },
        { index: 2, text: '{2,3}' },
        { index: 3, text: '{1,4}' },
        { index: 4, text: '{}' },
      ],
      answer: '2', hint: null, explanation: null, media_url: null, created_at: '2026-01-10T09:00:00Z',
    },
    total_participants: 15,
    correct_count: 9,
    correct_rate: 0.60,
    avg_response_time_sec: 11.2,
    distribution: { '1': 4, '2': 9, '3': 1, '4': 1 },
  },
  {
    question: {
      question_id: 'q-4', set_id: 'set-1', type: 'short_answer', order_index: 4,
      content: '{x | x는 10 이하의 소수} 를 원소나열법으로 쓰시오.',
      options: null, answer: '{2,3,5,7}', hint: null, explanation: null, media_url: null, created_at: '2026-01-10T09:00:00Z',
    },
    total_participants: 15,
    correct_count: 7,
    correct_rate: 0.47,
    avg_response_time_sec: 18.5,
    distribution: {},
    top_wrong_answers: ['{2,3,5,7,11}', '{1,2,3,5,7}', '2,3,5,7'],
  },
]

export async function GET() {
  return NextResponse.json(MOCK_QUESTION_REPORTS)
}

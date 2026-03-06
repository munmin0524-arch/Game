import { NextResponse } from 'next/server'

const MOCK_QUESTIONS: Record<string, object[]> = {
  'set-1': [
    { question_id: 'q-1', set_id: 'set-1', type: 'multiple_choice', order_index: 1, content: '다음 중 집합의 원소가 될 수 없는 것은?', options: [{ index: 1, text: '자연수 전체의 집합' }, { index: 2, text: '1보다 작은 자연수' }, { index: 3, text: '짝수인 소수' }, { index: 4, text: '키가 170cm인 사람' }], answer: '4', hint: '집합의 원소는 명확히 구분 가능해야 합니다', explanation: null, media_url: null, created_at: '2026-01-10T09:00:00Z' },
    { question_id: 'q-2', set_id: 'set-1', type: 'ox', order_index: 2, content: '공집합은 모든 집합의 부분집합이다.', options: null, answer: 'O', hint: null, explanation: '공집합 ∅은 모든 집합의 부분집합입니다.', media_url: null, created_at: '2026-01-10T09:00:00Z' },
    { question_id: 'q-3', set_id: 'set-1', type: 'multiple_choice', order_index: 3, content: 'A = {1,2,3}, B = {2,3,4} 일 때, A∩B는?', options: [{ index: 1, text: '{1,2,3,4}' }, { index: 2, text: '{2,3}' }, { index: 3, text: '{1,4}' }, { index: 4, text: '{}' }], answer: '2', hint: '교집합은 두 집합에 공통으로 속하는 원소의 집합입니다', explanation: null, media_url: null, created_at: '2026-01-10T09:00:00Z' },
    { question_id: 'q-4', set_id: 'set-1', type: 'short_answer', order_index: 4, content: '{x | x는 10 이하의 소수} 를 원소나열법으로 쓰시오.', options: null, answer: '{2,3,5,7}', hint: '소수는 1과 자기 자신만으로 나누어지는 수입니다', explanation: null, media_url: null, created_at: '2026-01-10T09:00:00Z' },
  ],
}

const MOCK_SETS: Record<string, object> = {
  'set-1': { set_id: 'set-1', host_member_id: 'host-1', title: '수학 1단원 — 집합과 명제', subject: '수학', grade: '고1', tags: ['집합', '명제'], is_deleted: false, original_set_id: null, created_at: '2026-01-10T09:00:00Z', updated_at: '2026-02-15T14:30:00Z', question_count: 12 },
  'set-2': { set_id: 'set-2', host_member_id: 'host-1', title: '영어 단어 퀴즈 — 수능 필수 500', subject: '영어', grade: '고2', tags: ['어휘'], is_deleted: false, original_set_id: null, created_at: '2026-01-20T10:00:00Z', updated_at: '2026-02-20T11:00:00Z', question_count: 20 },
  'set-3': { set_id: 'set-3', host_member_id: 'host-1', title: '과학 — 세포와 생명', subject: '과학', grade: '중3', tags: ['세포'], is_deleted: false, original_set_id: null, created_at: '2026-02-01T08:00:00Z', updated_at: '2026-02-28T09:00:00Z', question_count: 10 },
}

export async function GET(_: Request, { params }: { params: { setId: string } }) {
  const set = MOCK_SETS[params.setId] ?? MOCK_SETS['set-1']
  const questions = MOCK_QUESTIONS[params.setId] ?? MOCK_QUESTIONS['set-1']
  return NextResponse.json({ set, questions })
}

export async function PUT(req: Request, { params }: { params: { setId: string } }) {
  const body = await req.json()
  return NextResponse.json({ ...MOCK_SETS[params.setId], ...body, updated_at: new Date().toISOString() })
}

export async function DELETE() {
  return new NextResponse(null, { status: 204 })
}

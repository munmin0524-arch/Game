import { NextResponse } from 'next/server'

const MOCK_QUESTIONS_BY_SET: Record<string, object[]> = {
  'set-1': [
    { question_id: 'q-1-1', set_id: 'set-1', type: 'multiple_choice', order_index: 1, content: '다음 중 집합의 원소가 될 수 없는 것은?', options: [{ index: 1, text: '자연수 전체의 집합' }, { index: 2, text: '1보다 작은 자연수' }, { index: 3, text: '짝수인 소수' }, { index: 4, text: '키가 170cm인 사람' }], answer: '4', hint: '집합의 원소는 명확히 구분 가능해야 합니다', explanation: null, media_url: null, created_at: '2026-01-10T09:00:00Z' },
    { question_id: 'q-1-2', set_id: 'set-1', type: 'ox', order_index: 2, content: '공집합은 모든 집합의 부분집합이다.', options: null, answer: 'O', hint: null, explanation: '공집합 ∅은 모든 집합의 부분집합입니다.', media_url: null, created_at: '2026-01-10T09:01:00Z' },
    { question_id: 'q-1-3', set_id: 'set-1', type: 'multiple_choice', order_index: 3, content: 'A = {1,2,3}, B = {2,3,4} 일 때, A∩B는?', options: [{ index: 1, text: '{1,2,3,4}' }, { index: 2, text: '{2,3}' }, { index: 3, text: '{1,4}' }, { index: 4, text: '{}' }], answer: '2', hint: '교집합은 두 집합에 공통으로 속하는 원소의 집합입니다', explanation: null, media_url: null, created_at: '2026-01-10T09:02:00Z' },
    { question_id: 'q-1-4', set_id: 'set-1', type: 'short_answer', order_index: 4, content: '{x | x는 10 이하의 소수} 를 원소나열법으로 쓰시오.', options: null, answer: '{2,3,5,7}', hint: '소수는 1과 자기 자신만으로 나누어지는 수입니다', explanation: null, media_url: null, created_at: '2026-01-10T09:03:00Z' },
  ],
  'set-2': [
    { question_id: 'q-2-1', set_id: 'set-2', type: 'multiple_choice', order_index: 1, content: '"Abundant"의 뜻으로 가장 적절한 것은?', options: [{ index: 1, text: '부족한' }, { index: 2, text: '풍부한' }, { index: 3, text: '정확한' }, { index: 4, text: '모호한' }], answer: '2', hint: null, explanation: 'abundant = 풍부한, 많은', media_url: null, created_at: '2026-01-20T10:00:00Z' },
    { question_id: 'q-2-2', set_id: 'set-2', type: 'short_answer', order_index: 2, content: '"도서관"을 영어로 쓰시오.', options: null, answer: 'library', hint: 'l로 시작합니다', explanation: null, media_url: null, created_at: '2026-01-20T10:01:00Z' },
    { question_id: 'q-2-3', set_id: 'set-2', type: 'multiple_choice', order_index: 3, content: '"Elaborate"의 의미는?', options: [{ index: 1, text: '정교한' }, { index: 2, text: '단순한' }], answer: '1', hint: null, explanation: 'elaborate = 정교한, 정성들인', media_url: null, created_at: '2026-01-20T10:02:00Z' },
    { question_id: 'q-2-4', set_id: 'set-2', type: 'ox', order_index: 4, content: '"Receive"에서 i 앞에 e가 온다.', options: null, answer: 'X', hint: '"i before e, except after c"', explanation: 'receive는 c 뒤이므로 ei 순서입니다.', media_url: null, created_at: '2026-01-20T10:03:00Z' },
    { question_id: 'q-2-5', set_id: 'set-2', type: 'multiple_choice', order_index: 5, content: '다음 중 "기후"를 뜻하는 영어 단어는?', options: [{ index: 1, text: 'Weather' }, { index: 2, text: 'Climate' }, { index: 3, text: 'Temperature' }, { index: 4, text: 'Season' }, { index: 5, text: 'Atmosphere' }], answer: '2', hint: 'weather는 날씨(단기), 기후는 장기적 패턴입니다', explanation: null, media_url: null, created_at: '2026-01-20T10:04:00Z' },
  ],
  'set-3': [
    { question_id: 'q-3-1', set_id: 'set-3', type: 'multiple_choice', order_index: 1, content: '세포의 에너지 공장이라 불리는 세포 소기관은?', options: [{ index: 1, text: '리보솜' }, { index: 2, text: '미토콘드리아' }, { index: 3, text: '골지체' }, { index: 4, text: '소포체' }], answer: '2', hint: '이 소기관은 ATP를 생성합니다', explanation: '미토콘드리아는 세포 호흡을 통해 ATP를 생산합니다.', media_url: null, created_at: '2026-02-01T08:00:00Z' },
    { question_id: 'q-3-2', set_id: 'set-3', type: 'ox', order_index: 2, content: '식물세포에는 세포벽이 있지만 동물세포에는 없다.', options: null, answer: 'O', hint: null, explanation: '식물세포는 셀룰로스로 이루어진 세포벽을 가지고 있습니다.', media_url: null, created_at: '2026-02-01T08:01:00Z' },
    { question_id: 'q-3-3', set_id: 'set-3', type: 'short_answer', order_index: 3, content: 'DNA의 이중 나선 구조를 발견한 과학자 두 명은? (영문 성만)', options: null, answer: 'Watson, Crick', hint: 'W와 C로 시작합니다', explanation: '1953년 제임스 왓슨과 프랜시스 크릭이 발견했습니다.', media_url: null, created_at: '2026-02-01T08:02:00Z' },
    { question_id: 'q-3-4', set_id: 'set-3', type: 'multiple_choice', order_index: 4, content: '광합성이 일어나는 세포 소기관은?', options: [{ index: 1, text: '미토콘드리아' }, { index: 2, text: '엽록체' }, { index: 3, text: '핵' }, { index: 4, text: '세포막' }], answer: '2', hint: '녹색 색소를 가진 소기관입니다', explanation: null, media_url: null, created_at: '2026-02-01T08:03:00Z' },
    { question_id: 'q-3-5', set_id: 'set-3', type: 'ox', order_index: 5, content: '세포 분열 시 DNA가 복제된 후 분열이 일어난다.', options: null, answer: 'O', hint: null, explanation: 'S기에서 DNA 복제 → M기에서 분열', media_url: null, created_at: '2026-02-01T08:04:00Z' },
    { question_id: 'q-3-6', set_id: 'set-3', type: 'short_answer', order_index: 6, content: '물의 화학식을 쓰시오.', options: null, answer: 'H₂O', hint: '수소 2개 + 산소 1개', explanation: null, media_url: null, created_at: '2026-02-01T08:05:00Z' },
  ],
}

const MOCK_SETS: Record<string, object> = {
  'set-1': { set_id: 'set-1', host_member_id: 'host-1', title: '수학 1단원 — 집합과 명제', subject: '수학', grade: '고1', tags: ['집합', '명제'], is_deleted: false, original_set_id: null, created_at: '2026-01-10T09:00:00Z', updated_at: '2026-02-15T14:30:00Z', question_count: 4 },
  'set-2': { set_id: 'set-2', host_member_id: 'host-1', title: '영어 단어 퀴즈 — 수능 필수 500', subject: '영어', grade: '고2', tags: ['어휘'], is_deleted: false, original_set_id: null, created_at: '2026-01-20T10:00:00Z', updated_at: '2026-02-20T11:00:00Z', question_count: 5 },
  'set-3': { set_id: 'set-3', host_member_id: 'host-1', title: '과학 — 세포와 생명', subject: '과학', grade: '중3', tags: ['세포'], is_deleted: false, original_set_id: null, created_at: '2026-02-01T08:00:00Z', updated_at: '2026-02-28T09:00:00Z', question_count: 6 },
}

export async function GET(_: Request, { params }: { params: { setId: string } }) {
  const set = MOCK_SETS[params.setId]
  if (!set) {
    // 새로 생성된 세트 → 빈 문항
    return NextResponse.json({
      set: { set_id: params.setId, host_member_id: 'host-1', title: '새 퀴즈', subject: null, grade: null, tags: [], is_deleted: false, original_set_id: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), question_count: 0 },
      questions: [],
    })
  }
  const questions = MOCK_QUESTIONS_BY_SET[params.setId] ?? []
  return NextResponse.json({ set, questions })
}

export async function PUT(req: Request, { params }: { params: { setId: string } }) {
  const body = await req.json()
  const existing = MOCK_SETS[params.setId] ?? { set_id: params.setId }
  return NextResponse.json({ ...existing, ...body, updated_at: new Date().toISOString() })
}

export async function DELETE() {
  return new NextResponse(null, { status: 204 })
}

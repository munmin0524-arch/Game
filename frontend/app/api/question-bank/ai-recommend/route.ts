import { NextResponse } from 'next/server'

// AI 추천 문항 생성 (Mock)
// 실제 환경에서는 AI API를 호출하여 문항을 생성하거나 뱅크에서 최적 조합을 선별

const MOCK_POOL = [
  // 수학
  { type: 'multiple_choice', subject: '수학', grade: '1학년', unit: '1단원', difficulty: '쉬움', content: '다음 중 짝수인 것은?', options: [{ index: 1, text: '3' }, { index: 2, text: '7' }, { index: 3, text: '8' }, { index: 4, text: '11' }], answer: '3', hint: null, explanation: '8은 2로 나누어 떨어지므로 짝수입니다.' },
  { type: 'ox', subject: '수학', grade: '1학년', unit: '1단원', difficulty: '쉬움', content: '1은 소수이다.', options: null, answer: 'X', hint: null, explanation: '소수는 1보다 큰 자연수 중 1과 자신만을 약수로 가지는 수입니다.' },
  { type: 'multiple_choice', subject: '수학', grade: '1학년', unit: '2단원', difficulty: '보통', content: '다음 중 소수(Prime Number)가 아닌 것은?', options: [{ index: 1, text: '2' }, { index: 2, text: '3' }, { index: 3, text: '4' }, { index: 4, text: '5' }], answer: '3', hint: null, explanation: '4는 2×2이므로 소수가 아닙니다.' },
  { type: 'short_answer', subject: '수학', grade: '1학년', unit: '2단원', difficulty: '보통', content: '1부터 10까지의 합은?', options: null, answer: '55', hint: '등차수열 공식을 사용하세요', explanation: 'n(n+1)/2 = 10×11/2 = 55' },
  { type: 'multiple_choice', subject: '수학', grade: '1학년', unit: '3단원', difficulty: '보통', content: 'A = {1,2,3}, B = {2,3,4} 일 때, A∪B는?', options: [{ index: 1, text: '{2,3}' }, { index: 2, text: '{1,2,3,4}' }, { index: 3, text: '{1,4}' }, { index: 4, text: '{1,2,3}' }], answer: '2', hint: '합집합은 두 집합의 모든 원소입니다', explanation: null },
  { type: 'ox', subject: '수학', grade: '1학년', unit: '3단원', difficulty: '어려움', content: '공집합의 부분집합의 개수는 1개이다.', options: null, answer: 'O', hint: null, explanation: '공집합 자체가 유일한 부분집합입니다.' },
  { type: 'multiple_choice', subject: '수학', grade: '2학년', unit: '1단원', difficulty: '어려움', content: 'log₂8의 값은?', options: [{ index: 1, text: '2' }, { index: 2, text: '3' }, { index: 3, text: '4' }, { index: 4, text: '8' }], answer: '2', hint: '2를 몇 번 곱하면 8이 되는지 생각해보세요', explanation: '2³ = 8이므로 log₂8 = 3' },
  { type: 'short_answer', subject: '수학', grade: '2학년', unit: '1단원', difficulty: '어려움', content: '피타고라스 정리에서 빗변의 길이를 c라 할 때, a²+b²=?', options: null, answer: 'c²', hint: null, explanation: null },
  // 영어
  { type: 'multiple_choice', subject: '영어', grade: '1학년', unit: '1단원', difficulty: '쉬움', content: '"사과"를 영어로 쓰면?', options: [{ index: 1, text: 'Apple' }, { index: 2, text: 'Banana' }, { index: 3, text: 'Orange' }, { index: 4, text: 'Grape' }], answer: '1', hint: null, explanation: null },
  { type: 'short_answer', subject: '영어', grade: '1학년', unit: '1단원', difficulty: '쉬움', content: '"library"의 한국어 뜻은?', options: null, answer: '도서관', hint: null, explanation: null },
  { type: 'ox', subject: '영어', grade: '1학년', unit: '2단원', difficulty: '보통', content: '"Receive"의 철자에서 i 앞에 e가 온다.', options: null, answer: 'X', hint: '"i before e, except after c"', explanation: null },
  { type: 'multiple_choice', subject: '영어', grade: '2학년', unit: '2단원', difficulty: '보통', content: '"Abundant"의 뜻으로 가장 적절한 것은?', options: [{ index: 1, text: '부족한' }, { index: 2, text: '풍부한' }, { index: 3, text: '정확한' }, { index: 4, text: '모호한' }], answer: '2', hint: null, explanation: null },
  { type: 'multiple_choice', subject: '영어', grade: '2학년', unit: '3단원', difficulty: '어려움', content: '"Elaborate"의 의미는?', options: [{ index: 1, text: '정교한' }, { index: 2, text: '단순한' }, { index: 3, text: '빠른' }, { index: 4, text: '느린' }], answer: '1', hint: null, explanation: null },
  // 과학
  { type: 'multiple_choice', subject: '과학', grade: '1학년', unit: '1단원', difficulty: '쉬움', content: '물의 끓는점은 몇 도인가?', options: [{ index: 1, text: '0°C' }, { index: 2, text: '50°C' }, { index: 3, text: '100°C' }, { index: 4, text: '200°C' }], answer: '3', hint: null, explanation: null },
  { type: 'ox', subject: '과학', grade: '1학년', unit: '1단원', difficulty: '쉬움', content: '빛의 속도는 소리의 속도보다 빠르다.', options: null, answer: 'O', hint: null, explanation: '빛 ≈ 3×10⁸ m/s, 소리 ≈ 340 m/s' },
  { type: 'short_answer', subject: '과학', grade: '2학년', unit: '2단원', difficulty: '보통', content: '물의 화학식은?', options: null, answer: 'H₂O', hint: '수소 2개 + 산소 1개', explanation: null },
  { type: 'multiple_choice', subject: '과학', grade: '2학년', unit: '2단원', difficulty: '보통', content: '광합성에 필요한 요소가 아닌 것은?', options: [{ index: 1, text: '햇빛' }, { index: 2, text: '이산화탄소' }, { index: 3, text: '산소' }, { index: 4, text: '물' }], answer: '3', hint: null, explanation: null },
  { type: 'ox', subject: '과학', grade: '2학년', unit: '3단원', difficulty: '어려움', content: 'DNA는 단일 가닥 구조이다.', options: null, answer: 'X', hint: null, explanation: 'DNA는 이중 나선 구조입니다.' },
  { type: 'short_answer', subject: '과학', grade: '3학년', unit: '1단원', difficulty: '어려움', content: '만유인력 상수의 기호는?', options: null, answer: 'G', hint: '뉴턴의 법칙', explanation: null },
]

export async function POST(req: Request) {
  const body = await req.json()
  const { subject, grade, unit, easyCount, normalCount, hardCount, types } = body as {
    subject?: string
    grade?: string
    unit?: string
    easyCount: number
    normalCount: number
    hardCount: number
    types: string[] // ['multiple_choice', 'ox', 'short_answer']
  }

  // 필터링
  let pool = MOCK_POOL.filter((q) => types.includes(q.type))
  if (subject) pool = pool.filter((q) => q.subject === subject)
  if (grade) pool = pool.filter((q) => q.grade === grade)
  if (unit) pool = pool.filter((q) => q.unit === unit)

  // 난이도별 선별
  const pick = (diff: string, count: number) => {
    const candidates = pool.filter((q) => q.difficulty === diff)
    // 셔플 후 필요한 만큼
    const shuffled = candidates.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  const easy = pick('쉬움', easyCount)
  const normal = pick('보통', normalCount)
  const hard = pick('어려움', hardCount)
  const result = [...easy, ...normal, ...hard]

  // question_id 부여
  const questions = result.map((q, i) => ({
    ...q,
    question_id: `ai-${Date.now()}-${i}`,
    set_id: '',
    order_index: i,
    media_url: null,
    created_at: new Date().toISOString(),
  }))

  return NextResponse.json(questions)
}

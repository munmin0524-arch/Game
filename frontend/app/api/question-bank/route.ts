import { NextResponse } from 'next/server'

// 전체 문항 풀 — 실제 환경에서는 host의 모든 세트지 문항을 JOIN하여 반환
const ALL_QUESTIONS = [
  {
    question_id: 'q-1', set_id: 'set-1', set_title: '수학 기초',
    type: 'multiple_choice', order_index: 1,
    content: '다음 중 소수(Prime Number)가 아닌 것은?',
    options: [{ index: 1, text: '2' }, { index: 2, text: '3' }, { index: 3, text: '4' }, { index: 4, text: '5' }],
    answer: '3', hint: null, explanation: '4는 2×2이므로 소수가 아닙니다.', media_url: null,
    created_at: '2026-01-10T09:00:00Z',
    grade: '1학년', difficulty: '보통', unit: '1단원',
  },
  {
    question_id: 'q-2', set_id: 'set-1', set_title: '수학 기초',
    type: 'ox', order_index: 2,
    content: '삼각형의 내각의 합은 180도이다.',
    options: null, answer: 'O', hint: null, explanation: null, media_url: null,
    created_at: '2026-01-10T09:05:00Z',
    grade: '1학년', difficulty: '쉬움', unit: '2단원',
  },
  {
    question_id: 'q-3', set_id: 'set-1', set_title: '수학 기초',
    type: 'multiple_choice', order_index: 3,
    content: '1부터 10까지의 합은?',
    options: [{ index: 1, text: '45' }, { index: 2, text: '50' }, { index: 3, text: '55' }, { index: 4, text: '60' }],
    answer: '3', hint: '등차수열 공식을 사용하세요', explanation: 'n(n+1)/2 = 55', media_url: null,
    created_at: '2026-01-10T09:10:00Z',
    grade: '1학년', difficulty: '어려움', unit: '3단원',
  },
  {
    question_id: 'q-4', set_id: 'set-1', set_title: '수학 기초',
    type: 'short_answer', order_index: 4,
    content: '피타고라스 정리에서 빗변의 길이를 c라 할 때, a²+b²=?',
    options: null, answer: 'c²', hint: null, explanation: null, media_url: null,
    created_at: '2026-01-10T09:15:00Z',
    grade: '2학년', difficulty: '보통', unit: '4단원',
  },
  {
    question_id: 'q-5', set_id: 'set-2', set_title: '영어 단어',
    type: 'multiple_choice', order_index: 1,
    content: '"사과"를 영어로 쓰면?',
    options: [{ index: 1, text: 'Apple' }, { index: 2, text: 'Banana' }, { index: 3, text: 'Orange' }, { index: 4, text: 'Grape' }],
    answer: '1', hint: null, explanation: null, media_url: null,
    created_at: '2026-01-15T10:00:00Z',
    grade: '1학년', difficulty: '쉬움', unit: '1단원',
  },
  {
    question_id: 'q-6', set_id: 'set-2', set_title: '영어 단어',
    type: 'short_answer', order_index: 2,
    content: '"library"의 한국어 뜻은?',
    options: null, answer: '도서관', hint: null, explanation: null, media_url: null,
    created_at: '2026-01-15T10:05:00Z',
    grade: '1학년', difficulty: '쉬움', unit: '2단원',
  },
  {
    question_id: 'q-7', set_id: 'set-3', set_title: '과학 탐구',
    type: 'ox', order_index: 1,
    content: '빛의 속도는 소리의 속도보다 빠르다.',
    options: null, answer: 'O', hint: null, explanation: '빛의 속도 ≈ 3×10⁸ m/s, 소리 ≈ 340 m/s', media_url: null,
    created_at: '2026-02-01T09:00:00Z',
    grade: '2학년', difficulty: '쉬움', unit: '1단원',
  },
  {
    question_id: 'q-8', set_id: 'set-3', set_title: '과학 탐구',
    type: 'multiple_choice', order_index: 2,
    content: '광합성에 필요한 요소가 아닌 것은?',
    options: [{ index: 1, text: '햇빛' }, { index: 2, text: '이산화탄소' }, { index: 3, text: '산소' }, { index: 4, text: '물' }],
    answer: '3', hint: null, explanation: '광합성은 햇빛+CO₂+H₂O → 포도당+O₂', media_url: null,
    created_at: '2026-02-01T09:05:00Z',
    grade: '2학년', difficulty: '보통', unit: '2단원',
  },
  {
    question_id: 'q-9', set_id: 'set-3', set_title: '과학 탐구',
    type: 'short_answer', order_index: 3,
    content: '물의 화학식은?',
    options: null, answer: 'H₂O', hint: '수소 2개, 산소 1개', explanation: null, media_url: null,
    created_at: '2026-02-01T09:10:00Z',
    grade: '3학년', difficulty: '쉬움', unit: '1단원',
  },
  {
    question_id: 'q-10', set_id: 'set-3', set_title: '과학 탐구',
    type: 'ox', order_index: 4,
    content: '지구는 태양 주위를 공전한다.',
    options: null, answer: 'O', hint: null, explanation: '지구는 약 365일에 한 번 태양 주위를 공전합니다.', media_url: null,
    created_at: '2026-02-01T09:15:00Z',
    grade: '1학년', difficulty: '쉬움', unit: '3단원',
  },
  {
    question_id: 'q-11', set_id: 'set-1', set_title: '수학 기초',
    type: 'multiple_choice', order_index: 5,
    content: '다음 중 짝수가 아닌 것은?',
    options: [{ index: 1, text: '12' }, { index: 2, text: '7' }],
    answer: '2', hint: null, explanation: '7은 홀수입니다.', media_url: null,
    created_at: '2026-01-10T09:20:00Z',
    grade: '1학년', difficulty: '쉬움', unit: '1단원',
  },
  {
    question_id: 'q-12', set_id: 'set-2', set_title: '영어 단어',
    type: 'multiple_choice', order_index: 3,
    content: '"Happy"의 반의어는?',
    options: [{ index: 1, text: 'Glad' }, { index: 2, text: 'Sad' }, { index: 3, text: 'Angry' }, { index: 4, text: 'Excited' }, { index: 5, text: 'Bored' }],
    answer: '2', hint: null, explanation: null, media_url: null,
    created_at: '2026-01-15T10:10:00Z',
    grade: '2학년', difficulty: '보통', unit: '3단원',
  },
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')?.toLowerCase() ?? ''
  const type = searchParams.get('type') ?? ''
  const subject = searchParams.get('subject') ?? ''
  const excludeSetId = searchParams.get('excludeSetId') ?? ''
  const grade = searchParams.get('grade') ?? ''
  const difficulty = searchParams.get('difficulty') ?? ''
  const unit = searchParams.get('unit') ?? ''

  let results = ALL_QUESTIONS

  if (excludeSetId) {
    results = results.filter((q) => q.set_id !== excludeSetId)
  }
  if (type) {
    results = results.filter((q) => q.type === type)
  }
  if (subject) {
    results = results.filter((q) => q.set_title.includes(subject))
  }
  if (grade) {
    results = results.filter((q) => q.grade === grade)
  }
  if (difficulty) {
    results = results.filter((q) => q.difficulty === difficulty)
  }
  if (unit) {
    results = results.filter((q) => q.unit === unit)
  }
  if (search) {
    results = results.filter((q) =>
      q.content.toLowerCase().includes(search) ||
      q.set_title.toLowerCase().includes(search)
    )
  }

  return NextResponse.json(results)
}

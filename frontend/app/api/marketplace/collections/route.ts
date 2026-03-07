import { NextResponse } from 'next/server'

const MOCK_COLLECTIONS = [
  {
    collection_id: 'col-001',
    member_id: 'member-201',
    title: '중1 수학 1학기 총정리',
    description: '중1 1학기에 나오는 핵심 단원별 퀴즈 모음',
    is_public: true,
    quiz_count: 5,
    like_count: 23,
    created_at: '2026-02-15T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    nickname: '김수학',
    is_certified: true,
    preview_items: [
      { shared_set_id: 'ss-001', title: '중1 수학 1단원 소수와 합성수', subject: '수학', grade: '중1', question_count: 12 },
      { shared_set_id: 'ss-006', title: '중1 수학 1단원 약수와 배수', subject: '수학', grade: '중1', question_count: 10 },
    ],
  },
  {
    collection_id: 'col-002',
    member_id: 'member-202',
    title: '영어 기초 완성 시리즈',
    description: '초등~중1 영어 기초를 다지는 퀴즈 컬렉션',
    is_public: true,
    quiz_count: 3,
    like_count: 15,
    created_at: '2026-02-20T00:00:00Z',
    updated_at: '2026-02-28T00:00:00Z',
    nickname: '이영어',
    is_certified: true,
    preview_items: [
      { shared_set_id: 'ss-002', title: '영어 기초 단어 100선', subject: '영어', grade: '초6', question_count: 20 },
    ],
  },
  {
    collection_id: 'col-003',
    member_id: 'member-203',
    title: '수학 함수 집중 연습',
    description: '일차함수부터 이차함수까지 체계적 연습',
    is_public: true,
    quiz_count: 4,
    like_count: 18,
    created_at: '2026-02-25T00:00:00Z',
    updated_at: '2026-03-02T00:00:00Z',
    nickname: '박수학',
    is_certified: false,
    preview_items: [
      { shared_set_id: 'ss-003', title: '중2 수학 일차함수 종합', subject: '수학', grade: '중2', question_count: 15 },
    ],
  },
]

// GET: 인기 컬렉션 목록
export async function GET() {
  return NextResponse.json({ collections: MOCK_COLLECTIONS })
}

// POST: 새 컬렉션 생성
export async function POST(request: Request) {
  const body = await request.json()
  const newCollection = {
    collection_id: `col-${Date.now()}`,
    member_id: 'host-1',
    title: body.title,
    description: body.description ?? null,
    is_public: body.is_public ?? true,
    quiz_count: 0,
    like_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    nickname: '나',
    is_certified: false,
    preview_items: [],
  }
  return NextResponse.json(newCollection, { status: 201 })
}

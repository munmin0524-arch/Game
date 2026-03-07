import { NextRequest, NextResponse } from 'next/server'

const MOCK_REVIEWS = [
  {
    review_id: 'rev-001',
    shared_set_id: 'ss-001',
    member_id: 'member-301',
    rating: 5,
    comment: '문항 구성이 체계적이에요. 수업에서 바로 활용했습니다!',
    created_at: '2026-03-01T10:00:00Z',
    nickname: '수학사랑',
    is_certified: true,
  },
  {
    review_id: 'rev-002',
    shared_set_id: 'ss-001',
    member_id: 'member-302',
    rating: 4,
    comment: '난이도 조절이 잘 되어 있어요.',
    created_at: '2026-03-02T08:00:00Z',
    nickname: '중등교사',
    is_certified: false,
  },
  {
    review_id: 'rev-003',
    shared_set_id: 'ss-001',
    member_id: 'member-303',
    rating: 5,
    comment: null,
    created_at: '2026-03-03T14:30:00Z',
    nickname: '초보교사',
    is_certified: false,
  },
]

// GET: 리뷰 목록
export async function GET(_: NextRequest, { params }: { params: { sharedSetId: string } }) {
  const reviews = MOCK_REVIEWS.filter((r) => r.shared_set_id === params.sharedSetId || true) // mock: 전체 반환
  return NextResponse.json({ reviews })
}

// POST: 리뷰 작성
export async function POST(request: NextRequest) {
  const body = await request.json()
  const newReview = {
    review_id: `rev-${Date.now()}`,
    shared_set_id: 'ss-001',
    member_id: 'host-1',
    rating: body.rating,
    comment: body.comment ?? null,
    created_at: new Date().toISOString(),
    nickname: '나',
    is_certified: false,
  }
  return NextResponse.json(newReview, { status: 201 })
}

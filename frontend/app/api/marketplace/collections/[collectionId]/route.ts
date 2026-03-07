import { NextRequest, NextResponse } from 'next/server'

const MOCK_COLLECTION_DETAIL = {
  collection_id: 'col-001',
  member_id: 'member-201',
  title: '중1 수학 1학기 총정리',
  description: '중1 1학기에 나오는 핵심 단원별 퀴즈 모음입니다. 소수, 약수, 배수부터 일차방정식까지 체계적으로 정리했습니다.',
  is_public: true,
  quiz_count: 5,
  like_count: 23,
  created_at: '2026-02-15T00:00:00Z',
  updated_at: '2026-03-01T00:00:00Z',
  nickname: '김수학',
  is_certified: true,
  items: [
    {
      shared_set_id: 'ss-001',
      set_id: 'set-101',
      host_member_id: 'member-201',
      status: 'published',
      title: '중1 수학 1단원 소수와 합성수',
      subject: '수학',
      grade: '중1',
      tags: ['소수', '합성수'],
      question_count: 12,
      like_count: 42,
      download_count: 156,
      avg_rating: 4.7,
      review_count: 3,
      published_at: '2026-02-20T09:00:00Z',
      host_nickname: '김수학',
      is_certified: true,
    },
    {
      shared_set_id: 'ss-006',
      set_id: 'set-106',
      host_member_id: 'member-201',
      status: 'published',
      title: '중1 수학 1단원 약수와 배수',
      subject: '수학',
      grade: '중1',
      tags: ['약수', '배수'],
      question_count: 10,
      like_count: 31,
      download_count: 98,
      avg_rating: 4.2,
      review_count: 2,
      published_at: '2026-02-22T09:00:00Z',
      host_nickname: '김수학',
      is_certified: true,
    },
  ],
}

export async function GET(_: NextRequest, { params }: { params: { collectionId: string } }) {
  return NextResponse.json({
    ...MOCK_COLLECTION_DETAIL,
    collection_id: params.collectionId,
  })
}

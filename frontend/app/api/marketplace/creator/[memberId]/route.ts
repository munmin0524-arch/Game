import { NextRequest, NextResponse } from 'next/server'

const MOCK_CREATORS: Record<string, object> = {
  'member-201': {
    member_id: 'member-201',
    nickname: '김수학',
    is_certified: true,
    bio: '중학교 수학 교사입니다. 학생들이 쉽게 이해할 수 있는 퀴즈를 만들고 있어요.',
    shared_count: 12,
    total_likes: 156,
    total_downloads: 523,
    follower_count: 42,
    is_following: false,
    created_at: '2025-09-01T00:00:00Z',
  },
  'member-202': {
    member_id: 'member-202',
    nickname: '이영어',
    is_certified: true,
    bio: '초등학교 영어 전담입니다. 재미있는 영어 퀴즈를 공유합니다!',
    shared_count: 8,
    total_likes: 89,
    total_downloads: 312,
    follower_count: 28,
    is_following: true,
    created_at: '2025-10-15T00:00:00Z',
  },
}

const MOCK_SHARED_SETS = [
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
]

export async function GET(_: NextRequest, { params }: { params: { memberId: string } }) {
  const profile = MOCK_CREATORS[params.memberId]
  if (!profile) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const sets = MOCK_SHARED_SETS.filter((s) => s.host_member_id === params.memberId)
  return NextResponse.json({ profile, sets })
}

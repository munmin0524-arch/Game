// Mock API: 마켓플레이스 검색

import { NextRequest, NextResponse } from 'next/server'

const MOCK_SHARED_SETS = [
  {
    shared_set_id: 'ss-001',
    set_id: 'set-101',
    host_member_id: 'member-201',
    status: 'published',
    title: '중1 수학 1단원 소수와 합성수',
    description: '소수의 정의부터 합성수 판별까지 단계별로 구성했어요.',
    subject: '수학',
    grade: '중1',
    tags: ['소수', '합성수', '1단원'],
    question_count: 12,
    like_count: 42,
    download_count: 156,
    achievement_standards: ['[9수01-01]', '[9수01-02]'],
    published_at: '2026-02-20T09:00:00Z',
    updated_at: '2026-02-20T09:00:00Z',
    host_nickname: '김수학',
    is_certified: true,
    is_liked: false,
  },
  {
    shared_set_id: 'ss-002',
    set_id: 'set-102',
    host_member_id: 'member-202',
    status: 'published',
    title: '영어 기초 단어 100선',
    description: '초등 고학년~중1 수준의 필수 영단어 100개.',
    subject: '영어',
    grade: '초6',
    tags: ['단어', '기초'],
    question_count: 20,
    like_count: 28,
    download_count: 89,
    achievement_standards: ['[6영01-01]'],
    published_at: '2026-02-25T14:00:00Z',
    updated_at: '2026-02-25T14:00:00Z',
    host_nickname: '이영어',
    is_certified: true,
    is_liked: true,
  },
  {
    shared_set_id: 'ss-003',
    set_id: 'set-103',
    host_member_id: 'member-203',
    status: 'published',
    title: '중2 수학 일차함수 종합',
    description: '일차함수의 그래프, 기울기, 절편.',
    subject: '수학',
    grade: '중2',
    tags: ['일차함수', '그래프'],
    question_count: 15,
    like_count: 35,
    download_count: 120,
    achievement_standards: ['[9수04-01]'],
    published_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
    host_nickname: '박수학',
    is_certified: false,
    is_liked: false,
  },
  {
    shared_set_id: 'ss-004',
    set_id: 'set-104',
    host_member_id: 'member-204',
    status: 'published',
    title: '중1 영어 듣기 평가 대비',
    description: '듣기 평가에 자주 나오는 표현.',
    subject: '영어',
    grade: '중1',
    tags: ['듣기', '평가'],
    question_count: 10,
    like_count: 18,
    download_count: 67,
    achievement_standards: ['[9영02-01]'],
    published_at: '2026-03-02T08:00:00Z',
    updated_at: '2026-03-02T08:00:00Z',
    host_nickname: '최영어',
    is_certified: true,
    is_liked: false,
  },
  {
    shared_set_id: 'ss-005',
    set_id: 'set-105',
    host_member_id: 'member-205',
    status: 'published',
    title: '초5 수학 약분과 통분',
    description: '분수의 약분과 통분 연습.',
    subject: '수학',
    grade: '초5',
    tags: ['약분', '통분'],
    question_count: 8,
    like_count: 22,
    download_count: 95,
    achievement_standards: ['[6수01-01]'],
    published_at: '2026-02-28T11:00:00Z',
    updated_at: '2026-02-28T11:00:00Z',
    host_nickname: '정수학',
    is_certified: false,
    is_liked: true,
  },
  {
    shared_set_id: 'ss-006',
    set_id: 'set-106',
    host_member_id: 'member-201',
    status: 'published',
    title: '중1 수학 1단원 약수와 배수',
    description: '약수와 배수, 최대공약수, 최소공배수.',
    subject: '수학',
    grade: '중1',
    tags: ['약수', '배수'],
    question_count: 10,
    like_count: 31,
    download_count: 98,
    achievement_standards: ['[9수01-03]'],
    published_at: '2026-02-22T09:00:00Z',
    updated_at: '2026-02-22T09:00:00Z',
    host_nickname: '김수학',
    is_certified: true,
    is_liked: false,
  },
]

// Mock: 별점 데이터
const RATINGS: Record<string, { avg_rating: number; review_count: number }> = {
  'ss-001': { avg_rating: 4.7, review_count: 3 },
  'ss-002': { avg_rating: 4.3, review_count: 5 },
  'ss-003': { avg_rating: 4.0, review_count: 2 },
  'ss-004': { avg_rating: 3.8, review_count: 1 },
  'ss-005': { avg_rating: 4.5, review_count: 4 },
  'ss-006': { avg_rating: 4.2, review_count: 2 },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.toLowerCase() ?? ''
  const subject = searchParams.get('subject')
  const grade = searchParams.get('grade')
  const type = searchParams.get('type') // 문항 유형 필터
  const sort = searchParams.get('sort') ?? 'popular'
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')

  // 별점 포함 데이터
  const setsWithRatings = MOCK_SHARED_SETS.map((s) => ({
    ...s,
    ...(RATINGS[s.shared_set_id] ?? { avg_rating: 0, review_count: 0 }),
  }))

  let filtered = setsWithRatings.filter((s) => {
    if (q && !s.title.toLowerCase().includes(q) && !s.tags.some((t) => t.includes(q))) return false
    if (subject && subject !== '전체' && s.subject !== subject) return false
    if (grade && grade !== '전체' && s.grade !== grade) return false
    // type 필터는 mock에서 무시 (실제 구현 시 문항 타입 기반 필터링)
    return true
  })

  // 정렬
  if (sort === 'popular') {
    filtered.sort((a, b) => (b.like_count + b.download_count) - (a.like_count + a.download_count))
  } else if (sort === 'recent') {
    filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
  } else if (sort === 'likes') {
    filtered.sort((a, b) => b.like_count - a.like_count)
  } else if (sort === 'downloads') {
    filtered.sort((a, b) => b.download_count - a.download_count)
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.avg_rating - a.avg_rating)
  }

  const total = filtered.length
  const start = (page - 1) * limit
  const data = filtered.slice(start, start + limit)

  return NextResponse.json({ data, total, page, limit })
}

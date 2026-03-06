// Mock API: 마켓플레이스 홈 (GET) + 공유 등록 (POST)

import { NextResponse } from 'next/server'

// 공유 Mock 데이터 — 다른 라우트에서도 참조
const MOCK_SHARED_SETS = [
  {
    shared_set_id: 'ss-001',
    set_id: 'set-101',
    host_member_id: 'member-201',
    status: 'published',
    title: '중1 수학 1단원 소수와 합성수',
    description: '소수의 정의부터 합성수 판별까지 단계별로 구성했어요. 중간고사 대비에 딱!',
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
    description: '초등 고학년~중1 수준의 필수 영단어 100개를 퀴즈로 만들었습니다.',
    subject: '영어',
    grade: '초6',
    tags: ['단어', '기초', '필수'],
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
    description: '일차함수의 그래프, 기울기, 절편 등을 종합적으로 다뤘습니다.',
    subject: '수학',
    grade: '중2',
    tags: ['일차함수', '그래프', '기울기'],
    question_count: 15,
    like_count: 35,
    download_count: 120,
    achievement_standards: ['[9수04-01]', '[9수04-02]'],
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
    description: '듣기 평가에 자주 나오는 표현 및 상황별 대화를 정리했습니다.',
    subject: '영어',
    grade: '중1',
    tags: ['듣기', '평가', '대화'],
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
    description: '분수의 약분과 통분을 체계적으로 연습할 수 있는 문제입니다.',
    subject: '수학',
    grade: '초5',
    tags: ['약분', '통분', '분수'],
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
    description: '약수와 배수, 최대공약수, 최소공배수를 정리한 퀴즈입니다.',
    subject: '수학',
    grade: '중1',
    tags: ['약수', '배수', '최대공약수'],
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

// GET: 마켓플레이스 홈 (인기 + 최신)
export async function GET() {
  const popular = [...MOCK_SHARED_SETS]
    .sort((a, b) => (b.like_count + b.download_count) - (a.like_count + a.download_count))
    .slice(0, 6)

  const recent = [...MOCK_SHARED_SETS]
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 6)

  return NextResponse.json({ popular, recent })
}

// POST: 세트 공유 (퍼블리시)
export async function POST() {
  // TODO: 실제 공유 로직
  return NextResponse.json({
    shared_set_id: 'ss-new',
    status: 'published',
    message: '공유 완료',
  })
}

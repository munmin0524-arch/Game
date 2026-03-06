// Mock API: 내가 공유한 세트 목록

import { NextResponse } from 'next/server'

const MY_SHARED_SETS = [
  {
    shared_set_id: 'ss-001',
    set_id: 'set-101',
    host_member_id: 'member-201',
    status: 'published',
    title: '중1 수학 1단원 소수와 합성수',
    description: '소수의 정의부터 합성수 판별까지 단계별로 구성했어요.',
    subject: '수학',
    grade: '중1',
    tags: ['소수', '합성수'],
    question_count: 12,
    like_count: 42,
    download_count: 156,
    achievement_standards: ['[9수01-01]', '[9수01-02]'],
    published_at: '2026-02-20T09:00:00Z',
    updated_at: '2026-02-20T09:00:00Z',
    host_nickname: '홍길동',
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
    host_nickname: '홍길동',
  },
]

export async function GET() {
  return NextResponse.json(MY_SHARED_SETS)
}

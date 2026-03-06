// Mock API: 공유 세트 상세 (GET), 수정 (PUT), 삭제 (DELETE)

import { NextRequest, NextResponse } from 'next/server'

const MOCK_DETAIL = {
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
  questions: [
    {
      question_id: 'q-m01',
      set_id: 'set-101',
      type: 'multiple_choice',
      order_index: 1,
      content: '다음 중 소수가 아닌 것은?',
      options: [{ index: 1, text: '2' }, { index: 2, text: '3' }, { index: 3, text: '4' }, { index: 4, text: '5' }],
      answer: '3',
      hint: null,
      explanation: '4 = 2 × 2이므로 합성수입니다.',
      media_url: null,
      achievement_standards: ['[9수01-01]'],
      created_at: '2026-02-20T09:00:00Z',
      grade: '중1',
      difficulty: '보통',
      unit: '1단원',
    },
    {
      question_id: 'q-m02',
      set_id: 'set-101',
      type: 'ox',
      order_index: 2,
      content: '1은 소수이다.',
      options: null,
      answer: 'X',
      hint: null,
      explanation: '1은 소수도 합성수도 아닙니다.',
      media_url: null,
      achievement_standards: ['[9수01-01]'],
      created_at: '2026-02-20T09:00:00Z',
      grade: '중1',
      difficulty: '쉬움',
      unit: '1단원',
    },
    {
      question_id: 'q-m03',
      set_id: 'set-101',
      type: 'short_answer',
      order_index: 3,
      content: '50 이하의 소수의 개수는?',
      options: null,
      answer: '15',
      hint: '에라토스테네스의 체를 활용해보세요.',
      explanation: '2,3,5,7,11,13,17,19,23,29,31,37,41,43,47 → 15개',
      media_url: null,
      achievement_standards: ['[9수01-02]'],
      created_at: '2026-02-20T09:00:00Z',
      grade: '중1',
      difficulty: '어려움',
      unit: '1단원',
    },
    {
      question_id: 'q-m04',
      set_id: 'set-101',
      type: 'multiple_choice',
      order_index: 4,
      content: '다음 중 합성수인 것은?',
      options: [{ index: 1, text: '1' }, { index: 2, text: '2' }, { index: 3, text: '9' }, { index: 4, text: '11' }],
      answer: '3',
      hint: null,
      explanation: '9 = 3 × 3이므로 합성수입니다.',
      media_url: null,
      achievement_standards: ['[9수01-01]'],
      created_at: '2026-02-20T09:00:00Z',
      grade: '중1',
      difficulty: '보통',
      unit: '1단원',
    },
    {
      question_id: 'q-m05',
      set_id: 'set-101',
      type: 'ox',
      order_index: 5,
      content: '모든 짝수는 합성수이다.',
      options: null,
      answer: 'X',
      hint: '2는 짝수이면서 소수입니다.',
      explanation: '2는 유일한 짝수 소수입니다.',
      media_url: null,
      achievement_standards: ['[9수01-01]'],
      created_at: '2026-02-20T09:00:00Z',
      grade: '중1',
      difficulty: '보통',
      unit: '1단원',
    },
  ],
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sharedSetId: string }> }
) {
  const { sharedSetId } = await params
  return NextResponse.json({ ...MOCK_DETAIL, shared_set_id: sharedSetId })
}

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ sharedSetId: string }> }
) {
  const { sharedSetId } = await params
  return NextResponse.json({ shared_set_id: sharedSetId, message: '수정 완료' })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sharedSetId: string }> }
) {
  const { sharedSetId } = await params
  return NextResponse.json({ shared_set_id: sharedSetId, message: '공유 해제 완료' })
}

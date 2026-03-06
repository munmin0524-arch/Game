// Mock API: 신고

import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ sharedSetId: string }> }
) {
  await params
  // TODO: 실제 신고 로직 + 3건 자동 숨김
  return NextResponse.json({ message: '신고가 접수되었습니다.' })
}

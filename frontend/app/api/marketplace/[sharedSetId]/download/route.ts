// Mock API: 다운로드 (세트/문항 복사)

import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ sharedSetId: string }> }
) {
  await params
  // TODO: 실제 문항 복사 로직
  return NextResponse.json({
    target_set_id: 'set-new-001',
    question_count: 5,
  })
}

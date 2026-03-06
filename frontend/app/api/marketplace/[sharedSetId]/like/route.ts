// Mock API: 좋아요 토글

import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ sharedSetId: string }> }
) {
  await params
  // TODO: 실제 좋아요 토글 로직
  return NextResponse.json({ liked: true, like_count: 43 })
}

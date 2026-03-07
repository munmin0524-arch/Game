import { NextResponse } from 'next/server'

// POST: 북마크 토글
export async function POST(_: Request, { params }: { params: { sharedSetId: string } }) {
  // Mock: 토글 결과 반환
  return NextResponse.json({
    shared_set_id: params.sharedSetId,
    bookmarked: true, // 토글 후 상태
  })
}

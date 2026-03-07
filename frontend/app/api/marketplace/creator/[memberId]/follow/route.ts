import { NextResponse } from 'next/server'

// POST: 팔로우 토글
export async function POST(_: Request, { params }: { params: { memberId: string } }) {
  return NextResponse.json({
    member_id: params.memberId,
    following: true,
  })
}

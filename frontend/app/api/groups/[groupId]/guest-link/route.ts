import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { groupId: string } }) {
  return NextResponse.json({
    link: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/join/${params.groupId}?token=mock-guest-token-abc123`,
  })
}

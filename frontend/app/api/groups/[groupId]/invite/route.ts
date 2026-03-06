import { NextResponse } from 'next/server'

export async function POST() {
  // Mock: 초대 이메일 발송 성공
  return new NextResponse(null, { status: 204 })
}

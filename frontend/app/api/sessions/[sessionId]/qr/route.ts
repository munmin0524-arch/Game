import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  })
}

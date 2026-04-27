// Host 라우트 그룹 레이아웃
// 역할: Host(교사) 인증 가드 + 공통 GNB

// TODO: 세션 확인 후 비인증 시 /login 리다이렉트
// TODO: host_profiles 존재 여부로 Host 권한 확인

import { Suspense } from 'react'
import { GNB } from '@/components/common/GNB'

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/80">
      <Suspense fallback={<div className="h-16 bg-white/80 backdrop-blur-md shadow-soft" />}>
        <GNB />
      </Suspense>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>
    </div>
  )
}

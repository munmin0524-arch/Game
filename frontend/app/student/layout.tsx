// 학생용 서비스 레이아웃
// 역할: 상단 네비게이션 + 학생 인증 가드

// TODO: 학생 세션 확인 후 비인증 시 로그인 리다이렉트

import { StudentNav } from '@/components/student/StudentNav'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/80">
      <StudentNav />
      <main className="mx-auto max-w-5xl px-6 py-8">
        {children}
      </main>
    </div>
  )
}

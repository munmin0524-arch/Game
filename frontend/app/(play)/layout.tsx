// 학생 플레이 라우트 그룹 레이아웃
// 역할: 게스트/멤버 세션 확인, 전체화면 플레이 UI

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* GNB 없음 — 플레이 중 최소 UI */}
      {children}
    </div>
  )
}

// 라이브 세션 전용 레이아웃 — 부모 GNB/padding 완전 무시, 풀스크린
export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-gray-50">
      {children}
    </div>
  )
}

// 에디터 전용 레이아웃 — 부모 main의 padding/max-width 제거
export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <div className="-mx-4 -my-8 max-w-none">{children}</div>
}

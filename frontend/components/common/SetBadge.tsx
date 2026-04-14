// SetBadge — 세트지 카드·미리보기에서 공통으로 쓰는 라벨 뱃지
// kind 색상 토큰은 QuizCard hover overlay 및 PreviewSheet 헤더와도 통일된다.

import { Flame, Sparkles, Trophy, BookMarked } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SetBadgeKind = 'new' | 'hot' | 'official' | 'best' | 'textbook' | 'theme' | 'difficulty'

const STYLES: Record<SetBadgeKind, { cls: string; icon?: React.ReactNode; label: string }> = {
  new:        { cls: 'bg-amber-50 text-amber-700 ring-amber-200',   icon: <Sparkles className="h-3 w-3" />, label: 'NEW' },
  hot:        { cls: 'bg-red-50 text-red-600 ring-red-200',         icon: <Flame className="h-3 w-3" />,    label: '인기' },
  official:   { cls: 'bg-blue-50 text-blue-700 ring-blue-200',      icon: <Sparkles className="h-3 w-3" />, label: '퀴즈파티 공식' },
  best:       { cls: 'bg-purple-50 text-purple-700 ring-purple-200', icon: <Trophy className="h-3 w-3" />,   label: '베스트' },
  textbook:   { cls: 'bg-slate-100 text-slate-700 ring-slate-200',  icon: <BookMarked className="h-3 w-3" />, label: '교과서' },
  theme:      { cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', label: '테마' },
  difficulty: { cls: 'bg-gray-100 text-gray-700 ring-gray-200', label: '' },
}

export function SetBadge({
  kind,
  text,
  className,
}: {
  kind: SetBadgeKind
  text?: string
  className?: string
}) {
  const s = STYLES[kind]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1',
        s.cls,
        className,
      )}
    >
      {s.icon}
      {text ?? s.label}
    </span>
  )
}

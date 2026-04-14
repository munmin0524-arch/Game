'use client'

// "전체 보기" 모드 — PPT 슬라이드 11~15 스타일의 리스트 뷰
// 필터바 아래에 한 줄씩 세트지 나열 (썸네일 + 메타 + 액션)

import { Play, Eye, Flame, Star, Edit, Copy, Trash2, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/common/EmptyState'
import { SetBadge } from '@/components/common/SetBadge'
import { cn } from '@/lib/utils'
import type { QuestionSet } from '@/types'

const GRADIENTS = [
  'from-blue-200 to-cyan-100',
  'from-violet-200 to-purple-100',
  'from-rose-200 to-orange-100',
  'from-emerald-200 to-teal-100',
  'from-amber-200 to-yellow-100',
  'from-pink-200 to-rose-100',
]

function gradientFor(id: string, v?: number | null): string {
  if (v != null && v >= 0) return GRADIENTS[v % GRADIENTS.length]
  return GRADIENTS[id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length]
}

function Row({
  s,
  seen,
  isMineSection,
  onPreview,
  onQuickStart,
  onEdit,
  onDuplicate,
  onShare,
  onDelete,
  onGameOpen,
}: {
  s: QuestionSet
  seen: boolean
  isMineSection: boolean
  onPreview: (id: string) => void
  onQuickStart: (id: string) => void
  onEdit?: (id: string) => void
  onDuplicate?: (id: string) => void
  onShare?: (s: QuestionSet) => void
  onDelete?: (id: string) => void
  onGameOpen?: (id: string) => void
}) {
  const gradient = gradientFor(s.set_id, s.thumbnail_variant)
  return (
    <div
      className={cn(
        'group flex items-stretch gap-4 rounded-xl border bg-white p-3 transition-all hover:shadow-md hover:border-blue-200',
        seen && 'ring-1 ring-blue-200',
      )}
    >
      {/* 좌측 썸네일 (그라디언트 밴드) */}
      <div
        className={cn('shrink-0 rounded-lg bg-gradient-to-br flex items-end justify-start p-2 w-24 h-16', gradient)}
      >
        <span className="text-[10px] font-bold text-gray-800 bg-white/60 backdrop-blur rounded px-1.5 py-0.5">
          {s.question_count ?? 0}문항
        </span>
      </div>

      {/* 본문 */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(s.source === 'quiz_party' || s.is_official) && <SetBadge kind="official" />}
          {s.source === 'mine' && <SetBadge kind="mine" />}
          {s.source === 'community' && <SetBadge kind="community" />}
        </div>
        <button
          onClick={() => onPreview(s.set_id)}
          className="block text-left text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-1"
        >
          {s.title}
        </button>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
          {s.subject && <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0">{s.subject}</Badge>}
          {s.grade && <Badge variant="outline" className="rounded-full text-[10px] px-1.5 py-0">{s.grade}</Badge>}
          {s.textbook && <span>· {s.textbook}</span>}
          {s.unit && <span>· {s.unit}</span>}
          {s.rating_avg != null && (
            <span className="inline-flex items-center gap-0.5 text-amber-600">
              · <Star className="h-3 w-3 fill-current" /> {s.rating_avg.toFixed(1)}
            </span>
          )}
          {(s.play_count ?? 0) > 0 && (
            <span className="inline-flex items-center gap-0.5">
              · <Flame className="h-3 w-3 text-orange-400" /> {s.play_count}
            </span>
          )}
          {s.source === 'community' && s.host_nickname && (
            <span>· by {s.host_nickname}{s.is_certified && <span className="text-blue-500">✓</span>}</span>
          )}
        </div>
      </div>

      {/* 우측 액션 */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPreview(s.set_id)}
          className="h-8 rounded-full px-3 text-xs"
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          보기
        </Button>
        <Button
          size="sm"
          onClick={() => onQuickStart(s.set_id)}
          className="h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-3 text-xs"
        >
          <Play className="h-3.5 w-3.5 mr-1" />
          출제
        </Button>
        {isMineSection && s.source === 'mine' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">···</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && <DropdownMenuItem onClick={() => onEdit(s.set_id)}><Edit className="h-4 w-4 mr-2" /> 편집</DropdownMenuItem>}
              {onDuplicate && <DropdownMenuItem onClick={() => onDuplicate(s.set_id)}><Copy className="h-4 w-4 mr-2" /> 복제</DropdownMenuItem>}
              {onGameOpen && <DropdownMenuItem onClick={() => onGameOpen(s.set_id)}>게임 열기</DropdownMenuItem>}
              {onShare && <><DropdownMenuSeparator /><DropdownMenuItem onClick={() => onShare(s)}><Share2 className="h-4 w-4 mr-2" /> 광장에 공유</DropdownMenuItem></>}
              {onDelete && <><DropdownMenuSeparator /><DropdownMenuItem onClick={() => onDelete(s.set_id)} className="text-red-600"><Trash2 className="h-4 w-4 mr-2" /> 삭제</DropdownMenuItem></>}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

export function SetsHubGrid({
  sets,
  loading,
  seenIds,
  isMineSection,
  onPreview,
  onQuickStart,
  onEdit,
  onDuplicate,
  onShare,
  onDelete,
  onGameOpen,
  emptyTitle,
  emptyDescription,
}: {
  sets: QuestionSet[]
  loading: boolean
  seenIds: Set<string>
  isMineSection: boolean
  onPreview: (setId: string) => void
  onQuickStart: (setId: string) => void
  onEdit?: (setId: string) => void
  onDuplicate?: (setId: string) => void
  onShare?: (s: QuestionSet) => void
  onDelete?: (setId: string) => void
  onGameOpen?: (setId: string) => void
  emptyTitle: string
  emptyDescription: string
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (sets.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-500">
        총 <span className="font-semibold text-gray-700">{sets.length}</span>개의 세트지
      </div>
      {sets.map((s) => (
        <Row
          key={s.set_id}
          s={s}
          seen={seenIds.has(s.set_id)}
          isMineSection={isMineSection}
          onPreview={onPreview}
          onQuickStart={onQuickStart}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onShare={onShare}
          onDelete={onDelete}
          onGameOpen={onGameOpen}
        />
      ))}
    </div>
  )
}

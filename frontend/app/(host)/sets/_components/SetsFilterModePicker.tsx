'use client'

// 1-depth 필터 모드 선택기 — Phase별로 노출 모드가 다름
// 모드 선택 시 하위 cascade가 달라짐.

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { PHASE_FILTER_CONFIG, type ExtendedFilterMode, type Phase } from '@/lib/phase-data'

export type FilterMode = ExtendedFilterMode | null

interface ModeMeta {
  key: Exclude<FilterMode, null>
  emoji: string
  label: string
  color: string
}

const ALL_MODES: ModeMeta[] = [
  { key: 'textbook',     emoji: '📘', label: '교과서별',  color: 'from-sky-500 to-cyan-400' },
  { key: 'workbook',     emoji: '📐', label: '교재별',    color: 'from-fuchsia-500 to-pink-400' },
  { key: 'subject',      emoji: '📚', label: '과목별',    color: 'from-emerald-500 to-teal-400' },
  { key: 'theme',        emoji: '🎯', label: '테마별',    color: 'from-amber-500 to-orange-400' },
  { key: 'elem-special', emoji: '✍️', label: '초등 특화', color: 'from-rose-500 to-orange-400' },
  { key: 'community',    emoji: '🤝', label: '커뮤니티',  color: 'from-blue-500 to-indigo-500' },
  { key: 'ai-remix',     emoji: '🤖', label: 'AI 재가공', color: 'from-violet-500 to-fuchsia-500' },
]

export function SetsFilterModePicker({
  mode,
  onModeChange,
  search,
  onSearchChange,
  phase,
}: {
  mode: FilterMode
  onModeChange: (m: FilterMode) => void
  search: string
  onSearchChange: (v: string) => void
  phase: Phase
}) {
  const allowed = PHASE_FILTER_CONFIG[phase].modes
  const visibleModes = ALL_MODES.filter((m) => allowed.includes(m.key))

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      {/* 모드 세그먼티드 컨트롤 */}
      <div className="inline-flex items-center gap-1 rounded-2xl bg-gray-100 p-1 ring-1 ring-gray-200 shrink-0 flex-wrap">
        <button
          onClick={() => onModeChange(null)}
          className={cn(
            'px-3 py-2 rounded-xl text-sm font-semibold transition-all',
            mode === null
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-800',
          )}
          aria-pressed={mode === null}
        >
          🌟 둘러보기
        </button>
        {visibleModes.map((m) => {
          const active = mode === m.key
          return (
            <button
              key={m.key}
              onClick={() => onModeChange(m.key)}
              className={cn(
                'relative px-3 py-2 rounded-xl text-sm font-semibold transition-all',
                active
                  ? `bg-gradient-to-br ${m.color} text-white shadow-md scale-[1.02]`
                  : 'text-gray-600 hover:text-gray-900',
              )}
              aria-pressed={active}
            >
              <span className="mr-1">{m.emoji}</span>
              {m.label}
            </button>
          )
        })}
      </div>

      {/* 검색 */}
      <div className="relative lg:w-[280px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="원하는 단원·지식요인을 입력하세요 (예: 일차방정식, 비문학 독해)"
          className="pl-9 pr-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            aria-label="검색어 지우기"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

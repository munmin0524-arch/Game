'use client'

// 소스 탭 — 언더라인 스타일 (카훗/넷플릭스 UX)
// 전체 / 퀴즈파티 제공 / 내가 만든 / 다른 선생님

import { cn } from '@/lib/utils'
import { SETS_HUB_LABELS } from '../_labels'
import type { SetSource } from '@/types'

export type SourceTab = 'all' | SetSource

export function SetsSourcePills({
  value,
  onChange,
  counts,
}: {
  value: SourceTab
  onChange: (v: SourceTab) => void
  counts?: Partial<Record<SourceTab, number>>
}) {
  const tabs: SourceTab[] = ['all', 'quiz_party', 'mine', 'community']
  return (
    <div className="border-b border-gray-200" role="tablist">
      <div className="flex gap-1">
        {tabs.map((key) => {
          const t = SETS_HUB_LABELS.pills[key]
          const active = value === key
          const count = counts?.[key]
          return (
            <button
              key={key}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(key)}
              className={cn(
                'relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors',
                active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800',
              )}
            >
              <span className="text-base leading-none">{t.emoji}</span>
              <span>{t.label}</span>
              {count != null && (
                <span
                  className={cn(
                    'ml-1 rounded-full px-1.5 text-[10px] font-semibold',
                    active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500',
                  )}
                >
                  {count}
                </span>
              )}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

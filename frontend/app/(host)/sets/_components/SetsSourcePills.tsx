'use client'

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
    <div className="flex flex-wrap gap-2" role="tablist">
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
              'group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
              active
                ? 'bg-blue-600 text-white shadow-md scale-[1.02]'
                : 'bg-white text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200',
            )}
          >
            <span className="text-base leading-none">{t.emoji}</span>
            <span>{t.label}</span>
            {count != null && (
              <span
                className={cn(
                  'ml-1 rounded-full px-1.5 text-[10px] font-semibold',
                  active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500',
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

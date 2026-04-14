'use client'

// Kahoot 스타일 카테고리 타일 — 컬렉션 입구 역할
// 클릭 시 필터 프리셋을 적용해 해당 컬렉션만 보여준다.
// 카피·이모지·그라디언트는 _labels.ts에서 관리.

import { cn } from '@/lib/utils'
import { SETS_HUB_LABELS } from '../_labels'
import type { HubFilters } from './SetsFilterBar'
import { EMPTY_FILTERS } from './SetsFilterBar'

// 각 타일 키 → 필터 프리셋 매핑
function presetFor(key: string): Partial<HubFilters> {
  switch (key) {
    case 'new-semester':  return { search: '신학기' }
    case 'bisang':        return { textbook: '비상 교과서' }
    case 'gongbuck':      return { search: '공부력' }
    case 'icebreak':      return { search: '아이스브레이킹' }
    case 'humor':         return { search: '유머' }
    case 'math-workbook': return { search: '쎈', subject: '수학' }
    case 'korean':        return { theme: '공부력-국어', subject: '국어' }
    case 'math-op':       return { theme: '공부력-수학', subject: '수학' }
    default:              return {}
  }
}

export function HubCategoryTiles({
  onPick,
}: {
  onPick: (preset: HubFilters) => void
}) {
  const L = SETS_HUB_LABELS.tiles
  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">{L.heading}</h2>
        <span className="text-xs text-gray-400">{L.sub}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {L.items.map((t) => (
          <button
            key={t.key}
            onClick={() => onPick({ ...EMPTY_FILTERS, ...presetFor(t.key) })}
            className={cn(
              'group relative overflow-hidden rounded-2xl p-3 text-left text-white shadow-sm transition-all',
              'bg-gradient-to-br hover:scale-[1.04] hover:shadow-lg',
              t.gradient,
            )}
          >
            <div className="absolute right-1 -bottom-2 text-6xl opacity-20 group-hover:opacity-30 transition-opacity leading-none">
              {t.emoji}
            </div>
            <div className="relative z-10">
              <div className="text-2xl leading-none mb-1">{t.emoji}</div>
              <div className="text-sm font-bold leading-tight">{t.label}</div>
              <div className="text-[10px] font-medium opacity-90 mt-0.5">{t.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

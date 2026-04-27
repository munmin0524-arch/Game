'use client'

// Kahoot 스타일 카테고리 타일 — 컬렉션 입구 역할
// Phase별로 타일 구성을 다르게 (lib/phase-data.ts 의 PHASE_TILES 참고)

import { cn } from '@/lib/utils'
import { PHASE_TILES, type Phase } from '@/lib/phase-data'
import type { HubFilters } from './SetsFilterBar'
import { EMPTY_FILTERS } from './SetsFilterBar'

export function HubCategoryTiles({
  phase,
  onPick,
}: {
  phase: Phase
  onPick: (preset: HubFilters) => void
}) {
  const tiles = PHASE_TILES[phase]

  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">카테고리로 둘러보기</h2>
        <span className="text-xs text-gray-400">원하는 주제를 한 번에</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {tiles.map((t) => (
          <button
            key={t.key}
            onClick={() => onPick({ ...EMPTY_FILTERS, ...t.preset })}
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

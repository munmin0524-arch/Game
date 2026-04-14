'use client'

import { LayoutGrid, Rows3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SETS_HUB_LABELS } from '../_labels'

export type ViewMode = 'carousel' | 'grid'

export function SetsViewToggle({
  value,
  onChange,
}: {
  value: ViewMode
  onChange: (v: ViewMode) => void
}) {
  const L = SETS_HUB_LABELS.view
  return (
    <div className="inline-flex items-center rounded-full bg-gray-100 p-0.5 text-xs">
      <button
        className={cn(
          'flex items-center gap-1 rounded-full px-3 py-1.5 transition-all',
          value === 'carousel' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-gray-500',
        )}
        onClick={() => onChange('carousel')}
        aria-pressed={value === 'carousel'}
      >
        <Rows3 className="h-3.5 w-3.5" />
        {L.carousel}
      </button>
      <button
        className={cn(
          'flex items-center gap-1 rounded-full px-3 py-1.5 transition-all',
          value === 'grid' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-gray-500',
        )}
        onClick={() => onChange('grid')}
        aria-pressed={value === 'grid'}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        {L.grid}
      </button>
    </div>
  )
}

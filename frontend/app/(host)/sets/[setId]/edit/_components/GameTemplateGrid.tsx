'use client'

import { useState } from 'react'
import type { GameCategory, SubjectKey } from '@/types'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getTemplatesForSubject,
  getTemplatesByCategory,
} from './GameTemplateData'

interface GameTemplateGridProps {
  subject: SubjectKey | null
  onSelect: (templateCode: string, optionCount: number) => void
  onCancel: () => void
}

// 미니 프리뷰 — 컬러 블록 (카테고리별)
function SelectionPreview({ optionCount }: { optionCount: number }) {
  const colors = ['bg-blue-400', 'bg-purple-400', 'bg-red-400', 'bg-green-400', 'bg-orange-400']
  return (
    <div className="flex flex-col gap-1">
      <div className="h-3 rounded-sm bg-green-700" />
      <div className={`grid gap-1 ${optionCount <= 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
        {Array.from({ length: optionCount }).map((_, i) => (
          <div key={i} className={`h-6 rounded-sm ${colors[i % colors.length]}`} />
        ))}
      </div>
    </div>
  )
}

function OXPreview() {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-3 rounded-sm bg-green-700" />
      <div className="h-6 rounded-sm bg-blue-600" />
      <div className="flex gap-2 justify-center pt-1">
        <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-bold">O</div>
        <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold">X</div>
      </div>
    </div>
  )
}

function UnscramblePreview() {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-3 rounded-sm bg-green-700" />
      <div className="flex gap-1">
        {['bg-purple-300', 'bg-blue-300', 'bg-pink-300', 'bg-orange-300'].map((c, i) => (
          <div key={i} className={`h-5 flex-1 rounded-sm ${c}`} />
        ))}
      </div>
      <div className="h-4 rounded-sm bg-gray-200 border-b-2 border-gray-400" />
    </div>
  )
}

export function GameTemplateGrid({ subject, onSelect, onCancel }: GameTemplateGridProps) {
  const [activeTab, setActiveTab] = useState<GameCategory>('selection')

  const templates = getTemplatesForSubject(subject)
  const byCategory = getTemplatesByCategory(templates)

  return (
    <div className="flex flex-col h-full">
      {/* 카테고리 탭 */}
      <div className="flex items-center gap-1 border-b px-4 pt-3">
        {CATEGORIES.map((cat) => {
          const count = byCategory[cat].length
          if (count === 0) return null
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-colors
                ${activeTab === cat
                  ? `${CATEGORY_COLORS[cat].bg} ${CATEGORY_COLORS[cat].accent} text-gray-900`
                  : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'
                }`}
            >
              {CATEGORY_LABELS[cat]} ({count})
            </button>
          )
        })}
        <div className="flex-1" />
        <button
          onClick={onCancel}
          className="text-sm text-gray-400 hover:text-gray-600 px-2 py-1"
        >
          취소
        </button>
      </div>

      {/* 템플릿 그리드 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {byCategory[activeTab].map((t) => (
            <button
              key={t.code}
              onClick={() => onSelect(t.code, t.optionCount)}
              className="flex flex-col items-stretch rounded-2xl border-2 border-gray-200 bg-white p-3 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="bg-gray-50 rounded-xl p-2.5 mb-2">
                {t.category === 'selection' && <SelectionPreview optionCount={t.optionCount} />}
                {t.category === 'ox' && <OXPreview />}
                {t.category === 'unscramble' && <UnscramblePreview />}
              </div>
              <p className="text-[11px] font-semibold text-gray-600 group-hover:text-blue-600 text-center truncate">
                {t.code}
              </p>
              {t.description && (
                <p className="text-[10px] text-gray-400 text-center truncate">{t.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

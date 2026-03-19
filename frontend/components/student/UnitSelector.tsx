'use client'

import { useState, useEffect } from 'react'

interface UnitSelectorProps {
  onSelect?: (selection: { subject: string; unit: string; subUnit: string }) => void
  compact?: boolean
}

const CURRICULUM_DATA: Record<string, Record<string, string[]>> = {
  '과학': {
    '여러 가지 힘': ['마찰력', '탄성력', '중력', '부력'],
    '물질의 상태 변화': ['고체→액체', '액체→기체', '상태 변화와 에너지'],
  },
  '수학': {
    '일차방정식': ['이항', '일차방정식의 풀이', '일차방정식의 활용'],
    '함수': ['함수의 뜻', '함수의 그래프', '일차함수'],
  },
}

export default function UnitSelector({ onSelect, compact = false }: UnitSelectorProps) {
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [selectedSubUnit, setSelectedSubUnit] = useState('')

  const subjects = Object.keys(CURRICULUM_DATA)
  const units = selectedSubject ? Object.keys(CURRICULUM_DATA[selectedSubject]) : []
  const subUnits =
    selectedSubject && selectedUnit
      ? CURRICULUM_DATA[selectedSubject][selectedUnit] ?? []
      : []

  // Cascade resets
  useEffect(() => {
    setSelectedUnit('')
    setSelectedSubUnit('')
  }, [selectedSubject])

  useEffect(() => {
    setSelectedSubUnit('')
  }, [selectedUnit])

  // Notify parent when all three are selected
  useEffect(() => {
    if (selectedSubject && selectedUnit && selectedSubUnit) {
      onSelect?.({ subject: selectedSubject, unit: selectedUnit, subUnit: selectedSubUnit })
    }
  }, [selectedSubject, selectedUnit, selectedSubUnit, onSelect])

  const baseSelect = compact
    ? 'w-full rounded-lg border border-white/30 bg-white/20 px-2 py-1.5 text-xs text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50'
    : 'w-full rounded-lg border border-white/30 bg-white/20 px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50'

  const labelClass = compact
    ? 'text-[10px] font-medium text-white/80 mb-0.5'
    : 'text-xs font-medium text-white/80 mb-1'

  return (
    <div className={`grid grid-cols-3 ${compact ? 'gap-2' : 'gap-3'}`}>
      {/* 과목 */}
      <div>
        <label className={labelClass}>과목</label>
        <select
          className={baseSelect}
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="" className="text-gray-800">
            선택
          </option>
          {subjects.map((s) => (
            <option key={s} value={s} className="text-gray-800">
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* 대단원 */}
      <div>
        <label className={labelClass}>대단원</label>
        <select
          className={baseSelect}
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          disabled={!selectedSubject}
        >
          <option value="" className="text-gray-800">
            선택
          </option>
          {units.map((u) => (
            <option key={u} value={u} className="text-gray-800">
              {u}
            </option>
          ))}
        </select>
      </div>

      {/* 중단원 */}
      <div>
        <label className={labelClass}>중단원</label>
        <select
          className={baseSelect}
          value={selectedSubUnit}
          onChange={(e) => setSelectedSubUnit(e.target.value)}
          disabled={!selectedUnit}
        >
          <option value="" className="text-gray-800">
            선택
          </option>
          {subUnits.map((su) => (
            <option key={su} value={su} className="text-gray-800">
              {su}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

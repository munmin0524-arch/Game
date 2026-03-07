'use client'

import { useMemo, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type {
  StudentMonitorData,
  StudentSortKey,
  StudentSortDir,
  StudentFilterBadge,
  BehaviorBadge,
} from '@/types'
import StudentCard from './StudentCard'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface StudentGridProps {
  students: StudentMonitorData[]
  onSelectStudent: (student: StudentMonitorData) => void
  selectedIds: string[]
  onSelectedIdsChange: (ids: string[]) => void
  multiSelectMode: boolean
  onMultiSelectModeChange: (v: boolean) => void
}

// ─────────────────────────────────────────────────────────────
// 필터/정렬 옵션
// ─────────────────────────────────────────────────────────────

const SORT_OPTIONS: { key: StudentSortKey; label: string }[] = [
  { key: 'name', label: '이름' },
  { key: 'score', label: '점수' },
  { key: 'accuracy', label: '정답률' },
  { key: 'status', label: '상태' },
]

const FILTER_OPTIONS: {
  key: StudentFilterBadge
  label: string
  desc: string
  color: string
  activeColor: string
}[] = [
  { key: 'all', label: '전체', desc: '모든 학생', color: 'text-gray-500 hover:bg-gray-100', activeColor: 'bg-gray-800 text-white' },
  { key: 'struggling', label: '연속 오답', desc: '3문항 이상 연속 틀림', color: 'text-red-600 hover:bg-red-50', activeColor: 'bg-red-600 text-white' },
  { key: 'guessing', label: '찍기 의심', desc: '2초 안에 답변 (너무 빠름)', color: 'text-orange-600 hover:bg-orange-50', activeColor: 'bg-orange-500 text-white' },
  { key: 'star', label: '우수', desc: '3문항 이상 연속 정답', color: 'text-yellow-600 hover:bg-yellow-50', activeColor: 'bg-yellow-500 text-white' },
  { key: 'slow', label: '시간 부족', desc: '시간이 모자라 미응답', color: 'text-gray-500 hover:bg-gray-100', activeColor: 'bg-gray-600 text-white' },
]

const STATUS_ORDER: Record<string, number> = {
  answering: 0,
  idle: 1,
  answered: 2,
  disconnected: 3,
}

// ─────────────────────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────────────────────

export default function StudentGrid({
  students,
  onSelectStudent,
  selectedIds,
  onSelectedIdsChange,
  multiSelectMode,
  onMultiSelectModeChange,
}: StudentGridProps) {
  const [sortKey, setSortKey] = useState<StudentSortKey>('score')
  const [sortDir, setSortDir] = useState<StudentSortDir>('desc')
  const [filterBadge, setFilterBadge] = useState<StudentFilterBadge>('all')

  // 필터링
  const filtered = useMemo(() => {
    if (filterBadge === 'all') return students
    return students.filter((s) => s.badges.includes(filterBadge as BehaviorBadge))
  }, [students, filterBadge])

  // 정렬
  const sorted = useMemo(() => {
    const list = [...filtered]
    list.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'name':
          cmp = a.nickname.localeCompare(b.nickname, 'ko')
          break
        case 'score':
          cmp = a.score - b.score
          break
        case 'accuracy':
          cmp = a.accuracy - b.accuracy
          break
        case 'status':
          cmp = (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [filtered, sortKey, sortDir])

  // 집계
  const badgeCounts = useMemo(() => {
    const counts: Record<string, number> = { struggling: 0, guessing: 0, star: 0, slow: 0 }
    students.forEach((s) => s.badges.forEach((b) => { counts[b] = (counts[b] ?? 0) + 1 }))
    return counts
  }, [students])

  const handleSort = (key: StudentSortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  const handleToggleSelect = (id: string) => {
    onSelectedIdsChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    )
  }

  const handleSelectAll = () => {
    onSelectedIdsChange(sorted.map((s) => s.participantId))
  }

  const handleDeselectAll = () => {
    onSelectedIdsChange([])
  }

  const activeFilter = FILTER_OPTIONS.find((o) => o.key === filterBadge)

  return (
    <div className="flex flex-col gap-3">
      {/* ── 필터 (뱃지 범례 겸용) ── */}
      <div className="flex flex-wrap items-center gap-1.5">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setFilterBadge(opt.key)}
            title={opt.desc}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
              filterBadge === opt.key ? opt.activeColor : opt.color,
            )}
          >
            {opt.label}
            {opt.key !== 'all' && badgeCounts[opt.key] > 0 && (
              <span className="ml-1.5 opacity-70">{badgeCounts[opt.key]}</span>
            )}
          </button>
        ))}

        {/* 선택된 필터 설명 */}
        {filterBadge !== 'all' && activeFilter && (
          <span className="ml-2 text-xs text-gray-400">
            — {activeFilter.desc}
          </span>
        )}
      </div>

      {/* ── 정렬 + 다중선택 ── */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleSort(opt.key)}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-medium transition-colors',
                sortKey === opt.key
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100',
              )}
            >
              {opt.label}
              {sortKey === opt.key && (
                <span className="ml-0.5">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
              )}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-gray-200" />

        <Button
          variant={multiSelectMode ? 'default' : 'outline'}
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            onMultiSelectModeChange(!multiSelectMode)
            if (multiSelectMode) onSelectedIdsChange([])
          }}
        >
          {multiSelectMode ? '선택 해제' : '다중 선택'}
        </Button>

        {multiSelectMode && (
          <>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleSelectAll}>
              전체 선택
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleDeselectAll}>
              전체 해제
            </Button>
          </>
        )}

        <span className="ml-auto text-xs text-gray-400">{sorted.length}명</span>
      </div>

      {/* ── 학생 카드 그리드 ── */}
      <div className="grid grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5">
        {sorted.map((student) => (
          <StudentCard
            key={student.participantId}
            student={student}
            isSelected={selectedIds.includes(student.participantId)}
            multiSelectMode={multiSelectMode}
            onToggleSelect={handleToggleSelect}
            onClick={onSelectStudent}
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="py-12 text-center text-sm text-gray-400">
          해당 조건의 학생이 없습니다
        </div>
      )}
    </div>
  )
}

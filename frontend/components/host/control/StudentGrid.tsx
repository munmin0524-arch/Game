'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import type {
  StudentMonitorData,
  StudentSortKey,
  StudentSortDir,
  StudentFilterBadge,
  BehaviorBadge,
} from '@/types'
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
// 옵션
// ─────────────────────────────────────────────────────────────

const SORT_OPTIONS: { key: StudentSortKey; label: string }[] = [
  { key: 'rank', label: '순위' },
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
  { key: 'all', label: '전체', desc: '', color: 'text-gray-600 hover:bg-gray-100', activeColor: 'bg-gray-800 text-white' },
  { key: 'struggling', label: '연속 오답', desc: '3문항 이상 연속 틀림', color: 'text-red-600 hover:bg-red-50', activeColor: 'bg-red-600 text-white' },
  { key: 'guessing', label: '찍기 의심', desc: '2초 안에 답변', color: 'text-orange-600 hover:bg-orange-50', activeColor: 'bg-orange-500 text-white' },
  { key: 'star', label: '우수', desc: '3문항 이상 연속 정답', color: 'text-yellow-700 hover:bg-yellow-50', activeColor: 'bg-yellow-500 text-white' },
  { key: 'slow', label: '진행 느림', desc: '전체 문항 절반 미만 완료', color: 'text-gray-500 hover:bg-gray-100', activeColor: 'bg-gray-600 text-white' },
]

const STATUS_DOT: Record<string, string> = {
  answering: 'bg-yellow-400 animate-pulse',
  finished: 'bg-green-500',
  disconnected: 'bg-red-400',
  idle: 'bg-gray-300',
}

const STATUS_LABEL: Record<string, string> = {
  answering: '풀이 중',
  finished: '완료',
  disconnected: '연결 끊김',
  idle: '대기',
}

const BADGE_CONFIG: Record<string, { label: string; className: string }> = {
  struggling: { label: '연속 오답', className: 'bg-red-100 text-red-700 border-red-200' },
  guessing: { label: '찍기 의심', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  star: { label: '우수', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  slow: { label: '진행 느림', className: 'bg-gray-100 text-gray-600 border-gray-200' },
}

const STATUS_ORDER: Record<string, number> = {
  answering: 0,
  idle: 1,
  finished: 2,
  disconnected: 3,
}

// ─────────────────────────────────────────────────────────────
// 순위 계산 (점수 desc → 총 응답시간 asc)
// ─────────────────────────────────────────────────────────────

function computeRanks(students: StudentMonitorData[]): Map<string, number> {
  const sorted = [...students].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    const aTime = a.perQuestionResults.reduce((s, r) => s + (r.responseTimeSec ?? 0), 0)
    const bTime = b.perQuestionResults.reduce((s, r) => s + (r.responseTimeSec ?? 0), 0)
    return aTime - bTime
  })
  const map = new Map<string, number>()
  sorted.forEach((s, i) => map.set(s.participantId, i + 1))
  return map
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
  const [sortKey, setSortKey] = useState<StudentSortKey>('rank')
  const [sortDir, setSortDir] = useState<StudentSortDir>('asc')
  const [filterBadge, setFilterBadge] = useState<StudentFilterBadge>('all')

  const rankMap = useMemo(() => computeRanks(students), [students])

  const filtered = useMemo(() => {
    if (filterBadge === 'all') return students
    return students.filter((s) => s.badges.includes(filterBadge as BehaviorBadge))
  }, [students, filterBadge])

  const sorted = useMemo(() => {
    const list = [...filtered]
    list.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'rank':
          cmp = (rankMap.get(a.participantId) ?? 99) - (rankMap.get(b.participantId) ?? 99)
          break
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
  }, [filtered, sortKey, sortDir, rankMap])

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
      setSortDir(key === 'name' ? 'asc' : key === 'rank' ? 'asc' : 'desc')
    }
  }

  const toggleSelect = (id: string) => {
    onSelectedIdsChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    )
  }

  const activeFilter = FILTER_OPTIONS.find((o) => o.key === filterBadge)

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* ── 필터 바 ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setFilterBadge(opt.key)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
              filterBadge === opt.key ? opt.activeColor : opt.color,
            )}
          >
            {opt.label}
            {opt.key !== 'all' && badgeCounts[opt.key] > 0 && (
              <span className="ml-1.5 opacity-70">{badgeCounts[opt.key]}</span>
            )}
          </button>
        ))}

        {filterBadge !== 'all' && activeFilter?.desc && (
          <span className="text-sm text-gray-400 ml-1">— {activeFilter.desc}</span>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={multiSelectMode ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
            onClick={() => {
              onMultiSelectModeChange(!multiSelectMode)
              if (multiSelectMode) onSelectedIdsChange([])
            }}
          >
            {multiSelectMode ? '선택 해제' : '다중 선택'}
          </Button>
          {multiSelectMode && (
            <>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => onSelectedIdsChange(sorted.map((s) => s.participantId))}>
                전체
              </Button>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => onSelectedIdsChange([])}>
                해제
              </Button>
            </>
          )}
          <span className="text-sm text-gray-400 tabular-nums">{sorted.length}명</span>
        </div>
      </div>

      {/* ── 테이블 ── */}
      <div className="flex-1 overflow-y-auto rounded-xl border bg-white">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 border-b">
            <tr>
              {multiSelectMode && <th className="w-10 px-3 py-3" />}
              <th className="w-14 px-3 py-3 text-center">
                <button type="button" onClick={() => handleSort('rank')} className="text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700">
                  순위
                  {sortKey === 'rank' && <span className="ml-0.5">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button type="button" onClick={() => handleSort('name')} className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700">
                  학생
                  {sortKey === 'name' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">진행도</span>
              </th>
              <th className="px-4 py-3 text-right">
                <button type="button" onClick={() => handleSort('score')} className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 ml-auto">
                  점수
                  {sortKey === 'score' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button type="button" onClick={() => handleSort('accuracy')} className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 ml-auto">
                  정답률
                  {sortKey === 'accuracy' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">알림</span>
              </th>
              <th className="px-4 py-3 text-center">
                <button type="button" onClick={() => handleSort('status')} className="text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700">
                  상태
                  {sortKey === 'status' && <span className="ml-0.5">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((student) => {
              const isSelected = selectedIds.includes(student.participantId)
              const rank = rankMap.get(student.participantId) ?? 0
              return (
                <tr
                  key={student.participantId}
                  onClick={() => {
                    if (multiSelectMode) {
                      toggleSelect(student.participantId)
                    } else {
                      onSelectStudent(student)
                    }
                  }}
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-blue-50/50',
                    isSelected && 'bg-blue-50',
                    student.status === 'disconnected' && 'opacity-50',
                  )}
                >
                  {/* 체크박스 */}
                  {multiSelectMode && (
                    <td className="px-3 py-3">
                      <div className={cn(
                        'h-4 w-4 rounded border-2 mx-auto',
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300',
                      )}>
                        {isSelected && (
                          <svg viewBox="0 0 12 12" className="h-full w-full text-white">
                            <path d="M3 6l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </td>
                  )}

                  {/* 순위 */}
                  <td className="px-3 py-3 text-center">
                    <span className={cn(
                      'text-sm font-bold tabular-nums',
                      rank === 1 ? 'text-yellow-600' : rank === 2 ? 'text-gray-500' : rank === 3 ? 'text-amber-700' : 'text-gray-400',
                    )}>
                      {rank}
                    </span>
                  </td>

                  {/* 학생 */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                        student.avatarColor,
                      )}>
                        {student.nickname.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{student.nickname}</p>
                        {student.correctStreak >= 3 && (
                          <p className="text-xs text-amber-600">{student.correctStreak}연속 정답</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 진행도 */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            student.isFinished ? 'bg-green-500' : 'bg-blue-400',
                          )}
                          style={{ width: `${(student.completedQuestions / student.totalQuestions) * 100}%` }}
                        />
                      </div>
                      <span className={cn(
                        'text-sm tabular-nums font-medium whitespace-nowrap',
                        student.isFinished ? 'text-green-600' : 'text-gray-700',
                      )}>
                        {student.completedQuestions}/{student.totalQuestions}
                        {student.isFinished && ' ✓'}
                      </span>
                    </div>
                  </td>

                  {/* 점수 */}
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-bold tabular-nums text-gray-900">{student.score}</span>
                  </td>

                  {/* 정답률 */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            student.accuracy >= 70 ? 'bg-green-500' : student.accuracy >= 40 ? 'bg-yellow-400' : 'bg-red-400',
                          )}
                          style={{ width: `${student.accuracy}%` }}
                        />
                      </div>
                      <span className="text-sm tabular-nums text-gray-700 w-10 text-right">{student.accuracy}%</span>
                    </div>
                  </td>

                  {/* 뱃지 */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {student.badges.map((badge) => (
                        <span
                          key={badge}
                          className={cn(
                            'inline-block rounded-full border px-2 py-0.5 text-xs font-semibold whitespace-nowrap',
                            BADGE_CONFIG[badge]?.className,
                          )}
                        >
                          {BADGE_CONFIG[badge]?.label}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* 상태 */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className={cn('h-2 w-2 rounded-full flex-shrink-0', STATUS_DOT[student.status])} />
                      <span className="text-xs text-gray-600 whitespace-nowrap">{STATUS_LABEL[student.status]}</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {sorted.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">
            해당 조건의 학생이 없습니다
          </div>
        )}
      </div>
    </div>
  )
}

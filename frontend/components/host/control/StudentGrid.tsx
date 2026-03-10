'use client'

import { useMemo, useState } from 'react'
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
}

// ─────────────────────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────────────────────

const FILTER_OPTIONS: {
  key: StudentFilterBadge
  label: string
  color: string
  activeColor: string
}[] = [
  { key: 'all', label: '전체', color: 'text-gray-600 hover:bg-gray-100', activeColor: 'bg-gray-800 text-white' },
  { key: 'struggling', label: '연속 오답', color: 'text-red-600 hover:bg-red-50', activeColor: 'bg-red-600 text-white' },
  { key: 'guessing', label: '찍기 의심', color: 'text-orange-600 hover:bg-orange-50', activeColor: 'bg-orange-500 text-white' },
  { key: 'slow', label: '진행 느림', color: 'text-gray-500 hover:bg-gray-100', activeColor: 'bg-gray-600 text-white' },
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

  return (
    <div className="flex flex-col gap-3 h-full">
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
            {opt.key === 'all' ? (
              <span className="ml-1.5 opacity-70">{students.length}명</span>
            ) : (
              badgeCounts[opt.key] > 0 && (
                <span className="ml-1.5 opacity-70">{badgeCounts[opt.key]}</span>
              )
            )}
          </button>
        ))}

        <span className="ml-auto text-sm text-gray-400 tabular-nums">
          {sorted.length !== students.length && `${sorted.length}명 표시`}
        </span>
      </div>

      {/* ── 테이블 ── */}
      <div className="flex-1 overflow-y-auto rounded-xl border bg-white">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 border-b">
            <tr>
              <th className="w-12 px-3 py-3 text-center">
                <button type="button" onClick={() => handleSort('rank')} className="text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700">
                  #
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
                <button type="button" onClick={() => handleSort('accuracy')} className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 ml-auto">
                  정답률
                  {sortKey === 'accuracy' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button type="button" onClick={() => handleSort('score')} className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 ml-auto">
                  점수
                  {sortKey === 'score' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                </button>
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
              const rank = rankMap.get(student.participantId) ?? 0
              return (
                <tr
                  key={student.participantId}
                  onClick={() => onSelectStudent(student)}
                  title={`${student.nickname} · 정답률 ${student.accuracy}% · ${STATUS_LABEL[student.status]}`}
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-blue-50/50',
                    student.status === 'disconnected' && 'opacity-50',
                  )}
                >
                  {/* 순위 */}
                  <td className="px-3 py-2.5 text-center">
                    <span className={cn(
                      'text-sm font-bold tabular-nums',
                      rank === 1 ? 'text-yellow-600' : rank === 2 ? 'text-gray-500' : rank === 3 ? 'text-amber-700' : 'text-gray-400',
                    )}>
                      {rank}
                    </span>
                  </td>

                  {/* 학생 (이름 + 뱃지) */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{student.nickname}</span>
                      {student.badges.map((badge) => {
                        const cfg: Record<string, { label: string; cls: string }> = {
                          struggling: { label: '연속오답', cls: 'bg-red-100 text-red-600' },
                          guessing: { label: '찍기', cls: 'bg-orange-100 text-orange-600' },
                          slow: { label: '느림', cls: 'bg-gray-100 text-gray-500' },
                          star: { label: '우수', cls: 'bg-yellow-100 text-yellow-700' },
                        }
                        const c = cfg[badge]
                        if (!c) return null
                        return (
                          <span key={badge} className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold', c.cls)}>
                            {c.label}
                          </span>
                        )
                      })}
                    </div>
                  </td>

                  {/* 진행도 */}
                  <td className="px-4 py-2.5 text-center">
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
                      </span>
                    </div>
                  </td>

                  {/* 정답률 */}
                  <td className="px-4 py-2.5 text-right">
                    <span className={cn(
                      'text-sm tabular-nums font-medium',
                      student.accuracy >= 70 ? 'text-green-600' : student.accuracy >= 40 ? 'text-gray-700' : 'text-red-500',
                    )}>
                      {student.accuracy}%
                    </span>
                  </td>

                  {/* 점수 */}
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-sm font-bold tabular-nums text-gray-900">{student.score}</span>
                  </td>

                  {/* 상태 (색상 dot + 라벨) */}
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className={cn('h-2 w-2 rounded-full flex-shrink-0', STATUS_DOT[student.status])} />
                      <span className="text-xs text-gray-500 whitespace-nowrap">{STATUS_LABEL[student.status]}</span>
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

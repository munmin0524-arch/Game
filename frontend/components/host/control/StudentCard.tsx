'use client'

import type { StudentMonitorData, BehaviorBadge } from '@/types'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// 상태/뱃지 표시 설정
// ─────────────────────────────────────────────────────────────

const STATUS_DOT: Record<StudentMonitorData['status'], string> = {
  answering: 'bg-yellow-400 animate-pulse',
  answered: 'bg-green-500',
  disconnected: 'bg-red-400',
  idle: 'bg-gray-300',
}

const BADGE_CONFIG: Record<BehaviorBadge, { label: string; className: string }> = {
  struggling: { label: '연속 오답', className: 'bg-red-100 text-red-700 border-red-200' },
  guessing: { label: '찍기 의심', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  star: { label: '우수', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  slow: { label: '시간 부족', className: 'bg-gray-100 text-gray-600 border-gray-200' },
}

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface StudentCardProps {
  student: StudentMonitorData
  isSelected: boolean
  multiSelectMode: boolean
  onToggleSelect: (id: string) => void
  onClick: (student: StudentMonitorData) => void
}

export default function StudentCard({
  student,
  isSelected,
  multiSelectMode,
  onToggleSelect,
  onClick,
}: StudentCardProps) {
  const handleClick = () => {
    if (multiSelectMode) {
      onToggleSelect(student.participantId)
    } else {
      onClick(student)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'relative flex w-full flex-col items-center rounded-xl border bg-white px-2 py-3 text-center transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-blue-500 border-blue-300 bg-blue-50/30',
        student.status === 'disconnected' && 'opacity-50',
      )}
    >
      {/* 다중선택 체크박스 (좌상단) */}
      {multiSelectMode && (
        <div className="absolute top-2 left-2">
          <div
            className={cn(
              'h-4 w-4 rounded border-2 transition-colors',
              isSelected
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300 bg-white',
            )}
          >
            {isSelected && (
              <svg viewBox="0 0 12 12" className="h-full w-full text-white">
                <path
                  d="M3 6l2 2 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* 상태 dot (우상단) */}
      <div className="absolute top-2.5 right-2.5">
        <span className={cn('block h-2.5 w-2.5 rounded-full', STATUS_DOT[student.status])} />
      </div>

      {/* 아바타 */}
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white',
          student.avatarColor,
        )}
      >
        {student.nickname.charAt(0)}
      </div>

      {/* 닉네임 */}
      <span className="mt-1.5 w-full truncate text-xs font-semibold text-gray-900">
        {student.nickname}
      </span>

      {/* 점수 + 정답률 */}
      <div className="mt-0.5 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
        <span className="font-medium">{student.score}점</span>
        <span className="text-gray-300">|</span>
        <span>{student.accuracy}%</span>
      </div>

      {/* 뱃지 */}
      {student.badges.length > 0 && (
        <div className="mt-1.5 flex flex-wrap justify-center gap-1">
          {student.badges.map((badge) => (
            <span
              key={badge}
              className={cn(
                'inline-block rounded-full border px-1.5 py-0 text-[10px] font-semibold leading-4',
                BADGE_CONFIG[badge].className,
              )}
            >
              {BADGE_CONFIG[badge].label}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}

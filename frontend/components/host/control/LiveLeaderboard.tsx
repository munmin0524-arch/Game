'use client'

import { ChevronDown, ChevronUp, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LeaderboardEntry } from '@/types'
import { cn } from '@/lib/utils'

interface LiveLeaderboardProps {
  entries: LeaderboardEntry[]
  visible: boolean
  onToggleVisibility: () => void
}

const RANK_COLORS: Record<number, string> = {
  1: 'bg-yellow-50 border-l-4 border-l-yellow-400',
  2: 'bg-gray-50 border-l-4 border-l-gray-300',
  3: 'bg-amber-50/50 border-l-4 border-l-amber-600',
}

const RANK_BADGE: Record<number, string> = {
  1: 'text-yellow-600',
  2: 'text-gray-500',
  3: 'text-amber-700',
}

export default function LiveLeaderboard({
  entries,
  visible,
  onToggleVisibility,
}: LiveLeaderboardProps) {
  return (
    <div className="border-t">
      {/* 헤더 */}
      <button
        type="button"
        onClick={onToggleVisibility}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            리더보드
          </span>
        </div>
        {visible ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {/* 테이블 */}
      {visible && (
        <div className="max-h-[280px] overflow-y-auto px-2 pb-3">
          <div className="space-y-0.5">
            {entries.map((entry) => (
              <div
                key={entry.participantId}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
                  RANK_COLORS[entry.rank] ?? 'hover:bg-gray-50',
                )}
              >
                {/* 순위 */}
                <span
                  className={cn(
                    'w-6 text-center font-bold tabular-nums',
                    RANK_BADGE[entry.rank] ?? 'text-gray-400',
                  )}
                >
                  {entry.rank}
                </span>

                {/* 닉네임 */}
                <span className="flex-1 truncate font-medium text-gray-800">
                  {entry.nickname}
                </span>

                {/* 점수 */}
                <span className="w-12 text-right font-mono text-xs text-gray-600 tabular-nums">
                  {entry.totalScore}
                </span>

                {/* 정답률 */}
                <span className="w-10 text-right text-xs text-gray-400 tabular-nums">
                  {entry.accuracy}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

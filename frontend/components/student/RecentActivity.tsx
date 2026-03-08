'use client'

import Link from 'next/link'

interface Activity {
  date: string
  gameType: string
  questions: number
  accuracy: number
  result: 'win' | 'lose' | 'finished'
}

interface RecentActivityProps {
  activities: Activity[]
}

const GAME_LABELS: Record<string, { name: string; emoji: string }> = {
  tug_of_war: { name: '줄다리기', emoji: '🪢' },
  boat_racing: { name: '보트레이싱', emoji: '🚤' },
  kickboard_racing: { name: '킥보드', emoji: '🛴' },
  balloon_flying: { name: '풍선 날리기', emoji: '🎈' },
  adaptive: { name: '맞춤형 학습', emoji: '🧠' },
}

const RESULT_LABELS: Record<string, { text: string; color: string }> = {
  win: { text: '승리', color: 'text-blue-600 bg-blue-50' },
  lose: { text: '패배', color: 'text-gray-500 bg-gray-100' },
  finished: { text: '완료', color: 'text-violet-600 bg-violet-50' },
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-soft">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">최근 학습 기록</h3>
        <Link href="/student/lms/history" className="text-[10px] text-blue-500 hover:text-blue-600">
          더보기 →
        </Link>
      </div>

      <div className="space-y-1.5">
        {activities.map((act, i) => {
          const game = GAME_LABELS[act.gameType] || { name: act.gameType, emoji: '🎮' }
          const result = RESULT_LABELS[act.result] || RESULT_LABELS.finished
          return (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2">
              <span className="text-base">{game.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] font-semibold text-gray-900 truncate">{game.name}</p>
                  <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-semibold ${result.color}`}>
                    {result.text}
                  </span>
                </div>
                <p className="text-[9px] text-gray-400">
                  {act.questions}문제 · {act.accuracy}%
                </p>
              </div>
              <span className="text-[9px] text-gray-400 shrink-0">{act.date}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

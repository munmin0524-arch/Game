'use client'

import { useState } from 'react'

interface DayData {
  day: string
  questions: number
  accuracy: number
}

interface WeeklyTrendProps {
  weeklyData: DayData[]
  monthlyData?: DayData[]
}

export function WeeklyTrend({ weeklyData, monthlyData }: WeeklyTrendProps) {
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const data = period === 'week' ? weeklyData : (monthlyData ?? weeklyData)
  const maxQuestions = Math.max(...data.map((d) => d.questions), 1)
  const avgAccuracy = Math.round(data.reduce((s, d) => s + d.accuracy, 0) / data.length)
  const totalQuestions = data.reduce((s, d) => s + d.questions, 0)

  return (
    <div className="rounded-xl bg-white p-3 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-700">학습 트렌드</h3>
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span>총 {totalQuestions}문제</span>
            <span>평균 {avgAccuracy}%</span>
          </div>
        </div>
        <div className="flex gap-0.5 rounded-lg bg-gray-100 p-0.5">
          {(['week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors ${
                period === p
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p === 'week' ? '이번 주' : '이번 달'}
            </button>
          ))}
        </div>
      </div>

      {/* 차트 영역 — 고정 높이 px 기반 */}
      <div className="flex items-end gap-3 h-[140px] px-1">
        {data.map((d, i) => {
          const barHeightPx = Math.max(6, Math.round((d.questions / maxQuestions) * 110))
          const accuracyHeightPx = Math.round(barHeightPx * (d.accuracy / 100))
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              {/* 문제수 라벨 */}
              <span className="text-[10px] font-medium text-gray-600">{d.questions}</span>
              {/* 바 */}
              <div className="w-full flex justify-center">
                <div
                  className="w-8 rounded-t-md bg-blue-100 relative overflow-hidden"
                  style={{ height: `${barHeightPx}px` }}
                >
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-blue-500"
                    style={{ height: `${accuracyHeightPx}px` }}
                  />
                </div>
              </div>
              {/* 정답률 */}
              <span className="text-[9px] font-semibold text-blue-500">{d.accuracy}%</span>
              {/* 요일 라벨 */}
              <span className="text-[10px] text-gray-500">{d.day}</span>
            </div>
          )
        })}
      </div>

      {/* 범례 */}
      <div className="mt-2 flex justify-center gap-4 text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-100" /> 문제 수
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500" /> 정답률
        </span>
      </div>
    </div>
  )
}

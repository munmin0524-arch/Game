'use client'

import { AlertTriangle } from 'lucide-react'
import type { LiveAnalyticsData, QuestionType } from '@/types'
import type { WsQuestionShow } from '@/types'

// ─────────────────────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────────────────────

const CIRCLE_NUMBERS = ['', '\u2460', '\u2461', '\u2462', '\u2463', '\u2464'] as const
const OPTION_COLORS = [
  '',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-purple-500',
] as const

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface LiveAnalyticsProps {
  analytics: LiveAnalyticsData
  question: WsQuestionShow | null
  hintRevealed: boolean
}

export default function LiveAnalytics({
  analytics,
  question,
  hintRevealed,
}: LiveAnalyticsProps) {
  const distributionEntries = Object.entries(analytics.distribution)
  const maxDistCount =
    distributionEntries.length > 0
      ? Math.max(...distributionEntries.map(([, c]) => c))
      : 0

  const answerPct =
    analytics.total > 0 ? Math.round((analytics.answered / analytics.total) * 100) : 0

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* ── Confusion Alert ── */}
      {analytics.isConfusing && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-500" />
          <div className="text-xs">
            <p className="font-semibold text-red-700">이 문항이 어려울 수 있습니다</p>
            <p className="text-red-600 mt-0.5">정답률 40% 미만 - 힌트 공개를 고려해보세요</p>
          </div>
        </div>
      )}

      {/* ── 응답 집계 ── */}
      <div>
        <div className="flex items-end justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            응답 현황
          </span>
          <span className="text-sm font-bold tabular-nums text-gray-800">
            {analytics.answered}/{analytics.total}명
            <span className="ml-1 text-xs font-normal text-gray-400">({answerPct}%)</span>
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${answerPct}%` }}
          />
        </div>
      </div>

      {/* ── 선택 분포 ── */}
      {distributionEntries.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            선택 분포
          </p>
          <div className="space-y-2">
            {distributionEntries.map(([key, count]) => {
              const pct =
                analytics.answered > 0
                  ? Math.round((count / analytics.answered) * 100)
                  : 0
              const barPct =
                maxDistCount > 0 ? Math.round((count / maxDistCount) * 100) : 0
              const idx = Number(key)
              const isNumericOption = !isNaN(idx) && idx >= 1 && idx <= 5

              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-gray-600">
                      {key === 'O' || key === 'X'
                        ? key
                        : isNumericOption
                          ? `${CIRCLE_NUMBERS[idx]} ${question?.question.options?.[idx - 1]?.text ?? ''}`
                          : key}
                    </span>
                    <span className="text-xs tabular-nums text-gray-400">
                      {count}명 ({pct}%)
                    </span>
                  </div>
                  <div className="h-5 w-full rounded bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-500 ${
                        isNumericOption
                          ? OPTION_COLORS[idx] || 'bg-gray-400'
                          : key === 'O'
                            ? 'bg-blue-500'
                            : key === 'X'
                              ? 'bg-rose-500'
                              : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.max(barPct, 3)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── 정답률 추이 ── */}
      {analytics.accuracyTrend.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            정답률 추이
          </p>
          <div className="flex items-end gap-1.5" style={{ height: 80 }}>
            {analytics.accuracyTrend.map((point) => {
              const h = Math.max(point.correctPercent, 5)
              const isLow = point.correctPercent < 40
              return (
                <div
                  key={point.questionIndex}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <span className="text-[10px] tabular-nums text-gray-500">
                    {point.correctPercent}%
                  </span>
                  <div className="w-full flex items-end" style={{ height: 50 }}>
                    <div
                      className={`w-full rounded-t transition-all ${
                        isLow ? 'bg-red-400' : 'bg-blue-400'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">Q{point.questionIndex}</span>
                </div>
              )
            })}
          </div>
          {/* 평균 응답 시간 */}
          {analytics.accuracyTrend.length > 0 && (
            <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
              <span>평균 응답시간</span>
              <span className="tabular-nums">
                {(
                  analytics.accuracyTrend.reduce((s, p) => s + p.avgResponseTimeSec, 0) /
                  analytics.accuracyTrend.length
                ).toFixed(1)}
                초
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

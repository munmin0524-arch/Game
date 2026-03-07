'use client'

import { useMemo } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PerQuestionAnalytics, StudentMonitorData } from '@/types'

interface QuestionAnalyticsPanelProps {
  questions: PerQuestionAnalytics[]
  students: StudentMonitorData[]
  selectedIndex: number
  onSelectedIndexChange: (index: number) => void
}

export default function QuestionAnalyticsPanel({
  questions,
  students,
  selectedIndex,
  onSelectedIndexChange,
}: QuestionAnalyticsPanelProps) {
  if (questions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400 text-sm">
        문항 데이터가 없습니다
      </div>
    )
  }

  const q = questions[selectedIndex]
  if (!q) return null

  const respondedCount = q.totalStudents - q.unansweredCount
  const correctPercent = respondedCount > 0 ? Math.round((q.correctCount / respondedCount) * 100) : 0
  const totalSelections = Object.values(q.distribution).reduce((s, v) => s + v, 0)

  // 선택지별 학생 그룹핑
  const studentsByOption = useMemo(() => {
    const map: Record<string, StudentMonitorData[]> = {}
    const unanswered: StudentMonitorData[] = []

    for (const s of students) {
      const result = s.perQuestionResults[selectedIndex]
      if (!result || result.selectedAnswer === null || result.isSkipped) {
        unanswered.push(s)
      } else {
        const key = result.selectedAnswer
        if (!map[key]) map[key] = []
        map[key].push(s)
      }
    }
    return { map, unanswered }
  }, [students, selectedIndex])

  return (
    <div className="flex h-full flex-col">
      {/* ── 문항 네비게이션 ── */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={selectedIndex === 0}
          onClick={() => onSelectedIndexChange(selectedIndex - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-bold text-gray-800">
          Q{q.questionIndex} / {questions.length}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={selectedIndex === questions.length - 1}
          onClick={() => onSelectedIndexChange(selectedIndex + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── 문항 내용 ── */}
        <div className="border-b px-4 py-4">
          <p className="text-sm font-semibold text-gray-900 leading-relaxed">
            {q.questionContent}
          </p>
          <div className="mt-3 space-y-1.5">
            {q.options.map((opt) => {
              const isCorrect = opt.index === q.correctOptionIndex
              return (
                <div
                  key={opt.index}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
                    isCorrect
                      ? 'bg-green-50 border border-green-200 text-green-800 font-medium'
                      : 'bg-gray-50 text-gray-600',
                  )}
                >
                  <span className={cn(
                    'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500',
                  )}>
                    {opt.index}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                  {isCorrect && <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 응답 통계 요약 ── */}
        <div className="border-b px-4 py-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">응답 현황</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-green-50 px-3 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">정답</span>
              </div>
              <p className="text-lg font-bold text-green-700 tabular-nums">{q.correctCount}</p>
              <p className="text-xs text-green-600 tabular-nums">{correctPercent}%</p>
            </div>
            <div className="rounded-lg bg-red-50 px-3 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                <XCircle className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">오답</span>
              </div>
              <p className="text-lg font-bold text-red-700 tabular-nums">{q.incorrectCount}</p>
              <p className="text-xs text-red-600 tabular-nums">
                {respondedCount > 0 ? Math.round((q.incorrectCount / respondedCount) * 100) : 0}%
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                <HelpCircle className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">미응답</span>
              </div>
              <p className="text-lg font-bold text-gray-600 tabular-nums">{q.unansweredCount}</p>
              <p className="text-xs text-gray-500 tabular-nums">
                {Math.round((q.unansweredCount / q.totalStudents) * 100)}%
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">평균 응답시간: <strong className="text-gray-700">{q.avgResponseTimeSec}초</strong></span>
          </div>
        </div>

        {/* ── 선택지별 분포 + 학생 목록 ── */}
        <div className="px-4 py-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">선택 분포</h3>
          <div className="space-y-3">
            {q.options.map((opt) => {
              const count = q.distribution[String(opt.index)] ?? 0
              const percent = totalSelections > 0 ? Math.round((count / totalSelections) * 100) : 0
              const isCorrect = opt.index === q.correctOptionIndex
              const optStudents = studentsByOption.map[String(opt.index)] ?? []
              return (
                <div key={opt.index}>
                  {/* 바 차트 */}
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'w-5 text-center text-xs font-bold flex-shrink-0',
                      isCorrect ? 'text-green-600' : 'text-gray-400',
                    )}>
                      {opt.index}
                    </span>
                    <div className="flex-1 h-6 rounded-full bg-gray-100 overflow-hidden relative">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          isCorrect ? 'bg-green-400' : 'bg-gray-300',
                        )}
                        style={{ width: `${Math.max(percent, 2)}%` }}
                      />
                      <span className="absolute inset-0 flex items-center px-2.5 text-xs font-medium text-gray-700">
                        {opt.text}
                      </span>
                    </div>
                    <span className={cn(
                      'w-14 text-right text-xs font-semibold tabular-nums flex-shrink-0',
                      isCorrect ? 'text-green-600' : 'text-gray-500',
                    )}>
                      {count}명 ({percent}%)
                    </span>
                  </div>
                  {/* 학생 목록 */}
                  {optStudents.length > 0 && (
                    <div className="ml-8 mt-1.5 flex flex-wrap gap-1">
                      {optStudents.map((s) => (
                        <span
                          key={s.participantId}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                            isCorrect
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-600',
                          )}
                        >
                          <span className={cn(
                            'flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white',
                            s.avatarColor,
                          )}>
                            {s.nickname.charAt(0)}
                          </span>
                          {s.nickname}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* 미응답 학생 */}
          {studentsByOption.unanswered.length > 0 && (
            <div className="mt-4 pt-3 border-t">
              <div className="flex items-center gap-1.5 mb-2">
                <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500">
                  미응답 ({studentsByOption.unanswered.length}명)
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {studentsByOption.unanswered.map((s) => (
                  <span
                    key={s.participantId}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500"
                  >
                    <span className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white',
                      s.avatarColor,
                    )}>
                      {s.nickname.charAt(0)}
                    </span>
                    {s.nickname}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

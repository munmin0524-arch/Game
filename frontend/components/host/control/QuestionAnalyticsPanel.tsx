'use client'

import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  BarChart3,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PerQuestionAnalytics, StudentMonitorData } from '@/types'

/* ── 접이식 섹션 ── */
function Section({
  title,
  icon: Icon,
  defaultOpen = false,
  badge,
  children,
}: {
  title: string
  icon: React.ElementType
  defaultOpen?: boolean
  badge?: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <Icon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex-1">
          {title}
        </span>
        {badge}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-gray-400 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

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
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3 flex-shrink-0">
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
        {/* ── 문항 내용 (항상 표시) ── */}
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

        {/* ── 응답 요약 1줄 (항상 표시) ── */}
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              <span className="font-semibold text-green-700">{q.correctCount}</span>
              <span className="text-gray-400 text-xs">({correctPercent}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5 text-red-400" />
              <span className="font-semibold text-red-600">{q.incorrectCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-semibold text-gray-500">{q.unansweredCount}</span>
            </div>
            <div className="ml-auto flex items-center gap-1 text-gray-400">
              <Clock className="h-3 w-3" />
              <span className="text-xs tabular-nums">{q.avgResponseTimeSec}초</span>
            </div>
          </div>
        </div>

        {/* ── 선택 분포 (접힘) ── */}
        <Section
          title="선택 분포"
          icon={BarChart3}
          badge={
            <span className="text-[10px] text-gray-400 tabular-nums">
              {respondedCount}/{q.totalStudents}명 응답
            </span>
          }
        >
          <div className="space-y-2">
            {q.options.map((opt) => {
              const count = q.distribution[String(opt.index)] ?? 0
              const percent = totalSelections > 0 ? Math.round((count / totalSelections) * 100) : 0
              const isCorrect = opt.index === q.correctOptionIndex
              return (
                <div key={opt.index} className="flex items-center gap-3">
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
              )
            })}
          </div>
        </Section>

        {/* ── 학생별 응답 (접힘) ── */}
        <Section title="학생별 응답" icon={Users}>
          <div className="space-y-3">
            {q.options.map((opt) => {
              const isCorrect = opt.index === q.correctOptionIndex
              const optStudents = studentsByOption.map[String(opt.index)] ?? []
              if (optStudents.length === 0) return null
              return (
                <div key={opt.index}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold',
                      isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500',
                    )}>
                      {opt.index}
                    </span>
                    <span className="text-xs text-gray-500">
                      {opt.text} ({optStudents.length}명)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {optStudents.map((s) => (
                      <span
                        key={s.participantId}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                          isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600',
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
                </div>
              )
            })}

            {studentsByOption.unanswered.length > 0 && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-1.5 mb-1.5">
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
        </Section>
      </div>
    </div>
  )
}

'use client'

import { Clock, Lightbulb, LightbulbOff } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import type { WsQuestionShow, QuestionType } from '@/types'

// ─────────────────────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────────────────────

const CIRCLE_NUMBERS = ['', '\u2460', '\u2461', '\u2462', '\u2463', '\u2464'] as const
const OPTION_LIGHT_COLORS = [
  '',
  'bg-blue-50 border-blue-200 text-blue-700',
  'bg-emerald-50 border-emerald-200 text-emerald-700',
  'bg-amber-50 border-amber-200 text-amber-700',
  'bg-rose-50 border-rose-200 text-rose-700',
  'bg-purple-50 border-purple-200 text-purple-700',
] as const

const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  multiple_choice: '객관식',
  ox: 'O/X',
  unscramble: '어순 배열',
}

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface QuestionPanelProps {
  question: WsQuestionShow | null
  hintRevealed: boolean
  timeRemaining: number
  isPaused: boolean
}

export default function QuestionPanel({
  question,
  hintRevealed,
  timeRemaining,
  isPaused,
}: QuestionPanelProps) {
  const timePct = question
    ? Math.round((timeRemaining / question.timeLimit) * 100)
    : 0
  const isTimeCritical = timeRemaining <= 5

  if (!question) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400 text-sm p-6">
        문항 대기 중...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto">
      {/* 문항 번호 + 유형 */}
      <div className="flex items-center gap-2">
        <span className="rounded bg-gray-900 px-2 py-0.5 text-xs font-bold text-white tabular-nums">
          Q{question.questionIndex}/{question.totalQuestions}
        </span>
        <span className="text-xs text-gray-500">
          {QUESTION_TYPE_LABEL[question.question.type]}
        </span>
      </div>

      {/* 문항 내용 */}
      <div className="rounded-lg border bg-gray-50 p-3">
        <p className="text-sm leading-relaxed text-gray-800 font-medium">
          {question.question.content}
        </p>
      </div>

      {/* 선택지 */}
      {question.question.options && (
        <div className="grid grid-cols-1 gap-1.5">
          {question.question.options.map((opt) => (
            <div
              key={opt.index}
              className={`rounded-lg border px-3 py-2 text-xs ${OPTION_LIGHT_COLORS[opt.index] || 'bg-gray-50 text-gray-700'}`}
            >
              <span className="font-semibold">{CIRCLE_NUMBERS[opt.index]}</span>{' '}
              {opt.text}
            </div>
          ))}
        </div>
      )}

      {/* OX */}
      {question.question.type === 'ox' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-center rounded-lg border-2 border-blue-200 bg-blue-50 py-4 text-2xl font-bold text-blue-600">
            O
          </div>
          <div className="flex items-center justify-center rounded-lg border-2 border-rose-200 bg-rose-50 py-4 text-2xl font-bold text-rose-600">
            X
          </div>
        </div>
      )}

      {/* 어순 배열 */}
      {question.question.type === 'unscramble' && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-4 text-center text-xs text-gray-400">
          학생이 어순을 배열합니다
        </div>
      )}

      {/* 힌트 상태 */}
      {question.question.hint && (
        <div
          className={`rounded-lg border p-2.5 text-xs ${
            hintRevealed
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-gray-200 bg-gray-50 text-gray-400'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            {hintRevealed ? (
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <LightbulbOff className="h-3.5 w-3.5" />
            )}
            <span className="font-medium text-[10px] uppercase tracking-wide">
              {hintRevealed ? '힌트 공개됨' : '힌트 대기'}
            </span>
          </div>
          {hintRevealed ? (
            <p>{question.question.hint}</p>
          ) : (
            <p className="italic">공개 전에는 표시되지 않습니다</p>
          )}
        </div>
      )}

      {/* 타이머 */}
      <div className="mt-auto space-y-2 rounded-lg border bg-gray-50 p-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <Clock className="h-3.5 w-3.5" />
            남은 시간
          </span>
          <span
            className={`font-mono text-xl font-bold tabular-nums transition-colors ${
              isTimeCritical ? 'text-red-600 animate-pulse' : 'text-gray-900'
            }`}
          >
            {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:
            {String(timeRemaining % 60).padStart(2, '0')}
          </span>
        </div>
        <Progress
          value={timePct}
          className={`h-1.5 transition-all ${isTimeCritical ? '[&>div]:bg-red-500' : '[&>div]:bg-blue-500'}`}
        />
        {isPaused && (
          <p className="text-center text-xs text-yellow-600 font-medium animate-pulse">
            일시정지 중
          </p>
        )}
      </div>
    </div>
  )
}

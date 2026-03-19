'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Candy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ------------------------------------------------------------------ */
/* Mock Data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_RESULT = {
  sessionType: 'game' as const, // 'game' | 'recommended' | 'wrong_note'
  gameMode: 'tug_of_war',
  subject: '과학',
  unit: '여러 가지 힘',
  subUnit: '마찰력',
  playedAt: '2026-03-19T14:30:00',
  jellyEarned: 3,
  questions: [
    {
      id: 'q1',
      content: '정지 마찰력과 운동 마찰력 중 큰 것은?',
      options: ['정지 마찰력', '운동 마찰력', '같다', '상황에 따라 다르다'],
      correctIndex: 0,
      selectedIndex: 0,
      isCorrect: true,
      timeSec: 8,
      explanation: null,
    },
    {
      id: 'q2',
      content: '훅의 법칙에서 k는 무엇을 나타내는가?',
      options: ['질량', '탄성 계수', '부피', '밀도'],
      correctIndex: 1,
      selectedIndex: 0,
      isCorrect: false,
      timeSec: 15,
      explanation:
        '훅의 법칙 F=kx에서 k는 용수철의 탄성 계수(단위: N/m)입니다.',
    },
    {
      id: 'q3',
      content: '무게의 단위로 올바른 것은?',
      options: ['kg', 'N', 'm/s', 'J'],
      correctIndex: 1,
      selectedIndex: 1,
      isCorrect: true,
      timeSec: 5,
      explanation: null,
    },
    {
      id: 'q4',
      content: '중력의 방향은?',
      options: ['위쪽', '아래쪽(지구 중심)', '수평 방향', '물체 운동 방향'],
      correctIndex: 1,
      selectedIndex: 1,
      isCorrect: true,
      timeSec: 4,
      explanation: null,
    },
    {
      id: 'q5',
      content: '마찰력의 크기에 영향을 주는 요인이 아닌 것은?',
      options: ['접촉면의 거칠기', '누르는 힘', '접촉면의 넓이', '물체의 무게'],
      correctIndex: 2,
      selectedIndex: 2,
      isCorrect: true,
      timeSec: 10,
      explanation: null,
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const SESSION_TYPE_LABELS: Record<string, string> = {
  game: '🎮 일반 게임',
  recommended: '💡 추천 학습',
  wrong_note: '📖 오답 복습',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${month}월 ${day}일 ${hours}:${minutes}`
}

const CIRCLE_LABELS = ['①', '②', '③', '④', '⑤']

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function GameResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromHistory = searchParams.get('from') === 'history'

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const { questions, jellyEarned, sessionType } = MOCK_RESULT

  const correctCount = questions.filter((q) => q.isCorrect).length
  const incorrectCount = questions.length - correctCount
  const accuracy = Math.round((correctCount / questions.length) * 100)

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  /* Donut chart via conic-gradient */
  const correctDeg = (correctCount / questions.length) * 360
  const donutStyle: React.CSSProperties = {
    background: `conic-gradient(
      #22c55e 0deg ${correctDeg}deg,
      #ef4444 ${correctDeg}deg 360deg
    )`,
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            게임 결과
          </h1>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {SESSION_TYPE_LABELS[sessionType]}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {formatDate(MOCK_RESULT.playedAt)}
        </p>
        <p className="mt-0.5 text-sm text-gray-400">
          {MOCK_RESULT.subject} &gt; {MOCK_RESULT.unit} &gt;{' '}
          {MOCK_RESULT.subUnit}
        </p>
      </div>

      {/* ── Donut Chart ── */}
      <div className="mb-6 flex justify-center">
        <div className="relative h-44 w-44 rounded-full" style={donutStyle}>
          {/* Inner white circle */}
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-white">
            <span className="text-4xl font-black text-gray-900">
              {accuracy}%
            </span>
            <span className="text-xs text-gray-500">정답률</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 flex justify-center gap-6 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-green-500" />
          정답
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
          오답
        </span>
      </div>

      {/* ── 4-stat summary ── */}
      <div className="mb-8 grid grid-cols-4 gap-3">
        {[
          {
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            label: '정답',
            value: correctCount,
          },
          {
            icon: <XCircle className="h-5 w-5 text-red-500" />,
            label: '오답',
            value: incorrectCount,
          },
          {
            icon: <BookOpen className="h-5 w-5 text-blue-500" />,
            label: '총문제',
            value: questions.length,
          },
          {
            icon: <Candy className="h-5 w-5 text-amber-500" />,
            label: '젤리',
            value: `+${jellyEarned}`,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center rounded-xl bg-white p-3 shadow-sm"
          >
            {s.icon}
            <span className="mt-1 text-lg font-bold text-gray-900">
              {s.value}
            </span>
            <span className="text-[11px] text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── 문항별 결과 ── */}
      <h2 className="mb-3 text-lg font-bold text-gray-900">문항별 결과</h2>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const expanded = expandedIds.has(q.id)
          return (
            <div
              key={q.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              {/* Question header */}
              <div className="flex items-start gap-2">
                {q.isCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                )}
                <p className="text-sm font-medium text-gray-900">
                  <span className="mr-1 text-gray-400">Q{idx + 1}.</span>
                  {q.content}
                </p>
              </div>

              {/* Options */}
              <ul className="mt-3 space-y-1.5 pl-7 text-sm">
                {q.options.map((opt, oi) => {
                  const isCorrectOpt = oi === q.correctIndex
                  const isSelected = oi === q.selectedIndex
                  let optClass = 'text-gray-600'
                  let suffix = ''
                  if (isCorrectOpt) {
                    optClass = 'text-green-600 font-semibold'
                    suffix = ' ✅'
                  }
                  if (isSelected && !q.isCorrect && !isCorrectOpt) {
                    optClass = 'text-red-500 line-through'
                    suffix = ' ❌'
                  }
                  return (
                    <li key={oi} className={optClass}>
                      {CIRCLE_LABELS[oi]} {opt}
                      {suffix}
                    </li>
                  )
                })}
              </ul>

              {/* Meta */}
              <div className="mt-3 flex items-center gap-4 pl-7 text-xs text-gray-400">
                <span>내 선택: {CIRCLE_LABELS[q.selectedIndex]}</span>
                <span className="flex items-center gap-0.5">
                  <Clock className="h-3.5 w-3.5" />
                  소요시간: {q.timeSec}초
                </span>
              </div>

              {/* Explanation toggle (wrong answers only) */}
              {!q.isCorrect && q.explanation && (
                <div className="mt-3 pl-7">
                  <button
                    onClick={() => toggleExpand(q.id)}
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    {expanded ? (
                      <>
                        해설 닫기 <ChevronUp className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        해설 보기 <ChevronDown className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                  {expanded && (
                    <div className="mt-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                      {q.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Action Buttons ── */}
      {!fromHistory && (
        <div className="mt-8 space-y-3">
          {incorrectCount > 0 && (
            <Button
              className="w-full h-12 rounded-xl bg-red-500 hover:bg-red-600 text-base font-semibold"
              onClick={() => {
                // TODO: navigate to retry wrong questions
              }}
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              틀린 문제 다시 풀기
            </Button>
          )}

          <p className="text-center text-sm text-gray-500">
            <BookOpen className="mr-1 inline h-4 w-4" />
            오답노트에 자동 추가됨 ✅
          </p>

          <Button
            variant="outline"
            className="w-full h-12 rounded-xl text-base font-semibold"
            onClick={() => router.push('/student')}
          >
            <Candy className="mr-2 h-5 w-5 text-amber-500" />
            곰젤리 +{jellyEarned} 획득!
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}

// 문항 미리보기 (읽기전용) — 메인 플로우
// 세트 선택 후 문항 확인 → 게임 설정으로 이동

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Circle, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { questionSetsApi } from '@/lib/api'
import type { Question, QuestionSet } from '@/types'

// ─── Mock 데이터 ───

const MOCK_QUESTIONS: Question[] = [
  {
    question_id: 'q1', set_id: 'mock-s-01', type: 'multiple_choice', order_index: 1,
    content: '다음 중 정수가 아닌 것은?',
    options: [{ index: 1, text: '-3' }, { index: 2, text: '0' }, { index: 3, text: '2.5' }, { index: 4, text: '7' }],
    answer: '3', hint: '정수는 소수점이 없는 수입니다.', explanation: '2.5는 유리수이지만 정수는 아닙니다.',
    media_url: null, created_at: '2026-03-01T10:00:00Z',
  },
  {
    question_id: 'q2', set_id: 'mock-s-01', type: 'ox', order_index: 2,
    content: '0은 자연수이다.',
    options: null,
    answer: 'X', hint: '자연수는 1부터 시작합니다.', explanation: '0은 정수이지만 자연수에는 포함되지 않습니다.',
    media_url: null, created_at: '2026-03-01T10:01:00Z',
  },
  {
    question_id: 'q3', set_id: 'mock-s-01', type: 'multiple_choice', order_index: 3,
    content: '(-3) + 5의 값은?',
    options: [{ index: 1, text: '-8' }, { index: 2, text: '-2' }, { index: 3, text: '2' }, { index: 4, text: '8' }],
    answer: '3', hint: '부호가 다른 두 수의 덧셈을 생각해보세요.', explanation: '(-3) + 5 = 5 - 3 = 2',
    media_url: null, created_at: '2026-03-01T10:02:00Z',
  },
  {
    question_id: 'q4', set_id: 'mock-s-01', type: 'multiple_choice', order_index: 4,
    content: '다음 중 절댓값이 가장 큰 수는?',
    options: [{ index: 1, text: '3' }, { index: 2, text: '-5' }, { index: 3, text: '4' }, { index: 4, text: '-2' }],
    answer: '2', hint: '절댓값은 수직선에서 0까지의 거리입니다.', explanation: '|-5| = 5로 가장 큽니다.',
    media_url: null, created_at: '2026-03-01T10:03:00Z',
  },
  {
    question_id: 'q5', set_id: 'mock-s-01', type: 'ox', order_index: 5,
    content: '음수끼리의 곱은 항상 양수이다.',
    options: null,
    answer: 'O', hint: '부호 규칙을 떠올려보세요.', explanation: '음수 × 음수 = 양수',
    media_url: null, created_at: '2026-03-01T10:04:00Z',
  },
]

const MOCK_SET: QuestionSet & { questions: Question[] } = {
  set_id: 'mock-s-01', host_member_id: 'me', title: '중1 정수와 유리수 단원평가',
  subject: '수학', grade: '중1-1학기', tags: ['정수', '유리수'], is_deleted: false,
  is_shared: false, original_set_id: null, question_count: 5,
  created_at: '2026-03-01T10:00:00Z', updated_at: '2026-03-10T14:30:00Z',
  questions: MOCK_QUESTIONS,
}

// ─── 유형 라벨 ───

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: '객관식',
  ox: 'OX',
  unscramble: '단답형',
}

export default function PreviewPage() {
  const { setId } = useParams<{ setId: string }>()
  const router = useRouter()

  const [set, setSet] = useState<(QuestionSet & { questions: Question[] }) | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    questionSetsApi.get(setId)
      .then(setSet)
      .catch(() => setSet(MOCK_SET))
      .finally(() => setLoading(false))
  }, [setId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
      </div>
    )
  }

  if (!set || set.questions.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">문항이 없습니다.</p>
        <Button variant="outline" onClick={() => router.push('/select')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          세트 선택으로
        </Button>
      </div>
    )
  }

  const questions = set.questions.sort((a, b) => a.order_index - b.order_index)
  const q = questions[currentIdx]
  const total = questions.length

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 세트 정보 */}
      <div>
        <h1 className="text-xl font-bold">{set.title}</h1>
        <div className="flex items-center gap-2 mt-1">
          {set.subject && <Badge variant="secondary" className="text-xs">{set.subject}</Badge>}
          {set.grade && <Badge variant="outline" className="text-xs">{set.grade}</Badge>}
          <span className="text-sm text-gray-400">{total}문항</span>
        </div>
      </div>

      {/* 문항 네비게이션 인디케이터 */}
      <div className="flex items-center justify-center gap-1.5">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`h-2 rounded-full transition-all ${
              i === currentIdx ? 'w-6 bg-blue-500' : 'w-2 bg-gray-200 hover:bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* 문항 카드 */}
      <div className="rounded-2xl border bg-white p-6 shadow-soft space-y-5">
        {/* 문항 헤더 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-blue-600">
            Q{currentIdx + 1} / {total}
          </span>
          <Badge variant="secondary" className="text-xs">
            {TYPE_LABELS[q.type] ?? q.type}
          </Badge>
        </div>

        {/* 문항 내용 */}
        <p className="text-lg font-medium leading-relaxed">{q.content}</p>

        {/* 보기 (객관식) */}
        {q.type === 'multiple_choice' && q.options && (
          <div className="space-y-2">
            {q.options.map((opt) => {
              const isAnswer = String(opt.index) === q.answer
              return (
                <div
                  key={opt.index}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                    isAnswer
                      ? 'border-green-300 bg-green-50 text-green-800'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {isAnswer ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-300 shrink-0" />
                  )}
                  <span>{opt.text}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* OX 표시 */}
        {q.type === 'ox' && (
          <div className="flex gap-4">
            {['O', 'X'].map((v) => (
              <div
                key={v}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 py-4 text-xl font-bold ${
                  q.answer === v
                    ? v === 'O'
                      ? 'border-blue-400 bg-blue-50 text-blue-600'
                      : 'border-red-400 bg-red-50 text-red-600'
                    : 'border-gray-200 text-gray-300'
                }`}
              >
                {v === 'O' ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <XCircle className="h-6 w-6" />
                )}
                {v}
              </div>
            ))}
          </div>
        )}

        {/* 해설 */}
        {q.explanation && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-xs font-semibold text-amber-700 mb-1">해설</p>
            <p className="text-sm text-amber-900">{q.explanation}</p>
          </div>
        )}

        {/* 힌트 */}
        {q.hint && (
          <p className="text-xs text-gray-400">
            💡 힌트: {q.hint}
          </p>
        )}
      </div>

      {/* 이전/다음 네비 */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((i) => i - 1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          이전
        </Button>

        <span className="text-sm text-gray-400">
          {currentIdx + 1} / {total}
        </span>

        <Button
          variant="outline"
          disabled={currentIdx === total - 1}
          onClick={() => setCurrentIdx((i) => i + 1)}
        >
          다음
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* 하단 고정 바 */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="ghost" onClick={() => router.push('/select')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          세트 선택
        </Button>
        <Button onClick={() => router.push(`/select/${setId}/settings`)}>
          게임 설정으로
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

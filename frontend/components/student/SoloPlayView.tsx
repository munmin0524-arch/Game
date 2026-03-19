'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface Question {
  id: string
  content: string
  type: 'multiple_choice' | 'ox'
  options: string[]
  correctIndex: number
  explanation: string | null
}

interface QuestionResult {
  questionId: string
  selectedIndex: number
  isCorrect: boolean
}

interface SoloPlayViewProps {
  questions: Question[]
  onComplete: (results: QuestionResult[]) => void
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

type Phase = 'answering' | 'revealed'

export default function SoloPlayView({
  questions,
  onComplete,
}: SoloPlayViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('answering')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [results, setResults] = useState<QuestionResult[]>([])

  const question = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const progress = ((currentIndex + (phase === 'revealed' ? 1 : 0)) / questions.length) * 100

  /* Handle option selection */
  const handleSelect = (optIndex: number) => {
    if (phase !== 'answering') return
    setSelectedIndex(optIndex)

    const isCorrect = optIndex === question.correctIndex
    setResults((prev) => [
      ...prev,
      { questionId: question.id, selectedIndex: optIndex, isCorrect },
    ])
    setPhase('revealed')
  }

  /* Handle next / complete */
  const handleNext = () => {
    if (isLast) {
      onComplete(results)
      return
    }
    setCurrentIndex((i) => i + 1)
    setPhase('answering')
    setSelectedIndex(null)
  }

  /* Option styling */
  const getOptionClasses = (optIndex: number) => {
    const base =
      'w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors'

    if (phase === 'answering') {
      return `${base} border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 text-gray-900 cursor-pointer`
    }

    // revealed state
    const isCorrectOpt = optIndex === question.correctIndex
    const isSelectedOpt = optIndex === selectedIndex

    if (isCorrectOpt) {
      return `${base} border-green-500 bg-green-50 text-green-800`
    }
    if (isSelectedOpt && !isCorrectOpt) {
      return `${base} border-red-500 bg-red-50 text-red-800`
    }
    return `${base} border-gray-100 bg-gray-50 text-gray-400`
  }

  const isCorrectAnswer = selectedIndex === question.correctIndex

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col px-4 py-6">
      {/* ── Progress ── */}
      <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
        <span className="font-medium">
          문항 {currentIndex + 1}/{questions.length}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Question ── */}
      <div className="mb-6 flex-1">
        <h2 className="text-lg font-bold text-gray-900">{question.content}</h2>

        {/* Options */}
        <div className="mt-6 space-y-3">
          {question.options.map((opt, oi) => (
            <button
              key={oi}
              disabled={phase === 'revealed'}
              onClick={() => handleSelect(oi)}
              className={getOptionClasses(oi)}
            >
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                {question.type === 'ox'
                  ? oi === 0
                    ? 'O'
                    : 'X'
                  : oi + 1}
              </span>
              {opt}

              {/* Icons in revealed state */}
              {phase === 'revealed' && oi === question.correctIndex && (
                <CheckCircle2 className="ml-auto inline h-5 w-5 text-green-500" />
              )}
              {phase === 'revealed' &&
                oi === selectedIndex &&
                oi !== question.correctIndex && (
                  <XCircle className="ml-auto inline h-5 w-5 text-red-500" />
                )}
            </button>
          ))}
        </div>

        {/* Feedback + Explanation */}
        {phase === 'revealed' && (
          <div className="mt-6">
            {/* Correct / Incorrect banner */}
            {isCorrectAnswer ? (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">정답입니다!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-red-800">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">오답입니다</span>
              </div>
            )}

            {/* Explanation */}
            {question.explanation && (
              <div className="mt-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                <div className="mb-1 flex items-center gap-1 font-semibold">
                  <BookOpen className="h-4 w-4" />
                  해설
                </div>
                {question.explanation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Next button ── */}
      {phase === 'revealed' && (
        <Button
          onClick={handleNext}
          className="h-12 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-semibold"
        >
          {isLast ? '결과 보기' : '다음 문항'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

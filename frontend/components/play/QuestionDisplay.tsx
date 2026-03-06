// QuestionDisplay — 문항 표시 컴포넌트
// S-06 플레이 화면에서 사용

'use client'

import { Input } from '@/components/ui/input'
import type { QuestionOption, QuestionType } from '@/types'

const OPTION_LABELS = ['①', '②', '③', '④', '⑤']

interface QuestionDisplayProps {
  type: QuestionType
  content: string
  options: QuestionOption[] | null
  selectedAnswer: string | null
  shortAnswerValue: string
  submitted: boolean
  onSelectAnswer: (answer: string) => void
  onShortAnswerChange: (value: string) => void
  onShortAnswerSubmit: () => void
}

export function QuestionDisplay({
  type,
  content,
  options,
  selectedAnswer,
  shortAnswerValue,
  submitted,
  onSelectAnswer,
  onShortAnswerChange,
  onShortAnswerSubmit,
}: QuestionDisplayProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 문항 내용 */}
      <h2 className="text-xl font-semibold text-white leading-relaxed">{content}</h2>

      {/* 객관식 */}
      {type === 'multiple_choice' && options && (
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => {
            const val = String(opt.index)
            const isSelected = selectedAnswer === val
            return (
              <button
                key={opt.index}
                onClick={() => onSelectAnswer(val)}
                disabled={submitted}
                className={`rounded-xl border-2 p-4 text-left transition-all active:scale-95
                  ${
                    isSelected
                      ? 'border-blue-400 bg-blue-500/30 text-white'
                      : 'border-white/20 bg-white/10 text-gray-200 hover:border-white/40 hover:bg-white/20'
                  }
                  ${submitted && !isSelected ? 'opacity-40' : ''}
                  disabled:cursor-not-allowed
                `}
              >
                <span className="text-sm font-bold text-blue-300 mr-2">
                  {OPTION_LABELS[opt.index - 1] ?? opt.index}
                </span>
                {opt.text}
              </button>
            )
          })}
        </div>
      )}

      {/* OX */}
      {type === 'ox' && (
        <div className="grid grid-cols-2 gap-4">
          {(['O', 'X'] as const).map((val) => {
            const isSelected = selectedAnswer === val
            return (
              <button
                key={val}
                onClick={() => onSelectAnswer(val)}
                disabled={submitted}
                className={`rounded-2xl border-2 py-10 text-6xl font-bold transition-all active:scale-95
                  ${
                    isSelected
                      ? val === 'O'
                        ? 'border-blue-400 bg-blue-500/30 text-blue-300'
                        : 'border-red-400 bg-red-500/30 text-red-300'
                      : 'border-white/20 bg-white/10 text-white/80 hover:border-white/40 hover:bg-white/20'
                  }
                  ${submitted && !isSelected ? 'opacity-40' : ''}
                  disabled:cursor-not-allowed
                `}
              >
                {val}
              </button>
            )
          })}
        </div>
      )}

      {/* 단답형 */}
      {type === 'short_answer' && (
        <Input
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-lg h-12"
          placeholder="답을 입력하세요"
          value={shortAnswerValue}
          onChange={(e) => onShortAnswerChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onShortAnswerSubmit()}
          disabled={submitted}
        />
      )}
    </div>
  )
}

// QuestionPreview — 학생 시점 문항 미리보기
// 에디터 미리보기 모드 + 퀴즈 광장 뷰어에서 공용

'use client'

import { Badge } from '@/components/ui/badge'
import type { Question, QuestionType } from '@/types'

const OPTION_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-green-500',
  'bg-orange-500',
]

const TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: '객관식',
  ox: 'OX',
  unscramble: '단어 배열',
}

interface QuestionPreviewProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  compact?: boolean
}

export function QuestionPreview({
  question,
  questionIndex,
  totalQuestions,
  compact = false,
}: QuestionPreviewProps) {
  // 빈칸 채우기: ___ 을 하이라이트로 렌더링
  const renderContentWithBlanks = (content: string) => {
    const parts = content.split(/(_{3,})/)
    let blankIdx = 0
    return parts.map((part, i) => {
      if (/^_{3,}$/.test(part)) {
        blankIdx++
        return (
          <span
            key={i}
            className="inline-block min-w-[80px] border-b-2 border-blue-400 bg-blue-50 px-2 py-0.5 mx-1 text-blue-500 font-medium text-center"
          >
            빈칸 {blankIdx}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className={`flex flex-col ${compact ? 'gap-3 p-4' : 'gap-5 p-6'}`}>
      {/* 상단 진행 표시 */}
      <div className="flex items-center justify-between">
        <span className={`font-bold text-gray-700 ${compact ? 'text-sm' : 'text-base'}`}>
          Q{questionIndex + 1} / {totalQuestions}
        </span>
        <Badge variant="secondary" className="rounded-full text-xs">
          {TYPE_LABELS[question.type] ?? question.type}
        </Badge>
      </div>

      {/* 문제 텍스트 */}
      <div className={`bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl text-white ${compact ? 'p-4' : 'p-6'}`}>
        <p className={`font-semibold leading-relaxed ${compact ? 'text-sm' : 'text-lg'}`}>
          {question.content || '(문제 내용 없음)'}
        </p>
      </div>

      {/* 이미지 */}
      {question.media_url && (
        <div className="flex justify-center">
          <img
            src={question.media_url}
            alt="문제 이미지"
            className="max-h-48 rounded-xl object-contain"
          />
        </div>
      )}

      {/* 유형별 선택지 */}
      {question.type === 'multiple_choice' && question.options && (
        <div className={`grid ${question.options.length <= 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-3`}>
          {question.options.map((opt, i) => (
            <button
              key={opt.index}
              className={`${OPTION_COLORS[i % OPTION_COLORS.length]} rounded-xl text-white font-semibold text-center transition-transform hover:scale-[1.02] ${
                compact ? 'py-4 text-sm' : 'py-6 text-base'
              }`}
            >
              {opt.text || `보기 ${opt.index}`}
            </button>
          ))}
        </div>
      )}

      {question.type === 'ox' && (
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-blue-500 rounded-xl text-white font-bold text-3xl py-8 hover:scale-[1.02] transition-transform">
            O
          </button>
          <button className="bg-red-500 rounded-xl text-white font-bold text-3xl py-8 hover:scale-[1.02] transition-transform">
            X
          </button>
        </div>
      )}

      {question.type === 'unscramble' && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500">단어를 올바른 순서로 배열하세요</p>
        </div>
      )}

      {/* 힌트 */}
      {question.hint && (
        <div className={`bg-amber-50 border border-amber-200 rounded-xl ${compact ? 'p-3 text-xs' : 'p-4 text-sm'} text-amber-700`}>
          <span className="font-semibold">힌트:</span> {question.hint}
        </div>
      )}
    </div>
  )
}

// 오답노트 카드 — 단일 오답 문항 표시 컴포넌트
'use client'

import { useState } from 'react'
import { BookOpen, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface WrongNoteCardProps {
  questionContent: string
  myAnswer: string
  correctAnswer: string
  subject: string
  unit: string
  explanation?: string
  onReview?: () => void
}

export function WrongNoteCard({
  questionContent,
  myAnswer,
  correctAnswer,
  subject,
  unit,
  explanation,
  onReview,
}: WrongNoteCardProps) {
  const [showExplanation, setShowExplanation] = useState(false)

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      {/* 과목 > 단원 */}
      <p className="text-xs text-gray-400">
        {subject} &gt; {unit}
      </p>

      {/* 문제 내용 (2줄 말줄임) */}
      <p className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2">{questionContent}</p>

      {/* 내 답 → 정답 */}
      <div className="mt-3 flex items-center gap-1 text-sm">
        <span className="text-gray-500">내 답:</span>
        <span className="font-medium text-red-500">{myAnswer}</span>
        <span className="mx-1 text-gray-300">&rarr;</span>
        <span className="text-gray-500">정답:</span>
        <span className="font-medium text-green-600">{correctAnswer}</span>
      </div>

      {/* 버튼 영역 */}
      <div className="mt-4 flex gap-2">
        {explanation && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExplanation((prev) => !prev)}
            className="flex-1"
          >
            <BookOpen className="mr-1.5 h-4 w-4" />
            해설보기
            {showExplanation ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </Button>
        )}
        <Button size="sm" onClick={onReview} className="flex-1">
          <RotateCcw className="mr-1.5 h-4 w-4" />
          다시풀기
        </Button>
      </div>

      {/* 해설 패널 (슬라이드 토글) */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          showExplanation ? 'mt-3 max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">{explanation}</div>
      </div>
    </div>
  )
}

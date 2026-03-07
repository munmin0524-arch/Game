// QuestionTemplateCard — 문항 유형 템플릿 미니 프리뷰 카드
// 에디터에서 문항 추가 시 유형 선택용

'use client'

import type { QuestionType } from '@/types'

export interface QuestionTemplate {
  id: string
  label: string
  type: QuestionType
  optionCount: number // MC: 2/4/5, OX/단답: 0
}

export const QUESTION_TEMPLATES: QuestionTemplate[] = [
  { id: 'mc2', label: '객관식 2지선다', type: 'multiple_choice', optionCount: 2 },
  { id: 'mc4', label: '객관식 4지선다', type: 'multiple_choice', optionCount: 4 },
  { id: 'ox', label: 'OX 퀴즈', type: 'ox', optionCount: 0 },
  { id: 'mc5', label: '객관식 5지선다', type: 'multiple_choice', optionCount: 5 },
  { id: 'unscramble', label: '단어 배열', type: 'unscramble', optionCount: 0 },
]

// 미니 프리뷰 — 스크린샷 기반 컬러 블록
function MC2Preview() {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-3 rounded-sm bg-green-700" />
      <div className="flex gap-1">
        <div className="flex-1 h-10 rounded-sm bg-blue-600" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex-1 rounded-sm bg-blue-400" />
          <div className="flex-1 rounded-sm bg-green-400" />
        </div>
      </div>
    </div>
  )
}

function ShortAnswerPreview() {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-3 rounded-sm bg-green-700" />
      <div className="h-6 rounded-sm bg-blue-600" />
      <div className="h-3 rounded-sm bg-green-400" />
      <div className="h-3 rounded-sm bg-orange-400" />
    </div>
  )
}

function MC4Preview() {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-3 rounded-sm bg-green-700" />
      <div className="grid grid-cols-2 gap-1">
        <div className="h-6 rounded-sm bg-blue-400" />
        <div className="h-6 rounded-sm bg-purple-400" />
        <div className="h-6 rounded-sm bg-red-400" />
        <div className="h-6 rounded-sm bg-green-400" />
      </div>
    </div>
  )
}

function OXPreview() {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-3 rounded-sm bg-green-700" />
      <div className="h-6 rounded-sm bg-blue-600" />
      <div className="flex gap-2 justify-center pt-1">
        <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-bold">O</div>
        <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold">X</div>
      </div>
    </div>
  )
}

function MC5Preview() {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="h-3 rounded-sm bg-green-700" />
      <div className="h-3 rounded-sm bg-blue-400" />
      <div className="h-3 rounded-sm bg-purple-400" />
      <div className="h-3 rounded-sm bg-red-400" />
      <div className="h-3 rounded-sm bg-green-400" />
      <div className="h-3 rounded-sm bg-orange-400" />
    </div>
  )
}

function FillBlankPreview() {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-3 rounded-sm bg-green-700" />
      <div className="flex gap-1 items-center">
        <div className="h-3 flex-1 rounded-sm bg-gray-300" />
        <div className="h-4 w-8 rounded-sm bg-blue-400 border-b-2 border-blue-600" />
        <div className="h-3 flex-1 rounded-sm bg-gray-300" />
      </div>
      <div className="h-3 rounded-sm bg-orange-400" />
    </div>
  )
}

const PREVIEW_MAP: Record<string, () => JSX.Element> = {
  mc2: MC2Preview,
  short: ShortAnswerPreview,
  mc4: MC4Preview,
  ox: OXPreview,
  mc5: MC5Preview,
  fill: FillBlankPreview,
}

interface QuestionTemplateCardProps {
  template: QuestionTemplate
  onClick: () => void
}

export function QuestionTemplateCard({ template, onClick }: QuestionTemplateCardProps) {
  const Preview = PREVIEW_MAP[template.id]

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-stretch rounded-2xl border-2 border-gray-200 bg-white p-3 hover:border-blue-400 hover:shadow-card transition-all cursor-pointer group w-full"
    >
      <div className="bg-gray-50 rounded-xl p-2.5 mb-2">
        <Preview />
      </div>
      <p className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 text-center">
        {template.label}
      </p>
    </button>
  )
}

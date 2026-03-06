// QuestionSetCard — 세트지 카드 (대시보드 최근 세트지)
// S-01 대시보드에서 사용

'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { FileText, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { QuestionSet } from '@/types'

interface QuestionSetCardProps {
  questionSet?: QuestionSet
  set?: QuestionSet
}

const CARD_GRADIENTS = [
  'from-blue-500 to-cyan-400',
  'from-violet-500 to-purple-400',
  'from-rose-400 to-orange-300',
  'from-emerald-500 to-teal-400',
  'from-amber-400 to-yellow-300',
]

export function QuestionSetCard({ questionSet, set }: QuestionSetCardProps) {
  const qs = questionSet ?? set!
  const router = useRouter()
  const updatedAgo = formatDistanceToNow(new Date(qs.updated_at), {
    addSuffix: true,
    locale: ko,
  })

  // 카드별 고유 그라데이션 (set_id 해시 기반)
  const gradientIdx = qs.set_id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % CARD_GRADIENTS.length
  const gradient = CARD_GRADIENTS[gradientIdx]

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all cursor-pointer min-w-[160px]"
      onClick={() => router.push(`/sets/${qs.set_id}/edit`)}
    >
      {/* 상단 그라데이션 영역 */}
      <div className={`bg-gradient-to-br ${gradient} px-5 pt-5 pb-8`}>
        <p className="font-bold text-white text-sm leading-snug line-clamp-2">
          {qs.title}
        </p>
      </div>

      {/* 하단 정보 영역 */}
      <div className="bg-white px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {qs.subject && (
            <Badge variant="secondary" className="rounded-full text-[11px] px-2 py-0">
              {qs.subject}
            </Badge>
          )}
          <span className="text-xs text-gray-400">
            {qs.question_count ?? 0}문항
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-gray-500 hover:text-blue-600 px-2"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/sets/${qs.set_id}/deploy`)
          }}
        >
          <Zap className="mr-1 h-3 w-3" />
          배포
        </Button>
      </div>
    </div>
  )
}

// 스켈레톤 (로딩 상태)
export function QuestionSetCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden min-w-[160px] animate-pulse">
      <div className="h-20 bg-gray-200" />
      <div className="bg-white px-5 py-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
}

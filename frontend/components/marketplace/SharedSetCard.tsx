// SharedSetCard — 마켓플레이스 공유 세트 카드
// S-M01 홈, S-M02 검색 결과에서 사용

'use client'

import { useRouter } from 'next/navigation'
import { Heart, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BookmarkButton } from './BookmarkButton'
import { CertifiedBadge } from './CertifiedBadge'
import { StarRating } from './StarRating'
import type { SharedSet } from '@/types'

interface SharedSetCardProps {
  sharedSet: SharedSet
}

const CARD_GRADIENTS = [
  'from-blue-500 to-cyan-400',
  'from-violet-500 to-purple-400',
  'from-rose-400 to-orange-300',
  'from-emerald-500 to-teal-400',
  'from-amber-400 to-yellow-300',
  'from-pink-500 to-rose-400',
]

export function SharedSetCard({ sharedSet }: SharedSetCardProps) {
  const router = useRouter()
  const gradientIdx =
    sharedSet.shared_set_id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) %
    CARD_GRADIENTS.length
  const gradient = CARD_GRADIENTS[gradientIdx]

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all cursor-pointer"
      onClick={() => router.push(`/marketplace/${sharedSet.shared_set_id}`)}
    >
      {/* 상단 그라데이션 영역 */}
      <div className={`bg-gradient-to-br ${gradient} px-5 pt-5 pb-8 relative`}>
        <p className="font-bold text-white text-sm leading-snug line-clamp-2 pr-8">
          {sharedSet.title}
        </p>
        <p className="text-white/70 text-xs mt-1">
          {sharedSet.question_count}문항
        </p>
        <div className="absolute top-2 right-2">
          <BookmarkButton bookmarked={sharedSet.is_bookmarked ?? false} />
        </div>
      </div>

      {/* 하단 정보 영역 */}
      <div className="bg-white px-5 py-3 space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="secondary" className="rounded-full text-[11px] px-2 py-0">
            {sharedSet.subject}
          </Badge>
          <Badge variant="outline" className="rounded-full text-[11px] px-2 py-0">
            {sharedSet.grade}
          </Badge>
          {sharedSet.avg_rating != null && sharedSet.avg_rating > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] text-amber-500 font-medium">
              <StarRating rating={sharedSet.avg_rating} />
              {sharedSet.avg_rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span
            className="text-xs text-gray-400 truncate hover:text-blue-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/marketplace/creator/${sharedSet.host_member_id}`)
            }}
          >
            by {sharedSet.host_nickname ?? '교사'}
            {sharedSet.is_certified && <> <CertifiedBadge /></>}
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-0.5">
              <Heart className="h-3 w-3" />
              {sharedSet.like_count}
            </span>
            <span className="flex items-center gap-0.5">
              <Download className="h-3 w-3" />
              {sharedSet.download_count}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SharedSetCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden animate-pulse">
      <div className="h-24 bg-gray-200" />
      <div className="bg-white px-5 py-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  )
}

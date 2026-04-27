'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QuizCard } from '@/components/common/QuizCard'
import type { QuestionSet } from '@/types'
import type { SetBadgeKind } from '@/components/common/SetBadge'

export interface CarouselRowProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  items: QuestionSet[]
  onPreview: (setId: string) => void
  onQuickStart: (setId: string) => void
  seenIds: Set<string>
  getBadges?: (s: QuestionSet) => SetBadgeKind[]
  onDismiss?: () => void
}

export function SetsCarouselRow({
  title,
  subtitle,
  icon,
  items,
  onPreview,
  onQuickStart,
  seenIds,
  getBadges,
  onDismiss,
}: CarouselRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateArrows()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [items.length])

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 300), behavior: 'smooth' })
  }

  if (items.length === 0) return null

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            {icon}
            {title}
          </h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{items.length}개</span>
          {onDismiss && (
            <button
              onClick={onDismiss}
              aria-label="이 섹션 숨기기"
              className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="relative group">
        {/* 왼쪽 페이드 + 버튼 */}
        {canLeft && (
          <>
            <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-r from-[#F8F9FB] to-transparent z-10" />
            <button
              onClick={() => scrollBy(-1)}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white shadow-lg ring-1 ring-gray-200 opacity-0 group-hover:opacity-100 hover:bg-gray-50 transition"
              aria-label="이전"
            >
              <ChevronLeft className="h-4 w-4 mx-auto text-gray-600" />
            </button>
          </>
        )}

        {/* 오른쪽 페이드 + 버튼 */}
        {canRight && (
          <>
            <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-[#F8F9FB] to-transparent z-10" />
            <button
              onClick={() => scrollBy(1)}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white shadow-lg ring-1 ring-gray-200 opacity-0 group-hover:opacity-100 hover:bg-gray-50 transition"
              aria-label="다음"
            >
              <ChevronRight className="h-4 w-4 mx-auto text-gray-600" />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className={cn(
            'flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          )}
        >
          {items.map((s) => (
            <div key={s.set_id} className="snap-start shrink-0 w-[200px] sm:w-[220px]">
              <QuizCard
                id={s.set_id}
                title={s.title}
                questionCount={s.question_count ?? 0}
                subject={s.subject}
                grade={s.grade}
                textbook={s.textbook}
                theme={s.theme}
                difficulty={s.difficulty}
                playCount={s.play_count}
                avgRating={s.rating_avg}
                badges={getBadges?.(s)}
                hostNickname={s.source === 'community' ? s.host_nickname : undefined}
                isCertified={s.is_certified}
                likeCount={s.like_count}
                thumbnailVariant={s.thumbnail_variant}
                seen={seenIds.has(s.set_id)}
                overlayMode="hover"
                pathPreview={s.description}
                onPreview={() => onPreview(s.set_id)}
                onQuickStart={() => onQuickStart(s.set_id)}
                onClick={() => onPreview(s.set_id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

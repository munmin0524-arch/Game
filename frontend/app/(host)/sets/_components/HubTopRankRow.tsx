'use client'

// Top 10 랭킹 row — 넷플릭스 "오늘의 Top 10" 스타일
// 숫자를 카드 왼쪽에 크게 겹쳐 배치해 순위 감각을 극대화.

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { QuizCard } from '@/components/common/QuizCard'
import { cn } from '@/lib/utils'
import type { QuestionSet } from '@/types'
import type { SetBadgeKind } from '@/components/common/SetBadge'

function inferCreatorType(s: QuestionSet): 'ai' | 'teacher' | null {
  if (s.host_member_id === 'ai-remix') return 'ai'
  if (s.source === 'community' && s.host_nickname) return 'teacher'
  return null
}

export function HubTopRankRow({
  items,
  seenIds,
  onPreview,
  onQuickStart,
  getBadges,
  showCommunityMeta = false,
}: {
  items: QuestionSet[]
  seenIds: Set<string>
  onPreview: (setId: string) => void
  onQuickStart: (setId: string) => void
  getBadges?: (s: QuestionSet) => SetBadgeKind[]
  showCommunityMeta?: boolean
}) {
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
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 340), behavior: 'smooth' })
  }

  if (items.length === 0) return null
  const top10 = items.slice(0, 10)

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Flame className="h-5 w-5 text-orange-500" />
            오늘의 Top 10
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">전국 선생님이 가장 많이 선택한 세트지</p>
        </div>
      </div>

      <div className="relative group">
        {canLeft && (
          <>
            <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-16 bg-gradient-to-r from-[#F8F9FB] to-transparent z-10" />
            <button
              onClick={() => scrollBy(-1)}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white shadow-xl ring-1 ring-gray-200 opacity-0 group-hover:opacity-100 hover:bg-gray-50 transition"
              aria-label="이전"
            >
              <ChevronLeft className="h-4 w-4 mx-auto text-gray-600" />
            </button>
          </>
        )}
        {canRight && (
          <>
            <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-[#F8F9FB] to-transparent z-10" />
            <button
              onClick={() => scrollBy(1)}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white shadow-xl ring-1 ring-gray-200 opacity-0 group-hover:opacity-100 hover:bg-gray-50 transition"
              aria-label="다음"
            >
              <ChevronRight className="h-4 w-4 mx-auto text-gray-600" />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className={cn(
            'flex gap-2 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          )}
        >
          {top10.map((s, i) => (
            <div key={s.set_id} className="snap-start shrink-0 flex items-end">
              {/* 거대 숫자 */}
              <div
                className="select-none font-black text-transparent leading-none mr-[-18px] md:mr-[-28px]"
                style={{
                  fontSize: 'clamp(100px, 14vw, 180px)',
                  WebkitTextStroke: '3px rgb(209 213 219)',
                }}
              >
                {i + 1}
              </div>
              <div className="w-[200px] sm:w-[220px] relative z-10">
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
                  badges={getBadges?.(s)}
                  thumbnailVariant={s.thumbnail_variant}
                  seen={seenIds.has(s.set_id)}
                  overlayMode="hover"
                  pathPreview={s.description}
                  avgRating={showCommunityMeta ? s.rating_avg : undefined}
                  hostNickname={showCommunityMeta && s.source === 'community' ? s.host_nickname : undefined}
                  isCertified={showCommunityMeta ? s.is_certified : undefined}
                  likeCount={showCommunityMeta ? s.like_count : undefined}
                  downloadCount={showCommunityMeta ? s.download_count : undefined}
                  creatorType={showCommunityMeta ? inferCreatorType(s) : null}
                  onPreview={() => onPreview(s.set_id)}
                  onQuickStart={() => onQuickStart(s.set_id)}
                  onClick={() => onPreview(s.set_id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

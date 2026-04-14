'use client'

// Netflix 스타일 빌보드 히어로 — 페이지 최상단 큐레이션 슬롯
// 3~5개 피처드 세트를 5초 간격 자동 회전 + 수동 dot 전환.

import { useEffect, useMemo, useState } from 'react'
import { Play, Eye, Sparkles, Flame, Star, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SetBadge } from '@/components/common/SetBadge'
import { cn } from '@/lib/utils'
import { SETS_HUB_LABELS } from '../_labels'
import type { QuestionSet } from '@/types'

const GRADIENTS = [
  'from-indigo-600 via-blue-500 to-cyan-400',
  'from-fuchsia-600 via-purple-500 to-indigo-400',
  'from-rose-500 via-orange-400 to-amber-300',
  'from-emerald-600 via-teal-500 to-cyan-400',
  'from-amber-500 via-orange-500 to-rose-500',
  'from-pink-500 via-rose-400 to-orange-300',
]

function gradientFor(s: QuestionSet): string {
  const v = s.thumbnail_variant ?? s.set_id.charCodeAt(0)
  return GRADIENTS[Math.abs(v) % GRADIENTS.length]
}

export function HubBillboard({
  featured,
  onPreview,
  onQuickStart,
}: {
  featured: QuestionSet[]
  onPreview: (setId: string) => void
  onQuickStart: (setId: string) => void
}) {
  const slides = useMemo(() => featured.slice(0, 5), [featured])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || slides.length <= 1) return
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 6000)
    return () => clearInterval(t)
  }, [paused, slides.length])

  if (slides.length === 0) return null
  const s = slides[index]
  const gradient = gradientFor(s)

  return (
    <section
      className="relative overflow-hidden rounded-3xl shadow-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 배경 그라디언트 */}
      <div className={cn('relative h-[320px] md:h-[380px] bg-gradient-to-br text-white', gradient)}>
        {/* 반복 패턴 (감성 텍스처) */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3) 0, transparent 45%)',
          }}
        />
        {/* 하단 그라데이션 오버레이 */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="relative h-full flex flex-col justify-between p-6 md:p-10">
          {/* 상단: 에디터스 픽 태그 */}
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-[11px] font-semibold tracking-wider uppercase">
              <Sparkles className="h-3 w-3" />
              {SETS_HUB_LABELS.billboard.eyebrow}
            </span>
            {s.is_official && <SetBadge kind="official" />}
            {s.is_new && <SetBadge kind="new" />}
          </div>

          {/* 중하단: 제목 + 메타 + CTA */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-xs opacity-90">
              {s.textbook && (
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {s.textbook}
                </span>
              )}
              {s.theme && (
                <span className="inline-flex items-center gap-1">
                  · {s.theme.replace('공부력-', '공부력 ')}
                </span>
              )}
              {s.unit && <span>· {s.unit}</span>}
            </div>

            <h2 className="text-2xl md:text-4xl font-black leading-tight drop-shadow-md">
              {s.title}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              {s.subject && <Badge className="rounded-full bg-white/90 text-gray-800 hover:bg-white">{s.subject}</Badge>}
              {s.grade && <Badge variant="outline" className="rounded-full border-white/50 bg-white/10 text-white">{s.grade}</Badge>}
              <span className="font-semibold">{s.question_count ?? 0}문항</span>
              {s.difficulty && <span>· 난이도 {s.difficulty}</span>}
              {s.rating_avg != null && (
                <span className="inline-flex items-center gap-1">
                  · <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  {s.rating_avg.toFixed(1)}
                </span>
              )}
              {(s.play_count ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1">
                  · <Flame className="h-3.5 w-3.5 text-orange-200" />
                  {s.play_count}회 플레이
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="lg"
                onClick={() => onQuickStart(s.set_id)}
                className="rounded-full bg-white text-gray-900 hover:bg-white/90 font-bold px-6 shadow-lg"
              >
                <Play className="h-5 w-5 mr-1.5 fill-current" />
                {SETS_HUB_LABELS.billboard.ctaPrimary}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onPreview(s.set_id)}
                className="rounded-full border-white/60 bg-white/10 text-white hover:bg-white/20 font-semibold backdrop-blur"
              >
                <Eye className="h-5 w-5 mr-1.5" />
                {SETS_HUB_LABELS.billboard.ctaPreview}
              </Button>
            </div>
          </div>
        </div>

        {/* 우하단 슬라이드 인디케이터 */}
        {slides.length > 1 && (
          <div className="absolute right-6 bottom-6 md:right-10 md:bottom-8 flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`슬라이드 ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === index ? 'bg-white w-8' : 'bg-white/50 w-4 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

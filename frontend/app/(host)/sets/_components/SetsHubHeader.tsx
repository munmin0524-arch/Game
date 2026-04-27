'use client'

import Link from 'next/link'
import { Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SETS_HUB_LABELS } from '../_labels'
import { PHASE_HEADERS, type Phase } from '@/lib/phase-data'
import { cn } from '@/lib/utils'

export function SetsHubHeader({ phase }: { phase: Phase }) {
  const L = SETS_HUB_LABELS.header
  const H = PHASE_HEADERS[phase]

  return (
    <div className="space-y-3">
      {/* Phase별 컨셉 배너 */}
      <div className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br px-6 py-5 text-white shadow-card',
        H.gradient,
      )}>
        <div className="relative z-10 grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
          {/* 좌측: 컨셉 */}
          <div>
            <span className="inline-block text-[11px] font-bold tracking-wider uppercase bg-white/15 backdrop-blur rounded-full px-3 py-1">
              {H.badge}
            </span>
            <p className="text-base md:text-lg font-bold mt-2 text-yellow-200">
              💡 {H.oneLiner}
            </p>
            <h2 className="text-lg md:text-xl font-semibold mt-1 leading-tight">{H.title}</h2>
            <p className="text-sm text-white/80 mt-1.5 leading-relaxed">{H.subtitle}</p>
          </div>
          {/* 우측: 큐레이션 리스트 */}
          <div className="rounded-xl bg-white/10 backdrop-blur px-4 py-3 ring-1 ring-white/20">
            <p className="text-[11px] font-bold tracking-wider uppercase text-white/70 mb-2">
              이 단계의 큐레이션
            </p>
            <ul className="space-y-1.5 text-[13px] leading-snug">
              {H.curation.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-white/50 shrink-0">·</span>
                  <span className="text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -right-4 top-16 h-24 w-24 rounded-full bg-white/5" />
      </div>

      {/* 페이지 제목 + 새 퀴즈 만들기 */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="text-xs font-semibold text-amber-600 tracking-wider uppercase">
              {L.eyebrow}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">{L.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{L.subtitle}</p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/sets/new/edit">
            <Plus className="mr-2 h-4 w-4" />
            {L.newBtn}
          </Link>
        </Button>
      </div>
    </div>
  )
}

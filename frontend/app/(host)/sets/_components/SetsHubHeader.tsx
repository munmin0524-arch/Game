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
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-[11px] font-bold tracking-wider uppercase bg-white/15 backdrop-blur rounded-full px-3 py-1">
            {H.badge}
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2 leading-tight">{H.title}</h2>
          <p className="text-sm text-white/80 mt-1.5 leading-relaxed">{H.subtitle}</p>
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

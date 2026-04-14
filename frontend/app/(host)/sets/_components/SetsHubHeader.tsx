'use client'

import Link from 'next/link'
import { Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SETS_HUB_LABELS } from '../_labels'

export function SetsHubHeader() {
  const L = SETS_HUB_LABELS.header
  return (
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
  )
}

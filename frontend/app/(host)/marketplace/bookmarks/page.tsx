// 내가 찜한 퀴즈

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SharedSetCard, SharedSetCardSkeleton } from '@/components/marketplace/SharedSetCard'
import type { SharedSet } from '@/types'

export default function BookmarksPage() {
  const router = useRouter()
  const [sets, setSets] = useState<SharedSet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock: 마켓플레이스 데이터에서 is_bookmarked인 것만 필터
    fetch('/api/marketplace')
      .then((res) => res.json())
      .then((data) => {
        // Mock: 인기 퀴즈 중 일부를 찜한 것으로 간주
        const all = [...(data.popular ?? []), ...(data.recent ?? [])]
        const unique = Array.from(new Map(all.map((s: SharedSet) => [s.shared_set_id, s])).values())
        setSets(unique.slice(0, 3) as SharedSet[])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/marketplace')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-amber-500" />
          <h1 className="text-xl font-bold text-gray-900">찜한 퀴즈</h1>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SharedSetCardSkeleton key={i} />
          ))}
        </div>
      ) : sets.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Bookmark className="h-12 w-12 mx-auto mb-3 text-gray-200" />
          <p className="text-lg font-medium">찜한 퀴즈가 없습니다</p>
          <p className="text-sm mt-1">마음에 드는 퀴즈를 찜해보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sets.map((s) => (
            <SharedSetCard key={s.shared_set_id} sharedSet={s} />
          ))}
        </div>
      )}
    </div>
  )
}

// 컬렉션 상세

'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CertifiedBadge } from '@/components/marketplace/CertifiedBadge'
import { SharedSetCard, SharedSetCardSkeleton } from '@/components/marketplace/SharedSetCard'
import type { SharedSet } from '@/types'

interface CollectionDetail {
  collection_id: string
  title: string
  description: string | null
  quiz_count: number
  like_count: number
  nickname: string
  is_certified: boolean
  items: SharedSet[]
}

interface PageProps {
  params: Promise<{ collectionId: string }>
}

export default function CollectionDetailPage({ params }: PageProps) {
  const { collectionId } = use(params)
  const router = useRouter()
  const [detail, setDetail] = useState<CollectionDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/marketplace/collections/${collectionId}`)
      .then((res) => res.json())
      .then((data) => setDetail(data))
      .finally(() => setLoading(false))
  }, [collectionId])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SharedSetCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!detail) return null

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
      <Button variant="ghost" size="sm" className="-ml-2 text-gray-500" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        뒤로
      </Button>

      {/* 컬렉션 헤더 */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 p-6 space-y-3">
        <div className="flex items-start gap-3">
          <FolderOpen className="h-8 w-8 text-violet-500 shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{detail.title}</h1>
            {detail.description && (
              <p className="text-sm text-gray-600 mt-1">{detail.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            by {detail.nickname}
            {detail.is_certified && <CertifiedBadge />}
          </span>
          <Badge variant="secondary">{detail.quiz_count}개 퀴즈</Badge>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {detail.like_count}
          </span>
        </div>
      </div>

      {/* 포함된 퀴즈 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">포함된 퀴즈</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {detail.items.map((s) => (
            <SharedSetCard key={s.shared_set_id} sharedSet={s} />
          ))}
        </div>
      </section>
    </div>
  )
}

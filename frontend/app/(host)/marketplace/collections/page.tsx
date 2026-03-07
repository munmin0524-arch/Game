// 인기 컬렉션 탐색

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FolderOpen, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CertifiedBadge } from '@/components/marketplace/CertifiedBadge'
import type { Collection } from '@/types'

export default function CollectionsPage() {
  const router = useRouter()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/marketplace/collections')
      .then((res) => res.json())
      .then((data) => setCollections(data.collections ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/marketplace')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">인기 컬렉션</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 text-gray-200" />
          <p className="text-lg font-medium">아직 공개된 컬렉션이 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <div
              key={col.collection_id}
              className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3 hover:shadow-card transition-shadow cursor-pointer"
              onClick={() => router.push(`/marketplace/collections/${col.collection_id}`)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{col.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{col.description}</p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {col.quiz_count}개
                </Badge>
              </div>

              {/* 미리보기 아이템 */}
              {col.preview_items && col.preview_items.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {col.preview_items.slice(0, 3).map((item) => (
                    <Badge key={item.shared_set_id} variant="outline" className="text-xs">
                      {item.title && item.title.length > 15 ? item.title.slice(0, 15) + '...' : item.title}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  by {col.nickname ?? '교사'}
                  {col.is_certified && <CertifiedBadge />}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {col.like_count}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

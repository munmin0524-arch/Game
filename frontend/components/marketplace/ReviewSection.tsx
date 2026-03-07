'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from './StarRating'
import { CertifiedBadge } from './CertifiedBadge'
import type { Review } from '@/types'

interface ReviewSectionProps {
  sharedSetId: string
  avgRating?: number
  reviewCount?: number
}

export function ReviewSection({ sharedSetId, avgRating = 0, reviewCount = 0 }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [myRating, setMyRating] = useState(0)
  const [myComment, setMyComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/marketplace/${sharedSetId}/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews ?? []))
      .finally(() => setLoading(false))
  }, [sharedSetId])

  const handleSubmit = async () => {
    if (myRating === 0) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/marketplace/${sharedSetId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: myRating, comment: myComment || null }),
      })
      const newReview = await res.json()
      setReviews((prev) => [newReview, ...prev])
      setMyRating(0)
      setMyComment('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-gray-900">리뷰</h2>
        {reviewCount > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <StarRating rating={avgRating} />
            <span className="font-medium">{avgRating.toFixed(1)}</span>
            <span>({reviewCount})</span>
          </div>
        )}
      </div>

      {/* 리뷰 작성 */}
      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-sm font-medium text-gray-700">리뷰 남기기</p>
        <StarRating rating={myRating} size="md" interactive onRate={setMyRating} />
        <Textarea
          placeholder="한줄평을 남겨주세요 (선택)"
          value={myComment}
          onChange={(e) => setMyComment(e.target.value)}
          rows={2}
          className="resize-none"
        />
        <Button
          size="sm"
          disabled={myRating === 0 || submitting}
          onClick={handleSubmit}
        >
          {submitting ? '등록 중...' : '리뷰 등록'}
        </Button>
      </div>

      {/* 리뷰 목록 */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center py-8 text-gray-400 text-sm">아직 리뷰가 없습니다. 첫 리뷰를 남겨보세요!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.review_id} className="rounded-xl border border-gray-100 p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">
                  {r.nickname ?? '교사'}
                </span>
                {r.is_certified && <CertifiedBadge />}
                <StarRating rating={r.rating} />
              </div>
              {r.comment && (
                <p className="text-sm text-gray-600">{r.comment}</p>
              )}
              <p className="text-xs text-gray-300">
                {new Date(r.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

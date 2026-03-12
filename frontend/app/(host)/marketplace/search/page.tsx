// S-M02: 마켓플레이스 검색 결과 — 단원 필터 + QuizCard 적용
// /marketplace/search

'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters'
import { QuizCard, QuizCardSkeleton } from '@/components/common/QuizCard'
import type { SharedSet } from '@/types'

const SORT_OPTIONS = [
  { value: 'popular', label: '인기순' },
  { value: 'recent', label: '최신순' },
  { value: 'likes', label: '좋아요순' },
  { value: 'downloads', label: '다운로드순' },
  { value: 'rating', label: '평점순' },
]

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [subject, setSubject] = useState(searchParams.get('subject') ?? '전체')
  const [grade, setGrade] = useState(searchParams.get('grade') ?? '전체')
  const [unit, setUnit] = useState(searchParams.get('unit') ?? '전체')
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'popular')
  const [results, setResults] = useState<SharedSet[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchResults = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (subject && subject !== '전체') params.set('subject', subject)
    if (grade && grade !== '전체') params.set('grade', grade)
    if (unit && unit !== '전체') params.set('unit', unit)
    params.set('sort', sort)
    params.set('page', String(page))
    params.set('limit', '12')

    fetch(`/api/marketplace/search?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.data ?? [])
        setTotal(data.total ?? 0)
      })
      .catch(() => { setResults([]); setTotal(0) })
      .finally(() => setLoading(false))
  }, [search, subject, grade, unit, sort, page])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  const handleSearch = () => {
    setPage(1)
    fetchResults()
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/marketplace')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {search ? `"${search}" 검색 결과` : '퀴즈 검색'}
          </h1>
          <p className="text-sm text-gray-500">{total}개 결과</p>
        </div>
      </div>

      {/* 필터 + 정렬 */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <MarketplaceFilters
            search={search}
            onSearchChange={setSearch}
            subject={subject}
            onSubjectChange={(v) => { setSubject(v); setUnit('전체'); setPage(1) }}
            grade={grade}
            onGradeChange={(v) => { setGrade(v); setUnit('전체'); setPage(1) }}
            unit={unit}
            onUnitChange={(v) => { setUnit(v); setPage(1) }}
            onSearch={handleSearch}
          />
        </div>
        <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1) }}>
          <SelectTrigger className="w-[130px] rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 결과 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <QuizCardSkeleton key={i} />)
          : results.map((s) => (
              <QuizCard
                key={s.shared_set_id}
                id={s.shared_set_id}
                title={s.title}
                questionCount={s.question_count}
                subject={s.subject}
                grade={s.grade}
                avgRating={s.avg_rating}
                likeCount={s.like_count}
                downloadCount={s.download_count}
                hostNickname={s.host_nickname ?? '교사'}
                isCertified={s.is_certified}
                isBookmarked={s.is_bookmarked}
                onClick={() => router.push(`/marketplace/${s.shared_set_id}`)}
              />
            ))}
      </div>

      {/* 결과 없음 */}
      {!loading && results.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">검색 결과가 없습니다</p>
          <p className="text-sm mt-1">다른 키워드나 필터로 검색해보세요.</p>
        </div>
      )}

      {/* 페이지네이션 */}
      {total > 12 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            이전
          </Button>
          <span className="flex items-center px-3 text-sm text-gray-500">
            {page} / {Math.ceil(total / 12)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(total / 12)}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  )
}

export default function MarketplaceSearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">로딩 중...</div>}>
      <SearchContent />
    </Suspense>
  )
}

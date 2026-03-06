// S-M01: 마켓플레이스 홈
// /marketplace

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SharedSetCard, SharedSetCardSkeleton } from '@/components/marketplace/SharedSetCard'
import type { SharedSet } from '@/types'

const SUBJECT_SHORTCUTS = [
  { label: '수학', emoji: '📐', active: true },
  { label: '영어', emoji: '🔤', active: true },
  { label: '과학', emoji: '🔬', active: false },
  { label: '사회', emoji: '📖', active: false },
]

export default function MarketplacePage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [popular, setPopular] = useState<SharedSet[]>([])
  const [recent, setRecent] = useState<SharedSet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/marketplace')
      .then((res) => res.json())
      .then((data) => {
        setPopular(data.popular ?? [])
        setRecent(data.recent ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/marketplace/search?q=${encodeURIComponent(search.trim())}`)
    }
  }

  const handleSubjectClick = (subject: string) => {
    router.push(`/marketplace/search?subject=${encodeURIComponent(subject)}`)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-8">
      {/* 헤더 */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          커뮤니티 마켓플레이스
        </h1>
        <p className="text-gray-500">
          다른 선생님이 만든 퀴즈를 검색하고, 내 수업에 활용하세요.
        </p>

        {/* 검색바 */}
        <div className="mx-auto max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="퀴즈 검색... (예: 수학 1단원, 소수)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-11 pr-4 h-12 rounded-full text-base shadow-soft"
          />
        </div>
      </div>

      {/* 인기 퀴즈 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">인기 퀴즈</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 gap-1"
            onClick={() => router.push('/marketplace/search?sort=popular')}
          >
            전체 보기
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SharedSetCardSkeleton key={i} />)
            : popular.slice(0, 4).map((s) => (
                <SharedSetCard key={s.shared_set_id} sharedSet={s} />
              ))}
        </div>
      </section>

      {/* 최신 등록 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">최신 등록</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 gap-1"
            onClick={() => router.push('/marketplace/search?sort=recent')}
          >
            전체 보기
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SharedSetCardSkeleton key={i} />)
            : recent.slice(0, 4).map((s) => (
                <SharedSetCard key={s.shared_set_id} sharedSet={s} />
              ))}
        </div>
      </section>

      {/* 과목별 바로가기 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">과목별</h2>
        <div className="flex flex-wrap gap-3">
          {SUBJECT_SHORTCUTS.map((sub) => (
            <button
              key={sub.label}
              onClick={() => sub.active && handleSubjectClick(sub.label)}
              disabled={!sub.active}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all
                ${sub.active
                  ? 'bg-white shadow-soft hover:shadow-card cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              <span className="text-lg">{sub.emoji}</span>
              {sub.label}
              {!sub.active && (
                <Badge variant="secondary" className="text-[10px] px-1.5">
                  준비중
                </Badge>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

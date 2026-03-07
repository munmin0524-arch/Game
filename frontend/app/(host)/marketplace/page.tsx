// S-M01: 퀴즈 광장 홈

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search, Bookmark, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SharedSetCard, SharedSetCardSkeleton } from '@/components/marketplace/SharedSetCard'
import type { SharedSet } from '@/types'
import { SUBJECT_OPTIONS, getGradeGroups } from '@/lib/filter-constants'

export default function MarketplacePage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('전체')
  const [grade, setGrade] = useState('전체')
  const [forYou, setForYou] = useState<SharedSet[]>([])
  const [popular, setPopular] = useState<SharedSet[]>([])
  const [recent, setRecent] = useState<SharedSet[]>([])
  const [popularTags, setPopularTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const gradeGroups = getGradeGroups(subject === '전체' ? null : subject)

  useEffect(() => {
    fetch('/api/marketplace').then((r) => r.json())
      .then((mpData) => {
        setForYou(mpData.forYou ?? [])
        setPopular(mpData.popular ?? [])
        setRecent(mpData.recent ?? [])
        setPopularTags(mpData.popular_tags ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/marketplace/search?q=${encodeURIComponent(search.trim())}`)
    }
  }

  const handleFilterApply = () => {
    const params = new URLSearchParams()
    if (subject !== '전체') params.set('subject', subject)
    if (grade !== '전체') params.set('grade', grade)
    router.push(`/marketplace/search?${params}`)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-8">
      {/* 헤더 */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">퀴즈 광장</h1>
        <p className="text-gray-500">
          다른 선생님이 만든 퀴즈를 검색하고, 내 게임에 활용하세요.
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

        {/* 필터바 */}
        <div className="mx-auto max-w-xl flex items-center gap-2">
          <Select value={subject} onValueChange={(v) => { setSubject(v); setGrade('전체') }}>
            <SelectTrigger className="w-[130px] rounded-full">
              <SelectValue placeholder="과목" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체 과목</SelectItem>
              {SUBJECT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value} disabled={!s.enabled}>
                  {s.value}{!s.enabled && ` (${s.label})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="w-[200px] rounded-full">
              <SelectValue placeholder="학년/학기" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체 학년/학기</SelectItem>
              {gradeGroups.map((group) => (
                <SelectGroup key={group.group}>
                  <SelectLabel className="text-xs text-gray-400">{group.group}</SelectLabel>
                  {group.items.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handleFilterApply}
          >
            검색
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-500 gap-1"
            onClick={() => router.push('/marketplace/bookmarks')}
          >
            <Bookmark className="h-4 w-4" />
            찜 목록
          </Button>
        </div>
      </div>

      {/* 인기 태그 */}
      {popularTags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => router.push(`/marketplace/search?q=${encodeURIComponent(tag)}`)}
              className="px-3.5 py-1.5 rounded-full bg-gray-100 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* 맞춤 추천 */}
      {forYou.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-gray-900">맞춤 추천</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {forYou.slice(0, 4).map((s) => (
              <SharedSetCard key={s.shared_set_id} sharedSet={s} />
            ))}
          </div>
        </section>
      )}

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

    </div>
  )
}

// S-M01: 퀴즈 광장 홈

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search, Bookmark, FolderOpen, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SharedSetCard, SharedSetCardSkeleton } from '@/components/marketplace/SharedSetCard'
import { CertifiedBadge } from '@/components/marketplace/CertifiedBadge'
import type { SharedSet, Collection } from '@/types'

const SUBJECT_SHORTCUTS = [
  { label: '수학', emoji: '📐', active: true },
  { label: '영어', emoji: '🔤', active: true },
  { label: '과학', emoji: '🔬', active: false },
  { label: '사회', emoji: '📖', active: false },
]

const SUBJECTS = ['전체', '수학', '영어', '과학', '사회', '국어', '기타']
const GRADES = ['전체', '초1', '초2', '초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3']

export default function MarketplacePage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('전체')
  const [grade, setGrade] = useState('전체')
  const [forYou, setForYou] = useState<SharedSet[]>([])
  const [popular, setPopular] = useState<SharedSet[]>([])
  const [recent, setRecent] = useState<SharedSet[]>([])
  const [popularTags, setPopularTags] = useState<string[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/marketplace').then((r) => r.json()),
      fetch('/api/marketplace/collections').then((r) => r.json()),
    ])
      .then(([mpData, colData]) => {
        setForYou(mpData.forYou ?? [])
        setPopular(mpData.popular ?? [])
        setRecent(mpData.recent ?? [])
        setPopularTags(mpData.popular_tags ?? [])
        setCollections(colData.collections ?? [])
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

  const handleSubjectClick = (sub: string) => {
    router.push(`/marketplace/search?subject=${encodeURIComponent(sub)}`)
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
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="w-[110px] rounded-full">
              <SelectValue placeholder="과목" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="w-[110px] rounded-full">
              <SelectValue placeholder="학년" />
            </SelectTrigger>
            <SelectContent>
              {GRADES.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
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

      {/* 인기 컬렉션 */}
      {collections.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-violet-500" />
              <h2 className="text-lg font-bold text-gray-900">인기 컬렉션</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 gap-1"
              onClick={() => router.push('/marketplace/collections')}
            >
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.slice(0, 3).map((col) => (
              <div
                key={col.collection_id}
                className="rounded-2xl border border-gray-100 bg-white p-4 space-y-2 hover:shadow-card transition-shadow cursor-pointer"
                onClick={() => router.push(`/marketplace/collections/${col.collection_id}`)}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-gray-900 text-sm">{col.title}</h3>
                  <Badge variant="secondary" className="text-xs shrink-0">{col.quiz_count}개</Badge>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{col.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>by {col.nickname ?? '교사'}</span>
                  {col.is_certified && <CertifiedBadge />}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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

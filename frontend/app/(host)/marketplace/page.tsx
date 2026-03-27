// S-M01: 퀴즈 광장 홈 — 탭 분류 + 필터 + 카드 그리드

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bookmark, User } from 'lucide-react'
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
import { QuizCard, QuizCardSkeleton } from '@/components/common/QuizCard'
import { EmptyState } from '@/components/common/EmptyState'
import { SUBJECT_OPTIONS, getGradeGroups } from '@/lib/filter-constants'
import {
  getMathUnits,
  getEnglishLessons,
  ENGLISH_CONTENT_TYPES,
} from '@/app/(host)/sets/[setId]/edit/_components/FilterHierarchyData'
import type { SharedSet } from '@/types'

// ─── 교과서/문제집 옵션 (퀴즈파티 제공 탭) ───

const TEXTBOOK_OPTIONS = [
  { value: '비상 교과서', label: '비상 교과서' },
  { value: '천재 교과서', label: '천재 교과서' },
  { value: '미래엔 교과서', label: '미래엔 교과서' },
  { value: '동아 교과서', label: '동아 교과서' },
  { value: '지학사 교과서', label: '지학사 교과서' },
  { value: '오투', label: '오투' },
  { value: '쎈', label: '쎈' },
  { value: '개념원리', label: '개념원리' },
  { value: '수학의 정석', label: '수학의 정석' },
] as const

// ─── Mock 데이터 (백엔드 연결 전 폴백) ───

const MOCK_SHARED_SETS: SharedSet[] = [
  {
    shared_set_id: 'mock-m-01', set_id: 's-01', host_member_id: 'h-01', status: 'published',
    title: '중1 수학 일차방정식 총정리', description: null, subject: '수학', grade: '중1-1학기',
    tags: ['방정식', '일차'], question_count: 15, like_count: 42, download_count: 128,
    achievement_standards: null, published_at: '2026-02-10T09:00:00Z', updated_at: '2026-02-10T09:00:00Z',
    avg_rating: 4.7, review_count: 12, host_nickname: '수학쌤', is_certified: true, is_bookmarked: false,
  },
  {
    shared_set_id: 'mock-m-02', set_id: 's-02', host_member_id: 'h-02', status: 'published',
    title: '국어 비문학 독해 — 설명문·논설문 집중', description: null, subject: '국어', grade: '중2-1학기',
    tags: ['비문학', '독해', '설명문'], question_count: 20, like_count: 58, download_count: 210,
    achievement_standards: null, published_at: '2026-02-15T09:00:00Z', updated_at: '2026-02-15T09:00:00Z',
    avg_rating: 4.8, review_count: 22, host_nickname: '국어달인', is_certified: true, is_bookmarked: true,
  },
  {
    shared_set_id: 'mock-m-03', set_id: 's-03', host_member_id: 'h-03', status: 'published',
    title: '과학 — 지구와 달의 운동 개념 확인', description: null, subject: '과학', grade: '중1-2학기',
    tags: ['지구과학', '달', '자전공전'], question_count: 10, like_count: 34, download_count: 95,
    achievement_standards: null, published_at: '2026-01-20T09:00:00Z', updated_at: '2026-01-20T09:00:00Z',
    avg_rating: 4.5, review_count: 9, host_nickname: '과학탐험가', is_certified: true, is_bookmarked: false,
  },
  {
    shared_set_id: 'mock-m-04', set_id: 's-04', host_member_id: 'h-04', status: 'published',
    title: '사회 — 민주주의와 선거제도 OX 퀴즈', description: null, subject: '사회', grade: '중3-1학기',
    tags: ['민주주의', '선거', '정치'], question_count: 12, like_count: 41, download_count: 156,
    achievement_standards: null, published_at: '2026-02-01T09:00:00Z', updated_at: '2026-02-01T09:00:00Z',
    avg_rating: 4.6, review_count: 14, host_nickname: '사회박사', is_certified: true, is_bookmarked: true,
  },
  {
    shared_set_id: 'mock-m-05', set_id: 's-05', host_member_id: 'h-05', status: 'published',
    title: '한자 8급 기출 50자 읽기 테스트', description: null, subject: '한자', grade: '중1-1학기',
    tags: ['한자8급', '읽기'], question_count: 25, like_count: 29, download_count: 87,
    achievement_standards: null, published_at: '2026-03-01T09:00:00Z', updated_at: '2026-03-01T09:00:00Z',
    avg_rating: 4.3, review_count: 7, host_nickname: '한자선생', is_certified: false, is_bookmarked: false,
  },
  {
    shared_set_id: 'mock-m-06', set_id: 's-06', host_member_id: 'h-06', status: 'published',
    title: '영어 듣기평가 대비 Lesson 5', description: null, subject: '영어', grade: '중2-1학기',
    tags: ['듣기', '리스닝'], question_count: 25, like_count: 63, download_count: 185,
    achievement_standards: null, published_at: '2026-02-20T09:00:00Z', updated_at: '2026-02-20T09:00:00Z',
    avg_rating: 4.6, review_count: 18, host_nickname: '리스닝프로', is_certified: true, is_bookmarked: false,
  },
  {
    shared_set_id: 'mock-m-07', set_id: 's-07', host_member_id: 'h-01', status: 'published',
    title: '국어 문학 — 현대시 감상과 해석', description: null, subject: '국어', grade: '중3-2학기',
    tags: ['현대시', '문학', '감상'], question_count: 14, like_count: 47, download_count: 132,
    achievement_standards: null, published_at: '2026-02-25T09:00:00Z', updated_at: '2026-02-25T09:00:00Z',
    avg_rating: 4.7, review_count: 11, host_nickname: '국어달인', is_certified: true, is_bookmarked: false,
  },
  {
    shared_set_id: 'mock-m-08', set_id: 's-08', host_member_id: 'h-07', status: 'published',
    title: '과학 — 화학 반응식 맞추기 (산화·환원)', description: null, subject: '과학', grade: '중2-2학기',
    tags: ['화학', '산화환원', '반응식'], question_count: 16, like_count: 52, download_count: 178,
    achievement_standards: null, published_at: '2026-01-15T09:00:00Z', updated_at: '2026-01-15T09:00:00Z',
    avg_rating: 4.9, review_count: 21, host_nickname: '화학마스터', is_certified: true, is_bookmarked: true,
  },
  {
    shared_set_id: 'mock-m-09', set_id: 's-09', host_member_id: 'h-08', status: 'published',
    title: '사회 — 세계 기후와 자연환경 빈칸 퀴즈', description: null, subject: '사회', grade: '중1-2학기',
    tags: ['기후', '자연환경', '지리'], question_count: 22, like_count: 33, download_count: 104,
    achievement_standards: null, published_at: '2026-03-05T09:00:00Z', updated_at: '2026-03-05T09:00:00Z',
    avg_rating: 4.4, review_count: 8, host_nickname: '지리탐험', is_certified: false, is_bookmarked: false,
  },
  {
    shared_set_id: 'mock-m-10', set_id: 's-10', host_member_id: 'h-09', status: 'published',
    title: '중2 확률과 통계 실전 문제', description: null, subject: '수학', grade: '중2-2학기',
    tags: ['확률', '통계'], question_count: 15, like_count: 38, download_count: 110,
    achievement_standards: null, published_at: '2026-02-08T09:00:00Z', updated_at: '2026-02-08T09:00:00Z',
    avg_rating: 4.6, review_count: 10, host_nickname: '통계마스터', is_certified: true, is_bookmarked: false,
  },
  {
    shared_set_id: 'mock-m-11', set_id: 's-11', host_member_id: 'h-10', status: 'published',
    title: '한자 — 사자성어 60선 의미 맞추기', description: null, subject: '한자', grade: '중2-1학기',
    tags: ['사자성어', '의미'], question_count: 30, like_count: 71, download_count: 243,
    achievement_standards: null, published_at: '2026-03-08T09:00:00Z', updated_at: '2026-03-08T09:00:00Z',
    avg_rating: 4.8, review_count: 19, host_nickname: '한자왕', is_certified: true, is_bookmarked: true,
  },
  {
    shared_set_id: 'mock-m-12', set_id: 's-12', host_member_id: 'h-03', status: 'published',
    title: '영어 문법 총정리 — 관계대명사·분사', description: null, subject: '영어', grade: '중3-2학기',
    tags: ['문법', '관계대명사', '분사'], question_count: 18, like_count: 56, download_count: 203,
    achievement_standards: null, published_at: '2026-02-18T09:00:00Z', updated_at: '2026-02-18T09:00:00Z',
    avg_rating: 4.8, review_count: 15, host_nickname: 'Grammar쌤', is_certified: true, is_bookmarked: false,
  },
  {
    shared_set_id: 'mock-m-13', set_id: 's-13', host_member_id: 'h-11', status: 'published',
    title: '과학 — 뉴턴의 운동 법칙 3단계 퀴즈', description: null, subject: '과학', grade: '중3-1학기',
    tags: ['물리', '뉴턴', '운동법칙'], question_count: 12, like_count: 44, download_count: 138,
    achievement_standards: null, published_at: '2026-01-28T09:00:00Z', updated_at: '2026-01-28T09:00:00Z',
    avg_rating: 4.7, review_count: 13, host_nickname: '물리쌤', is_certified: true, is_bookmarked: false,
  },
  {
    shared_set_id: 'mock-m-14', set_id: 's-14', host_member_id: 'h-12', status: 'published',
    title: '국어 — 맞춤법·띄어쓰기 OX 퀴즈', description: null, subject: '국어', grade: '중1-1학기',
    tags: ['맞춤법', '띄어쓰기', 'OX'], question_count: 20, like_count: 82, download_count: 312,
    achievement_standards: null, published_at: '2026-02-12T09:00:00Z', updated_at: '2026-02-12T09:00:00Z',
    avg_rating: 4.9, review_count: 27, host_nickname: '우리말지킴이', is_certified: true, is_bookmarked: true,
  },
  {
    shared_set_id: 'mock-m-15', set_id: 's-15', host_member_id: 'h-13', status: 'published',
    title: '사회 — 대한민국 헌법과 기본권', description: null, subject: '사회', grade: '중3-2학기',
    tags: ['헌법', '기본권'], question_count: 14, like_count: 36, download_count: 119,
    achievement_standards: null, published_at: '2026-01-22T09:00:00Z', updated_at: '2026-01-22T09:00:00Z',
    avg_rating: 4.5, review_count: 10, host_nickname: '법률쌤', is_certified: true, is_bookmarked: false,
  },
]

// ─── 탭 정의 ───

type MarketplaceTab = 'quiz_party' | 'community'

const TABS: { key: MarketplaceTab; label: string }[] = [
  { key: 'quiz_party', label: '퀴즈파티 제공' },
  { key: 'community', label: '선생님 공유' },
]

export default function MarketplacePage() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<MarketplaceTab>('quiz_party')
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('전체')
  const [grade, setGrade] = useState('전체')
  const [unit, setUnit] = useState('전체')
  const [contentType, setContentType] = useState('전체')
  const [textbook, setTextbook] = useState('전체')
  const [mineOnly, setMineOnly] = useState(false)
  const [results, setResults] = useState<SharedSet[]>([])
  const [loading, setLoading] = useState(true)

  const gradeGroups = useMemo(
    () => getGradeGroups(subject === '전체' ? null : subject),
    [subject],
  )

  const unitOptions = useMemo(() => {
    if (grade === '전체' || !grade) return []
    if (subject === '수학') return getMathUnits(grade)
    if (subject === '영어') return getEnglishLessons(grade)
    return []
  }, [subject, grade])

  const fetchData = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('source', activeTab)
    if (search.trim()) params.set('q', search.trim())
    if (subject !== '전체') params.set('subject', subject)
    if (grade !== '전체') params.set('grade', grade)
    if (unit !== '전체') params.set('unit', unit)
    if (subject === '영어' && contentType !== '전체') params.set('contentType', contentType)
    if (mineOnly) params.set('mine', 'true')
    if (activeTab === 'quiz_party' && textbook !== '전체') params.set('textbook', textbook)

    fetch(`/api/marketplace/search?${params}`)
      .then((r) => r.json())
      .then((data) => setResults(Array.isArray(data) ? data : data.data ?? data.items ?? []))
      .catch(() => setResults(MOCK_SHARED_SETS))
      .finally(() => setLoading(false))
  }, [activeTab, search, subject, grade, unit, contentType, mineOnly, textbook])

  useEffect(() => {
    const timer = setTimeout(fetchData, 300)
    return () => clearTimeout(timer)
  }, [fetchData])

  const handleSubjectChange = (v: string) => {
    setSubject(v)
    setGrade('전체')
    setUnit('전체')
    setContentType('전체')
  }

  const handleGradeChange = (v: string) => {
    setGrade(v)
    setUnit('전체')
    setContentType('전체')
  }

  // ─── 퀴즈파티 제공: 복사 후 이동 ───

  const copyAndNavigate = async (sharedSetId: string, target: 'edit' | 'deploy') => {
    // TODO: 백엔드 연결 시 POST /api/sets/copy-from-shared { sharedSetId }
    const newSetId = `copied-${Date.now()}`
    await new Promise((r) => setTimeout(r, 400)) // mock delay
    router.push(
      target === 'edit'
        ? `/sets/${newSetId}/edit?from=marketplace`
        : `/sets/${newSetId}/deploy`,
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      {/* 헤더 */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">퀴즈 광장</h1>
        <p className="text-sm text-gray-500">
          퀴즈를 검색하고 내 게임에 활용하세요.
        </p>
      </div>

      {/* 탭 */}
      <div className="flex justify-center gap-1 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setTextbook('전체') }}
            className={`px-6 py-2.5 text-sm font-medium transition-colors relative
              ${activeTab === tab.key
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 교과서/문제집 필터 (퀴즈파티 제공 탭 전용) */}
      {activeTab === 'quiz_party' && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 shrink-0">교과서/문제집</span>
          <Select value={textbook} onValueChange={setTextbook}>
            <SelectTrigger className="w-[200px] rounded-full">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체</SelectItem>
              {TEXTBOOK_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 필터바 */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 검색 */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="퀴즈 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-full"
          />
        </div>

        {/* 과목 */}
        <Select value={subject} onValueChange={handleSubjectChange}>
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

        {/* 학년/학기 */}
        <Select value={grade} onValueChange={handleGradeChange}>
          <SelectTrigger className="w-[200px] rounded-full">
            <SelectValue placeholder="학년/학기" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="전체">전체 학년/학기</SelectItem>
            {gradeGroups.map((group) => (
              <SelectGroup key={group.group}>
                <SelectLabel className="text-xs text-gray-400">{group.group}</SelectLabel>
                {group.items.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        {/* 단원 */}
        {unitOptions.length > 0 && (
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[220px] rounded-full">
              <SelectValue placeholder="단원" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체 단원</SelectItem>
              {unitOptions.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* 평가 영역 (영어 선택 시) */}
        {subject === '영어' && (
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-[130px] rounded-full">
              <SelectValue placeholder="평가 영역" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체 영역</SelectItem>
              {ENGLISH_CONTENT_TYPES.map((ct) => (
                <SelectItem key={ct} value={ct}>
                  {ct}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* 내가 공유한 + 찜 목록 */}
        <div className="flex gap-1 ml-auto">
          {activeTab === 'community' && (
            <Button
              variant={mineOnly ? 'default' : 'ghost'}
              size="sm"
              className={mineOnly ? 'gap-1' : 'text-gray-500 gap-1'}
              onClick={() => setMineOnly(!mineOnly)}
            >
              <User className="h-4 w-4" />
              내가 공유한
            </Button>
          )}
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

      {/* 카드 그리드 */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <QuizCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          title="검색 결과가 없어요"
          description="다른 키워드로 검색하거나 필터를 조정해보세요."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((s) => (
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
              hostNickname={activeTab === 'quiz_party' ? '퀴즈파티' : (s.host_nickname ?? '교사')}
              isCertified={activeTab === 'quiz_party' ? false : s.is_certified}
              isBookmarked={s.is_bookmarked ?? (s as unknown as Record<string, unknown>).is_liked as boolean}
              onPreview={() => router.push(`/select/${s.set_id}/preview`)}
              onQuickStart={() => router.push(`/select/${s.set_id}/settings`)}
              onClick={() => router.push(`/marketplace/${s.shared_set_id}?source=${activeTab}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

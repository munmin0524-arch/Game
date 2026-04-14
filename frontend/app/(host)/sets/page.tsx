// S-02 세트지 선택 허브
// Netflix/Kahoot 스타일 브라우징 — 3개 소스(퀴즈파티/내가만든/커뮤니티) × 5축 필터 × 미리보기 Sheet
// TODO: 실제 API (`/api/sets/hub?source=...`) 연결 시 Mock 대신 사용.

'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { PublishDialog } from '@/components/marketplace/PublishDialog'
import { questionSetsApi } from '@/lib/api'

import { SetsHubHeader } from './_components/SetsHubHeader'
import { SetsSourcePills, type SourceTab } from './_components/SetsSourcePills'
import { SetsFilterBar, EMPTY_FILTERS, hasActiveFilters, type HubFilters } from './_components/SetsFilterBar'
import { SetsViewToggle, type ViewMode } from './_components/SetsViewToggle'
import { SetsHubCarousels } from './_components/SetsHubCarousels'
import { SetsHubGrid } from './_components/SetsHubGrid'
import { SetPreviewSheet } from './_components/SetPreviewSheet'
import { HubBillboard } from './_components/HubBillboard'
import { HubCategoryTiles } from './_components/HubCategoryTiles'

import { ALL_HUB_SETS } from './_mocks/setsHubMockData'
import { THEME_OPTIONS } from '@/lib/filter-constants'
import { SETS_HUB_LABELS } from './_labels'
import type { QuestionSet } from '@/types'

const SEEN_STORAGE_KEY = 'sets-hub-seen-ids'

function loadSeenIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(SEEN_STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(arr)
  } catch {
    return new Set()
  }
}

function saveSeenIds(ids: Set<string>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(Array.from(ids)))
  } catch {
    /* 무시 */
  }
}

export default function SetsHubPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [source, setSource] = useState<SourceTab>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('carousel')
  const [filters, setFilters] = useState<HubFilters>(EMPTY_FILTERS)
  const [sets, setSets] = useState<QuestionSet[]>([])
  const [loading, setLoading] = useState(true)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set())

  const [publishOpen, setPublishOpen] = useState(false)
  const [publishTarget, setPublishTarget] = useState<QuestionSet | null>(null)

  // ─── seen 상태 LocalStorage 동기화 ───
  useEffect(() => {
    setSeenIds(loadSeenIds())
  }, [])

  const markSeen = useCallback((setId: string) => {
    setSeenIds((prev) => {
      if (prev.has(setId)) return prev
      const next = new Set(prev)
      next.add(setId)
      saveSeenIds(next)
      return next
    })
  }, [])

  // ─── 데이터 로드 (Mock 폴백) ───
  // TODO: 백엔드 endpoint 연결 시 Promise.all로 source별 병렬 fetch.
  const fetchSets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await questionSetsApi.list({
        search: filters.search || undefined,
        subject: filters.subject === '전체' ? undefined : filters.subject,
        grade: filters.grade === '전체' ? undefined : filters.grade,
      })
      // 현재 API는 단일 소스만 반환 — Mock을 우선 사용해 3소스 허브를 구현
      if (res.data && res.data.length > 0) {
        setSets([...res.data, ...ALL_HUB_SETS])
      } else {
        setSets(ALL_HUB_SETS)
      }
    } catch {
      setSets(ALL_HUB_SETS)
    } finally {
      setLoading(false)
    }
  }, [filters.search, filters.subject, filters.grade])

  useEffect(() => {
    const timer = setTimeout(fetchSets, 300)
    return () => clearTimeout(timer)
  }, [fetchSets])

  // ─── 필터 적용 ───
  const sourceSets = useMemo(() => {
    if (source === 'all') return sets
    return sets.filter((s) => s.source === source)
  }, [sets, source])

  const filteredSets = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return sourceSets.filter((s) => {
      if (q) {
        const hay = [s.title, s.subject ?? '', s.grade ?? '', s.textbook ?? '', s.unit ?? '', ...(s.tags ?? [])]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (filters.subject !== '전체' && s.subject !== filters.subject) return false
      if (filters.grade !== '전체' && s.grade !== filters.grade) return false
      if (filters.textbook !== '전체' && s.textbook !== filters.textbook) return false
      if (filters.theme !== '전체' && s.theme !== filters.theme) return false
      if (filters.difficulty !== '전체' && s.difficulty !== filters.difficulty) return false
      return true
    })
  }, [sourceSets, filters])

  const counts = useMemo(() => ({
    all: sets.length,
    quiz_party: sets.filter((s) => s.source === 'quiz_party').length,
    mine: sets.filter((s) => s.source === 'mine').length,
    community: sets.filter((s) => s.source === 'community').length,
  }), [sets])

  // 필터가 활성화되어 있으면 grid 모드가 자연스러움 (캐러셀 row가 깨지므로)
  const effectiveView: ViewMode = hasActiveFilters(filters) ? 'grid' : viewMode

  // 빌보드: 공식 + 베스트 혼합 상위 5개 (전체/퀴즈파티 탭에서만 노출)
  const billboardFeatured = useMemo(() => {
    if (source === 'mine' || hasActiveFilters(filters)) return []
    return [...sourceSets]
      .filter((s) => s.is_official || (s.rating_avg ?? 0) >= 4.8)
      .sort((a, b) => {
        const rank = (s: QuestionSet) => (s.rating_avg ?? 0) * 100 + (s.play_count ?? 0) / 10
        return rank(b) - rank(a)
      })
      .slice(0, 5)
  }, [sourceSets, source, filters])

  // 테마 선택 시 과목 자동 연동 (독립축이지만 UX 편의)
  const handleFilterChange = (patch: Partial<HubFilters>) => {
    if (patch.theme && patch.theme !== '전체') {
      const theme = THEME_OPTIONS.find((t) => t.value === patch.theme)
      if (theme && filters.subject === '전체') {
        patch.subject = theme.subject
      }
    }
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  // ─── 액션 핸들러 ───
  const handlePreview = (setId: string) => {
    setPreviewId(setId)
    setPreviewOpen(true)
  }
  const handleQuickStart = (setId: string) => {
    markSeen(setId)
    router.push(`/sets/${setId}/deploy`)
  }
  const handleEdit = (setId: string) => router.push(`/sets/${setId}/edit`)
  const handleDuplicate = async (setId: string) => {
    try {
      await questionSetsApi.duplicate(setId)
      toast({ title: '퀴즈가 복제되었습니다.' })
      fetchSets()
    } catch {
      toast({ title: '복제에 실패했습니다.', variant: 'destructive' })
    }
  }
  const handleDelete = async (setId: string) => {
    try {
      await questionSetsApi.delete(setId)
      toast({ title: '퀴즈가 삭제되었습니다.' })
      setSets((prev) => prev.filter((s) => s.set_id !== setId))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      toast({
        title: msg.includes('deployed')
          ? '게임에 사용된 퀴즈는 삭제할 수 없습니다.'
          : '삭제에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }
  const handleShare = (qs: QuestionSet) => {
    setPublishTarget(qs)
    setPublishOpen(true)
  }
  const handlePublish = () => {
    // TODO: marketplaceApi.publish(publishTarget.set_id, form)
    toast({ title: '퀴즈 광장에 공유되었습니다.' })
    setPublishOpen(false)
    setPublishTarget(null)
  }

  const emptyCopy = (() => {
    const E = SETS_HUB_LABELS.empty
    if (filters.search.trim()) return E.search
    if (source === 'mine') return E.mine
    if (source === 'community') return E.community
    return E.default
  })()

  return (
    <div className="space-y-8">
      <SetsHubHeader />

      {/* 넷플릭스 스타일 빌보드 */}
      {billboardFeatured.length > 0 && effectiveView === 'carousel' && (
        <HubBillboard
          featured={billboardFeatured}
          onPreview={handlePreview}
          onQuickStart={handleQuickStart}
        />
      )}

      {/* 탭 + 뷰 토글 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SetsSourcePills value={source} onChange={setSource} counts={counts} />
        <SetsViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      {/* 카테고리 타일 — 카훗 스타일 큐레이션 입구 (전체/퀴즈파티 탭) */}
      {(source === 'all' || source === 'quiz_party') && effectiveView === 'carousel' && (
        <HubCategoryTiles onPick={(preset) => setFilters(preset)} />
      )}

      {/* 필터바 */}
      <SetsFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onResetAll={() => setFilters(EMPTY_FILTERS)}
        source={source}
      />

      {/* 본문 — 캐러셀 or 그리드 */}
      {effectiveView === 'carousel' && !loading && filteredSets.length > 0 ? (
        <SetsHubCarousels
          sets={filteredSets}
          source={source}
          onPreview={handlePreview}
          onQuickStart={handleQuickStart}
          seenIds={seenIds}
        />
      ) : (
        <SetsHubGrid
          sets={filteredSets}
          loading={loading}
          seenIds={seenIds}
          isMineSection={source === 'mine' || source === 'all'}
          onPreview={handlePreview}
          onQuickStart={handleQuickStart}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onShare={handleShare}
          onDelete={handleDelete}
          onGameOpen={(id) => router.push(`/sets/${id}/deploy`)}
          emptyTitle={emptyCopy.title}
          emptyDescription={emptyCopy.description}
        />
      )}

      {/* 미리보기 Sheet */}
      <SetPreviewSheet
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        setId={previewId}
        onMarkSeen={markSeen}
      />

      {/* 공유 다이얼로그 */}
      <PublishDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        defaultTitle={publishTarget?.title ?? ''}
        onPublish={handlePublish}
      />
    </div>
  )
}

'use client'

// row 구성 정책 (Phase 2)
//  - source='all':      이어서·Top10·개인화×2·신규·베스트·교과서별·테마별 → ≤8
//  - source='quiz_party': Top10·신규·베스트·교과서별·테마별              → ≤5
//  - source='mine':     최근편집 + 과목별                                   → 2~5
//  - source='community':이어서·Top10·인증교사·북마크·신규                  → ≤5

import { useEffect, useState } from 'react'
import {
  Flame,
  Sparkles,
  Trophy,
  BookOpen,
  GraduationCap,
  History,
  Heart,
  CheckCircle2,
  Target,
  Layers,
} from 'lucide-react'
import { SetsCarouselRow } from './SetsCarouselRow'
import { HubTopRankRow } from './HubTopRankRow'
import { SETS_HUB_LABELS, MOCK_PERSONALIZATION } from '../_labels'
import { TEXTBOOK_OPTIONS, THEME_OPTIONS } from '@/lib/filter-constants'
import type { QuestionSet } from '@/types'
import type { SourceTab } from './SetsSourcePills'
import type { SetBadgeKind } from '@/components/common/SetBadge'

function badgesFor(s: QuestionSet): SetBadgeKind[] {
  // 소스 기반 단일 뱃지만 노출
  if (s.source === 'quiz_party' || s.is_official) return ['official']
  if (s.source === 'mine') return ['mine']
  if (s.source === 'community') return ['community']
  return []
}

/** 여러 버킷에서 라운드 로빈으로 섞어 단일 row에 대표 세트 1~2개씩 배치 */
function interleave<T>(buckets: T[][], perBucket = 2): T[] {
  const out: T[] = []
  const max = perBucket
  for (let i = 0; i < max; i++) {
    for (const b of buckets) if (b[i]) out.push(b[i])
  }
  return out
}

const CONTINUE_DISMISSED_KEY = 'sets-hub-continue-dismissed'

export function SetsHubCarousels({
  sets,
  source,
  onPreview,
  onQuickStart,
  seenIds,
}: {
  sets: QuestionSet[]
  source: SourceTab
  onPreview: (setId: string) => void
  onQuickStart: (setId: string) => void
  seenIds: Set<string>
}) {
  const R = SETS_HUB_LABELS.rows
  const rows: Array<React.ReactNode> = []
  const rowProps = { onPreview, onQuickStart, seenIds, getBadges: badgesFor }

  const [continueDismissed, setContinueDismissed] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    setContinueDismissed(window.sessionStorage.getItem(CONTINUE_DISMISSED_KEY) === '1')
  }, [])
  const dismissContinue = () => {
    setContinueDismissed(true)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(CONTINUE_DISMISSED_KEY, '1')
    }
  }

  // ① 이어서 시작하기 (conditional)
  if (seenIds.size > 0 && !continueDismissed) {
    const seen = sets.filter((s) => seenIds.has(s.set_id)).slice(0, 12)
    if (seen.length > 0) {
      rows.push(
        <SetsCarouselRow
          key="row-continue"
          title={R.continue.title}
          subtitle={R.continue.subtitle}
          icon={<History className="h-5 w-5 text-blue-500" />}
          items={seen}
          onDismiss={dismissContinue}
          {...rowProps}
        />,
      )
    }
  }

  if (source !== 'mine') {
    // ② Top 10 (넷플릭스 스타일 숫자 overlay)
    const top = [...sets]
      .filter((s) => (s.play_count ?? 0) > 0)
      .sort((a, b) => (b.play_count ?? 0) - (a.play_count ?? 0))
      .slice(0, 10)
    if (top.length >= 5) {
      rows.push(
        <HubTopRankRow
          key="row-top10"
          items={top}
          seenIds={seenIds}
          onPreview={onPreview}
          onQuickStart={onQuickStart}
          getBadges={badgesFor}
        />,
      )
    }
  }

  // ③ ④ 개인화 row 2개 (전체 탭에서만)
  if (source === 'all') {
    const P = MOCK_PERSONALIZATION
    // ③ 같은 학년·교과서·과목 — "영어 5학년 선생님이세요?"
    const sameTextbook = sets
      .filter((s) => s.subject === P.inferredSubject && s.grade === P.inferredGrade && s.textbook === P.inferredTextbook)
      .slice(0, 10)
    if (sameTextbook.length > 0) {
      rows.push(
        <SetsCarouselRow
          key="row-personal-1"
          title={R.personalGrade.title}
          subtitle={R.personalGrade.subtitle}
          icon={<Target className="h-5 w-5 text-blue-600" />}
          items={sameTextbook}
          {...rowProps}
        />,
      )
    }
    // ④ 같은 학년·과목이지만 다른 교재
    const otherTextbook = sets
      .filter((s) => s.subject === P.inferredSubject && s.grade === P.inferredGrade && s.textbook && s.textbook !== P.inferredTextbook)
      .slice(0, 10)
    if (otherTextbook.length > 0) {
      rows.push(
        <SetsCarouselRow
          key="row-personal-2"
          title={R.personalOtherTextbook.title}
          subtitle={R.personalOtherTextbook.subtitle}
          icon={<Layers className="h-5 w-5 text-rose-500" />}
          items={otherTextbook}
          {...rowProps}
        />,
      )
    }
  }

  if (source !== 'mine') {
    // ⑤ 수학 문제집 row — 쎈·개념원리·유형
    if (source === 'all' || source === 'quiz_party') {
      const WORKBOOKS = ['쎈', '개념원리', '유형']
      const workbookSets = sets.filter((s) => s.textbook && WORKBOOKS.includes(s.textbook)).slice(0, 12)
      if (workbookSets.length > 0) {
        rows.push(
          <SetsCarouselRow
            key="row-math-workbook"
            title={R.mathWorkbook.title}
            subtitle={R.mathWorkbook.subtitle}
            icon={<BookOpen className="h-5 w-5 text-fuchsia-500" />}
            items={workbookSets}
            {...rowProps}
          />,
        )
      }
    }

    // ⑥ 베스트 (별점 4.7+)
    const bestSets = [...sets]
      .filter((s) => (s.rating_avg ?? 0) >= 4.7)
      .sort((a, b) => (b.rating_avg ?? 0) - (a.rating_avg ?? 0))
      .slice(0, 12)
    if (bestSets.length > 0) {
      rows.push(
        <SetsCarouselRow
          key="row-best"
          title={R.best.title}
          subtitle={R.best.subtitle}
          icon={<Trophy className="h-5 w-5 text-purple-500" />}
          items={bestSets}
          {...rowProps}
        />,
      )
    }
  }

  // ⑦ 교과서별 통합 row (5개 교과서 대표 섞기)
  if (source === 'all' || source === 'quiz_party') {
    const buckets = TEXTBOOK_OPTIONS.filter((t) => t.kind === 'textbook').map((tb) =>
      sets.filter((s) => s.textbook === tb.value && s.is_official).slice(0, 2),
    )
    const items = interleave(buckets, 2).slice(0, 12)
    if (items.length > 0) {
      rows.push(
        <SetsCarouselRow
          key="row-tb-browse"
          title={R.textbookBrowse.title}
          subtitle={R.textbookBrowse.subtitle}
          icon={<BookOpen className="h-5 w-5 text-blue-500" />}
          items={items}
          {...rowProps}
        />,
      )
    }
  }

  // ⑧ 공부력 테마 통합 row
  if (source === 'all' || source === 'quiz_party') {
    const buckets = THEME_OPTIONS.map((th) =>
      sets.filter((s) => s.theme === th.value && s.is_official).slice(0, 2),
    )
    const items = interleave(buckets, 2).slice(0, 12)
    if (items.length > 0) {
      rows.push(
        <SetsCarouselRow
          key="row-theme-browse"
          title={R.themeBrowse.title}
          subtitle={R.themeBrowse.subtitle}
          items={items}
          {...rowProps}
        />,
      )
    }
  }

  // ─── 내가 만든: 최근 편집 + 과목별 ───
  if (source === 'mine') {
    const recent = [...sets]
      .sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1))
      .slice(0, 10)
    if (recent.length > 0) {
      rows.push(
        <SetsCarouselRow
          key="row-recent"
          title={R.recent.title}
          subtitle={R.recent.subtitle}
          icon={<Sparkles className="h-5 w-5 text-blue-500" />}
          items={recent}
          {...rowProps}
        />,
      )
    }
    const subjects = Array.from(new Set(sets.map((s) => s.subject).filter(Boolean))) as string[]
    subjects.forEach((sub) => {
      const items = sets.filter((s) => s.subject === sub)
      if (items.length >= 2) {
        rows.push(
          <SetsCarouselRow
            key={`row-sub-${sub}`}
            title={sub}
            icon={<GraduationCap className="h-5 w-5 text-gray-500" />}
            items={items}
            {...rowProps}
          />,
        )
      }
    })
  }

  // ─── 커뮤니티: 인증 교사 · 북마크 ───
  if (source === 'community') {
    const certified = sets.filter((s) => s.is_certified).slice(0, 12)
    if (certified.length > 0) {
      rows.push(
        <SetsCarouselRow
          key="row-cert"
          title={R.certified.title}
          subtitle={R.certified.subtitle}
          icon={<CheckCircle2 className="h-5 w-5 text-blue-500" />}
          items={certified}
          {...rowProps}
        />,
      )
    }
    const bookmarked = sets.filter((s) => s.is_bookmarked)
    if (bookmarked.length > 0) {
      rows.push(
        <SetsCarouselRow
          key="row-bm"
          title={R.bookmarked.title}
          subtitle={R.bookmarked.subtitle}
          icon={<Heart className="h-5 w-5 text-rose-500" />}
          items={bookmarked}
          {...rowProps}
        />,
      )
    }
  }

  // 경고 방지: Flame unused in this file
  void Flame

  return <div className="space-y-10">{rows}</div>
}

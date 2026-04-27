'use client'

// row 구성 정책 — Phase 시연 모드
//  - phase='mvp':    시간컷·수학로드맵·영어어휘·영어문법·의사소통 등
//  - phase='phase1': MVP 콘텐츠 + 초등 맞춤법·독해·한국사·매캔 채널
//  - phase='phase2': 1차 + 교사 인기·AI 재가공·전과목 어휘·월간 신작

import { useEffect, useState } from 'react'
import {
  Sparkles,
  Trophy,
  BookOpen,
  GraduationCap,
  History,
  Heart,
  CheckCircle2,
  Timer,
  Compass,
  MessagesSquare,
  PenLine,
  ScrollText,
  Rocket,
  Award,
  Bot,
  Calendar,
  Languages,
  Star,
} from 'lucide-react'
import { SetsCarouselRow } from './SetsCarouselRow'
import { HubTopRankRow } from './HubTopRankRow'
import { SETS_HUB_LABELS } from '../_labels'
import {
  MVP_MATH_ROADMAP,
  MVP_MATH_TIME,
  MVP_ENG_VOCAB,
  MVP_ENG_GRAMMAR_GRADE,
  MVP_ENG_GRAMMAR_THEME,
  MVP_ENG_TALK,
  MVP_ENG_TIME,
  PHASE1_SPELLING,
  PHASE1_KOREAN_READ,
  PHASE1_HISTORY,
  PHASE1_MACCANN,
  PHASE2_TEACHER_POPULAR,
  PHASE2_REMIX,
  PHASE2_VOCAB_ALL,
  PHASE2_MONTHLY,
  type Phase,
} from '@/lib/phase-data'
import type { QuestionSet } from '@/types'
import type { SourceTab } from './SetsSourcePills'
import type { SetBadgeKind } from '@/components/common/SetBadge'

function badgesFor(s: QuestionSet): SetBadgeKind[] {
  if (s.source === 'quiz_party' || s.is_official) return ['official']
  if (s.source === 'mine') return ['mine']
  if (s.source === 'community') return ['community']
  return []
}

const CONTINUE_DISMISSED_KEY = 'sets-hub-continue-dismissed'

export function SetsHubCarousels({
  sets,
  source,
  phase,
  onPreview,
  onQuickStart,
  seenIds,
}: {
  sets: QuestionSet[]
  source: SourceTab
  phase: Phase
  onPreview: (setId: string) => void
  onQuickStart: (setId: string) => void
  seenIds: Set<string>
}) {
  const R = SETS_HUB_LABELS.rows
  const rows: Array<React.ReactNode> = []
  const rowProps = { onPreview, onQuickStart, seenIds, getBadges: badgesFor }

  // ─── 이어서 시작하기 dismiss 상태 ───
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

  // ─── 공통 row 1: 이어서 시작하기 ───
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

  // ─── 공통 row 2: 오늘의 Top 10 ───
  if (source !== 'mine') {
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

  // ═════════════════════════════════════════════════════════
  // 2차 고도화 — 교사 커뮤니티·AI 재가공·전과목 어휘·월간 신작
  // ═════════════════════════════════════════════════════════
  if (phase === 'phase2' && source !== 'mine') {
    rows.push(
      <SetsCarouselRow
        key="row-p2-popular"
        title="🏆 이번 주 인기 교사 콘텐츠"
        subtitle="좋아요·다운로드 상위 — 교사 커뮤니티 검증 완료"
        icon={<Award className="h-5 w-5 text-amber-500" />}
        items={PHASE2_TEACHER_POPULAR}
        {...rowProps}
      />,
    )
    rows.push(
      <SetsCarouselRow
        key="row-p2-remix"
        title="🤖 AI 재가공 가능 — 우리 학생 맞춤"
        subtitle="인기 콘텐츠를 우리반 수준·시험 스타일로 즉시 변환"
        icon={<Bot className="h-5 w-5 text-violet-500" />}
        items={PHASE2_REMIX}
        {...rowProps}
      />,
    )
    rows.push(
      <SetsCarouselRow
        key="row-p2-monthly"
        title="🆕 4월 신작 — 매달 새로 추가되는 콘텐츠"
        subtitle="시즌·이슈에 맞춘 월간 큐레이션"
        icon={<Calendar className="h-5 w-5 text-rose-500" />}
        items={PHASE2_MONTHLY}
        {...rowProps}
      />,
    )
    rows.push(
      <SetsCarouselRow
        key="row-p2-vocab"
        title="공부력 초등 전과목 어휘"
        subtitle="국어·수학·사회·과학·한자·영어 — 학년 종합"
        icon={<Languages className="h-5 w-5 text-emerald-500" />}
        items={PHASE2_VOCAB_ALL}
        {...rowProps}
      />,
    )
  }

  // ═════════════════════════════════════════════════════════
  // 1차 고도화 — 초등 특화 (1차 & 2차 phase 둘 다 노출)
  // ═════════════════════════════════════════════════════════
  if ((phase === 'phase1' || phase === 'phase2') && source !== 'mine') {
    rows.push(
      <SetsCarouselRow
        key="row-p1-maccann"
        title="🚀 매캔(MacCann) 채널 연동 패키지"
        subtitle="파트너십 채널과 연동된 초등 타겟 — 학생 도달까지 함께 공략"
        icon={<Rocket className="h-5 w-5 text-fuchsia-500" />}
        items={PHASE1_MACCANN}
        {...rowProps}
      />,
    )
    rows.push(
      <SetsCarouselRow
        key="row-p1-spelling"
        title="✍️ 초등 맞춤법 마스터팩"
        subtitle="저학년 100단어 → 고학년 60문항 — 학년대별 짧고 강한 세트"
        icon={<PenLine className="h-5 w-5 text-pink-500" />}
        items={PHASE1_SPELLING}
        {...rowProps}
      />,
    )
    rows.push(
      <SetsCarouselRow
        key="row-p1-kor-read"
        title="📖 초등 국어 독해 — 저학년 · 고학년"
        subtitle="짧은 글부터 비문학·문학까지 — 학년 흥미를 잡는 주제 중심"
        icon={<ScrollText className="h-5 w-5 text-orange-500" />}
        items={PHASE1_KOREAN_READ}
        {...rowProps}
      />,
    )
    rows.push(
      <SetsCarouselRow
        key="row-p1-history"
        title="🧑‍🎤 한국사 인물편 · 🏯 시대편"
        subtitle="인물 중심·시대 흐름 — 캐릭터 친화적인 초등 한국사 게임"
        icon={<GraduationCap className="h-5 w-5 text-rose-600" />}
        items={PHASE1_HISTORY}
        {...rowProps}
      />,
    )
  }

  // ═════════════════════════════════════════════════════════
  // MVP — 시간 컷, 수학 로드맵, 영어 어휘·문법·의사소통 (모든 phase에 노출)
  // ═════════════════════════════════════════════════════════
  if (source !== 'mine') {
    rows.push(
      <SetsCarouselRow
        key="row-mvp-mtime"
        title="⏱️ 수학 시간 컷 — 지식요인 단위 숏팩"
        subtitle="5분 몸풀기 · 10분 벼락치기 · 15분 정복 · 20분 도전"
        icon={<Timer className="h-5 w-5 text-blue-500" />}
        items={MVP_MATH_TIME}
        {...rowProps}
      />,
    )
    rows.push(
      <SetsCarouselRow
        key="row-mvp-etime"
        title="⏱️ 영어 시간 컷 — 어휘·문법 단위 숏팩"
        subtitle="중1 be동사 vs 일반동사 · 중1 필수 어휘 · 중2 현재완료 등"
        icon={<Timer className="h-5 w-5 text-cyan-500" />}
        items={MVP_ENG_TIME}
        {...rowProps}
      />,
    )
    rows.push(
      <SetsCarouselRow
        key="row-mvp-mathroad"
        title="🧮 수학 — 주제 관통 로드맵 팩"
        subtitle="분수 풀코스부터 함수 로드맵까지 — 학년을 가로지르는 마스터 코스"
        icon={<Compass className="h-5 w-5 text-amber-500" />}
        items={MVP_MATH_ROADMAP}
        {...rowProps}
      />,
    )
    rows.push(
      <SetsCarouselRow
        key="row-mvp-evocab"
        title="📘 영어 — 학년별 어휘 마스터 팩"
        subtitle="이 학년 진도 맞는 어휘 딱 주세요에 바로 대응"
        icon={<BookOpen className="h-5 w-5 text-emerald-500" />}
        items={MVP_ENG_VOCAB}
        {...rowProps}
      />,
    )
    rows.push(
      <SetsCarouselRow
        key="row-mvp-egrammar-grade"
        title="📝 영어 — 학년별 문법 마스터 팩"
        subtitle="중1 18종, 중2 17종, 공1·공2 9종 — 항목별 50문항"
        icon={<Star className="h-5 w-5 text-violet-500" />}
        items={MVP_ENG_GRAMMAR_GRADE}
        {...rowProps}
      />,
    )
    rows.push(
      <SetsCarouselRow
        key="row-mvp-egrammar-theme"
        title="🗺️ 영어 — 문법 테마 로드맵"
        subtitle="시제 대서사시·동사 확장·to부정사 풀코스·관계사 올인원·비교 구문 등"
        icon={<Trophy className="h-5 w-5 text-purple-500" />}
        items={MVP_ENG_GRAMMAR_THEME}
        {...rowProps}
      />,
    )
    rows.push(
      <SetsCarouselRow
        key="row-mvp-etalk"
        title="💬 영어 — 초등 의사소통 기능 팩"
        subtitle="묻고 답하기·감정 태도·생활 상황·공간 시간 — 24기능 풀세트"
        icon={<MessagesSquare className="h-5 w-5 text-pink-500" />}
        items={MVP_ENG_TALK}
        {...rowProps}
      />,
    )
  }

  // ─── 내가 만든 ───
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
  }

  // ─── 커뮤니티 ───
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

  return <div className="space-y-10">{rows}</div>
}

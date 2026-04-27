'use client'

// Phase별 큐레이션 섹션 — 보고용 이미지 큐레이션 컬럼과 1:1 매핑
// 사용자 명세 기준 큐레이션 구조:
//   MVP 수학: 타임어택 / 학년 > 지식요인별 / 테마별
//   MVP 영어: 타임어택 / 학년 > 문법 / 학년 > 어휘 / 테마별
//   1차 추가: 주제 몰입형 (맞춤법·국어독해·한국사·매캔)
//   2차 추가: 커뮤니티 기반 순환 (인기교사·like·AI재가공·월간·내세트지 편입)
//   "이어서 시작하기" — 모든 phase에서 마지막에 노출

import { useEffect, useState } from 'react'
import {
  Sparkles,
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
  BookOpen,
  Trophy,
  GraduationCap,
  Crown,
  TrendingUp,
  Layers,
} from 'lucide-react'
import { SetsCarouselRow } from './SetsCarouselRow'
import { HubTopRankRow } from './HubTopRankRow'
import { SETS_HUB_LABELS } from '../_labels'
import {
  MVP_MATH_ROADMAP,
  MVP_MATH_BY_GRADE_KE,
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
  PHASE_FILTER_CONFIG,
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

// ─── 섹션 헤더 (이미지 큐레이션 컬럼 텍스트 강조) ─────────────
function CurationSection({
  category,
  badge,
  description,
  accent,
  children,
}: {
  category: string
  badge?: string
  description?: string
  accent: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-baseline gap-3 border-b border-gray-200 pb-2">
        {badge && (
          <span className={`text-[11px] font-bold tracking-wider uppercase ${accent}`}>
            {badge}
          </span>
        )}
        <h2 className="text-base md:text-lg font-bold text-gray-900">{category}</h2>
        {description && <span className="text-xs text-gray-400">{description}</span>}
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  )
}

export function SetsHubCarousels({
  sets,
  source,
  phase,
  subjectFilter = '전체',
  onPreview,
  onQuickStart,
  seenIds,
}: {
  sets: QuestionSet[]
  source: SourceTab
  phase: Phase
  subjectFilter?: string
  onPreview: (setId: string) => void
  onQuickStart: (setId: string) => void
  seenIds: Set<string>
}) {
  const R = SETS_HUB_LABELS.rows
  const sections: Array<React.ReactNode> = []
  // 2차 고도화에서만 마켓플레이스 메타·AI/교사 뱃지 노출
  const showCommunityMeta = phase === 'phase2'
  const rowProps = { onPreview, onQuickStart, seenIds, getBadges: badgesFor, showCommunityMeta }

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

  // ─── 공통: Top 10 (PhaseConfig.showTop10 == true 일 때만) ───
  if (source !== 'mine' && PHASE_FILTER_CONFIG[phase].showTop10) {
    const top = [...sets]
      .filter((s) => (s.play_count ?? 0) > 0)
      .sort((a, b) => (b.play_count ?? 0) - (a.play_count ?? 0))
      .slice(0, 10)
    if (top.length >= 5) {
      sections.push(
        <HubTopRankRow
          key="row-top10"
          items={top}
          seenIds={seenIds}
          onPreview={onPreview}
          onQuickStart={onQuickStart}
          getBadges={badgesFor}
          showCommunityMeta={showCommunityMeta}
        />,
      )
    }
  }

  // ═════════════════════════════════════════════════════════
  // MVP — 수학 / 영어 두 개의 큰 섹션 (subjectFilter로 분기 가능)
  // ═════════════════════════════════════════════════════════
  const showMvpMath = phase === 'mvp' && source !== 'mine' && (subjectFilter === '전체' || subjectFilter === '수학')
  const showMvpEnglish = phase === 'mvp' && source !== 'mine' && (subjectFilter === '전체' || subjectFilter === '영어')

  if (showMvpMath) {
    // 🟦 수학 섹션
    sections.push(
      <CurationSection
        key="mvp-math"
        badge="MVP · 수학"
        category="타임어택 + 학년 > 지식요인 + 테마별"
        description="22개정 지식요인 단위 — 교과서 무관 즉시 시작"
        accent="text-blue-600"
      >
        <SetsCarouselRow
          title="⏱️ 타임어택 — 지식요인별 5/10/15/20분 컷"
          subtitle="중1 정수와 유리수 10분 · 중2 연립방정식 20분 도전 등"
          icon={<Timer className="h-5 w-5 text-blue-500" />}
          items={MVP_MATH_TIME}
          {...rowProps}
        />
        <SetsCarouselRow
          title="📐 학년 > 지식요인별 단원 세트지"
          subtitle="중1 정수와 유리수 · 중2 일차함수 · 초5 분수의 덧뺄셈 등"
          icon={<Layers className="h-5 w-5 text-indigo-500" />}
          items={MVP_MATH_BY_GRADE_KE}
          {...rowProps}
        />
        <SetsCarouselRow
          title="🧮 테마별 수학 — 학년 관통 풀코스 / 로드맵"
          subtitle="분수 풀코스 (초3-1 → 초6-2, 약 660문항) · 함수 로드맵 · 방정식 완전정복 등"
          icon={<Compass className="h-5 w-5 text-amber-500" />}
          items={MVP_MATH_ROADMAP}
          {...rowProps}
        />
      </CurationSection>,
    )
  }

  if (showMvpEnglish) {
    // 🟩 영어 섹션
    sections.push(
      <CurationSection
        key="mvp-english"
        badge="MVP · 영어"
        category="타임어택 + 학년 > 문법 + 학년 > 어휘 + 테마별"
        description="문법·어휘를 학년 진도와 학년 관통 두 축으로 동시 제공"
        accent="text-emerald-600"
      >
        <SetsCarouselRow
          title="⏱️ 타임어택 — 지식요인별 숏팩"
          subtitle="중1 be동사 vs 일반동사 5분 · 중2 현재완료 15분 벼락치기 등"
          icon={<Timer className="h-5 w-5 text-cyan-500" />}
          items={MVP_ENG_TIME}
          {...rowProps}
        />
        <SetsCarouselRow
          title="📝 학년 > 문법 요인별 마스터 팩"
          subtitle="중1 18종 · 중2 17종 · 공1·공2 9종 — 항목별 50문항"
          icon={<Star className="h-5 w-5 text-violet-500" />}
          items={MVP_ENG_GRAMMAR_GRADE}
          {...rowProps}
        />
        <SetsCarouselRow
          title="📘 학년 단위 어휘 마스터 팩"
          subtitle="이 학년 진도 맞는 어휘 딱 주세요에 바로 대응 — 학년별 12세트지"
          icon={<BookOpen className="h-5 w-5 text-emerald-500" />}
          items={MVP_ENG_VOCAB}
          {...rowProps}
        />
        <SetsCarouselRow
          title="🗺️ 테마별 영어 — 시제 대서사시 / 동사의 확장 외"
          subtitle="시제 대서사시 (중1 현재진행 → 공1 과거완료) · 동사 확장 · to부정사 풀코스 · 관계사 올인원 등"
          icon={<Trophy className="h-5 w-5 text-purple-500" />}
          items={MVP_ENG_GRAMMAR_THEME}
          {...rowProps}
        />
        <SetsCarouselRow
          title="💬 초등 의사소통 기능 팩"
          subtitle="묻고 답하기 · 감정 태도 · 생활 상황 · 공간 시간 — 24기능 풀세트"
          icon={<MessagesSquare className="h-5 w-5 text-pink-500" />}
          items={MVP_ENG_TALK}
          {...rowProps}
        />
      </CurationSection>,
    )
  }

  // ═════════════════════════════════════════════════════════
  // 1차 고도화 — 주제 몰입형 + MVP 누적
  // ═════════════════════════════════════════════════════════
  if (phase === 'phase1' && source !== 'mine') {
    sections.push(
      <CurationSection
        key="p1-immersion"
        badge="1차 고도화 · 주제 몰입형"
        category="짧고 강한 초등 특화 패키지"
        description="흥미 기반 큐레이션 + 매캔 채널 연동"
        accent="text-rose-600"
      >
        <SetsCarouselRow
          title="🚀 초등 매캔(MacCann) 채널 연동 패키지"
          subtitle="파트너십 채널과 연동된 초등 타겟 — 학생 도달까지 함께 공략"
          icon={<Rocket className="h-5 w-5 text-fuchsia-500" />}
          items={PHASE1_MACCANN}
          {...rowProps}
        />
        <SetsCarouselRow
          title="✍️ 초등 맞춤법 패키지"
          subtitle="저학년 100단어 → 고학년 60문항 — 학년대별 짧고 강한 세트"
          icon={<PenLine className="h-5 w-5 text-pink-500" />}
          items={PHASE1_SPELLING}
          {...rowProps}
        />
        <SetsCarouselRow
          title="📖 초등 국어 독해"
          subtitle="저학년 짧은 글·그림책 → 고학년 비문학·문학"
          icon={<ScrollText className="h-5 w-5 text-orange-500" />}
          items={PHASE1_KOREAN_READ}
          {...rowProps}
        />
        <SetsCarouselRow
          title="🧑‍🎤 저·고학년 초등 한국사 — 인물편 · 시대편"
          subtitle="인물 중심·시대 흐름 — 캐릭터 친화적인 초등 한국사 게임"
          icon={<GraduationCap className="h-5 w-5 text-rose-600" />}
          items={PHASE1_HISTORY}
          {...rowProps}
        />
      </CurationSection>,
    )
    // 1차에는 MVP 콘텐츠도 누적 노출
    sections.push(
      <CurationSection
        key="p1-mvp-base"
        badge="기존 MVP 콘텐츠"
        category="22개정 지식요인 기반 — 영수 기반 콘텐츠"
        description="시간 컷 + 학년 단원 + 테마별 풀코스"
        accent="text-slate-500"
      >
        <SetsCarouselRow
          title="⏱️ 수학·영어 시간 컷"
          icon={<Timer className="h-5 w-5 text-blue-500" />}
          items={[...MVP_MATH_TIME, ...MVP_ENG_TIME]}
          {...rowProps}
        />
        <SetsCarouselRow
          title="🧮 수학 테마별 + 📘 영어 학년 어휘"
          icon={<Compass className="h-5 w-5 text-amber-500" />}
          items={[...MVP_MATH_ROADMAP, ...MVP_ENG_VOCAB]}
          {...rowProps}
        />
      </CurationSection>,
    )
  }

  // ═════════════════════════════════════════════════════════
  // 2차 고도화 — 커뮤니티 기반 순환 + 1차/MVP 누적
  // ═════════════════════════════════════════════════════════
  if (phase === 'phase2' && source !== 'mine') {
    sections.push(
      <CurationSection
        key="p2-cycle"
        badge="2차 고도화 · 커뮤니티 기반 순환"
        category="교사가 만들고 공유하고 사용함"
        description="좋아요·공유 순위 + 월간 시즌·이슈"
        accent="text-violet-600"
      >
        <SetsCarouselRow
          title="🏆 인기 교사 제작 콘텐츠"
          subtitle="좋아요·다운로드 상위 — 교사 커뮤니티 검증 완료"
          icon={<Award className="h-5 w-5 text-amber-500" />}
          items={PHASE2_TEACHER_POPULAR}
          {...rowProps}
        />
        <SetsCarouselRow
          title="❤️ like · 공유 수 기반 순위"
          subtitle="진짜 교실에서 사용된 검증 콘텐츠"
          icon={<TrendingUp className="h-5 w-5 text-rose-500" />}
          items={[...PHASE2_TEACHER_POPULAR].sort((a, b) => (b.like_count ?? 0) - (a.like_count ?? 0))}
          {...rowProps}
        />
        <SetsCarouselRow
          title="🤖 AI 재가공 — 우리반·시험 스타일 맞춤"
          subtitle="인기 콘텐츠를 AI가 학년·난이도·시각화 강화로 즉시 변환"
          icon={<Bot className="h-5 w-5 text-violet-500" />}
          items={PHASE2_REMIX}
          {...rowProps}
        />
        <SetsCarouselRow
          title="🆕 월간 시즌 · 이슈 업데이트"
          subtitle="시즌·이슈에 맞춘 월간 큐레이션 — 매달 새로 추가"
          icon={<Calendar className="h-5 w-5 text-rose-500" />}
          items={PHASE2_MONTHLY}
          {...rowProps}
        />
        <SetsCarouselRow
          title="👑 내 세트지 → 공식 레디메이드 편입"
          subtitle="검증된 교사 콘텐츠가 공식 콘텐츠로 승격되어 모든 교사에게 노출"
          icon={<Crown className="h-5 w-5 text-amber-500" />}
          items={PHASE2_TEACHER_POPULAR.slice(0, 3).map((s) => ({ ...s, is_official: true }))}
          {...rowProps}
        />
      </CurationSection>,
    )
    sections.push(
      <CurationSection
        key="p2-vocab"
        badge="공부력 콘텐츠 확장"
        category="초등 전과목 어휘"
        description="국어·수학·사회·과학·한자·영어"
        accent="text-emerald-600"
      >
        <SetsCarouselRow
          title="🔤 공부력 초등 전과목 어휘"
          subtitle="국어·수학·사회·과학·한자·영어 — 학년 종합"
          icon={<Languages className="h-5 w-5 text-emerald-500" />}
          items={PHASE2_VOCAB_ALL}
          {...rowProps}
        />
      </CurationSection>,
    )
    // 2차에는 1차/MVP 콘텐츠도 누적 노출
    sections.push(
      <CurationSection
        key="p2-prev-base"
        badge="1차·MVP 누적 콘텐츠"
        category="초등 특화 + 22개정 지식요인 기반"
        accent="text-slate-500"
      >
        <SetsCarouselRow
          title="✍️ 초등 맞춤법 + 📖 국어 독해 + 🧑‍🎤 한국사"
          icon={<PenLine className="h-5 w-5 text-pink-500" />}
          items={[...PHASE1_SPELLING, ...PHASE1_KOREAN_READ, ...PHASE1_HISTORY]}
          {...rowProps}
        />
        <SetsCarouselRow
          title="🧮 수학 테마별 + 📘 영어 학년 어휘"
          icon={<Compass className="h-5 w-5 text-amber-500" />}
          items={[...MVP_MATH_ROADMAP, ...MVP_ENG_VOCAB]}
          {...rowProps}
        />
      </CurationSection>,
    )
  }

  // ─── 내가 만든 ───
  if (source === 'mine') {
    const recent = [...sets]
      .sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1))
      .slice(0, 10)
    if (recent.length > 0) {
      sections.push(
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
      sections.push(
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
      sections.push(
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

  // ─── 마지막: 이어서 시작하기 (모든 phase 공통) ───
  if (seenIds.size > 0 && !continueDismissed) {
    const seen = sets.filter((s) => seenIds.has(s.set_id)).slice(0, 12)
    if (seen.length > 0) {
      sections.push(
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

  return <div className="space-y-12">{sections}</div>
}

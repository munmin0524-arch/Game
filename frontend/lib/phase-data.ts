// Phase별 시연용 콘텐츠 정의 (MVP / 1차 고도화 / 2차 고도화)
// — GNB 하위 메뉴에서 phase 쿼리(?phase=mvp|phase1|phase2)로 분기
// — 모든 카드/카피/타일/Row 구성을 이 파일에서 단일 소스로 관리

import type { QuestionSet } from '@/types'

export type Phase = 'mvp' | 'phase1' | 'phase2'

export const PHASES: Array<{ key: Phase; label: string; sub: string }> = [
  { key: 'mvp',    label: 'MVP',         sub: '22개정 지식요인 기반' },
  { key: 'phase1', label: '1차 고도화',   sub: '초등 특화 콘텐츠' },
  { key: 'phase2', label: '2차 고도화',   sub: '교사 커뮤니티 × AI' },
]

// ─── Phase별 헤더 카피 ──────────────────────────────────────

export const PHASE_HEADERS: Record<Phase, {
  badge: string
  title: string
  subtitle: string
  gradient: string
}> = {
  mvp: {
    badge: 'MVP · 6개월 안에 진행 가능한 문항풀',
    title: '22개정 지식요인 기반 — 어떤 교과서를 쓰셔도 바로 시작',
    subtitle: '비상만이 아닌 전국 모든 학교의 교사가 쓸 수 있는 레디메이드 세트지. 교과서 종류에 관계없이 2022 개정 교육과정의 지식요인 단위로 묶어, 세팅 없이 즉시 사용하세요.',
    gradient: 'from-slate-700 to-slate-900',
  },
  phase1: {
    badge: '1차 고도화 · 초등 특화',
    title: '학생 집중도를 끌어올리는 — 초등 몰입 콘텐츠',
    subtitle: '게임이 가장 잘 통하는 나이, 초등을 잡으면 교실이 바뀝니다. 짧고 강한 세트지로 흥미를 극대화하고, 매캔(MacCann) 채널과 연동해 학생 도달까지 함께 공략합니다.',
    gradient: 'from-rose-600 to-orange-500',
  },
  phase2: {
    badge: '2차 고도화 · 교사 커뮤니티 × AI',
    title: '매달 새로워지는 — 교사가 만들고 교사가 키우는 콘텐츠',
    subtitle: '문항 생성을 AI가 지원하고, 교사 커뮤니티가 검증·확산합니다. 교사가 직접 만든 콘텐츠가 인기를 얻고 재가공되며, 매달 새 콘텐츠가 추가되어 플랫폼이 끊임없이 자랍니다.',
    gradient: 'from-violet-700 to-fuchsia-600',
  },
}

// ─── Phase별 카테고리 타일 ─────────────────────────────────

export interface PhaseTile {
  key: string
  emoji: string
  label: string
  sub: string
  gradient: string
  preset: { search?: string; subject?: string; phaseRow?: string }
}

export const PHASE_TILES: Record<Phase, PhaseTile[]> = {
  mvp: [
    { key: 'time-5',     emoji: '⏱️', label: '5분 몸풀기',    sub: '수업 도입',     gradient: 'from-sky-500 to-cyan-500',     preset: { search: '5분' } },
    { key: 'time-10',    emoji: '⏱️', label: '10분 벼락치기', sub: '쉬는시간 활용', gradient: 'from-blue-500 to-indigo-500',  preset: { search: '10분' } },
    { key: 'time-15',    emoji: '⏱️', label: '15분 정복',     sub: '단원 마무리',   gradient: 'from-violet-500 to-purple-500',preset: { search: '15분' } },
    { key: 'time-20',    emoji: '⏱️', label: '20분 도전',     sub: '시험 전 연습',  gradient: 'from-fuchsia-500 to-pink-500', preset: { search: '20분' } },
    { key: 'math-fullc', emoji: '🧮', label: '수학 풀코스',   sub: '학년 관통 로드맵', gradient: 'from-amber-500 to-orange-500', preset: { search: '풀코스', subject: '수학' } },
    { key: 'eng-vocab',  emoji: '📘', label: '영어 어휘 마스터팩', sub: '학년별 진도 대응', gradient: 'from-emerald-500 to-teal-500', preset: { search: '어휘 마스터', subject: '영어' } },
    { key: 'eng-grammar',emoji: '📝', label: '영어 문법 로드맵', sub: '시제·관계사·to부정사', gradient: 'from-rose-500 to-orange-500', preset: { search: '문법', subject: '영어' } },
    { key: 'eng-talk',   emoji: '💬', label: '초등 의사소통 팩', sub: '묻고답하기·생활대화', gradient: 'from-pink-500 to-rose-500', preset: { search: '의사소통', subject: '영어' } },
  ],
  phase1: [
    { key: 'spelling',   emoji: '✍️', label: '초등 맞춤법',   sub: '저학년 집중',     gradient: 'from-pink-500 to-rose-500',    preset: { search: '맞춤법' } },
    { key: 'kor-low',    emoji: '📖', label: '국어 독해 저학년', sub: '1~4학년',       gradient: 'from-orange-500 to-amber-500', preset: { search: '독해 저학년' } },
    { key: 'kor-high',   emoji: '📚', label: '국어 독해 고학년', sub: '5~6학년',       gradient: 'from-violet-500 to-purple-500',preset: { search: '독해 고학년' } },
    { key: 'history-p',  emoji: '🧑‍🎤', label: '한국사 인물편',  sub: '인물 중심 학습', gradient: 'from-rose-600 to-orange-500',  preset: { search: '한국사 인물' } },
    { key: 'history-e',  emoji: '🏯', label: '한국사 시대편',   sub: '시대 흐름',      gradient: 'from-emerald-500 to-teal-500', preset: { search: '한국사 시대' } },
    { key: 'maccann',    emoji: '🚀', label: '매캔 연동 패키지', sub: '파트너십 채널', gradient: 'from-fuchsia-500 to-pink-500', preset: { search: '매캔' } },
    { key: 'mvp-time',   emoji: '⏱️', label: '시간 컷 패키지',  sub: 'MVP 콘텐츠',    gradient: 'from-sky-500 to-cyan-500',     preset: { search: '벼락치기' } },
    { key: 'mvp-fullc',  emoji: '🧮', label: '수학 풀코스',     sub: 'MVP 콘텐츠',    gradient: 'from-amber-500 to-orange-500', preset: { search: '풀코스' } },
  ],
  phase2: [
    { key: 'pop-creator', emoji: '🏆', label: '인기 교사 콘텐츠', sub: '좋아요·다운로드', gradient: 'from-amber-500 to-orange-500', preset: { search: '인기' } },
    { key: 'remix',       emoji: '🤖', label: 'AI 재가공',         sub: '내 학생 맞춤',    gradient: 'from-violet-700 to-fuchsia-600', preset: { search: '재가공' } },
    { key: 'community',   emoji: '🤝', label: '커뮤니티 신작',     sub: '이번 주 신규',    gradient: 'from-blue-600 to-indigo-600',    preset: { search: '신작' } },
    { key: 'verified',    emoji: '✅', label: '검증된 콘텐츠',     sub: '인증 교사 작품',  gradient: 'from-emerald-500 to-teal-500',   preset: { search: '인증' } },
    { key: 'all-vocab',   emoji: '🔤', label: '초등 전과목 어휘',  sub: '국·수·과·사·한자', gradient: 'from-rose-500 to-orange-500',    preset: { search: '전과목 어휘' } },
    { key: 'monthly',     emoji: '🆕', label: '월간 신규',          sub: '매달 추가',       gradient: 'from-pink-500 to-rose-500',      preset: { search: '월간' } },
    { key: 'p1-spelling', emoji: '✍️', label: '초등 맞춤법',       sub: '1차 콘텐츠',      gradient: 'from-fuchsia-500 to-pink-500',   preset: { search: '맞춤법' } },
    { key: 'mvp-time',    emoji: '⏱️', label: '시간 컷 패키지',    sub: 'MVP 콘텐츠',     gradient: 'from-sky-500 to-cyan-500',       preset: { search: '벼락치기' } },
  ],
}

// ═════════════════════════════════════════════════════════════
// MVP 콘텐츠
// ═════════════════════════════════════════════════════════════

// 수학 — 주제 관통 로드맵 팩 (대표 10개)
export const MVP_MATH_ROADMAP: QuestionSet[] = [
  { set_id: 'mvp-m-c1', host_member_id: 'quiz_party', title: 'C-1 분수 풀코스 (초3 → 초6)', subject: '수학', grade: null, tags: ['풀코스','수와연산','분수'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 660, difficulty: '중', thumbnail_variant: 1, play_count: 1024, rating_avg: 4.9, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'mvp-m-c2', host_member_id: 'quiz_party', title: 'C-2 소수 풀코스 (초3 → 초6)', subject: '수학', grade: null, tags: ['풀코스','수와연산','소수'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 466, difficulty: '중', thumbnail_variant: 2, play_count: 812, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-m-c7', host_member_id: 'quiz_party', title: 'C-7 규칙·대응·비례 계보 (초4 → 중1)', subject: '수학', grade: null, tags: ['로드맵','변화와관계'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-28T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 441, difficulty: '중', thumbnail_variant: 3, play_count: 612, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-m-c8', host_member_id: 'quiz_party', title: 'C-8 방정식 완전정복 (초6 → 공통1)', subject: '수학', grade: null, tags: ['완전정복','방정식'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-25T09:00:00Z', updated_at: '2026-04-09T09:00:00Z', question_count: 530, difficulty: '상', thumbnail_variant: 4, play_count: 745, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'mvp-m-c9', host_member_id: 'quiz_party', title: 'C-9 함수 로드맵 (초6 → 공통2)', subject: '수학', grade: null, tags: ['로드맵','함수'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-22T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 700, difficulty: '상', thumbnail_variant: 5, play_count: 891, rating_avg: 4.9, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-m-c12',host_member_id: 'quiz_party', title: 'C-12 평면도형의 성장 (초3 → 공통2)', subject: '수학', grade: null, tags: ['로드맵','도형'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-18T09:00:00Z', updated_at: '2026-04-05T09:00:00Z', question_count: 603, difficulty: '중', thumbnail_variant: 0, play_count: 532, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-m-c14',host_member_id: 'quiz_party', title: 'C-14 도형의 성질 계보 (초6 → 중2)', subject: '수학', grade: null, tags: ['계보','도형'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-15T09:00:00Z', updated_at: '2026-04-03T09:00:00Z', question_count: 607, difficulty: '중', thumbnail_variant: 1, play_count: 478, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-m-c16',host_member_id: 'quiz_party', title: 'C-16 측정 완전정복 (초3 → 초6)', subject: '수학', grade: null, tags: ['완전정복','측정'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-12T09:00:00Z', updated_at: '2026-04-01T09:00:00Z', question_count: 525, difficulty: '하', thumbnail_variant: 2, play_count: 356, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-m-c18',host_member_id: 'quiz_party', title: 'C-18 그래프의 진화사 (초3 → 공통2)', subject: '수학', grade: null, tags: ['로드맵','자료와가능성'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-10T09:00:00Z', updated_at: '2026-03-30T09:00:00Z', question_count: 500, difficulty: '중', thumbnail_variant: 3, play_count: 412, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-m-c20',host_member_id: 'quiz_party', title: 'C-20 AI 시대 수학 소양 팩 (초6 → 중2)', subject: '수학', grade: null, tags: ['융합','AI소양'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-05T09:00:00Z', updated_at: '2026-03-28T09:00:00Z', question_count: 300, difficulty: '중', thumbnail_variant: 4, play_count: 289, rating_avg: 4.7, is_official: true, is_new: true, source: 'quiz_party' },
]

// 수학 — 시간 컷 (지식요인 단위 숏팩)
export const MVP_MATH_TIME: QuestionSet[] = [
  { set_id: 'mvp-mt-01', host_member_id: 'quiz_party', title: '중1 정수와 유리수 — 10분 벼락치기', subject: '수학', grade: '중등 수학 수학1', tags: ['10분','정수','유리수'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-10T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 12, difficulty: '하', thumbnail_variant: 1, play_count: 678, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'mvp-mt-02', host_member_id: 'quiz_party', title: '중1 일차방정식 — 15분 정복', subject: '수학', grade: '중등 수학 수학1', tags: ['15분','일차방정식'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-09T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 18, difficulty: '중', thumbnail_variant: 2, play_count: 524, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-mt-03', host_member_id: 'quiz_party', title: '초5 분수의 덧셈·뺄셈 — 5분 몸풀기', subject: '수학', grade: '초등 수학 5-1', tags: ['5분','분수'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-08T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 8, difficulty: '하', thumbnail_variant: 3, play_count: 891, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-mt-04', host_member_id: 'quiz_party', title: '중2 연립방정식 — 20분 도전', subject: '수학', grade: '중등 수학 수학2', tags: ['20분','연립방정식'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-07T09:00:00Z', updated_at: '2026-04-11T09:00:00Z', question_count: 22, difficulty: '상', thumbnail_variant: 4, play_count: 312, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-mt-05', host_member_id: 'quiz_party', title: '초6 비와 비율 — 10분 벼락치기', subject: '수학', grade: '초등 수학 6-1', tags: ['10분','비와비율'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-06T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 14, difficulty: '하', thumbnail_variant: 5, play_count: 412, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-mt-06', host_member_id: 'quiz_party', title: '중3 이차방정식 — 15분 벼락치기', subject: '수학', grade: null, tags: ['15분','이차방정식'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-05T09:00:00Z', updated_at: '2026-04-09T09:00:00Z', question_count: 16, difficulty: '상', thumbnail_variant: 0, play_count: 278, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-mt-07', host_member_id: 'quiz_party', title: '중1 작도와 합동 — 15분 정복', subject: '수학', grade: '중등 수학 수학1', tags: ['15분','작도','합동'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-04T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 17, difficulty: '중', thumbnail_variant: 1, play_count: 198, rating_avg: 4.5, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-mt-08', host_member_id: 'quiz_party', title: '중2 일차함수 — 20분 도전', subject: '수학', grade: '중등 수학 수학2', tags: ['20분','일차함수'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-03T09:00:00Z', updated_at: '2026-04-07T09:00:00Z', question_count: 20, difficulty: '중', thumbnail_variant: 2, play_count: 256, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
]

// 영어 — 학년별 어휘 마스터 팩
export const MVP_ENG_VOCAB: QuestionSet[] = [
  { set_id: 'mvp-ev-01', host_member_id: 'quiz_party', title: '초5 어휘 마스터 팩 — 12단원 × 단어 12세트', subject: '영어', grade: '초등 영어 5', tags: ['어휘 마스터'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 2478, difficulty: '하', thumbnail_variant: 1, play_count: 412, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-ev-02', host_member_id: 'quiz_party', title: '초6 어휘 마스터 팩 — 12단원 × 단어 12세트', subject: '영어', grade: '초등 영어 6', tags: ['어휘 마스터'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-11T09:00:00Z', question_count: 2478, difficulty: '하', thumbnail_variant: 2, play_count: 389, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-ev-03', host_member_id: 'quiz_party', title: '중1 어휘 마스터 팩 — 8단원 × 단어 12세트', subject: '영어', grade: '중등 영어 영어1', tags: ['어휘 마스터'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-28T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 3533, difficulty: '중', thumbnail_variant: 3, play_count: 521, rating_avg: 4.9, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'mvp-ev-04', host_member_id: 'quiz_party', title: '중2 어휘 마스터 팩 — 8단원 × 단어 12세트', subject: '영어', grade: '중등 영어 영어2', tags: ['어휘 마스터'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-25T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 3533, difficulty: '중', thumbnail_variant: 4, play_count: 467, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-ev-05', host_member_id: 'quiz_party', title: '공1 어휘 마스터 팩 — 4단원 × 단어 12세트', subject: '영어', grade: '고등 영어 공통영어1', tags: ['어휘 마스터'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-20T09:00:00Z', updated_at: '2026-04-05T09:00:00Z', question_count: 2030, difficulty: '상', thumbnail_variant: 5, play_count: 312, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-ev-06', host_member_id: 'quiz_party', title: '공2 어휘 마스터 팩 — 4단원 × 단어 12세트', subject: '영어', grade: '고등 영어 공통영어2', tags: ['어휘 마스터'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-15T09:00:00Z', updated_at: '2026-04-02T09:00:00Z', question_count: 2030, difficulty: '상', thumbnail_variant: 0, play_count: 287, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
]

// 영어 — 의사소통 기능 (초등)
export const MVP_ENG_TALK: QuestionSet[] = [
  { set_id: 'mvp-et-01', host_member_id: 'quiz_party', title: '초5 의사소통 기능 풀세트 — 24기능 전체', subject: '영어', grade: '초등 영어 5', tags: ['의사소통','풀세트'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-02T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 480, difficulty: '하', thumbnail_variant: 1, play_count: 478, rating_avg: 4.9, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'mvp-et-02', host_member_id: 'quiz_party', title: '초6 의사소통 기능 풀세트 — 24기능 전체', subject: '영어', grade: '초등 영어 6', tags: ['의사소통','풀세트'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-02T09:00:00Z', updated_at: '2026-04-11T09:00:00Z', question_count: 480, difficulty: '하', thumbnail_variant: 2, play_count: 412, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-et-03', host_member_id: 'quiz_party', title: '묻고 답하기 마스터 팩 — 19+ 유형', subject: '영어', grade: null, tags: ['의사소통','묻고답하기'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-30T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 240, difficulty: '하', thumbnail_variant: 3, play_count: 567, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-et-04', host_member_id: 'quiz_party', title: '감정·태도 표현 팩 — 8개 항목', subject: '영어', grade: null, tags: ['의사소통','감정태도'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-28T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 96, difficulty: '하', thumbnail_variant: 4, play_count: 312, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-et-05', host_member_id: 'quiz_party', title: '생활 상황 대화 팩 — 7개 항목', subject: '영어', grade: null, tags: ['의사소통','생활대화'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-26T09:00:00Z', updated_at: '2026-04-06T09:00:00Z', question_count: 84, difficulty: '하', thumbnail_variant: 5, play_count: 268, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-et-06', host_member_id: 'quiz_party', title: '공간·시간·방향 팩 — 6개 항목', subject: '영어', grade: null, tags: ['의사소통','공간시간'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-24T09:00:00Z', updated_at: '2026-04-04T09:00:00Z', question_count: 72, difficulty: '하', thumbnail_variant: 0, play_count: 234, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
]

// 영어 — 문법 학년별 마스터 팩
export const MVP_ENG_GRAMMAR_GRADE: QuestionSet[] = [
  { set_id: 'mvp-eg-01', host_member_id: 'quiz_party', title: '중1 문법 18종 마스터 팩 — 항목 × 50문항', subject: '영어', grade: '중등 영어 영어1', tags: ['문법 마스터'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-30T09:00:00Z', updated_at: '2026-04-11T09:00:00Z', question_count: 2400, difficulty: '중', thumbnail_variant: 1, play_count: 612, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'mvp-eg-02', host_member_id: 'quiz_party', title: '중2 문법 17종 마스터 팩 — 항목 × 50문항', subject: '영어', grade: '중등 영어 영어2', tags: ['문법 마스터'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-28T09:00:00Z', updated_at: '2026-04-09T09:00:00Z', question_count: 2400, difficulty: '중', thumbnail_variant: 2, play_count: 528, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-eg-03', host_member_id: 'quiz_party', title: '공1 문법 9종 마스터 팩 — 항목 × 50문항', subject: '영어', grade: '고등 영어 공통영어1', tags: ['문법 마스터'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-25T09:00:00Z', updated_at: '2026-04-06T09:00:00Z', question_count: 1200, difficulty: '상', thumbnail_variant: 3, play_count: 367, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-eg-04', host_member_id: 'quiz_party', title: '공2 문법 9종 마스터 팩 — 항목 × 50문항', subject: '영어', grade: '고등 영어 공통영어2', tags: ['문법 마스터'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-22T09:00:00Z', updated_at: '2026-04-04T09:00:00Z', question_count: 1200, difficulty: '상', thumbnail_variant: 4, play_count: 298, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
]

// 영어 — 문법 테마 로드맵
export const MVP_ENG_GRAMMAR_THEME: QuestionSet[] = [
  { set_id: 'mvp-egt-01', host_member_id: 'quiz_party', title: '시제 대서사시 팩 (중1 현재진행 → 공1 과거완료)', subject: '영어', grade: null, tags: ['문법 로드맵','시제'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-26T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 250, difficulty: '중', thumbnail_variant: 1, play_count: 612, rating_avg: 4.9, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'mvp-egt-02', host_member_id: 'quiz_party', title: '동사의 확장 팩 (중1 be동사 → 공2 동사+목적어+to)', subject: '영어', grade: null, tags: ['문법 로드맵','동사'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-24T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 320, difficulty: '중', thumbnail_variant: 2, play_count: 478, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-egt-03', host_member_id: 'quiz_party', title: 'to부정사 풀코스 팩 (중1 명사 → 공2 seem to)', subject: '영어', grade: null, tags: ['문법 로드맵','to부정사'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-22T09:00:00Z', updated_at: '2026-04-06T09:00:00Z', question_count: 220, difficulty: '중', thumbnail_variant: 3, play_count: 412, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-egt-04', host_member_id: 'quiz_party', title: '관계사 올인원 팩 (중2 주격 → 공2 분사 후치)', subject: '영어', grade: null, tags: ['문법 로드맵','관계사'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-20T09:00:00Z', updated_at: '2026-04-04T09:00:00Z', question_count: 280, difficulty: '상', thumbnail_variant: 4, play_count: 389, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-egt-05', host_member_id: 'quiz_party', title: '비교 구문 로드맵 팩 (중1 비교급 → 공2 as many)', subject: '영어', grade: null, tags: ['문법 로드맵','비교'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-18T09:00:00Z', updated_at: '2026-04-02T09:00:00Z', question_count: 180, difficulty: '중', thumbnail_variant: 5, play_count: 312, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-egt-06', host_member_id: 'quiz_party', title: '접속사·연결어 계보 팩 (중1 when → 공2 unless)', subject: '영어', grade: null, tags: ['문법 로드맵','접속사'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-16T09:00:00Z', updated_at: '2026-03-30T09:00:00Z', question_count: 200, difficulty: '중', thumbnail_variant: 0, play_count: 256, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-egt-07', host_member_id: 'quiz_party', title: '특수 구문 배틀 팩 (중1 감탄문 → 공2 with+분사)', subject: '영어', grade: null, tags: ['문법 로드맵','특수구문'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-14T09:00:00Z', updated_at: '2026-03-28T09:00:00Z', question_count: 240, difficulty: '상', thumbnail_variant: 1, play_count: 234, rating_avg: 4.5, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-egt-08', host_member_id: 'quiz_party', title: '수동·분사 구문 팩 (중2 수동태 → 공2 with+분사)', subject: '영어', grade: null, tags: ['문법 로드맵','수동분사'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-12T09:00:00Z', updated_at: '2026-03-26T09:00:00Z', question_count: 160, difficulty: '상', thumbnail_variant: 2, play_count: 198, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
]

// 영어 — 시간 컷 (어휘·문법 단위 숏팩)
export const MVP_ENG_TIME: QuestionSet[] = [
  { set_id: 'mvp-et-t01', host_member_id: 'quiz_party', title: '중1 be동사 vs 일반동사 — 5분 몸풀기', subject: '영어', grade: '중등 영어 영어1', tags: ['5분','be동사','일반동사'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-10T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 8, difficulty: '하', thumbnail_variant: 1, play_count: 712, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'mvp-et-t02', host_member_id: 'quiz_party', title: '중1 필수 어휘 — 10분 몸풀기', subject: '영어', grade: '중등 영어 영어1', tags: ['10분','필수어휘'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-09T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 15, difficulty: '하', thumbnail_variant: 2, play_count: 567, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-et-t03', host_member_id: 'quiz_party', title: '중2 현재완료 — 15분 벼락치기', subject: '영어', grade: '중등 영어 영어2', tags: ['15분','현재완료'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-08T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 18, difficulty: '중', thumbnail_variant: 3, play_count: 423, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-et-t04', host_member_id: 'quiz_party', title: '중1 과거시제 — 10분 정복', subject: '영어', grade: '중등 영어 영어1', tags: ['10분','과거시제'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-07T09:00:00Z', updated_at: '2026-04-11T09:00:00Z', question_count: 12, difficulty: '하', thumbnail_variant: 4, play_count: 389, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-et-t05', host_member_id: 'quiz_party', title: '중2 관계대명사 — 15분 벼락치기', subject: '영어', grade: '중등 영어 영어2', tags: ['15분','관계대명사'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-06T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 18, difficulty: '상', thumbnail_variant: 5, play_count: 312, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-et-t06', host_member_id: 'quiz_party', title: '공1 시제 종합 — 20분 도전', subject: '영어', grade: '고등 영어 공통영어1', tags: ['20분','시제'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-05T09:00:00Z', updated_at: '2026-04-09T09:00:00Z', question_count: 22, difficulty: '상', thumbnail_variant: 0, play_count: 234, rating_avg: 4.5, is_official: true, source: 'quiz_party' },
  { set_id: 'mvp-et-t07', host_member_id: 'quiz_party', title: '초6 일상 어휘 — 5분 몸풀기', subject: '영어', grade: '초등 영어 6', tags: ['5분','일상어휘'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-04T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 10, difficulty: '하', thumbnail_variant: 1, play_count: 467, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
]

export const MVP_ALL_SETS: QuestionSet[] = [
  ...MVP_MATH_ROADMAP,
  ...MVP_MATH_TIME,
  ...MVP_ENG_VOCAB,
  ...MVP_ENG_TALK,
  ...MVP_ENG_GRAMMAR_GRADE,
  ...MVP_ENG_GRAMMAR_THEME,
  ...MVP_ENG_TIME,
]

// ═════════════════════════════════════════════════════════════
// 1차 고도화 콘텐츠 (MVP + 초등 특화 추가)
// ═════════════════════════════════════════════════════════════

export const PHASE1_SPELLING: QuestionSet[] = [
  { set_id: 'p1-sp-01', host_member_id: 'quiz_party', title: '초등 맞춤법 마스터팩 (1~2학년) — 주의 단어 100', subject: '국어', grade: null, tags: ['맞춤법','초등 저학년'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-12T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 100, difficulty: '하', thumbnail_variant: 1, play_count: 1245, rating_avg: 4.9, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'p1-sp-02', host_member_id: 'quiz_party', title: '초등 맞춤법 마스터팩 (3~4학년) — 헷갈리는 80', subject: '국어', grade: null, tags: ['맞춤법','초등 중학년'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-12T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 80, difficulty: '하', thumbnail_variant: 2, play_count: 892, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'p1-sp-03', host_member_id: 'quiz_party', title: '초등 맞춤법 마스터팩 (5~6학년) — 실전 60', subject: '국어', grade: null, tags: ['맞춤법','초등 고학년'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-11T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 60, difficulty: '중', thumbnail_variant: 3, play_count: 678, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
]

export const PHASE1_KOREAN_READ: QuestionSet[] = [
  { set_id: 'p1-kr-01', host_member_id: 'quiz_party', title: '초등 국어 독해 저학년 — 짧은 글 30선', subject: '국어', grade: null, tags: ['독해 저학년','초1~2'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-10T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 30, difficulty: '하', thumbnail_variant: 4, play_count: 723, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'p1-kr-02', host_member_id: 'quiz_party', title: '초등 국어 독해 저학년 — 그림책 읽기 활동', subject: '국어', grade: null, tags: ['독해 저학년','그림책'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-09T09:00:00Z', updated_at: '2026-04-11T09:00:00Z', question_count: 24, difficulty: '하', thumbnail_variant: 5, play_count: 567, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'p1-kr-03', host_member_id: 'quiz_party', title: '초등 국어 독해 고학년 — 비문학 50선', subject: '국어', grade: null, tags: ['독해 고학년','비문학'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-08T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 50, difficulty: '중', thumbnail_variant: 0, play_count: 489, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'p1-kr-04', host_member_id: 'quiz_party', title: '초등 국어 독해 고학년 — 문학 감상 30선', subject: '국어', grade: null, tags: ['독해 고학년','문학'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-07T09:00:00Z', updated_at: '2026-04-09T09:00:00Z', question_count: 30, difficulty: '중', thumbnail_variant: 1, play_count: 412, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
]

export const PHASE1_HISTORY: QuestionSet[] = [
  { set_id: 'p1-hp-01', host_member_id: 'quiz_party', title: '한국사 인물편 — 조선의 명군과 신하', subject: '한국사', grade: null, tags: ['한국사 인물','조선'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-08T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 40, difficulty: '중', thumbnail_variant: 2, play_count: 678, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'p1-hp-02', host_member_id: 'quiz_party', title: '한국사 인물편 — 독립운동가 열전', subject: '한국사', grade: null, tags: ['한국사 인물','독립운동'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-06T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 35, difficulty: '중', thumbnail_variant: 3, play_count: 523, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'p1-hp-03', host_member_id: 'quiz_party', title: '한국사 인물편 — 고려의 영웅들', subject: '한국사', grade: null, tags: ['한국사 인물','고려'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-04T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 28, difficulty: '중', thumbnail_variant: 4, play_count: 389, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'p1-he-01', host_member_id: 'quiz_party', title: '한국사 시대편 — 선사부터 삼국까지', subject: '한국사', grade: null, tags: ['한국사 시대','선사 삼국'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-02T09:00:00Z', updated_at: '2026-04-06T09:00:00Z', question_count: 32, difficulty: '중', thumbnail_variant: 5, play_count: 412, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'p1-he-02', host_member_id: 'quiz_party', title: '한국사 시대편 — 고려에서 조선까지', subject: '한국사', grade: null, tags: ['한국사 시대','고려 조선'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-30T09:00:00Z', updated_at: '2026-04-04T09:00:00Z', question_count: 36, difficulty: '중', thumbnail_variant: 0, play_count: 367, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'p1-he-03', host_member_id: 'quiz_party', title: '한국사 시대편 — 근현대사 핵심', subject: '한국사', grade: null, tags: ['한국사 시대','근현대'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-28T09:00:00Z', updated_at: '2026-04-02T09:00:00Z', question_count: 30, difficulty: '상', thumbnail_variant: 1, play_count: 312, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
]

export const PHASE1_MACCANN: QuestionSet[] = [
  { set_id: 'p1-mc-01', host_member_id: 'quiz_party', title: '🚀 매캔 연동 — 분수 모험 (초등 수학)', subject: '수학', grade: null, tags: ['매캔','초등 수학'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-12T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 25, difficulty: '하', thumbnail_variant: 2, play_count: 1156, rating_avg: 4.9, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'p1-mc-02', host_member_id: 'quiz_party', title: '🚀 매캔 연동 — 영어 단어 사파리', subject: '영어', grade: null, tags: ['매캔','초등 영어'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-12T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 30, difficulty: '하', thumbnail_variant: 3, play_count: 989, rating_avg: 4.9, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'p1-mc-03', host_member_id: 'quiz_party', title: '🚀 매캔 연동 — 한자 탐험대', subject: '한자', grade: null, tags: ['매캔','초등 한자'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-11T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 20, difficulty: '하', thumbnail_variant: 4, play_count: 678, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'p1-mc-04', host_member_id: 'quiz_party', title: '🚀 매캔 연동 — 한국사 모험왕', subject: '한국사', grade: null, tags: ['매캔','초등 한국사'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-10T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 28, difficulty: '하', thumbnail_variant: 5, play_count: 567, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
]

export const PHASE1_ALL_SETS: QuestionSet[] = [
  ...MVP_ALL_SETS,
  ...PHASE1_SPELLING,
  ...PHASE1_KOREAN_READ,
  ...PHASE1_HISTORY,
  ...PHASE1_MACCANN,
]

// ═════════════════════════════════════════════════════════════
// 2차 고도화 콘텐츠 (1차 + 교사 커뮤니티 / AI 재가공)
// ═════════════════════════════════════════════════════════════

export const PHASE2_TEACHER_POPULAR: QuestionSet[] = [
  { set_id: 'p2-tp-01', host_member_id: 'h-kim',  title: '🏆 인기 1위 — 김민수T의 분수나눗셈 마스터팩', subject: '수학', grade: null, tags: ['교사 인기','분수'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-04-10T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 45, difficulty: '중', thumbnail_variant: 1, play_count: 2456, rating_avg: 4.9, like_count: 1245, download_count: 678, host_nickname: '김민수T', is_certified: true, is_new: true, source: 'community' },
  { set_id: 'p2-tp-02', host_member_id: 'h-park', title: '🏆 인기 2위 — 박지영T의 영어 시제 마스터', subject: '영어', grade: null, tags: ['교사 인기','시제'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-04-09T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 38, difficulty: '상', thumbnail_variant: 2, play_count: 2134, rating_avg: 4.9, like_count: 1089, download_count: 567, host_nickname: '박지영T', is_certified: true, source: 'community' },
  { set_id: 'p2-tp-03', host_member_id: 'h-lee',  title: '🏆 인기 3위 — 이수진T의 한국사 인물 도감', subject: '한국사', grade: null, tags: ['교사 인기','인물'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-04-08T09:00:00Z', updated_at: '2026-04-11T09:00:00Z', question_count: 50, difficulty: '중', thumbnail_variant: 3, play_count: 1923, rating_avg: 4.9, like_count: 945, download_count: 489, host_nickname: '이수진T', is_certified: true, source: 'community' },
  { set_id: 'p2-tp-04', host_member_id: 'h-jung', title: '🏆 인기 4위 — 정혜린T의 초등 맞춤법 챌린지', subject: '국어', grade: null, tags: ['교사 인기','맞춤법'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-04-07T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 40, difficulty: '하', thumbnail_variant: 4, play_count: 1756, rating_avg: 4.8, like_count: 823, download_count: 412, host_nickname: '정혜린T', is_certified: false, source: 'community' },
  { set_id: 'p2-tp-05', host_member_id: 'h-song', title: '🏆 인기 5위 — 송민호T의 과학 화학 반응식', subject: '과학', grade: null, tags: ['교사 인기','화학'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-04-06T09:00:00Z', updated_at: '2026-04-09T09:00:00Z', question_count: 32, difficulty: '상', thumbnail_variant: 5, play_count: 1612, rating_avg: 4.8, like_count: 745, download_count: 378, host_nickname: '송민호T', is_certified: true, source: 'community' },
  { set_id: 'p2-tp-06', host_member_id: 'h-ahn',  title: '🏆 인기 6위 — 안주영T의 일차함수 비주얼 팩', subject: '수학', grade: null, tags: ['교사 인기','일차함수'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-04-05T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 28, difficulty: '중', thumbnail_variant: 0, play_count: 1489, rating_avg: 4.7, like_count: 689, download_count: 345, host_nickname: '안주영T', is_certified: true, source: 'community' },
]

export const PHASE2_REMIX: QuestionSet[] = [
  { set_id: 'p2-rm-01', host_member_id: 'ai-remix', title: '🤖 AI 재가공 — 우리반 학생 수준 맞춤 분수 팩', subject: '수학', grade: null, tags: ['AI 재가공','맞춤'], is_deleted: false, is_shared: false, original_set_id: 'p2-tp-01', created_at: '2026-04-13T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 25, difficulty: '하', thumbnail_variant: 1, play_count: 234, rating_avg: 4.7, is_new: true, source: 'community' },
  { set_id: 'p2-rm-02', host_member_id: 'ai-remix', title: '🤖 AI 재가공 — 영어 시제, 우리 학교 시험 스타일', subject: '영어', grade: null, tags: ['AI 재가공','시험대비'], is_deleted: false, is_shared: false, original_set_id: 'p2-tp-02', created_at: '2026-04-12T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 30, difficulty: '중', thumbnail_variant: 2, play_count: 198, rating_avg: 4.6, is_new: true, source: 'community' },
  { set_id: 'p2-rm-03', host_member_id: 'ai-remix', title: '🤖 AI 재가공 — 한국사 인물, 캐주얼 톤', subject: '한국사', grade: null, tags: ['AI 재가공','캐주얼'], is_deleted: false, is_shared: false, original_set_id: 'p2-tp-03', created_at: '2026-04-11T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 28, difficulty: '하', thumbnail_variant: 3, play_count: 156, rating_avg: 4.6, source: 'community' },
  { set_id: 'p2-rm-04', host_member_id: 'ai-remix', title: '🤖 AI 재가공 — 화학 반응식, 시각화 강화 버전', subject: '과학', grade: null, tags: ['AI 재가공','시각화'], is_deleted: false, is_shared: false, original_set_id: 'p2-tp-05', created_at: '2026-04-10T09:00:00Z', updated_at: '2026-04-11T09:00:00Z', question_count: 22, difficulty: '중', thumbnail_variant: 4, play_count: 134, rating_avg: 4.5, source: 'community' },
  { set_id: 'p2-rm-05', host_member_id: 'ai-remix', title: '🤖 AI 재가공 — 맞춤법, 4학년 어휘 수준', subject: '국어', grade: null, tags: ['AI 재가공','어휘조정'], is_deleted: false, is_shared: false, original_set_id: 'p2-tp-04', created_at: '2026-04-09T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 30, difficulty: '하', thumbnail_variant: 5, play_count: 112, rating_avg: 4.5, source: 'community' },
  { set_id: 'p2-rm-06', host_member_id: 'ai-remix', title: '🤖 AI 재가공 — 일차함수 그래프, 인터랙티브 강화', subject: '수학', grade: null, tags: ['AI 재가공','인터랙티브'], is_deleted: false, is_shared: false, original_set_id: 'p2-tp-06', created_at: '2026-04-08T09:00:00Z', updated_at: '2026-04-09T09:00:00Z', question_count: 24, difficulty: '중', thumbnail_variant: 0, play_count: 98, rating_avg: 4.6, source: 'community' },
]

export const PHASE2_VOCAB_ALL: QuestionSet[] = [
  { set_id: 'p2-va-01', host_member_id: 'quiz_party', title: '공부력 초등 전과목 어휘 (국어)', subject: '국어', grade: null, tags: ['전과목 어휘','초등 국어'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-11T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 240, difficulty: '하', thumbnail_variant: 1, play_count: 567, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'p2-va-02', host_member_id: 'quiz_party', title: '공부력 초등 전과목 어휘 (수학)', subject: '수학', grade: null, tags: ['전과목 어휘','초등 수학'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-10T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 180, difficulty: '하', thumbnail_variant: 2, play_count: 445, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'p2-va-03', host_member_id: 'quiz_party', title: '공부력 초등 전과목 어휘 (사회)', subject: '사회', grade: null, tags: ['전과목 어휘','초등 사회'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-09T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 160, difficulty: '하', thumbnail_variant: 3, play_count: 389, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'p2-va-04', host_member_id: 'quiz_party', title: '공부력 초등 전과목 어휘 (과학)', subject: '과학', grade: null, tags: ['전과목 어휘','초등 과학'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-08T09:00:00Z', updated_at: '2026-04-11T09:00:00Z', question_count: 200, difficulty: '하', thumbnail_variant: 4, play_count: 312, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'p2-va-05', host_member_id: 'quiz_party', title: '공부력 초등 한자 어휘 — 일상편', subject: '한자', grade: null, tags: ['전과목 어휘','초등 한자'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-07T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 120, difficulty: '하', thumbnail_variant: 5, play_count: 256, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'p2-va-06', host_member_id: 'quiz_party', title: '공부력 초등 영어 어휘 — 학년 종합', subject: '영어', grade: null, tags: ['전과목 어휘','초등 영어'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-06T09:00:00Z', updated_at: '2026-04-09T09:00:00Z', question_count: 280, difficulty: '하', thumbnail_variant: 0, play_count: 489, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
]

export const PHASE2_MONTHLY: QuestionSet[] = [
  { set_id: 'p2-mt-01', host_member_id: 'quiz_party', title: '🆕 4월 신작 — 봄철 자연 관찰 퀴즈 (과학)', subject: '과학', grade: null, tags: ['월간 신규','봄철'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-13T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 20, difficulty: '하', thumbnail_variant: 1, play_count: 412, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'p2-mt-02', host_member_id: 'quiz_party', title: '🆕 4월 신작 — 어린이날 특집 한국사', subject: '한국사', grade: null, tags: ['월간 신규','특집'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-13T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 15, difficulty: '하', thumbnail_variant: 2, play_count: 312, rating_avg: 4.7, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'p2-mt-03', host_member_id: 'quiz_party', title: '🆕 4월 신작 — 5월 가정의 달 어휘 챌린지', subject: '국어', grade: null, tags: ['월간 신규','어휘'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-12T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 18, difficulty: '하', thumbnail_variant: 3, play_count: 234, rating_avg: 4.6, is_official: true, is_new: true, source: 'quiz_party' },
]

export const PHASE2_ALL_SETS: QuestionSet[] = [
  ...PHASE1_ALL_SETS,
  ...PHASE2_TEACHER_POPULAR,
  ...PHASE2_REMIX,
  ...PHASE2_VOCAB_ALL,
  ...PHASE2_MONTHLY,
]

// ─── Phase 단일 진입점 ───────────────────────────────────────

export function getPhaseSets(phase: Phase): QuestionSet[] {
  if (phase === 'mvp')    return MVP_ALL_SETS
  if (phase === 'phase1') return PHASE1_ALL_SETS
  return PHASE2_ALL_SETS
}

// ─── Phase별 필터·노출 설정 ─────────────────────────────────

export type ExtendedFilterMode =
  | 'textbook'
  | 'workbook'
  | 'subject'
  | 'theme'
  | 'elem-special'
  | 'community'
  | 'ai-remix'

export interface PhaseFilterConfig {
  /** 1-depth 필터 모드 — 이 배열에 포함된 키만 노출 (둘러보기는 항상 노출) */
  modes: ExtendedFilterMode[]
  /** 비어있지 않으면 SUBJECT_OPTIONS에서 이 값들만 enabled */
  enabledSubjects: string[]
  /** "오늘의 Top 10" row 노출 여부 */
  showTop10: boolean
  /** 상단 빌보드 노출 여부 */
  showBillboard: boolean
}

export const PHASE_FILTER_CONFIG: Record<Phase, PhaseFilterConfig> = {
  mvp: {
    modes: ['subject', 'theme'],
    enabledSubjects: ['수학', '영어'],
    showTop10: false,
    showBillboard: false,
  },
  phase1: {
    modes: ['subject', 'theme', 'elem-special'],
    enabledSubjects: ['수학', '영어', '국어', '한국사', '한자'],
    showTop10: true,
    showBillboard: false,
  },
  phase2: {
    modes: ['subject', 'theme', 'elem-special', 'community', 'ai-remix'],
    enabledSubjects: [], // 전체 활성
    showTop10: true,
    showBillboard: true,
  },
}

// 신규 모드 클릭 시 적용할 필터 프리셋 (검색 키워드)
export const PHASE_MODE_PRESETS: Record<ExtendedFilterMode, { search?: string }> = {
  textbook: {},
  workbook: {},
  subject: {},
  theme: {},
  'elem-special': { search: '초등' },
  community: { search: '교사' },
  'ai-remix': { search: 'AI 재가공' },
}

// ============================================================
// /sets 허브 — 모든 표시 문구 중앙 관리
// 이 파일의 문자열만 바꾸면 화면에 즉시 반영됩니다.
// (이모지·이모티콘도 이 파일에서 함께 관리)
// ============================================================

export const SETS_HUB_LABELS = {
  // ── 페이지 헤더 ──────────────────────────────────────────
  header: {
    eyebrow: '퀴즈 파티 · Set Hub',
    title: '어떤 퀴즈로 수업하시겠어요?',
    subtitle: '비상 교과서 전과목, 공부력 테마, 그리고 전국 선생님들의 세트지를 한 곳에서 바로 골라 시작하세요.',
    newBtn: '새 퀴즈 만들기',
  },

  // ── 빌보드(상단 피처드) ─────────────────────────────────
  billboard: {
    eyebrow: '이번 주 에디터스 픽',
    ctaPrimary: '바로 시작',
    ctaPreview: '문항 미리보기',
  },

  // ── 소스 탭 (전체/퀴즈파티/내가만든/다른선생님) ─────────
  pills: {
    all:        { emoji: '🌟', label: '전체',            hint: '추천·신규·인기' },
    quiz_party: { emoji: '🎉', label: '퀴즈파티 제공',    hint: '교과서·공부력 레디메이드' },
    mine:       { emoji: '👤', label: '내가 만든',        hint: '내가 저작한 세트지' },
    community:  { emoji: '🤝', label: '다른 선생님',      hint: '전국 선생님 공유' },
  },

  // ── 카테고리 타일 (카훗 스타일 큐레이션 입구) ─────────
  tiles: {
    heading: '카테고리로 둘러보기',
    sub: '원하는 주제를 한 번에',
    items: [
      // 과목별 1단원 진입점
      { key: 'subj-math',    emoji: '🧮', label: '수학',       sub: '1단원부터',      gradient: 'from-blue-500 to-indigo-500' },
      { key: 'subj-english', emoji: '🔤', label: '영어',       sub: 'Lesson 1부터',   gradient: 'from-sky-500 to-cyan-500' },
      { key: 'subj-korean',  emoji: '📖', label: '국어',       sub: '1단원부터',      gradient: 'from-rose-500 to-orange-500' },
      { key: 'subj-social',  emoji: '🌏', label: '사회',       sub: '1단원부터',      gradient: 'from-emerald-500 to-teal-500' },
      { key: 'subj-science', emoji: '🔬', label: '과학',       sub: '1단원부터',      gradient: 'from-amber-500 to-orange-500' },
      // 특별 컬렉션
      { key: 'new-semester', emoji: '🎒', label: '신학기 추천', sub: '진단·복습',      gradient: 'from-violet-500 to-purple-500' },
      { key: 'icebreak',     emoji: '🎤', label: '아이스브레이킹', sub: '수업 도입용', gradient: 'from-pink-500 to-rose-500' },
      { key: 'humor',        emoji: '😂', label: '오늘의 유머', sub: '가볍고 재미있게', gradient: 'from-fuchsia-500 to-pink-500' },
    ],
  },

  // ── 필터 바 ─────────────────────────────────────────────
  // 순서: 검색 → 교재 → 과목 → 학년 → 테마 → 난이도
  filter: {
    searchPlaceholder: '퀴즈·단원·태그 검색...',
    textbook: '교과서/교재',
    subject: '과목',
    grade: '학년/학기',
    theme: '공부력 테마',
    difficulty: '난이도',
    activeLabel: '필터:',
    resetAll: '전체 해제',
    prefixTextbook: '교재',
    prefixSubject: '과목',
    prefixGrade: '학년',
    prefixTheme: '테마',
    prefixDifficulty: '난이도',
    prefixSearch: '검색',
  },

  // ── 뷰 모드 토글 ────────────────────────────────────────
  view: {
    carousel: '둘러보기',
    grid: '전체 보기',
  },

  // ── row 제목·서브 ──────────────────────────────────────
  rows: {
    continue:            { title: '이어서 시작하기',                     subtitle: '최근에 살펴본 세트지로 바로 수업을 시작해보세요' },
    top10:               { title: '오늘의 Top 10',                        subtitle: '전국 선생님이 가장 많이 선택한 세트지' },
    personalGrade:       { title: '비상 교과서 수학 5학년 선생님이세요?', subtitle: '기존에 출제하셨던 단원 기반 추천' },
    personalOtherTextbook:{ title: '같은 학년, 다른 교재도 추천',          subtitle: '초등 수학 5학년 — 교재를 바꿔 비교해보세요' },
    best:                { title: '선생님들의 별 5개',                    subtitle: '평점 4.7 이상 — 검증된 수업용 세트' },
    textbookBrowse:      { title: '교과서별 둘러보기',                    subtitle: '비상·천재·미래엔·동아·지학사 대표 세트' },
    mathWorkbook:        { title: '이 문제집은 어떠세요?',                subtitle: '쎈 · 개념원리 · 유형 — 수학 문제집 대표 세트' },
    themeBrowse:         { title: '테마별 제안',                          subtitle: '영어·국어·한자·어휘·한국사·수학 테마' },
    recent:              { title: '최근 편집한 세트지',                    subtitle: '이어서 작업하거나 바로 시작' },
    certified:           { title: '인증 선생님의 세트지',                  subtitle: '검증된 프로필의 선생님 추천' },
    bookmarked:          { title: '내가 찜한 세트지',                     subtitle: '북마크한 세트지 모음' },
  },

  // ── 빈 상태 ─────────────────────────────────────────────
  empty: {
    search:    { title: '검색 결과가 없어요',            description: '다른 키워드로 검색해보세요.' },
    mine:      { title: '아직 만든 세트지가 없어요',     description: '오른쪽 위 "새 퀴즈 만들기" 버튼으로 첫 세트지를 만들어보세요.' },
    community: { title: '조건에 맞는 공유 세트지가 없어요', description: '필터를 변경하거나 다른 과목을 둘러보세요.' },
    default:   { title: '조건에 맞는 세트지가 없어요',   description: '필터를 초기화하고 다시 시도해보세요.' },
  },

  // ── 미리보기 Sheet ─────────────────────────────────────
  preview: {
    questionCountFmt: (cur: number, total: number) => `문항 ${cur} / ${total}`,
    prevBtn: '이전 문항',
    nextBtn: '다음 문항',
    keyHint: '← → 키로 이동',
    ratingHeading: '이 세트지는 어떠셨나요?',
    ratingNote: '평가는 다음 버전부터 반영됩니다.',
    ratedFmt: (n: number) => `${n}점 평가됨!`,
    saveAria: '저장',
    editBtn: '편집',
    duplicateBtn: '내 퀴즈로 복제',
    startBtn: '이 세트로 바로 시작',
    officialBy: '🎉 퀴즈파티 제공',
    mineBy: '내가 만든 세트지',
    certifiedMark: '✓ 인증',
    explanationPrefix: '💡',
    correctLabel: '정답',
    typeLabel: { multiple_choice: '객관식', ox: 'OX', unscramble: '재배열' },
  },
} as const

// 개인화 추천 mock — 추후 실제 사용자 히스토리 API로 교체
// TODO: GET /api/me/recent-activity → 최근 출제 grade·subject·textbook 집계
export const MOCK_PERSONALIZATION = {
  inferredSubject: '수학',
  inferredGrade: '초등 수학 5-1',
  inferredTextbook: '비상 교과서',
} as const

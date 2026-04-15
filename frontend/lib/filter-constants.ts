// 앱 전역에서 사용하는 필터 상수 (과목, 학년/학기)
// sets, marketplace, editor 등에서 동일한 드롭다운을 제공

// ─── 과목 ───

export interface SubjectOption {
  value: string
  enabled: boolean
  label?: string // 비활성 시 표시할 라벨 (예: "준비중")
}

export const SUBJECT_OPTIONS: SubjectOption[] = [
  { value: '수학', enabled: true },
  { value: '영어', enabled: true },
  { value: '국어', enabled: true },
  { value: '사회', enabled: true },
  { value: '과학', enabled: true },
  { value: '한자', enabled: true },
  { value: '한국사', enabled: true },
]

// ─── 학년/학기 (과목별) ───

export interface GradeGroup {
  group: string // 그룹 헤더 (초등, 중등, 고등)
  items: string[]
}

const MATH_GRADES: GradeGroup[] = [
  {
    group: '초등',
    items: [
      '초등 수학 3-1', '초등 수학 3-2',
      '초등 수학 4-1', '초등 수학 4-2',
      '초등 수학 5-1', '초등 수학 5-2',
      '초등 수학 6-1', '초등 수학 6-2',
    ],
  },
  {
    group: '중등',
    items: ['중등 수학 수학1', '중등 수학 수학2'],
  },
  {
    group: '고등',
    items: ['고등 수학 공통수학1', '고등 수학 공통수학2'],
  },
]

const ENGLISH_GRADES: GradeGroup[] = [
  {
    group: '초등',
    items: ['초등 영어 5', '초등 영어 6'],
  },
  {
    group: '중등',
    items: ['중등 영어 영어1', '중등 영어 영어2'],
  },
  {
    group: '고등',
    items: ['고등 영어 공통영어1', '고등 영어 공통영어2'],
  },
]

const ALL_GRADES: GradeGroup[] = [
  {
    group: '초등',
    items: [
      '초등 수학 3-1', '초등 수학 3-2',
      '초등 수학 4-1', '초등 수학 4-2',
      '초등 수학 5-1', '초등 수학 5-2',
      '초등 수학 6-1', '초등 수학 6-2',
      '초등 영어 5', '초등 영어 6',
    ],
  },
  {
    group: '중등',
    items: [
      '중등 수학 수학1', '중등 수학 수학2',
      '중등 영어 영어1', '중등 영어 영어2',
    ],
  },
  {
    group: '고등',
    items: [
      '고등 수학 공통수학1', '고등 수학 공통수학2',
      '고등 영어 공통영어1', '고등 영어 공통영어2',
    ],
  },
]

export function getGradeGroups(subject?: string | null): GradeGroup[] {
  if (subject === '수학') return MATH_GRADES
  if (subject === '영어') return ENGLISH_GRADES
  return ALL_GRADES
}

// 플랫 리스트로 반환 (단순 배열이 필요한 곳)
export function getGradeList(subject?: string | null): string[] {
  return getGradeGroups(subject).flatMap((g) => g.items)
}

// ─── 교과서/교재 (A안: 비상 CBS 교과서 전과목 + 주요 문제집) ───

export interface TextbookOption {
  value: string
  label: string
  kind: 'textbook' | 'workbook'
}

export const TEXTBOOK_OPTIONS: TextbookOption[] = [
  { value: '비상 교과서', label: '비상 교과서', kind: 'textbook' },
  { value: '천재 교과서', label: '천재 교과서', kind: 'textbook' },
  { value: '미래엔 교과서', label: '미래엔 교과서', kind: 'textbook' },
  { value: '동아 교과서', label: '동아 교과서', kind: 'textbook' },
  { value: '지학사 교과서', label: '지학사 교과서', kind: 'textbook' },
  { value: '오투', label: '오투', kind: 'workbook' },
  { value: '쎈', label: '쎈', kind: 'workbook' },
  { value: '개념원리', label: '개념원리', kind: 'workbook' },
  { value: '유형', label: '유형', kind: 'workbook' },
  { value: '수학의 정석', label: '수학의 정석', kind: 'workbook' },
]

// ─── 공부력 테마 (B안: 테마형 세트지 축) ───

export interface ThemeOption {
  value: string
  label: string
  subject: string        // 테마가 암시하는 과목 (필터 연동용)
  emoji: string
}

export const THEME_OPTIONS: ThemeOption[] = [
  { value: '공부력-영어',  label: '공부력 영어',   subject: '영어', emoji: '🔤' },
  { value: '공부력-국어',  label: '공부력 국어',   subject: '국어', emoji: '📖' },
  { value: '공부력-한국사', label: '공부력 한국사', subject: '한국사', emoji: '🏯' },
  { value: '공부력-어휘',  label: '공부력 어휘',   subject: '국어', emoji: '💬' },
  { value: '공부력-한자',  label: '공부력 한자',   subject: '한자', emoji: '漢' },
  { value: '공부력-수학',  label: '공부력 수학',   subject: '수학', emoji: '🧮' },
  { value: '아이스브레이킹', label: '아이스브레이킹', subject: '',     emoji: '🧊' },
  { value: '오늘의-유머',   label: '오늘의 유머',    subject: '',     emoji: '😂' },
  { value: '오늘의-상식',   label: '오늘의 상식',    subject: '',     emoji: '💡' },
]

// ─── 난이도 ───

export const DIFFICULTY_OPTIONS = ['상', '중', '하'] as const
export type Difficulty = (typeof DIFFICULTY_OPTIONS)[number]

// ─── 단원 / 지식요인 (2022 개정 교육과정 반영, Mock) ──────────────
// 구조: subject → grade → unit[]
// (교과서별 cascade의 5-depth, 과목별 cascade의 3-depth 하위 옵션으로 사용)

export const UNITS_BY_SUBJECT_GRADE: Record<string, Record<string, string[]>> = {
  수학: {
    '중등 수학 수학1': ['소인수분해', '정수와 유리수', '문자의 사용과 식', '일차방정식', '좌표평면과 그래프', '기본도형', '작도와 합동', '평면도형의 성질', '입체도형의 성질', '자료의 정리와 해석'],
    '중등 수학 수학2': ['유리수와 순환소수', '식의 계산', '부등식과 방정식', '일차함수', '도형의 성질', '도형의 닮음', '확률'],
    '고등 수학 공통수학1': ['다항식', '방정식과 부등식', '집합과 명제', '함수와 그래프', '경우의 수'],
    '고등 수학 공통수학2': ['도형의 방정식', '집합과 명제', '함수와 그래프', '순열과 조합'],
  },
  국어: {
    '중1-1학기': ['시의 운율과 이미지', '소설의 구성', '설명문 읽기', '문법 — 음운과 품사', '듣기·말하기'],
    '중2-1학기': ['비문학 독해 — 설명문·논설문', '현대시 감상', '고전소설 읽기', '문법 — 문장 성분'],
    '중3-2학기': ['현대시 — 핵심 시어 분석', '수필과 에세이', '논설문 쓰기', '매체 언어'],
  },
  영어: {
    '중등 영어 영어1': ['Greetings & Introductions', '현재시제·빈도부사', '과거시제', '조동사 can/may', '비교급·최상급'],
    '중등 영어 영어2': ['현재완료', '관계대명사', '수동태', '가정법', '분사구문'],
    '고등 영어 공통영어1': ['문장의 형식', '시제 종합', '수동태·분사', '관계사', '가정법'],
  },
  사회: {
    '중1-1학기': ['내가 사는 세계', '우리와 다른 기후·다른 생활', '자연으로 떠나는 여행', '다양한 세계, 다양한 문화'],
    '중2-1학기': ['인권과 헌법', '헌법과 국가기관', '경제생활과 선택', '시장경제와 가격'],
    '중3-1학기': ['민주주의와 국가', '정치과정과 시민참여', '선거제도', '국제사회와 국제정치'],
  },
  과학: {
    '중1-1학기': ['지권의 변화', '여러 가지 힘', '생물의 다양성', '기체의 성질'],
    '중1-2학기': ['태양계 — 지구와 달의 운동', '열과 우리 생활', '물질의 상태 변화', '식물의 구조'],
    '중2-2학기': ['물질의 특성', '수권과 해수의 순환', '동물과 에너지', '물질의 변화 — 산화·환원'],
    '중3-1학기': ['뉴턴의 운동 법칙', '화학 반응의 규칙성', '유전과 진화', '전기와 자기'],
  },
  한자: {
    '중1-1학기': ['한자 8급 — 기초 50자', '부수와 필순', '한자어 기본 어휘'],
    '중2-1학기': ['사자성어 60선', '동의어·반의어 한자어', '고사성어와 일화'],
  },
  한국사: {
    '중2-1학기': ['선사시대와 고조선', '삼국시대', '고려시대 — 정치와 사회'],
    '중3-1학기': ['조선 전기', '조선 후기 — 실학과 문화', '개항기·일제강점기'],
  },
}

export function getUnits(subject?: string | null, grade?: string | null): string[] {
  if (!subject || !grade) return []
  return UNITS_BY_SUBJECT_GRADE[subject]?.[grade] ?? []
}

// 교과서별 cascade에서 사용할 "교과서 → 과목" 매핑
export const TEXTBOOK_SUBJECTS: Record<string, string[]> = {
  '비상 교과서': ['수학', '영어', '국어', '사회', '과학'],
  '천재 교과서': ['수학', '영어', '국어', '사회', '과학'],
  '미래엔 교과서': ['수학', '영어', '국어', '사회', '과학'],
  '동아 교과서': ['수학', '영어', '국어', '사회', '과학'],
  '지학사 교과서': ['수학', '과학', '사회'],
}

export function getTextbookSubjects(textbook?: string | null): string[] {
  if (!textbook) return []
  return TEXTBOOK_SUBJECTS[textbook] ?? []
}

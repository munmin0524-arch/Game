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
  { value: '사회', enabled: false, label: '준비중' },
  { value: '과학', enabled: false, label: '준비중' },
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

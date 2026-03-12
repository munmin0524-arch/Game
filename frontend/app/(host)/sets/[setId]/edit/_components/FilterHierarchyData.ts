// 교과과정 기반 필터 데이터 (수학/영어)
// 실제 서비스에서는 API로 로드하지만, MVP에서는 정적 데이터 사용

// ─── 과목 옵션 ───

export const SUBJECT_OPTIONS = [
  { value: '수학', key: 'math' as const, enabled: true },
  { value: '영어', key: 'english' as const, enabled: true },
  { value: '사회', key: 'social' as const, enabled: false },
  { value: '과학', key: 'science' as const, enabled: false },
] as const

// ─── 난이도 옵션 ───

export const DIFFICULTY_OPTIONS = [
  { value: '상', label: '상', color: 'bg-red-50 text-red-600 border-red-200' },
  { value: '중', label: '중', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { value: '하', label: '하', color: 'bg-green-50 text-green-600 border-green-200' },
] as const

// ─── 수학 대단원 (학년별) ───

export const MATH_UNITS: Record<string, string[]> = {
  '중등 수학 수학1': [
    'I. 수와 연산',
    'II. 문자와 식',
    'III. 좌표평면과 그래프',
    'IV. 기본 도형',
    'V. 평면도형과 입체도형',
    'VI. 통계',
  ],
  '중등 수학 수학2': [
    'I. 유리수의 표현과 식의 계산',
    'II. 부등식과 연립방정식',
    'III. 일차함수',
    'IV. 삼각형과 사각형의 성질',
    'V. 도형의 닮음과 피타고라스 정리',
    'VI. 확률',
  ],
}

// ─── 영어 단원 (학년별) — 목업 Lesson 1~8 고정 ───

export const ENGLISH_LESSONS: Record<string, string[]> = {
  '중등 영어 영어1': [
    'Lesson 1. Ready for a New Start',
    'Lesson 2. Happy with My Family',
    'Lesson 3. Love All Life',
    'Lesson 4. Everyday Art',
    'Lesson 5. Meet the New World',
    'Lesson 6. Walk Around the World',
    'Lesson 7. Greener, Greater',
    'Lesson 8. For a Better Tomorrow',
  ],
  '중등 영어 영어2': [
    'Lesson 1',
    'Lesson 2',
    'Lesson 3',
    'Lesson 4',
    'Lesson 5',
    'Lesson 6',
    'Lesson 7',
    'Lesson 8',
  ],
}

// ─── 영어 콘텐츠 유형 ───

export type EnglishContentType = '어휘' | '문법'

export const ENGLISH_CONTENT_TYPES: EnglishContentType[] = ['어휘', '문법']

// ─── 영어 세부 유형 ───

export const ENGLISH_SUB_TYPES: Record<EnglishContentType, string[]> = {
  '어휘': [
    '잘못 연결된 단어와 뜻 고르기',
    '진짜 단어 찾기',
    '단어 완성하기',
    '알맞은 단어, 뜻 고르기',
  ],
  '문법': [
    '문법 도전하기 1',
    '문법 도전하기 2',
  ],
}

// ─── 헬퍼 ───

export function getMathUnits(grade: string): string[] {
  return MATH_UNITS[grade] ?? []
}

export function getEnglishLessons(grade: string): string[] {
  return ENGLISH_LESSONS[grade] ?? []
}

export function getEnglishSubTypes(contentType: EnglishContentType | ''): string[] {
  if (!contentType) return []
  return ENGLISH_SUB_TYPES[contentType] ?? []
}

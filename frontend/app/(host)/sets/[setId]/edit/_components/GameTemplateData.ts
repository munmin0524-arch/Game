import type { GameTemplate, GameCategory, SubjectKey } from '@/types'

// ─── 전체 게임 템플릿 정의 ───

export const GAME_TEMPLATES: GameTemplate[] = [
  // 영어 선택형
  { code: 'M2_I_WI_IN', category: 'selection', subjects: ['english'], label: '선택형 2지선다', optionCount: 2, description: '이미지+텍스트' },
  { code: 'M2_SI_SI_IN', category: 'selection', subjects: ['english'], label: '선택형 2지선다', optionCount: 2, description: '텍스트' },
  { code: 'M3_BI_IN', category: 'selection', subjects: ['english'], label: '선택형 3지선다', optionCount: 3, description: '큰 이미지' },
  { code: 'M3_I_WI_IN', category: 'selection', subjects: ['english'], label: '선택형 3지선다', optionCount: 3, description: '이미지+텍스트' },
  { code: 'M4_WI_IN', category: 'selection', subjects: ['english'], label: '선택형 4지선다', optionCount: 4, description: '텍스트' },

  // 수학 선택형
  { code: 'M2_I_WI_BIN', category: 'selection', subjects: ['math'], label: '선택형 2지선다', optionCount: 2, description: '이미지+텍스트' },
  { code: 'M3_I_WI_BIN', category: 'selection', subjects: ['math'], label: '선택형 3지선다', optionCount: 3, description: '이미지+텍스트' },
  { code: 'M4_WI_BIN', category: 'selection', subjects: ['math'], label: '선택형 4지선다', optionCount: 4, description: '텍스트' },
  { code: 'M4_WI_BBIN', category: 'selection', subjects: ['math'], label: '선택형 4지선다', optionCount: 4, description: '텍스트 변형' },
  { code: 'M4_LI_I_BIN', category: 'selection', subjects: ['math'], label: '선택형 4지선다', optionCount: 4, description: '리스트+이미지' },
  { code: 'M4_I_WI_BIN', category: 'selection', subjects: ['math'], label: '선택형 4지선다', optionCount: 4, description: '이미지+텍스트' },

  // OX형 (공통)
  { code: 'OX_LI_IN', category: 'ox', subjects: ['math', 'english'], label: 'OX형', optionCount: 0, description: '리스트 레이아웃' },

  // Unscramble형 (공통)
  { code: 'Unscramble_P1', category: 'unscramble', subjects: ['math', 'english'], label: 'Unscramble', optionCount: 0, description: '패턴 1' },
  { code: 'Unscramble_P2', category: 'unscramble', subjects: ['math', 'english'], label: 'Unscramble', optionCount: 0, description: '패턴 2' },
]

// ─── 카테고리 라벨 ───

export const CATEGORY_LABELS: Record<GameCategory, string> = {
  selection: '선택형',
  ox: 'OX형',
  unscramble: 'Unscramble형',
}

export const CATEGORIES: GameCategory[] = ['selection', 'ox', 'unscramble']

// ─── 과목별 필터링 ───

export function getTemplatesForSubject(subject: SubjectKey | null): GameTemplate[] {
  if (!subject) return GAME_TEMPLATES
  return GAME_TEMPLATES.filter((t) => t.subjects.includes(subject))
}

export function getTemplatesByCategory(templates: GameTemplate[]): Record<GameCategory, GameTemplate[]> {
  return {
    selection: templates.filter((t) => t.category === 'selection'),
    ox: templates.filter((t) => t.category === 'ox'),
    unscramble: templates.filter((t) => t.category === 'unscramble'),
  }
}

// ─── 템플릿 코드로 찾기 ───

export function findTemplate(code: string): GameTemplate | undefined {
  return GAME_TEMPLATES.find((t) => t.code === code)
}

// ─── 미니 프리뷰 색상 맵 (카테고리별) ───

export const CATEGORY_COLORS: Record<GameCategory, { bg: string; accent: string }> = {
  selection: { bg: 'bg-blue-50', accent: 'border-blue-300' },
  ox: { bg: 'bg-green-50', accent: 'border-green-300' },
  unscramble: { bg: 'bg-purple-50', accent: 'border-purple-300' },
}

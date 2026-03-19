// ============================================================
// 단원별 숙련도 계산 + 추천 알고리즘
// ============================================================

import type { MasteryLevel, MasteryDisplay, StudentUnitMastery } from '@/types'

// ─────────────────────────────────────────────────────────────
// 숙련도 판정
// ─────────────────────────────────────────────────────────────

/**
 * 정답률 + 풀이 횟수 → 숙련도 레벨 판정
 */
export function calcMasteryLevel(
  totalAttempts: number,
  correctCount: number,
): MasteryLevel {
  if (totalAttempts === 0) return 'beginner'
  const rate = correctCount / totalAttempts
  if (rate >= 0.85 && totalAttempts >= 10) return 'mastered'
  if (rate >= 0.65 && totalAttempts >= 5) return 'proficient'
  if (rate >= 0.4 || totalAttempts <= 4) return 'developing'
  return 'beginner'
}

/**
 * 숙련도 레벨 → 학생 표시 정보 (색상 + 메시지)
 */
export function getMasteryDisplay(
  level: MasteryLevel,
  correctRate: number | null,
): MasteryDisplay {
  switch (level) {
    case 'mastered':
      return { color: 'green', emoji: '🟢', message: '잘하고 있어요!' }
    case 'proficient':
      return { color: 'blue', emoji: '🔵', message: '좋아요, 계속!' }
    case 'developing':
      return { color: 'yellow', emoji: '🟡', message: '조금만 더!' }
    case 'beginner':
      if (correctRate === null) {
        return { color: 'gray', emoji: '⚪', message: '아직 안 배웠어요' }
      }
      return { color: 'red', emoji: '🔴', message: '도전해봐요!' }
  }
}

// ─────────────────────────────────────────────────────────────
// 추천 알고리즘
// ─────────────────────────────────────────────────────────────

export type RecommendationType = 'unlearned' | 'weak' | 'review'

export interface UnitRecommendation {
  type: RecommendationType
  subject: string
  unit: string
  correctRate: number | null
  totalAttempts: number
  level: MasteryLevel
  display: MasteryDisplay
}

/**
 * 단원별 숙련도 목록에서 추천 학습 단원 추출
 * 우선순위: 미학습 > 취약 > 복습 권장
 */
export function getRecommendations(
  masteryList: StudentUnitMastery[],
  maxResults = 3,
): UnitRecommendation[] {
  const recommendations: UnitRecommendation[] = []

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // 1. 미학습 단원
  const unlearned = masteryList
    .filter((m) => m.total_attempts === 0)
    .map((m) => ({
      type: 'unlearned' as const,
      subject: m.subject,
      unit: m.unit,
      correctRate: null,
      totalAttempts: 0,
      level: 'beginner' as const,
      display: getMasteryDisplay('beginner', null),
    }))
  recommendations.push(...unlearned)

  // 2. 취약 단원 (developing/beginner + 풀이 1+, 정답률 낮은 순)
  const weak = masteryList
    .filter(
      (m) =>
        m.total_attempts > 0 &&
        (m.level === 'developing' || m.level === 'beginner'),
    )
    .sort((a, b) => {
      const rateA = a.total_attempts > 0 ? a.correct_count / a.total_attempts : 0
      const rateB = b.total_attempts > 0 ? b.correct_count / b.total_attempts : 0
      return rateA - rateB
    })
    .map((m) => {
      const rate = m.total_attempts > 0 ? Math.round((m.correct_count / m.total_attempts) * 100) : 0
      return {
        type: 'weak' as const,
        subject: m.subject,
        unit: m.unit,
        correctRate: rate,
        totalAttempts: m.total_attempts,
        level: m.level,
        display: getMasteryDisplay(m.level, rate),
      }
    })
  recommendations.push(...weak)

  // 3. 복습 권장 (proficient + 7일 이상 미학습)
  const review = masteryList
    .filter(
      (m) =>
        m.level === 'proficient' &&
        m.last_played_at !== null &&
        new Date(m.last_played_at) < sevenDaysAgo,
    )
    .map((m) => {
      const rate = Math.round((m.correct_count / m.total_attempts) * 100)
      return {
        type: 'review' as const,
        subject: m.subject,
        unit: m.unit,
        correctRate: rate,
        totalAttempts: m.total_attempts,
        level: m.level,
        display: getMasteryDisplay(m.level, rate),
      }
    })
  recommendations.push(...review)

  return recommendations.slice(0, maxResults)
}

/**
 * 숙련도 레벨별 색상 클래스 (Tailwind)
 */
export function getMasteryColorClass(level: MasteryLevel): {
  bg: string
  text: string
  bar: string
} {
  switch (level) {
    case 'mastered':
      return { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500' }
    case 'proficient':
      return { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' }
    case 'developing':
      return { bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-500' }
    case 'beginner':
      return { bg: 'bg-gray-50', text: 'text-gray-500', bar: 'bg-gray-300' }
  }
}

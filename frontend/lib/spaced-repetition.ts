// ============================================================
// 간격반복 (Spaced Repetition) 유틸
// SM-2 변형: 0→1일→3일→7일→14일→졸업
// ============================================================

import type { WrongNoteItem } from '@/types'

/** 단계별 복습 간격 (일 단위) */
const SR_INTERVALS = [0, 1, 3, 7, 14] as const

/** 최대 단계 (졸업) */
export const SR_MAX_STAGE = 5

/**
 * 복습 결과에 따른 다음 스케줄 계산
 * - 정답: 다음 단계로 진행
 * - 오답: 단계 0으로 리셋
 */
export function getNextReview(
  currentStage: number,
  isCorrect: boolean,
): { nextStage: number; nextReviewAt: Date; isGraduated: boolean } {
  if (!isCorrect) {
    // 실패 시 리셋 — 당일 다시
    return {
      nextStage: 0,
      nextReviewAt: new Date(),
      isGraduated: false,
    }
  }

  const nextStage = Math.min(currentStage + 1, SR_MAX_STAGE)

  if (nextStage >= SR_MAX_STAGE) {
    return {
      nextStage: SR_MAX_STAGE,
      nextReviewAt: new Date(0), // 졸업 — 더 이상 출제 안 함
      isGraduated: true,
    }
  }

  const nextReviewAt = new Date()
  nextReviewAt.setDate(nextReviewAt.getDate() + SR_INTERVALS[nextStage])

  return {
    nextStage,
    nextReviewAt,
    isGraduated: false,
  }
}

/**
 * 오늘 복습 대상 문제 필터링
 */
export function getTodayReviewItems(items: WrongNoteItem[]): WrongNoteItem[] {
  const now = new Date()
  return items.filter(
    (item) => !item.is_graduated && new Date(item.sr_next_review_at) <= now,
  )
}

/**
 * 복습 진행률 (졸업한 문제 / 전체 문제)
 */
export function getReviewProgress(items: WrongNoteItem[]): {
  total: number
  graduated: number
  pending: number
  todayReview: number
} {
  const graduated = items.filter((i) => i.is_graduated).length
  const todayReview = getTodayReviewItems(items).length
  return {
    total: items.length,
    graduated,
    pending: items.length - graduated,
    todayReview,
  }
}

/**
 * 단계별 간격 텍스트 (UI 표시용 — 현재 미사용, 필요 시 활용)
 */
export function getIntervalText(stage: number): string {
  if (stage >= SR_MAX_STAGE) return '졸업'
  if (stage < 0) return '즉시'
  const days = SR_INTERVALS[stage]
  if (days === 0) return '오늘'
  return `${days}일 후`
}

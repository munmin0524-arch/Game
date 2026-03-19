// ============================================================
// 곰젤리 보상 시스템 유틸
// ============================================================

import type { JellyTransactionType } from '@/types'

// ─────────────────────────────────────────────────────────────
// 획득 정책
// ─────────────────────────────────────────────────────────────

export interface JellyRewardRule {
  type: JellyTransactionType
  category: '출석' | '게임' | '문항수' | '정답률' | '오답노트' | '뱃지'
  label: string
  amount: number
  period: 'daily' | 'per_game' | 'per_event' | 'cumulative'
  /** 진행률 추적이 필요한 미션인 경우 목표 값 */
  target?: number
}

/** 곰젤리 획득 정책 (미션 목록) */
export const JELLY_REWARD_RULES: JellyRewardRule[] = [
  // 출석
  { type: 'attendance', category: '출석', label: '오늘 출석하기', amount: 1, period: 'daily' },
  { type: 'streak_3', category: '출석', label: '3일 연속 출석', amount: 2, period: 'per_event' },
  { type: 'streak_7', category: '출석', label: '7일 연속 출석', amount: 5, period: 'per_event' },
  { type: 'streak_30', category: '출석', label: '30일 연속 출석', amount: 15, period: 'per_event' },
  // 게임
  { type: 'game_complete', category: '게임', label: '게임 1판 완료', amount: 1, period: 'per_game' },
  { type: 'game_win', category: '게임', label: '게임 승리', amount: 2, period: 'per_game' },
  { type: 'game_types_all', category: '게임', label: '게임 종류 4종 다 하기', amount: 3, period: 'daily' },
  // 문항수
  { type: 'questions_10', category: '문항수', label: '오늘 10문제 풀기', amount: 1, period: 'daily', target: 10 },
  { type: 'questions_30', category: '문항수', label: '오늘 30문제 풀기', amount: 2, period: 'daily', target: 30 },
  { type: 'questions_60', category: '문항수', label: '오늘 60문제 풀기', amount: 3, period: 'daily', target: 60 },
  // 정답률
  { type: 'accuracy_80', category: '정답률', label: '한 게임 정답률 80% 이상', amount: 2, period: 'per_game' },
  { type: 'accuracy_100', category: '정답률', label: '한 게임 정답률 100% (올킬)', amount: 5, period: 'per_game' },
  // 오답노트
  { type: 'wrong_note_complete', category: '오답노트', label: '오늘 오답 복습 완료', amount: 2, period: 'daily' },
  { type: 'wrong_note_graduate', category: '오답노트', label: '오답 5개 졸업', amount: 3, period: 'cumulative', target: 5 },
  // 뱃지
  { type: 'badge_earn', category: '뱃지', label: '새 뱃지 획득', amount: 3, period: 'per_event' },
]

// ─────────────────────────────────────────────────────────────
// 소비 정책
// ─────────────────────────────────────────────────────────────

export interface JellySpendItem {
  type: JellyTransactionType
  category: '캐릭터' | '꾸미기'
  label: string
  cost: number
}

export const JELLY_SPEND_ITEMS: JellySpendItem[] = [
  { type: 'character_invite', category: '캐릭터', label: '캐릭터 초대', cost: 10 },
  { type: 'character_item', category: '꾸미기', label: '모자', cost: 5 },
  { type: 'character_item', category: '꾸미기', label: '배경', cost: 3 },
  { type: 'character_item', category: '꾸미기', label: '이펙트', cost: 8 },
]

// ─────────────────────────────────────────────────────────────
// 유틸 함수
// ─────────────────────────────────────────────────────────────

/**
 * 잔액이 충분한지 확인
 */
export function canSpend(balance: number, cost: number): boolean {
  return balance >= cost
}

/**
 * 거래 유형의 표시 라벨
 */
export function getTransactionLabel(type: JellyTransactionType): string {
  const rule = JELLY_REWARD_RULES.find((r) => r.type === type)
  if (rule) return rule.label
  const spend = JELLY_SPEND_ITEMS.find((s) => s.type === type)
  if (spend) return spend.label
  return type
}

/**
 * 거래 금액의 부호 포함 표시 문자열
 */
export function formatJellyAmount(amount: number): string {
  if (amount > 0) return `+${amount}`
  return `${amount}`
}

/**
 * 일일 미션 달성 현황 계산
 */
export interface DailyMissionStatus {
  rule: JellyRewardRule
  completed: boolean
  current: number
  target: number
}

export function calcDailyMissions(
  rules: JellyRewardRule[],
  todayStats: {
    attended: boolean
    gamesCompleted: number
    gamesWon: number
    gameTypesPlayed: number
    questionsSolved: number
    maxAccuracy: number
    wrongNoteReviewDone: boolean
  },
): DailyMissionStatus[] {
  return rules
    .filter((r) => r.period === 'daily' || r.period === 'per_game')
    .map((rule) => {
      let completed = false
      let current = 0
      let target = rule.target ?? 1

      switch (rule.type) {
        case 'attendance':
          completed = todayStats.attended
          current = completed ? 1 : 0
          break
        case 'game_complete':
          current = todayStats.gamesCompleted
          completed = current >= 1
          break
        case 'game_win':
          current = todayStats.gamesWon
          completed = current >= 1
          break
        case 'game_types_all':
          current = todayStats.gameTypesPlayed
          target = 4
          completed = current >= 4
          break
        case 'questions_10':
          current = todayStats.questionsSolved
          completed = current >= 10
          break
        case 'questions_30':
          current = todayStats.questionsSolved
          completed = current >= 30
          break
        case 'questions_60':
          current = todayStats.questionsSolved
          completed = current >= 60
          break
        case 'accuracy_80':
          current = todayStats.maxAccuracy
          target = 80
          completed = current >= 80
          break
        case 'accuracy_100':
          current = todayStats.maxAccuracy
          target = 100
          completed = current >= 100
          break
        case 'wrong_note_complete':
          completed = todayStats.wrongNoteReviewDone
          current = completed ? 1 : 0
          break
      }

      return { rule, completed, current, target }
    })
}

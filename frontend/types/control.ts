// ============================================================
// 컨트롤 패널 전용 타입 정의
// ============================================================

// ─────────────────────────────────────────────────────────────
// 학생 모니터링
// ─────────────────────────────────────────────────────────────

export type StudentStatus = 'answering' | 'answered' | 'disconnected' | 'idle'
export type BehaviorBadge = 'struggling' | 'guessing' | 'star' | 'slow'

export interface StudentQuestionResult {
  questionIndex: number
  questionContent: string
  selectedAnswer: string | null
  isCorrect: boolean | null
  responseTimeSec: number | null
  isSkipped: boolean
}

export interface StudentMonitorData {
  participantId: string
  nickname: string
  avatarColor: string
  status: StudentStatus
  score: number
  correctStreak: number
  accuracy: number // 0–100
  badges: BehaviorBadge[]
  lastResponseTimeSec: number | null
  currentQuestionAnswered: boolean
  perQuestionResults: StudentQuestionResult[]
}

// ─────────────────────────────────────────────────────────────
// 리액션 (코칭)
// ─────────────────────────────────────────────────────────────

export type ReactionType = 'praise' | 'encouragement' | 'warning' | 'speed_up'

export interface ReactionPayload {
  type: ReactionType
  targetIds: string[] // 빈 배열 = 전체 브로드캐스트
  sessionId: string
}

// ─────────────────────────────────────────────────────────────
// 분석
// ─────────────────────────────────────────────────────────────

export interface QuestionAccuracyPoint {
  questionIndex: number
  correctPercent: number
  avgResponseTimeSec: number
}

export interface LiveAnalyticsData {
  distribution: Record<string, number>
  answered: number
  total: number
  accuracyTrend: QuestionAccuracyPoint[]
  currentQuestionDifficulty: 'easy' | 'medium' | 'hard' | null
  isConfusing: boolean // 정답률 < 40%
}

// ─────────────────────────────────────────────────────────────
// 리더보드
// ─────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number
  participantId: string
  nickname: string
  totalScore: number
  accuracy: number
  avgResponseTimeSec: number
}

// ─────────────────────────────────────────────────────────────
// 정렬 / 필터
// ─────────────────────────────────────────────────────────────

export type StudentSortKey = 'name' | 'score' | 'accuracy' | 'status'
export type StudentSortDir = 'asc' | 'desc'
export type StudentFilterBadge = BehaviorBadge | 'all'

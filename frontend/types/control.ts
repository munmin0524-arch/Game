// ============================================================
// 컨트롤 패널 전용 타입 정의 (v3 — 스피드 퀴즈 개별 진행 모델)
// ============================================================

// ─────────────────────────────────────────────────────────────
// 학생 모니터링
// ─────────────────────────────────────────────────────────────

export type StudentStatus = 'answering' | 'finished' | 'disconnected' | 'idle'
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
  perQuestionResults: StudentQuestionResult[]
  // v3: 개별 진행도
  completedQuestions: number
  totalQuestions: number
  currentQuestionIndex: number
  isFinished: boolean
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
// 문항별 분석 (v3)
// ─────────────────────────────────────────────────────────────

export interface PerQuestionAnalytics {
  questionIndex: number
  questionContent: string
  questionType: 'multiple_choice' | 'ox'
  options: { index: number; text: string }[]
  correctOptionIndex: number
  distribution: Record<string, number>
  correctCount: number
  incorrectCount: number
  unansweredCount: number
  totalStudents: number
  avgResponseTimeSec: number
}

// ─────────────────────────────────────────────────────────────
// 분석 (레거시 — 기존 컴포넌트 호환용)
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
  isConfusing: boolean
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

export type StudentSortKey = 'rank' | 'name' | 'score' | 'accuracy' | 'status'
export type StudentSortDir = 'asc' | 'desc'
export type StudentFilterBadge = BehaviorBadge | 'all'

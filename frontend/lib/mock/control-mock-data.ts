// ============================================================
// 컨트롤 패널 Mock 데이터
// ============================================================

import type {
  StudentMonitorData,
  StudentQuestionResult,
  QuestionAccuracyPoint,
  LeaderboardEntry,
  LiveAnalyticsData,
  BehaviorBadge,
  StudentStatus,
} from '@/types'
import type { WsQuestionShow } from '@/types'

// ─────────────────────────────────────────────────────────────
// 아바타 색상 팔레트
// ─────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-purple-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-indigo-500',
]

function getAvatarColor(nickname: string): string {
  return AVATAR_COLORS[nickname.charCodeAt(0) % AVATAR_COLORS.length]
}

// ─────────────────────────────────────────────────────────────
// 학생별 문항 응답 내역 생성
// ─────────────────────────────────────────────────────────────

function makeQuestionResults(
  correctPattern: boolean[],
): StudentQuestionResult[] {
  const contents = [
    '다음 중 소수가 아닌 것은?',
    '피타고라스 정리에서 빗변을 구하는 공식은?',
    '일차방정식 2x + 3 = 7의 해는?',
  ]
  return correctPattern.map((isCorrect, i) => ({
    questionIndex: i + 1,
    questionContent: contents[i],
    selectedAnswer: isCorrect ? String(i + 1) : String(((i + 2) % 4) + 1),
    isCorrect,
    responseTimeSec: isCorrect ? 5 + i * 2 : 12 + i,
    isSkipped: false,
  }))
}

// ─────────────────────────────────────────────────────────────
// 24명 Mock 학생
// ─────────────────────────────────────────────────────────────

interface StudentSeed {
  nickname: string
  status: StudentStatus
  score: number
  correctStreak: number
  accuracy: number
  badges: BehaviorBadge[]
  lastResponseTimeSec: number | null
  currentQuestionAnswered: boolean
  correctPattern: boolean[]
}

const STUDENT_SEEDS: StudentSeed[] = [
  // ── Star 학생 (3명) ──
  { nickname: '수학천재', status: 'answered', score: 300, correctStreak: 3, accuracy: 100, badges: ['star'], lastResponseTimeSec: 4, currentQuestionAnswered: true, correctPattern: [true, true, true] },
  { nickname: '김민준', status: 'answered', score: 280, correctStreak: 3, accuracy: 95, badges: ['star'], lastResponseTimeSec: 6, currentQuestionAnswered: true, correctPattern: [true, true, true] },
  { nickname: '이서연', status: 'answered', score: 270, correctStreak: 3, accuracy: 90, badges: ['star'], lastResponseTimeSec: 5, currentQuestionAnswered: true, correctPattern: [true, true, true] },

  // ── Struggling 학생 (3명) ──
  { nickname: '박지훈', status: 'answered', score: 50, correctStreak: 0, accuracy: 17, badges: ['struggling'], lastResponseTimeSec: 18, currentQuestionAnswered: true, correctPattern: [false, false, false] },
  { nickname: '최유나', status: 'answered', score: 60, correctStreak: 0, accuracy: 20, badges: ['struggling'], lastResponseTimeSec: 15, currentQuestionAnswered: true, correctPattern: [false, false, true] },
  { nickname: '정하은', status: 'answering', score: 30, correctStreak: 0, accuracy: 10, badges: ['struggling'], lastResponseTimeSec: null, currentQuestionAnswered: false, correctPattern: [false, false, false] },

  // ── Guessing 학생 (2명) ──
  { nickname: '한도윤', status: 'answered', score: 120, correctStreak: 1, accuracy: 40, badges: ['guessing'], lastResponseTimeSec: 1, currentQuestionAnswered: true, correctPattern: [true, false, false] },
  { nickname: '강서준', status: 'answered', score: 140, correctStreak: 0, accuracy: 47, badges: ['guessing'], lastResponseTimeSec: 2, currentQuestionAnswered: true, correctPattern: [false, true, false] },

  // ── Slow 학생 (2명) ──
  { nickname: '윤지아', status: 'answering', score: 100, correctStreak: 0, accuracy: 33, badges: ['slow'], lastResponseTimeSec: null, currentQuestionAnswered: false, correctPattern: [true, false, false] },
  { nickname: '임서현', status: 'answering', score: 80, correctStreak: 0, accuracy: 27, badges: ['slow'], lastResponseTimeSec: null, currentQuestionAnswered: false, correctPattern: [false, true, false] },

  // ── Disconnected (2명) ──
  { nickname: '오현우', status: 'disconnected', score: 100, correctStreak: 0, accuracy: 50, badges: [], lastResponseTimeSec: null, currentQuestionAnswered: false, correctPattern: [true, false, false] },
  { nickname: '장예린', status: 'disconnected', score: 60, correctStreak: 0, accuracy: 33, badges: [], lastResponseTimeSec: null, currentQuestionAnswered: false, correctPattern: [false, true, false] },

  // ── Idle (2명) ──
  { nickname: '배준서', status: 'idle', score: 150, correctStreak: 1, accuracy: 50, badges: [], lastResponseTimeSec: null, currentQuestionAnswered: false, correctPattern: [true, false, true] },
  { nickname: '신하윤', status: 'idle', score: 130, correctStreak: 0, accuracy: 43, badges: [], lastResponseTimeSec: null, currentQuestionAnswered: false, correctPattern: [true, true, false] },

  // ── 일반 학생 (10명) ──
  { nickname: '송지호', status: 'answered', score: 240, correctStreak: 2, accuracy: 80, badges: [], lastResponseTimeSec: 8, currentQuestionAnswered: true, correctPattern: [true, true, false] },
  { nickname: '노은서', status: 'answered', score: 220, correctStreak: 1, accuracy: 73, badges: [], lastResponseTimeSec: 10, currentQuestionAnswered: true, correctPattern: [true, false, true] },
  { nickname: '황시우', status: 'answered', score: 200, correctStreak: 2, accuracy: 67, badges: [], lastResponseTimeSec: 7, currentQuestionAnswered: true, correctPattern: [true, true, false] },
  { nickname: '전소율', status: 'answered', score: 190, correctStreak: 1, accuracy: 63, badges: [], lastResponseTimeSec: 9, currentQuestionAnswered: true, correctPattern: [false, true, true] },
  { nickname: '권도현', status: 'answered', score: 180, correctStreak: 0, accuracy: 60, badges: [], lastResponseTimeSec: 11, currentQuestionAnswered: true, correctPattern: [true, true, false] },
  { nickname: '유하린', status: 'answered', score: 170, correctStreak: 1, accuracy: 57, badges: [], lastResponseTimeSec: 12, currentQuestionAnswered: true, correctPattern: [true, false, true] },
  { nickname: '문태윤', status: 'answered', score: 160, correctStreak: 0, accuracy: 53, badges: [], lastResponseTimeSec: 14, currentQuestionAnswered: true, correctPattern: [false, true, true] },
  { nickname: '안채원', status: 'answered', score: 150, correctStreak: 1, accuracy: 50, badges: [], lastResponseTimeSec: 13, currentQuestionAnswered: true, correctPattern: [true, false, true] },
  { nickname: '고윤호', status: 'answered', score: 140, correctStreak: 0, accuracy: 47, badges: [], lastResponseTimeSec: 15, currentQuestionAnswered: true, correctPattern: [true, false, false] },
  { nickname: '백수빈', status: 'answered', score: 130, correctStreak: 0, accuracy: 43, badges: [], lastResponseTimeSec: 16, currentQuestionAnswered: true, correctPattern: [false, true, false] },
]

export const MOCK_STUDENTS: StudentMonitorData[] = STUDENT_SEEDS.map(
  (seed, i) => ({
    participantId: `p-${String(i + 1).padStart(2, '0')}`,
    nickname: seed.nickname,
    avatarColor: getAvatarColor(seed.nickname),
    status: seed.status,
    score: seed.score,
    correctStreak: seed.correctStreak,
    accuracy: seed.accuracy,
    badges: seed.badges,
    lastResponseTimeSec: seed.lastResponseTimeSec,
    currentQuestionAnswered: seed.currentQuestionAnswered,
    perQuestionResults: makeQuestionResults(seed.correctPattern),
  }),
)

// ─────────────────────────────────────────────────────────────
// 정답률 추이
// ─────────────────────────────────────────────────────────────

export const MOCK_ACCURACY_TREND: QuestionAccuracyPoint[] = [
  { questionIndex: 1, correctPercent: 85, avgResponseTimeSec: 8.2 },
  { questionIndex: 2, correctPercent: 62, avgResponseTimeSec: 12.5 },
  { questionIndex: 3, correctPercent: 38, avgResponseTimeSec: 15.1 },
]

// ─────────────────────────────────────────────────────────────
// 리더보드 (학생 데이터에서 파생)
// ─────────────────────────────────────────────────────────────

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [...MOCK_STUDENTS]
  .sort((a, b) => b.score - a.score || (a.perQuestionResults.reduce((s, r) => s + (r.responseTimeSec ?? 0), 0)) - (b.perQuestionResults.reduce((s, r) => s + (r.responseTimeSec ?? 0), 0)))
  .map((s, i) => ({
    rank: i + 1,
    participantId: s.participantId,
    nickname: s.nickname,
    totalScore: s.score,
    accuracy: s.accuracy,
    avgResponseTimeSec:
      Math.round(
        (s.perQuestionResults.reduce((sum, r) => sum + (r.responseTimeSec ?? 0), 0) /
          Math.max(s.perQuestionResults.length, 1)) *
          10,
      ) / 10,
  }))

// ─────────────────────────────────────────────────────────────
// 분석 데이터
// ─────────────────────────────────────────────────────────────

export const MOCK_ANALYTICS: LiveAnalyticsData = {
  distribution: { '1': 5, '2': 4, '3': 7, '4': 2 },
  answered: 18,
  total: 24,
  accuracyTrend: MOCK_ACCURACY_TREND,
  currentQuestionDifficulty: 'hard',
  isConfusing: true, // 38% < 40%
}

// ─────────────────────────────────────────────────────────────
// 현재 문항 Mock
// ─────────────────────────────────────────────────────────────

export const MOCK_QUESTION: WsQuestionShow = {
  question: {
    question_id: 'q-3',
    type: 'multiple_choice',
    content: '일차방정식 2x + 3 = 7의 해는?',
    options: [
      { index: 1, text: 'x = 1' },
      { index: 2, text: 'x = 2' },
      { index: 3, text: 'x = 3' },
      { index: 4, text: 'x = 4' },
    ],
    hint: 'x에 대해 정리하면 2x = 4가 됩니다.',
  },
  questionIndex: 3,
  totalQuestions: 5,
  timeLimit: 20,
}

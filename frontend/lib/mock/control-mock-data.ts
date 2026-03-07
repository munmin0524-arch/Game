// ============================================================
// 컨트롤 패널 Mock 데이터 (v3 — 스피드 퀴즈 개별 진행)
// ============================================================

import type {
  StudentMonitorData,
  StudentQuestionResult,
  QuestionAccuracyPoint,
  LeaderboardEntry,
  LiveAnalyticsData,
  PerQuestionAnalytics,
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
// 5개 문항 정의
// ─────────────────────────────────────────────────────────────

const QUESTION_CONTENTS = [
  '다음 중 소수가 아닌 것은?',
  '피타고라스 정리에서 빗변을 구하는 공식은?',
  '일차방정식 2x + 3 = 7의 해는?',
  '삼각형의 내각의 합은?',
  '원의 넓이를 구하는 공식은?',
]

// ─────────────────────────────────────────────────────────────
// 학생별 문항 응답 내역 생성 (5문항)
// ─────────────────────────────────────────────────────────────

function makeQuestionResults(
  correctPattern: (boolean | null)[],
): StudentQuestionResult[] {
  return correctPattern.map((isCorrect, i) => ({
    questionIndex: i + 1,
    questionContent: QUESTION_CONTENTS[i],
    selectedAnswer: isCorrect === null ? null : isCorrect ? String(i + 1) : String(((i + 2) % 4) + 1),
    isCorrect,
    responseTimeSec: isCorrect === null ? null : isCorrect ? 5 + i * 2 : 12 + i,
    isSkipped: isCorrect === null,
  }))
}

// ─────────────────────────────────────────────────────────────
// 24명 Mock 학생 (5문항 기준)
// ─────────────────────────────────────────────────────────────

interface StudentSeed {
  nickname: string
  status: StudentStatus
  score: number
  correctStreak: number
  accuracy: number
  badges: BehaviorBadge[]
  lastResponseTimeSec: number | null
  correctPattern: (boolean | null)[] // null = 아직 안 풀음
  completedQuestions: number
  currentQuestionIndex: number
}

const TOTAL_QUESTIONS = 5

const STUDENT_SEEDS: StudentSeed[] = [
  // ── Star 학생 (3명) — 5/5 완료 ──
  { nickname: '수학천재', status: 'finished', score: 500, correctStreak: 5, accuracy: 100, badges: ['star'], lastResponseTimeSec: 4, correctPattern: [true, true, true, true, true], completedQuestions: 5, currentQuestionIndex: 5 },
  { nickname: '김민준', status: 'finished', score: 460, correctStreak: 5, accuracy: 92, badges: ['star'], lastResponseTimeSec: 6, correctPattern: [true, true, true, true, false], completedQuestions: 5, currentQuestionIndex: 5 },
  { nickname: '이서연', status: 'finished', score: 440, correctStreak: 3, accuracy: 88, badges: ['star'], lastResponseTimeSec: 5, correctPattern: [true, true, false, true, true], completedQuestions: 5, currentQuestionIndex: 5 },

  // ── Struggling 학생 (3명) — 2~3/5 진행 ──
  { nickname: '박지훈', status: 'answering', score: 50, correctStreak: 0, accuracy: 0, badges: ['struggling'], lastResponseTimeSec: 18, correctPattern: [false, false, false, null, null], completedQuestions: 3, currentQuestionIndex: 4 },
  { nickname: '최유나', status: 'answering', score: 80, correctStreak: 0, accuracy: 25, badges: ['struggling'], lastResponseTimeSec: 15, correctPattern: [false, false, true, false, null], completedQuestions: 4, currentQuestionIndex: 5 },
  { nickname: '정하은', status: 'answering', score: 30, correctStreak: 0, accuracy: 0, badges: ['struggling'], lastResponseTimeSec: null, correctPattern: [false, false, null, null, null], completedQuestions: 2, currentQuestionIndex: 3 },

  // ── Guessing 학생 (2명) — 4~5/5 진행 ──
  { nickname: '한도윤', status: 'answering', score: 180, correctStreak: 1, accuracy: 50, badges: ['guessing'], lastResponseTimeSec: 1, correctPattern: [true, false, true, false, null], completedQuestions: 4, currentQuestionIndex: 5 },
  { nickname: '강서준', status: 'finished', score: 200, correctStreak: 0, accuracy: 40, badges: ['guessing'], lastResponseTimeSec: 2, correctPattern: [false, true, false, true, false], completedQuestions: 5, currentQuestionIndex: 5 },

  // ── Slow 학생 (2명) — 1~2/5 진행 (절반 미만) ──
  { nickname: '윤지아', status: 'answering', score: 100, correctStreak: 0, accuracy: 50, badges: ['slow'], lastResponseTimeSec: null, correctPattern: [true, null, null, null, null], completedQuestions: 1, currentQuestionIndex: 2 },
  { nickname: '임서현', status: 'answering', score: 80, correctStreak: 0, accuracy: 50, badges: ['slow'], lastResponseTimeSec: null, correctPattern: [false, true, null, null, null], completedQuestions: 2, currentQuestionIndex: 3 },

  // ── Disconnected (2명) ──
  { nickname: '오현우', status: 'disconnected', score: 100, correctStreak: 0, accuracy: 50, badges: [], lastResponseTimeSec: null, correctPattern: [true, false, null, null, null], completedQuestions: 2, currentQuestionIndex: 3 },
  { nickname: '장예린', status: 'disconnected', score: 60, correctStreak: 0, accuracy: 33, badges: [], lastResponseTimeSec: null, correctPattern: [false, true, false, null, null], completedQuestions: 3, currentQuestionIndex: 4 },

  // ── Idle (2명) ──
  { nickname: '배준서', status: 'idle', score: 0, correctStreak: 0, accuracy: 0, badges: [], lastResponseTimeSec: null, correctPattern: [null, null, null, null, null], completedQuestions: 0, currentQuestionIndex: 1 },
  { nickname: '신하윤', status: 'idle', score: 0, correctStreak: 0, accuracy: 0, badges: [], lastResponseTimeSec: null, correctPattern: [null, null, null, null, null], completedQuestions: 0, currentQuestionIndex: 1 },

  // ── 일반 학생 (10명) — 3~5/5 진행 ──
  { nickname: '송지호', status: 'finished', score: 380, correctStreak: 2, accuracy: 80, badges: [], lastResponseTimeSec: 8, correctPattern: [true, true, false, true, true], completedQuestions: 5, currentQuestionIndex: 5 },
  { nickname: '노은서', status: 'finished', score: 360, correctStreak: 1, accuracy: 80, badges: [], lastResponseTimeSec: 10, correctPattern: [true, false, true, true, true], completedQuestions: 5, currentQuestionIndex: 5 },
  { nickname: '황시우', status: 'answering', score: 300, correctStreak: 2, accuracy: 75, badges: [], lastResponseTimeSec: 7, correctPattern: [true, true, false, true, null], completedQuestions: 4, currentQuestionIndex: 5 },
  { nickname: '전소율', status: 'answering', score: 280, correctStreak: 1, accuracy: 75, badges: [], lastResponseTimeSec: 9, correctPattern: [false, true, true, true, null], completedQuestions: 4, currentQuestionIndex: 5 },
  { nickname: '권도현', status: 'finished', score: 320, correctStreak: 0, accuracy: 60, badges: [], lastResponseTimeSec: 11, correctPattern: [true, true, false, false, true], completedQuestions: 5, currentQuestionIndex: 5 },
  { nickname: '유하린', status: 'answering', score: 240, correctStreak: 1, accuracy: 67, badges: [], lastResponseTimeSec: 12, correctPattern: [true, false, true, null, null], completedQuestions: 3, currentQuestionIndex: 4 },
  { nickname: '문태윤', status: 'answering', score: 220, correctStreak: 0, accuracy: 67, badges: [], lastResponseTimeSec: 14, correctPattern: [false, true, true, null, null], completedQuestions: 3, currentQuestionIndex: 4 },
  { nickname: '안채원', status: 'answering', score: 200, correctStreak: 1, accuracy: 67, badges: [], lastResponseTimeSec: 13, correctPattern: [true, false, true, null, null], completedQuestions: 3, currentQuestionIndex: 4 },
  { nickname: '고윤호', status: 'answering', score: 180, correctStreak: 0, accuracy: 50, badges: [], lastResponseTimeSec: 15, correctPattern: [true, false, null, null, null], completedQuestions: 2, currentQuestionIndex: 3 },
  { nickname: '백수빈', status: 'answering', score: 160, correctStreak: 0, accuracy: 50, badges: [], lastResponseTimeSec: 16, correctPattern: [false, true, null, null, null], completedQuestions: 2, currentQuestionIndex: 3 },
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
    perQuestionResults: makeQuestionResults(seed.correctPattern),
    completedQuestions: seed.completedQuestions,
    totalQuestions: TOTAL_QUESTIONS,
    currentQuestionIndex: seed.currentQuestionIndex,
    isFinished: seed.status === 'finished',
  }),
)

// ─────────────────────────────────────────────────────────────
// 문항별 분석 데이터 (5문항)
// ─────────────────────────────────────────────────────────────

export const MOCK_QUESTION_ANALYTICS: PerQuestionAnalytics[] = [
  {
    questionIndex: 1,
    questionContent: '다음 중 소수가 아닌 것은?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: '2' },
      { index: 2, text: '3' },
      { index: 3, text: '4' },
      { index: 4, text: '7' },
    ],
    correctOptionIndex: 3,
    distribution: { '1': 2, '2': 3, '3': 14, '4': 1 },
    correctCount: 14,
    incorrectCount: 6,
    unansweredCount: 4,
    totalStudents: 24,
    avgResponseTimeSec: 7.2,
  },
  {
    questionIndex: 2,
    questionContent: '피타고라스 정리에서 빗변을 구하는 공식은?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: 'c = a + b' },
      { index: 2, text: 'c² = a² + b²' },
      { index: 3, text: 'c = a × b' },
      { index: 4, text: 'c² = a² - b²' },
    ],
    correctOptionIndex: 2,
    distribution: { '1': 3, '2': 12, '3': 2, '4': 3 },
    correctCount: 12,
    incorrectCount: 8,
    unansweredCount: 4,
    totalStudents: 24,
    avgResponseTimeSec: 10.5,
  },
  {
    questionIndex: 3,
    questionContent: '일차방정식 2x + 3 = 7의 해는?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: 'x = 1' },
      { index: 2, text: 'x = 2' },
      { index: 3, text: 'x = 3' },
      { index: 4, text: 'x = 4' },
    ],
    correctOptionIndex: 2,
    distribution: { '1': 2, '2': 9, '3': 4, '4': 1 },
    correctCount: 9,
    incorrectCount: 7,
    unansweredCount: 8,
    totalStudents: 24,
    avgResponseTimeSec: 12.3,
  },
  {
    questionIndex: 4,
    questionContent: '삼각형의 내각의 합은?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: '90°' },
      { index: 2, text: '180°' },
      { index: 3, text: '270°' },
      { index: 4, text: '360°' },
    ],
    correctOptionIndex: 2,
    distribution: { '1': 1, '2': 8, '3': 1, '4': 2 },
    correctCount: 8,
    incorrectCount: 4,
    unansweredCount: 12,
    totalStudents: 24,
    avgResponseTimeSec: 6.8,
  },
  {
    questionIndex: 5,
    questionContent: '원의 넓이를 구하는 공식은?',
    questionType: 'multiple_choice',
    options: [
      { index: 1, text: 'πr' },
      { index: 2, text: 'πr²' },
      { index: 3, text: '2πr' },
      { index: 4, text: '2πr²' },
    ],
    correctOptionIndex: 2,
    distribution: { '1': 0, '2': 6, '3': 2, '4': 0 },
    correctCount: 6,
    incorrectCount: 2,
    unansweredCount: 16,
    totalStudents: 24,
    avgResponseTimeSec: 8.1,
  },
]

// ─────────────────────────────────────────────────────────────
// 정답률 추이
// ─────────────────────────────────────────────────────────────

export const MOCK_ACCURACY_TREND: QuestionAccuracyPoint[] =
  MOCK_QUESTION_ANALYTICS.map((q) => ({
    questionIndex: q.questionIndex,
    correctPercent: Math.round((q.correctCount / (q.totalStudents - q.unansweredCount)) * 100),
    avgResponseTimeSec: q.avgResponseTimeSec,
  }))

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
          Math.max(s.perQuestionResults.filter((r) => r.responseTimeSec !== null).length, 1)) *
          10,
      ) / 10,
  }))

// ─────────────────────────────────────────────────────────────
// 분석 데이터 (레거시 호환)
// ─────────────────────────────────────────────────────────────

export const MOCK_ANALYTICS: LiveAnalyticsData = {
  distribution: { '1': 5, '2': 4, '3': 7, '4': 2 },
  answered: 18,
  total: 24,
  accuracyTrend: MOCK_ACCURACY_TREND,
  currentQuestionDifficulty: 'hard',
  isConfusing: true,
}

// ─────────────────────────────────────────────────────────────
// 현재 문항 Mock (레거시 호환)
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

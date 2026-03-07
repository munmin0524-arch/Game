// 분석 엔진 — 리포트용 패턴/코칭/개념 이해도 계산
// types/index.ts의 분석 타입을 사용

import type {
  UUID,
  ResponseEvent,
  Question,
  ParticipantResult,
  AnalysisPattern,
  PatternLabel,
  CoachingLabel,
  StudentAnalysis,
  QuestionReportSummary,
  QuestionBarData,
  ConceptUnderstanding,
} from '@/types'

// ─────────────────────────────────────────────────────────────
// 문항별 분석
// ─────────────────────────────────────────────────────────────

/** 문항별 리포트 종합 요약 계산 */
export function calcQuestionSummary(
  questions: Question[],
  events: ResponseEvent[],
  totalParticipants: number,
): QuestionReportSummary {
  // 첫 시도만 필터 (attempt_no === 1 or final_submit)
  const firstAttempts = events.filter((e) => e.attempt_no === 1 && !e.is_skipped)

  // 제출율
  const respondedIds = new Set(firstAttempts.map((e) => e.result_id))
  const submissionRate = totalParticipants > 0
    ? (respondedIds.size / totalParticipants) * 100
    : 0

  // 평균 점수 (정답 비율 × 100)
  const correctCount = firstAttempts.filter((e) => e.is_correct).length
  const avgScore = firstAttempts.length > 0
    ? (correctCount / firstAttempts.length) * 100
    : 0

  // 평균 풀이시간
  const timesValid = firstAttempts
    .map((e) => e.response_time_sec)
    .filter((t): t is number => t != null)
  const avgTimeSec = timesValid.length > 0
    ? timesValid.reduce((a, b) => a + b, 0) / timesValid.length
    : 0

  // 문항별 오답율 계산
  const questionStats = questions.map((q) => {
    const qEvents = firstAttempts.filter((e) => e.question_id === q.question_id)
    const total = qEvents.length
    const correct = qEvents.filter((e) => e.is_correct).length
    const wrongRate = total > 0 ? ((total - correct) / total) * 100 : 0
    const correctRate = total > 0 ? (correct / total) * 100 : 0
    return { questionId: q.question_id, orderIndex: q.order_index, wrongRate, correctRate }
  })

  // 오답율 Top3
  const topWrongQuestions = [...questionStats]
    .sort((a, b) => b.wrongRate - a.wrongRate)
    .slice(0, 3)
    .filter((q) => q.wrongRate > 0)
    .map(({ questionId, wrongRate }) => ({ questionId, wrongRate }))

  // 정답율 Top3
  const topCorrectQuestions = [...questionStats]
    .sort((a, b) => b.correctRate - a.correctRate)
    .slice(0, 3)
    .filter((q) => q.correctRate > 0)
    .map(({ questionId, correctRate }) => ({ questionId, correctRate }))

  // 경고: 오답율 50%+
  const warnings: QuestionReportSummary['warnings'] = questionStats
    .filter((q) => q.wrongRate >= 50)
    .map((q) => ({ questionId: q.questionId, type: 'high_wrong_rate' as const, value: q.wrongRate }))

  // 경고: 후반부 오답율 급증 (후반 1/3의 평균 오답율이 전반 1/3보다 20%p 이상 높으면)
  const sorted = [...questionStats].sort((a, b) => a.orderIndex - b.orderIndex)
  const third = Math.max(1, Math.floor(sorted.length / 3))
  const firstThird = sorted.slice(0, third)
  const lastThird = sorted.slice(-third)
  const avgWrongFirst = firstThird.reduce((s, q) => s + q.wrongRate, 0) / firstThird.length
  const avgWrongLast = lastThird.reduce((s, q) => s + q.wrongRate, 0) / lastThird.length
  if (avgWrongLast - avgWrongFirst >= 20) {
    lastThird.forEach((q) => {
      if (!warnings.some((w) => w.questionId === q.questionId)) {
        warnings.push({ questionId: q.questionId, type: 'late_spike', value: q.wrongRate })
      }
    })
  }

  return {
    submissionRate: Math.round(submissionRate * 10) / 10,
    avgScore: Math.round(avgScore * 10) / 10,
    avgTimeSec: Math.round(avgTimeSec * 10) / 10,
    topWrongQuestions,
    topCorrectQuestions,
    warnings,
  }
}

/** 문항별 바 차트 데이터 */
export function calcQuestionBars(
  questions: Question[],
  events: ResponseEvent[],
): QuestionBarData[] {
  const firstAttempts = events.filter((e) => e.attempt_no === 1 && !e.is_skipped)

  return questions
    .sort((a, b) => a.order_index - b.order_index)
    .map((q) => {
      const qEvents = firstAttempts.filter((e) => e.question_id === q.question_id)
      const total = qEvents.length
      const correct = qEvents.filter((e) => e.is_correct).length
      const correctRate = total > 0 ? (correct / total) * 100 : 0

      const times = qEvents
        .map((e) => e.response_time_sec)
        .filter((t): t is number => t != null)
      const avgTimeSec = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
      const minTimeSec = times.length > 0 ? Math.min(...times) : 0
      const maxTimeSec = times.length > 0 ? Math.max(...times) : 0

      return {
        questionId: q.question_id,
        orderIndex: q.order_index,
        content: q.content,
        correctRate: Math.round(correctRate * 10) / 10,
        avgTimeSec: Math.round(avgTimeSec * 10) / 10,
        minTimeSec,
        maxTimeSec,
        hasWarning: correctRate < 50,
      }
    })
}

/** 개념(learning_map)별 이해도 계산 */
export function calcConceptUnderstanding(
  questions: Question[],
  events: ResponseEvent[],
): ConceptUnderstanding[] {
  const firstAttempts = events.filter((e) => e.attempt_no === 1 && !e.is_skipped)
  const conceptMap = new Map<string, { total: number; correct: number }>()

  for (const q of questions) {
    const concept = q.learning_map?.depth1 || q.learning_map?.depth2 || q.unit || '기타'
    const qEvents = firstAttempts.filter((e) => e.question_id === q.question_id)

    if (!conceptMap.has(concept)) {
      conceptMap.set(concept, { total: 0, correct: 0 })
    }
    const stats = conceptMap.get(concept)!
    stats.total += qEvents.length
    stats.correct += qEvents.filter((e) => e.is_correct).length
  }

  return Array.from(conceptMap.entries())
    .map(([concept, stats]) => ({
      concept,
      totalQuestions: stats.total,
      correctCount: stats.correct,
      rate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.rate - a.rate)
}

// ─────────────────────────────────────────────────────────────
// 학생별 분석
// ─────────────────────────────────────────────────────────────

/** 연속 정답/오답 계산 */
export function calcStreaks(events: ResponseEvent[]): { maxCorrect: number; maxWrong: number } {
  // 문항 순서대로 정렬 후 연속 계산
  const sorted = [...events]
    .filter((e) => e.attempt_no === 1 && !e.is_skipped && e.is_correct != null)
    .sort((a, b) => (a.answered_at ?? '').localeCompare(b.answered_at ?? ''))

  let maxCorrect = 0
  let maxWrong = 0
  let currentCorrect = 0
  let currentWrong = 0

  for (const e of sorted) {
    if (e.is_correct) {
      currentCorrect++
      currentWrong = 0
      maxCorrect = Math.max(maxCorrect, currentCorrect)
    } else {
      currentWrong++
      currentCorrect = 0
      maxWrong = Math.max(maxWrong, currentWrong)
    }
  }

  return { maxCorrect, maxWrong }
}

/** 학생별 2축 패턴 판정 */
export function calcStudentPattern(
  studentEvents: ResponseEvent[],
  avgTimeSec: number,
): AnalysisPattern {
  const first = studentEvents.filter((e) => e.attempt_no === 1 && !e.is_skipped)
  const total = first.length
  if (total === 0) {
    return { understands: false, diligent: false, needsHelp: true, needsPraise: false }
  }

  // 축1: 개념 이해 여부 — 정답률 60% 이상이면 "이해"
  const correctRate = first.filter((e) => e.is_correct).length / total
  const understands = correctRate >= 0.6

  // 축2: 성실도 — 평균 풀이시간의 50% 미만이고 정답률 낮으면 "찍기"
  const times = first.map((e) => e.response_time_sec).filter((t): t is number => t != null)
  const studentAvgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
  const tooFast = avgTimeSec > 0 && studentAvgTime < avgTimeSec * 0.5
  const diligent = !(tooFast && !understands)

  // 수정횟수 기반 성실도 보정 (이벤트 로그 있을 때)
  const modifyCount = studentEvents.filter((e) => e.event_type === 'modify').length
  const diligentFinal = diligent || modifyCount > 0

  // 코칭 판정
  const streaks = calcStreaks(studentEvents)
  const needsHelp = !understands && (streaks.maxWrong >= 3 || correctRate < 0.4)
  const needsPraise = understands && diligentFinal && streaks.maxCorrect >= 3

  return { understands, diligent: diligentFinal, needsHelp, needsPraise }
}

/** 패턴 라벨 결정 */
export function getPatternLabel(pattern: AnalysisPattern): PatternLabel {
  if (pattern.understands && pattern.diligent) return '이해'
  if (pattern.understands && !pattern.diligent) return '이해' // 이해하지만 빨리 풀음
  if (!pattern.understands && pattern.diligent) return '미이해'
  return '찍기'
}

/** 코칭 라벨 결정 */
export function getCoachingLabel(pattern: AnalysisPattern): CoachingLabel {
  if (pattern.needsHelp) return '도움 필요'
  if (pattern.needsPraise) return '칭찬 필요'
  if (!pattern.understands) return '관찰'
  return '양호'
}

/** 전체 학생 분석 결과 계산 */
export function calcAllStudentAnalyses(
  results: ParticipantResult[],
  events: ResponseEvent[],
  totalQuestions: number,
): StudentAnalysis[] {
  // 전체 평균 풀이시간 계산
  const allFirst = events.filter((e) => e.attempt_no === 1 && !e.is_skipped)
  const allTimes = allFirst
    .map((e) => e.response_time_sec)
    .filter((t): t is number => t != null)
  const globalAvgTime = allTimes.length > 0
    ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length
    : 0

  return results
    .filter((r) => r.status === 'submitted')
    .map((r) => {
      const studentEvents = events.filter((e) => e.result_id === r.result_id)
      const pattern = calcStudentPattern(studentEvents, globalAvgTime)
      const streaks = calcStreaks(studentEvents)

      return {
        resultId: r.result_id,
        nickname: r.nickname ?? '익명',
        totalScore: r.total_score ?? 0,
        correctCount: r.correct_count ?? 0,
        totalQuestions,
        totalTimeSec: r.total_response_time_sec ?? 0,
        pattern,
        patternLabel: getPatternLabel(pattern),
        coachingLabel: getCoachingLabel(pattern),
        streaks,
      }
    })
    .sort((a, b) => b.totalScore - a.totalScore)
}

/** 패턴 분포 계산 (전체 학생 대비 비율) */
export function calcPatternDistribution(
  analyses: StudentAnalysis[],
): Record<PatternLabel, number> {
  const dist: Record<PatternLabel, number> = { '이해': 0, '미이해': 0, '성실': 0, '찍기': 0 }
  for (const a of analyses) {
    dist[a.patternLabel]++
  }
  return dist
}

/** 코칭 Top3 / 칭찬 Top3 추출 */
export function calcCoachingTopN(
  analyses: StudentAnalysis[],
  label: CoachingLabel,
  n: number = 3,
): StudentAnalysis[] {
  return analyses
    .filter((a) => a.coachingLabel === label)
    .sort((a, b) => a.totalScore - b.totalScore) // 점수 낮은 순 (도움), 높은 순 (칭찬)
    .slice(0, n)
}

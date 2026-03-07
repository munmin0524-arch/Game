// S-17 리포트 (학생별 분석) — 스크롤 원페이지
// 요약(전체 통계) → 학생 카드 리스트 → 카드 클릭 시 아코디언 문항별 상세

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Search, ChevronDown, ChevronUp, HelpCircle, Star, Eye, ThumbsUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { EmptyState } from '@/components/common/EmptyState'
import {
  calcStudentPattern,
  calcStreaks,
  getPatternLabel,
  getCoachingLabel,
} from '@/lib/analysis'
import type { ParticipantResult, ResponseEvent, Question, PatternLabel, CoachingLabel } from '@/types'

// ─────────────────────────────────────────────────────────────
// 타입
// ─────────────────────────────────────────────────────────────

interface StudentReport {
  result: ParticipantResult
  responses: ResponseEvent[]
  questions: Question[]
}

interface AnalyzedStudent {
  report: StudentReport
  patternLabel: PatternLabel
  coachingLabel: CoachingLabel
  maxCorrectStreak: number
  maxWrongStreak: number
}

// ─────────────────────────────────────────────────────────────
// 패턴/코칭 뱃지 색상
// ─────────────────────────────────────────────────────────────

const PATTERN_COLORS: Record<PatternLabel, string> = {
  '이해': 'bg-green-100 text-green-700 border-green-200',
  '미이해': 'bg-orange-100 text-orange-700 border-orange-200',
  '성실': 'bg-blue-100 text-blue-700 border-blue-200',
  '찍기': 'bg-red-100 text-red-700 border-red-200',
}

const COACHING_COLORS: Record<CoachingLabel, string> = {
  '도움 필요': 'bg-red-100 text-red-700 border-red-200',
  '칭찬 필요': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  '관찰': 'bg-gray-100 text-gray-600 border-gray-200',
  '양호': 'bg-green-100 text-green-700 border-green-200',
}

const COACHING_ICONS: Record<CoachingLabel, typeof HelpCircle> = {
  '도움 필요': HelpCircle,
  '칭찬 필요': Star,
  '관찰': Eye,
  '양호': ThumbsUp,
}

// ─────────────────────────────────────────────────────────────
// 요약 전체 통계
// ─────────────────────────────────────────────────────────────

function SummarySection({ students }: { students: AnalyzedStudent[] }) {
  const submitted = students.filter((s) => s.report.result.status === 'submitted')

  // 패턴 분포
  const patternDist: Record<PatternLabel, number> = { '이해': 0, '미이해': 0, '성실': 0, '찍기': 0 }
  for (const s of submitted) patternDist[s.patternLabel]++

  // 코칭 Top3 / 칭찬 Top3
  const needsHelp = submitted
    .filter((s) => s.coachingLabel === '도움 필요')
    .sort((a, b) => (a.report.result.total_score ?? 0) - (b.report.result.total_score ?? 0))
    .slice(0, 3)
  const needsPraise = submitted
    .filter((s) => s.coachingLabel === '칭찬 필요')
    .sort((a, b) => (b.report.result.total_score ?? 0) - (a.report.result.total_score ?? 0))
    .slice(0, 3)

  const total = submitted.length || 1

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">요약 전체</h2>

      {/* 패턴 분포 바 */}
      <div className="rounded-xl border bg-white p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-600">패턴 분포</p>
        <div className="flex rounded-full overflow-hidden h-8">
          {(['이해', '미이해', '성실', '찍기'] as PatternLabel[]).map((label) => {
            const pct = (patternDist[label] / total) * 100
            if (pct === 0) return null
            const bgMap: Record<PatternLabel, string> = {
              '이해': 'bg-green-500', '미이해': 'bg-orange-400', '성실': 'bg-blue-500', '찍기': 'bg-red-400',
            }
            return (
              <div
                key={label}
                className={`${bgMap[label]} flex items-center justify-center text-xs text-white font-medium`}
                style={{ width: `${Math.max(pct, 8)}%` }}
              >
                {pct >= 15 ? `${label} ${Math.round(pct)}%` : ''}
              </div>
            )
          })}
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          {(['이해', '미이해', '성실', '찍기'] as PatternLabel[]).map((label) => (
            <span key={label} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded-sm inline-block ${
                label === '이해' ? 'bg-green-500' : label === '미이해' ? 'bg-orange-400' : label === '성실' ? 'bg-blue-500' : 'bg-red-400'
              }`} />
              {label} {patternDist[label]}명
            </span>
          ))}
        </div>
      </div>

      {/* 코칭/칭찬 Top3 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
            <HelpCircle className="h-4 w-4" /> 도움 필요 Top3
          </p>
          {needsHelp.length === 0 ? (
            <p className="text-xs text-gray-400">해당 없음</p>
          ) : needsHelp.map((s) => (
            <div key={s.report.result.result_id} className="flex items-center justify-between text-sm py-1">
              <span className="text-gray-700">{s.report.result.nickname}</span>
              <span className="text-red-600 font-medium">{s.report.result.total_score ?? 0}점</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border bg-yellow-50 p-4">
          <p className="text-sm font-semibold text-yellow-700 mb-2 flex items-center gap-1">
            <Star className="h-4 w-4" /> 칭찬 필요 Top3
          </p>
          {needsPraise.length === 0 ? (
            <p className="text-xs text-gray-400">해당 없음</p>
          ) : needsPraise.map((s) => (
            <div key={s.report.result.result_id} className="flex items-center justify-between text-sm py-1">
              <span className="text-gray-700">{s.report.result.nickname}</span>
              <span className="text-yellow-600 font-medium">{s.report.result.total_score ?? 0}점</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// 학생 아코디언 상세
// ─────────────────────────────────────────────────────────────

function StudentDetailPanel({ report }: { report: StudentReport }) {
  const { responses, questions } = report

  return (
    <div className="mt-2 mb-1 rounded-lg border border-blue-100 bg-blue-50/50 p-4 space-y-2">
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">문항별 응답 내역</p>
      {questions
        .sort((a, b) => a.order_index - b.order_index)
        .map((q) => {
          const resp = responses.find((r) => r.question_id === q.question_id)
          if (!resp) return null
          const isCorrect = resp.is_correct
          const isSkipped = resp.is_skipped

          return (
            <div key={q.question_id} className="flex items-start gap-3 text-sm">
              <span className={`mt-0.5 shrink-0 font-bold ${isCorrect ? 'text-green-600' : isSkipped ? 'text-gray-400' : 'text-red-500'}`}>
                {isSkipped ? '—' : isCorrect ? 'O' : 'X'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 truncate">Q{q.order_index}. {q.content}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                  {isSkipped
                    ? <span>미응답</span>
                    : <span>선택: {resp.selected_answer ?? '-'}</span>}
                  {!isCorrect && !isSkipped && (
                    <span className="text-green-600">정답: {q.answer}</span>
                  )}
                  {resp.response_time_sec != null && (
                    <span>{resp.response_time_sec.toFixed(1)}초</span>
                  )}
                  {resp.hint_used && (
                    <span className="text-purple-500">힌트 사용</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 학생 카드
// ─────────────────────────────────────────────────────────────

function StudentCard({
  student,
  isExpanded,
  onToggle,
}: {
  student: AnalyzedStudent
  isExpanded: boolean
  onToggle: () => void
}) {
  const { report, patternLabel, coachingLabel, maxCorrectStreak } = student
  const { result } = report
  const isNotParticipated = result.status === 'not_started' || result.status === 'abandoned'
  const CoachingIcon = COACHING_ICONS[coachingLabel]

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
        onClick={onToggle}
        disabled={isNotParticipated}
      >
        {/* 순위 */}
        <span className="w-8 text-center font-bold text-gray-400 shrink-0">
          {isNotParticipated ? '—' : `${result.rank}`}
        </span>

        {/* 이름 + 뱃지 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-800 truncate">
              {result.nickname ?? '-'}
            </span>
            {isNotParticipated && <span className="text-xs text-gray-400">미참여</span>}
            {!isNotParticipated && (
              <>
                <Badge variant="outline" className={`text-[10px] py-0 ${PATTERN_COLORS[patternLabel]}`}>
                  {patternLabel}
                </Badge>
                <Badge variant="outline" className={`text-[10px] py-0 gap-0.5 ${COACHING_COLORS[coachingLabel]}`}>
                  <CoachingIcon className="h-3 w-3" />
                  {coachingLabel}
                </Badge>
                {maxCorrectStreak >= 3 && (
                  <span className="text-[10px] text-amber-500 font-medium">
                    {maxCorrectStreak}연속 정답
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* 점수 */}
        <span className="font-semibold text-gray-900 w-16 text-right shrink-0">
          {isNotParticipated ? '-' : `${result.total_score?.toLocaleString() ?? 0}점`}
        </span>

        {/* 정답 수 */}
        <span className="text-sm text-gray-500 w-14 text-right shrink-0 hidden sm:block">
          {isNotParticipated ? '-' : `${result.correct_count ?? 0}/${report.questions.length}`}
        </span>

        {/* 펼침 아이콘 */}
        {!isNotParticipated && (
          <span className="shrink-0 text-gray-400">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        )}
      </button>

      {/* 아코디언 상세 */}
      {isExpanded && !isNotParticipated && (
        <div className="px-4 pb-4">
          <StudentDetailPanel report={report} />
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────────────────────────

export default function StudentReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [reports, setReports] = useState<StudentReport[]>([])
  const [sessionTitle, setSessionTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`/api/sessions/${sessionId}`).then((r) => r.json()),
      fetch(`/api/sessions/${sessionId}/report/students`).then((r) => r.json()),
    ])
      .then(([session, data]) => {
        setSessionTitle(session.set_title ?? '')
        setReports(data)
      })
      .catch(() => toast({ title: '리포트를 불러오지 못했습니다.', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }, [sessionId, toast])

  // 전체 평균 풀이시간 (패턴 판정용)
  const globalAvgTime = useMemo(() => {
    const allResponses = reports.flatMap((r) => r.responses)
    const firstAttempts = allResponses.filter((e) => e.attempt_no === 1 && !e.is_skipped)
    const times = firstAttempts.map((e) => e.response_time_sec).filter((t): t is number => t != null)
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
  }, [reports])

  // 분석된 학생 목록
  const analyzedStudents: AnalyzedStudent[] = useMemo(() => {
    return reports.map((report) => {
      const { responses } = report
      const pattern = calcStudentPattern(responses, globalAvgTime)
      const streaks = calcStreaks(responses)
      return {
        report,
        patternLabel: getPatternLabel(pattern),
        coachingLabel: getCoachingLabel(pattern),
        maxCorrectStreak: streaks.maxCorrect,
        maxWrongStreak: streaks.maxWrong,
      }
    })
  }, [reports, globalAvgTime])

  // 검색 필터
  const filtered = analyzedStudents.filter((s) =>
    search ? s.report.result.nickname?.toLowerCase().includes(search.toLowerCase()) : true,
  )

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <button
          className="text-sm text-gray-500 hover:text-gray-700 mb-1"
          onClick={() => router.push('/dashboard/history')}
        >
          ← 히스토리
        </button>
        <h1 className="text-xl font-bold mb-3">
          {sessionTitle || '리포트'}
        </h1>
        <div className="flex border-b">
          <button
            className="flex-1 py-2.5 text-sm font-medium text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700"
            onClick={() => router.replace(`/sessions/${sessionId}/report/questions`)}
          >
            문항별 분석
          </button>
          <button
            className="flex-1 py-2.5 text-sm font-medium text-center border-b-2 border-blue-600 text-blue-600"
          >
            학생별 분석
          </button>
        </div>
      </div>

      {/* 컨텐츠 */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg border bg-white animate-pulse" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState icon="📊" title="데이터가 없습니다" description="참여자가 없거나 응답 데이터가 없습니다." />
      ) : (
        <>
          {/* [요약] 전체 통계 */}
          <SummarySection students={analyzedStudents} />

          {/* [학생 리스트] */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">학생별 상세</h2>
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-9 h-8 text-sm"
                  placeholder="이름 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              {filtered.map((student) => (
                <StudentCard
                  key={student.report.result.result_id}
                  student={student}
                  isExpanded={expandedId === student.report.result.result_id}
                  onToggle={() =>
                    setExpandedId(
                      expandedId === student.report.result.result_id ? null : student.report.result.result_id,
                    )
                  }
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

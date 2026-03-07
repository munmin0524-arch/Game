// S-16 리포트 (문항별 분석) — 스크롤 원페이지
// 요약(종합 → 문항요약 → 개념별) → 상세(문항별 카드)

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/common/EmptyState'
import { AlertTriangle, TrendingDown, Clock, Users, Award } from 'lucide-react'
import type { Question } from '@/types'

// ─────────────────────────────────────────────────────────────
// 타입
// ─────────────────────────────────────────────────────────────

interface QuestionReport {
  question: Question
  total_participants: number
  correct_count: number
  correct_rate: number          // 0~1
  avg_response_time_sec: number
  min_response_time_sec?: number
  max_response_time_sec?: number
  distribution: Record<string, number>
}

// ─────────────────────────────────────────────────────────────
// 요약 종합 섹션
// ─────────────────────────────────────────────────────────────

function SummaryOverview({ reports }: { reports: QuestionReport[] }) {
  const totalParticipants = reports[0]?.total_participants ?? 0
  // 제출율: 응답이 있는 학생 수 / 전체 (mock에서는 100%로 간주)
  const submissionRate = 100

  // 평균 정답률
  const avgCorrectRate = reports.length > 0
    ? reports.reduce((s, r) => s + r.correct_rate, 0) / reports.length
    : 0

  // 평균 풀이시간
  const avgTime = reports.length > 0
    ? reports.reduce((s, r) => s + r.avg_response_time_sec, 0) / reports.length
    : 0

  // 오답율 Top3
  const sorted = [...reports].sort((a, b) => a.correct_rate - b.correct_rate)
  const topWrong = sorted.slice(0, 3).filter((r) => r.correct_rate < 1)

  // 정답율 Top3
  const topCorrect = [...reports].sort((a, b) => b.correct_rate - a.correct_rate).slice(0, 3)

  // 경고: 오답율 50%+
  const highWrong = reports.filter((r) => r.correct_rate < 0.5)

  // 경고: 후반부 급증
  const orderedReports = [...reports].sort((a, b) => a.question.order_index - b.question.order_index)
  const third = Math.max(1, Math.floor(orderedReports.length / 3))
  const firstThirdAvg = orderedReports.slice(0, third).reduce((s, r) => s + (1 - r.correct_rate), 0) / third
  const lastThirdAvg = orderedReports.slice(-third).reduce((s, r) => s + (1 - r.correct_rate), 0) / third
  const hasLateSpike = lastThirdAvg - firstThirdAvg >= 0.2

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">요약 종합</h2>

      {/* 카드 3종 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-4 text-center">
          <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{submissionRate}%</p>
          <p className="text-xs text-gray-500">제출율 ({totalParticipants}명)</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <Award className="h-5 w-5 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{Math.round(avgCorrectRate * 100)}%</p>
          <p className="text-xs text-gray-500">평균 정답률</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <Clock className="h-5 w-5 text-purple-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{avgTime.toFixed(1)}초</p>
          <p className="text-xs text-gray-500">평균 풀이시간</p>
        </div>
      </div>

      {/* Top3 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700 mb-2">오답율 높은 Top3</p>
          {topWrong.map((r) => (
            <div key={r.question.question_id} className="flex items-center justify-between text-sm py-1">
              <span className="text-gray-700">Q{r.question.order_index}</span>
              <span className="font-medium text-red-600">{Math.round((1 - r.correct_rate) * 100)}%</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700 mb-2">정답율 높은 Top3</p>
          {topCorrect.map((r) => (
            <div key={r.question.question_id} className="flex items-center justify-between text-sm py-1">
              <span className="text-gray-700">Q{r.question.order_index}</span>
              <span className="font-medium text-green-600">{Math.round(r.correct_rate * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 경고 배지 */}
      {(highWrong.length > 0 || hasLateSpike) && (
        <div className="flex flex-wrap gap-2">
          {highWrong.map((r) => (
            <Badge key={r.question.question_id} variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Q{r.question.order_index} 오답 {Math.round((1 - r.correct_rate) * 100)}%
            </Badge>
          ))}
          {hasLateSpike && (
            <Badge variant="outline" className="gap-1 border-orange-300 text-orange-600">
              <TrendingDown className="h-3 w-3" />
              후반부 오답율 급증
            </Badge>
          )}
        </div>
      )}
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// 요약 문항 바 차트
// ─────────────────────────────────────────────────────────────

function SummaryQuestionBars({ reports }: { reports: QuestionReport[] }) {
  const ordered = [...reports].sort((a, b) => a.question.order_index - b.question.order_index)
  const barData = ordered.map((r) => ({
    label: `Q${r.question.order_index}`,
    correctRate: Math.round(r.correct_rate * 100),
    hasWarning: r.correct_rate < 0.5,
  }))

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900">요약 문항</h2>
      <div className="rounded-xl border bg-white p-4">
        <div className="space-y-2">
          {barData.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="w-8 text-sm font-medium text-gray-600 shrink-0">{d.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${d.hasWarning ? 'bg-red-400' : 'bg-blue-500'}`}
                  style={{ width: `${d.correctRate}%` }}
                />
              </div>
              <span className={`text-sm font-medium w-12 text-right ${d.hasWarning ? 'text-red-600' : 'text-gray-700'}`}>
                {d.correctRate}%
              </span>
              {d.hasWarning && <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// 요약 개념별 이해도
// ─────────────────────────────────────────────────────────────

function SummaryConceptBars({ reports }: { reports: QuestionReport[] }) {
  // learning_map.depth1 기준으로 그룹핑
  const conceptMap = new Map<string, { total: number; correct: number }>()
  for (const r of reports) {
    const concept = r.question.learning_map?.depth1 || r.question.unit || '기타'
    if (!conceptMap.has(concept)) conceptMap.set(concept, { total: 0, correct: 0 })
    const stats = conceptMap.get(concept)!
    stats.total += r.total_participants
    stats.correct += r.correct_count
  }

  const concepts = Array.from(conceptMap.entries())
    .map(([name, stats]) => ({
      name,
      rate: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }))
    .sort((a, b) => b.rate - a.rate)

  if (concepts.length <= 1 && concepts[0]?.name === '기타') return null

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900">개념별 이해도</h2>
      <div className="rounded-xl border bg-white p-4">
        <div className="space-y-2">
          {concepts.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span className="w-24 text-sm text-gray-600 shrink-0 truncate">{c.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${c.rate >= 70 ? 'bg-green-500' : c.rate >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                  style={{ width: `${c.rate}%` }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right text-gray-700">{c.rate}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// 상세 문항별 카드
// ─────────────────────────────────────────────────────────────

const OPTION_LABELS = ['①', '②', '③', '④', '⑤']

function QuestionReportCard({ report }: { report: QuestionReport }) {
  const { question, correct_rate, avg_response_time_sec, min_response_time_sec, max_response_time_sec, distribution, correct_count, total_participants } = report

  const chartData = question.type === 'unscramble'
    ? []
    : Object.entries(distribution).map(([key, count]) => ({
        label: OPTION_LABELS[parseInt(key) - 1] ?? key,
        count,
        isCorrect: String(key) === String(question.answer),
      }))

  return (
    <div className="rounded-lg border bg-white p-5 space-y-4">
      {/* 문항 헤더 */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Q{question.order_index}</Badge>
            <Badge variant="secondary" className="text-xs">
              {question.type === 'multiple_choice' ? '객관식' : question.type === 'ox' ? 'OX' : 'Unscramble'}
            </Badge>
            {question.difficulty && (
              <Badge variant="outline" className="text-xs">{question.difficulty}</Badge>
            )}
            {question.learning_map?.depth1 && (
              <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                {question.learning_map.depth1}
              </Badge>
            )}
          </div>
          <p className="font-medium text-gray-800">{question.content}</p>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-2xl font-bold ${correct_rate >= 0.7 ? 'text-green-600' : correct_rate >= 0.4 ? 'text-yellow-500' : 'text-red-500'}`}>
            {Math.round(correct_rate * 100)}%
          </p>
          <p className="text-xs text-gray-400">정답률</p>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        <span>정답 {correct_count}명 / 전체 {total_participants}명</span>
        <span>·</span>
        <span>평균 {avg_response_time_sec.toFixed(1)}초</span>
        {min_response_time_sec != null && max_response_time_sec != null && (
          <>
            <span>·</span>
            <span className="text-gray-400">
              최소 {min_response_time_sec.toFixed(1)}초 / 최대 {max_response_time_sec.toFixed(1)}초
            </span>
          </>
        )}
      </div>

      {/* 선택지 분포 차트 */}
      {question.type !== 'unscramble' && chartData.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">선택지 분포</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 8 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="label" width={24} tick={{ fontSize: 14 }} />
              <Tooltip
                formatter={(value: number) => [`${value}명`, '응답']}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.isCorrect ? '#22c55e' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
              정답
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-slate-400 inline-block" />
              오답
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────────────────────────

export default function QuestionReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [reports, setReports] = useState<QuestionReport[]>([])
  const [sessionTitle, setSessionTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/sessions/${sessionId}`).then((r) => r.json()),
      fetch(`/api/sessions/${sessionId}/report/questions`).then((r) => r.json()),
    ])
      .then(([session, data]) => {
        setSessionTitle(session.set_title ?? '')
        setReports(data)
      })
      .catch(() => toast({ title: '리포트를 불러오지 못했습니다.', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }, [sessionId, toast])

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
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">
            {sessionTitle || '리포트'} — 문항별 분석
          </h1>
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => router.push(`/sessions/${sessionId}/report/students`)}
          >
            학생별 분석 →
          </button>
        </div>
      </div>

      {/* 컨텐츠 */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 rounded-lg border bg-white animate-pulse" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState icon="📊" title="데이터가 없습니다" description="참여자가 없거나 응답 데이터가 없습니다." />
      ) : (
        <>
          {/* [요약] 종합 */}
          <SummaryOverview reports={reports} />

          {/* [요약] 문항 요약 바 */}
          <SummaryQuestionBars reports={reports} />

          {/* [요약] 개념별 이해도 */}
          <SummaryConceptBars reports={reports} />

          {/* [상세] 문항별 카드 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">상세 문항별</h2>
            <div className="space-y-4">
              {[...reports]
                .sort((a, b) => a.question.order_index - b.question.order_index)
                .map((report) => (
                  <QuestionReportCard key={report.question.question_id} report={report} />
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

// S-16 리포트 (문항별 분석)
// 스펙: docs/screens/phase3-group-report.md#s-16
// 차트: Recharts 사용 (npm install recharts 필요)

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/common/EmptyState'
import type { Question } from '@/types'

interface QuestionReport {
  question: Question
  total_participants: number
  correct_count: number
  correct_rate: number          // 0~1
  avg_response_time_sec: number
  distribution: Record<string, number>
  top_wrong_answers?: string[]  // 단답형 전용
}

const OPTION_LABELS = ['①', '②', '③', '④', '⑤']

function QuestionReportCard({ report }: { report: QuestionReport }) {
  const { question, correct_rate, avg_response_time_sec, distribution, correct_count, total_participants, top_wrong_answers } = report

  // 차트 데이터 변환
  const chartData = question.type === 'short_answer'
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
            <Badge variant="outline" className="text-xs">
              Q{question.order_index}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {question.type === 'multiple_choice' ? '객관식' : question.type === 'ox' ? 'OX' : '단답형'}
            </Badge>
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
      <div className="flex gap-4 text-sm text-gray-600">
        <span>정답 {correct_count}명 / 전체 {total_participants}명</span>
        <span>·</span>
        <span>평균 응답 {avg_response_time_sec.toFixed(1)}초</span>
      </div>

      {/* 선택지 분포 차트 (객관식 / OX) */}
      {question.type !== 'short_answer' && chartData.length > 0 && (
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
                  <Cell
                    key={i}
                    fill={entry.isCorrect ? '#22c55e' : '#94a3b8'}
                  />
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

      {/* 단답형 오답 목록 (P-10: 텍스트 목록 방식) */}
      {question.type === 'short_answer' && top_wrong_answers && top_wrong_answers.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">주요 오답</p>
          <div className="flex flex-wrap gap-2">
            {top_wrong_answers.map((ans, i) => (
              <span key={i} className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-600 border border-red-100">
                {ans}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

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
    <div className="space-y-6">
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
        <div className="space-y-4">
          {reports.map((report) => (
            <QuestionReportCard key={report.question.question_id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}

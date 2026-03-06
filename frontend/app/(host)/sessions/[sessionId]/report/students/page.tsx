// S-17 리포트 (학생별 분석)
// 스펙: docs/screens/phase3-group-report.md#s-17

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { EmptyState } from '@/components/common/EmptyState'
import type { ParticipantResult, ResponseEvent, Question } from '@/types'

interface StudentReport {
  result: ParticipantResult
  responses: ResponseEvent[]
  questions: Question[]
}

function formatTime(sec: number | null): string {
  if (sec == null) return '-'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function StudentDetailPanel({ report }: { report: StudentReport }) {
  const { responses, questions } = report

  return (
    <div className="mt-2 mb-1 rounded-lg border border-blue-100 bg-blue-50 p-4 space-y-2">
      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">문항별 응답 내역</p>
      {questions.map((q) => {
        const resp = responses.find((r) => r.question_id === q.question_id)
        if (!resp) return null
        const isCorrect = resp.is_correct
        const isSkipped = resp.is_skipped

        return (
          <div key={q.question_id} className="flex items-start gap-3 text-sm">
            <span className={`mt-0.5 shrink-0 font-bold ${isCorrect ? 'text-green-600' : isSkipped ? 'text-gray-400' : 'text-red-500'}`}>
              {isSkipped ? '—' : isCorrect ? '✅' : '❌'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 truncate">Q{q.order_index}. {q.content}</p>
              <p className="text-xs text-gray-500">
                {isSkipped
                  ? '미응답'
                  : `선택: ${resp.selected_answer ?? '-'}`}
                {!isCorrect && !isSkipped && (
                  <span className="ml-2 text-green-600">→ 정답: {q.answer}</span>
                )}
                {resp.response_time_sec != null && (
                  <span className="ml-2">{resp.response_time_sec.toFixed(1)}초</span>
                )}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function StudentReportPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [reports, setReports] = useState<StudentReport[]>([])
  const [sessionTitle, setSessionTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showNotParticipated, setShowNotParticipated] = useState(false)
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

  const filtered = reports.filter((r) => {
    const matchSearch = search
      ? r.result.nickname?.toLowerCase().includes(search.toLowerCase())
      : true
    const matchParticipated = showNotParticipated
      ? r.result.status === 'not_started' || r.result.status === 'abandoned'
      : true
    return matchSearch && matchParticipated
  })

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
            {sessionTitle || '리포트'} — 학생별 분석
          </h1>
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => router.push(`/sessions/${sessionId}/report/questions`)}
          >
            ← 문항별 분석
          </button>
        </div>
      </div>

      {/* 검색 + 필터 */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="이름 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowNotParticipated((v) => !v)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors
            ${showNotParticipated ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          미참여만
        </button>
      </div>

      {/* 테이블 */}
      {loading ? (
        <div className="space-y-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg border bg-white animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📊" title="데이터가 없습니다" />
      ) : (
        <div className="space-y-1">
          {filtered.map((sr) => {
            const { result } = sr
            const isExpanded = expandedId === result.result_id
            const isNotParticipated =
              result.status === 'not_started' || result.status === 'abandoned'

            return (
              <div key={result.result_id} className="rounded-lg border bg-white overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : result.result_id)
                  }
                  disabled={isNotParticipated}
                >
                  {/* 순위 */}
                  <span className="w-10 text-center font-bold text-gray-400 shrink-0">
                    {isNotParticipated ? '—' : `${result.rank}위`}
                  </span>

                  {/* 이름 */}
                  <span className="flex-1 font-medium text-gray-800 truncate">
                    {result.nickname ?? '-'}
                    {isNotParticipated && (
                      <span className="ml-2 text-xs text-gray-400">미참여</span>
                    )}
                  </span>

                  {/* 유형 */}
                  <Badge variant={result.participant_type === 'member' ? 'default' : 'secondary'} className="text-xs shrink-0">
                    {result.participant_type === 'member' ? 'Member' : 'Guest'}
                  </Badge>

                  {/* 점수 */}
                  <span className="font-semibold text-gray-900 w-20 text-right shrink-0">
                    {isNotParticipated ? '-' : `${result.total_score?.toLocaleString() ?? 0}점`}
                  </span>

                  {/* 정답 수 */}
                  <span className="text-sm text-gray-500 w-16 text-right shrink-0 hidden sm:block">
                    {isNotParticipated
                      ? '-'
                      : `${result.correct_count ?? 0}/${sr.questions.length}개`}
                  </span>

                  {/* 응답 시간 */}
                  <span className="text-sm text-gray-400 w-12 text-right shrink-0 hidden md:block">
                    {isNotParticipated ? '-' : formatTime(result.total_response_time_sec)}
                  </span>
                </button>

                {/* 상세 패널 (토글) */}
                {isExpanded && !isNotParticipated && (
                  <div className="px-4 pb-4">
                    <StudentDetailPanel report={sr} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

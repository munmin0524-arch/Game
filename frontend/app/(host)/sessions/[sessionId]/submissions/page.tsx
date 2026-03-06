// S-12 제출 현황 대시보드 (Host)
// 스펙: docs/screens/phase2-assignment.md#s-12

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { differenceInDays, isPast } from 'date-fns'
import { Search, UserX } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'
import { SubmissionStatusBoard } from '@/components/host/SubmissionStatusBoard'
import type { Session, ParticipantResult } from '@/types'

type SubmissionFilter = 'all' | 'not_submitted'

function getSubmissionStatus(r: ParticipantResult): 'submitted' | 'in_progress' | 'not_submitted' {
  if (r.status === 'submitted') return 'submitted'
  if (r.status === 'in_progress') return 'in_progress'
  return 'not_submitted'
}

export default function SubmissionsPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [session, setSession] = useState<Session | null>(null)
  const [results, setResults] = useState<ParticipantResult[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<SubmissionFilter>('all')
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/sessions/${sessionId}`).then((r) => r.json()),
      fetch(`/api/sessions/${sessionId}/submissions`).then((r) => r.json()),
    ])
      .then(([s, r]) => {
        setSession(s)
        setResults(r)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [sessionId])

  const handleClose = async () => {
    setClosing(true)
    try {
      await fetch(`/api/sessions/${sessionId}/close`, { method: 'POST' })
      toast({ title: '과제가 마감 처리되었습니다.' })
      setSession((prev) => prev ? { ...prev, status: 'completed' } : prev)
    } catch {
      toast({ title: '마감 처리에 실패했습니다.', variant: 'destructive' })
    } finally {
      setClosing(false)
    }
  }

  const filtered = results.filter((r) => {
    const matchSearch = search
      ? r.nickname?.toLowerCase().includes(search.toLowerCase())
      : true
    const matchFilter =
      filter === 'not_submitted' ? getSubmissionStatus(r) !== 'submitted' : true
    return matchSearch && matchFilter
  })

  // 집계
  const submitted = results.filter((r) => getSubmissionStatus(r) === 'submitted').length
  const inProgress = results.filter((r) => getSubmissionStatus(r) === 'in_progress').length
  const notSubmitted = results.length - submitted - inProgress

  const isExpired = session?.close_at ? isPast(new Date(session.close_at)) : false
  const dDays = session?.close_at
    ? differenceInDays(new Date(session.close_at), new Date())
    : null

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <button
            className="text-sm text-gray-500 hover:text-gray-700 mb-1"
            onClick={() => router.push('/dashboard/history')}
          >
            ← 히스토리
          </button>
          <h1 className="text-xl font-bold">
            {session?.set_title ?? '로딩 중...'} — 제출 현황
          </h1>
        </div>

        {/* 마감일 + 마감 처리 */}
        <div className="flex items-center gap-3">
          {session?.close_at ? (
            <div className="text-right">
              <p className="text-sm text-gray-500">마감</p>
              <p className="text-sm font-medium">
                {new Date(session.close_at).toLocaleDateString('ko-KR')}
                {isExpired ? (
                  <Badge variant="secondary" className="ml-2">마감됨</Badge>
                ) : dDays !== null ? (
                  <span className="ml-2 text-blue-600 font-semibold">D-{dDays}</span>
                ) : null}
              </p>
            </div>
          ) : (
            <span className="text-sm text-gray-400">무기한</span>
          )}

          {!isExpired && session?.status !== 'completed' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={closing}>
                  마감 처리
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>과제를 마감 처리할까요?</AlertDialogTitle>
                  <AlertDialogDescription>
                    마감 처리 시 진행 중인 학생도 자동 제출 처리됩니다. 이 작업은 되돌릴 수
                    없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClose}>마감 처리</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* 요약 카드 */}
      <SubmissionStatusBoard
        submitted={submitted}
        inProgress={inProgress}
        notSubmitted={notSubmitted}
        total={results.length}
        loading={loading}
      />

      {/* 필터 + 검색 */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {(['all', 'not_submitted'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors
                ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {f === 'all' ? '전체' : '미제출만'}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="이름 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 제출 현황 테이블 */}
      <div className="rounded-lg border overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">이름</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">유형</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">상태</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">점수</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-12 ml-auto" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-400">
                  {search ? '검색 결과가 없습니다.' : '아직 제출한 학생이 없어요.'}
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const status = getSubmissionStatus(r)
                return (
                  <tr key={r.result_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.nickname ?? '-'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={r.participant_type === 'member' ? 'default' : 'secondary'}>
                        {r.participant_type === 'member' ? 'Member' : 'Guest'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {status === 'submitted' && (
                        <span className="flex items-center gap-1 text-green-600">
                          ✅ 제출완료
                        </span>
                      )}
                      {status === 'in_progress' && (
                        <span className="flex items-center gap-1 text-blue-600">
                          🔄 진행 중
                        </span>
                      )}
                      {status === 'not_submitted' && (
                        <span className="flex items-center gap-1 text-gray-400">
                          ⏳ 미제출
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {r.total_score != null ? `${r.total_score.toLocaleString()}점` : '-'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// S-08 결과·랭킹 화면 (Host + 학생 공통)
// 스펙: docs/screens/phase1-live-core.md#s-08

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { sessionsApi } from '@/lib/api'
import type { ParticipantResult, ParticipantType } from '@/types'

// TODO: 실제 인증 상태에서 가져올 것
function useCurrentUser() {
  return {
    isHost: false, // TODO: AuthContext에서 isHost 확인
    nickname: '', // TODO: 현재 사용자 닉네임
  }
}

const MEDAL = ['🥇', '🥈', '🥉']

function formatTime(sec: number | null): string {
  if (sec == null) return '-'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function ResultPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const { isHost, nickname } = useCurrentUser()

  const [results, setResults] = useState<ParticipantResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sessionsApi
      .results(sessionId)
      .then(setResults)
      .catch(() => toast({ title: '결과를 불러오지 못했습니다.', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }, [sessionId, toast])

  const handleReplay = async () => {
    try {
      const session = await sessionsApi.get(sessionId)
      // 동일 세트를 새 세션으로 배포
      router.push(`/sets/${session.set_id}/deploy`)
    } catch {
      toast({ title: '리플레이 생성에 실패했습니다.', variant: 'destructive' })
    }
  }

  const handleEnd = () => {
    if (isHost) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    )
  }

  const top3 = results.slice(0, 3)
  const rest = results.slice(3)

  // 학생 본인 결과
  const myResult = !isHost ? results.find((r) => r.nickname === nickname) : null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h1 className="text-lg font-bold">🏆 게임 결과</h1>
        <div className="flex gap-2">
          {isHost && (
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => router.push(`/sessions/${sessionId}/report/questions`)}
            >
              <BarChart2 className="mr-1 h-4 w-4" />
              리포트 보기
            </Button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">
        {/* 학생 본인 순위 (고정 상단) */}
        {!isHost && myResult && (
          <div className="rounded-xl border border-yellow-400/50 bg-yellow-400/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-semibold text-yellow-300">{myResult.nickname}</p>
                  <p className="text-sm text-gray-400">
                    {myResult.rank}위 · {formatTime(myResult.total_response_time_sec)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-300">
                  {myResult.total_score?.toLocaleString() ?? 0}점
                </p>
                <p className="text-xs text-gray-400">맞춤 {myResult.correct_count}개</p>
              </div>
            </div>
          </div>
        )}

        {/* TOP 3 포디움 */}
        {results.length > 0 && (
          <div>
            <h2 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wide mb-6">
              TOP 3
            </h2>

            <div className="flex items-end justify-center gap-4">
              {/* 2위 */}
              {top3[1] && (
                <div className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-3xl">{MEDAL[1]}</span>
                  <p className="text-sm font-medium text-gray-200 truncate max-w-[80px] text-center">
                    {top3[1].nickname}
                  </p>
                  <div className="w-full rounded-t-lg bg-gray-700 py-4 text-center">
                    <p className="font-bold text-white">
                      {top3[1].total_score?.toLocaleString() ?? 0}
                    </p>
                    <p className="text-xs text-gray-400">점</p>
                  </div>
                </div>
              )}

              {/* 1위 */}
              {top3[0] && (
                <div className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-4xl">{MEDAL[0]}</span>
                  <p className="font-semibold text-white truncate max-w-[100px] text-center">
                    {top3[0].nickname}
                  </p>
                  <div className="w-full rounded-t-lg bg-yellow-500 py-6 text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {top3[0].total_score?.toLocaleString() ?? 0}
                    </p>
                    <p className="text-xs text-gray-700">점</p>
                  </div>
                </div>
              )}

              {/* 3위 */}
              {top3[2] && (
                <div className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-3xl">{MEDAL[2]}</span>
                  <p className="text-sm font-medium text-gray-200 truncate max-w-[80px] text-center">
                    {top3[2].nickname}
                  </p>
                  <div className="w-full rounded-t-lg bg-amber-700/60 py-3 text-center">
                    <p className="font-bold text-white">
                      {top3[2].total_score?.toLocaleString() ?? 0}
                    </p>
                    <p className="text-xs text-gray-400">점</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 전체 순위 목록 */}
        {rest.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              전체 순위
            </h2>
            <div className="space-y-1">
              {rest.map((r) => (
                <RankRow key={r.result_id} result={r} myNickname={!isHost ? nickname : ''} />
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && (
          <p className="text-center text-gray-500 py-12">참여자가 없습니다.</p>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-2xl gap-3 justify-center">
          {isHost && (
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 min-w-[140px]"
              onClick={handleReplay}
            >
              🔄 리플레이
            </Button>
          )}
          <Button
            size="lg"
            className="min-w-[140px]"
            onClick={handleEnd}
          >
            {isHost ? '종료 ✕' : '나가기'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function RankRow({
  result,
  myNickname,
}: {
  result: ParticipantResult
  myNickname: string
}) {
  const isMe = myNickname && result.nickname === myNickname

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors
        ${isMe ? 'bg-yellow-400/10 border border-yellow-400/30' : 'bg-white/5 hover:bg-white/10'}
      `}
    >
      <span className="w-8 text-center font-bold text-gray-400">{result.rank}위</span>
      <span className="flex-1 font-medium text-white">
        {result.nickname}
        {isMe && <span className="ml-2 text-xs text-yellow-400">(나)</span>}
      </span>
      <Badge
        variant={result.participant_type === 'member' ? 'default' : 'secondary'}
        className="text-xs"
      >
        {result.participant_type === 'member' ? 'Member' : 'Guest'}
      </Badge>
      <span className="text-sm text-gray-400 w-12 text-right">
        {formatTime(result.total_response_time_sec)}
      </span>
      <span className="font-semibold text-white w-20 text-right">
        {result.total_score?.toLocaleString() ?? 0}점
      </span>
    </div>
  )
}

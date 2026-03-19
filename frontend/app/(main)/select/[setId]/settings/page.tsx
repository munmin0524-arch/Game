// 빠른 게임 설정 — 메인 플로우
// 핵심 설정만: 게임 모드 + 제한 시간 → 바로 시작

'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Rocket, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { sessionsApi } from '@/lib/api'
import { GAME_MODES, MODE_TYPE_COLORS } from '@/lib/game-constants'
import type { GameMode } from '@/types'

export default function QuickSettingsPage() {
  const { setId } = useParams<{ setId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [gameMode, setGameMode] = useState<GameMode>('tug_of_war')
  const [timeLimit, setTimeLimit] = useState(20)
  const [starting, setStarting] = useState(false)

  const handleStart = async () => {
    if (timeLimit < 1) {
      toast({ title: '제한 시간은 1초 이상이어야 합니다.', variant: 'destructive' })
      return
    }

    setStarting(true)
    try {
      const session = await sessionsApi.create(setId, {
        session_type: 'live',
        game_mode: gameMode,
        deploy_type: 'public_qr',
        time_limit_per_q: timeLimit,
        allow_retry: false,
        allow_hint: false,
      })
      router.push(`/live/${session.session_id}/waiting`)
    } catch {
      toast({ title: '게임 생성에 실패했습니다.', variant: 'destructive' })
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">게임 설정</h1>
        <p className="text-sm text-gray-500 mt-1">게임 유형을 고르고 바로 시작하세요</p>
      </div>

      {/* 게임 모드 선택 */}
      <section className="space-y-4 rounded-2xl border bg-white p-5 shadow-soft">
        <p className="font-semibold text-sm text-gray-500">게임 유형</p>
        <div className="grid grid-cols-2 gap-2">
          {GAME_MODES.map((mode) => {
            const isSelected = gameMode === mode.value
            return (
              <button
                key={mode.value}
                onClick={() => setGameMode(mode.value)}
                className={`flex flex-col items-start gap-1.5 rounded-xl border-2 p-3 text-left transition-all
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                    {mode.label}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${MODE_TYPE_COLORS[mode.type]}`}>
                    {mode.type}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{mode.desc}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* 제한 시간 */}
      <section className="space-y-3 rounded-2xl border bg-white p-5 shadow-soft">
        <Label className="text-sm font-semibold text-gray-500">문항당 제한 시간 (초)</Label>
        <div className="flex items-center gap-3">
          {[10, 15, 20, 30].map((sec) => (
            <button
              key={sec}
              onClick={() => setTimeLimit(sec)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all border
                ${timeLimit === sec
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              {sec}초
            </button>
          ))}
          <Input
            type="number"
            min={1}
            max={120}
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="w-20 text-center"
          />
        </div>
      </section>

      {/* 게임 시작 버튼 */}
      <Button
        size="lg"
        className="w-full h-14 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
        onClick={handleStart}
        disabled={starting}
      >
        <Rocket className="mr-2 h-5 w-5" />
        {starting ? '준비 중...' : '게임 시작!'}
      </Button>

      {/* 더 많은 설정 링크 */}
      <div className="text-center">
        <Button
          variant="link"
          className="text-sm text-gray-400"
          onClick={() => router.push(`/sets/${setId}/deploy`)}
        >
          <Settings2 className="mr-1 h-3.5 w-3.5" />
          더 많은 설정 (과제 모드, 그룹 지정 등)
        </Button>
      </div>
    </div>
  )
}

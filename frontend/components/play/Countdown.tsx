// Countdown — 타이머 컴포넌트
// S-06 플레이 화면에서 사용

'use client'

import { useEffect, useRef } from 'react'
import { Progress } from '@/components/ui/progress'

interface CountdownProps {
  totalSeconds: number
  remainingSeconds: number
  /** 타이머 종료 콜백 */
  onEnd?: () => void
}

export function Countdown({ totalSeconds, remainingSeconds, onEnd }: CountdownProps) {
  const endCalledRef = useRef(false)

  useEffect(() => {
    if (remainingSeconds <= 0 && !endCalledRef.current) {
      endCalledRef.current = true
      onEnd?.()
    }
    if (remainingSeconds > 0) {
      endCalledRef.current = false
    }
  }, [remainingSeconds, onEnd])

  const pct = totalSeconds > 0 ? Math.round((remainingSeconds / totalSeconds) * 100) : 0
  const isWarning = remainingSeconds <= 5
  const isUrgent = remainingSeconds <= 10 && remainingSeconds > 5

  const timerColor = isWarning
    ? 'text-red-400'
    : isUrgent
    ? 'text-yellow-400'
    : 'text-white'

  const barClass = isWarning
    ? '[&>div]:bg-red-500'
    : isUrgent
    ? '[&>div]:bg-yellow-400'
    : '[&>div]:bg-blue-500'

  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, '0')
  const ss = String(remainingSeconds % 60).padStart(2, '0')

  return (
    <div className="space-y-1">
      <div className="flex justify-end">
        <span className={`font-mono text-xl font-bold tabular-nums ${timerColor}`}>
          {mm}:{ss}
        </span>
      </div>
      <Progress value={pct} className={`h-2 ${barClass}`} />
    </div>
  )
}

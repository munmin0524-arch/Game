'use client'

import { useState } from 'react'
import { ThumbsUp, HandMetal, AlertTriangle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import type { ReactionType, ReactionPayload } from '@/types'
import { cn } from '@/lib/utils'

interface ReactionBarProps {
  selectedStudentIds: string[]
  onSendReaction: (payload: ReactionPayload) => void
  sessionId: string
}

const REACTIONS: { type: ReactionType; icon: React.ElementType; label: string; color: string }[] = [
  { type: 'praise', icon: ThumbsUp, label: '칭찬', color: 'text-yellow-600 hover:bg-yellow-50' },
  { type: 'encouragement', icon: HandMetal, label: '격려', color: 'text-blue-600 hover:bg-blue-50' },
  { type: 'warning', icon: AlertTriangle, label: '집중', color: 'text-orange-600 hover:bg-orange-50' },
  { type: 'speed_up', icon: Zap, label: '빨리', color: 'text-purple-600 hover:bg-purple-50' },
]

export default function ReactionBar({
  selectedStudentIds,
  onSendReaction,
  sessionId,
}: ReactionBarProps) {
  const { toast } = useToast()
  const [broadcastMode, setBroadcastMode] = useState(false)

  const targetCount = broadcastMode ? '전체' : `${selectedStudentIds.length}명`
  const canSend = broadcastMode || selectedStudentIds.length > 0

  const handleReaction = (type: ReactionType) => {
    if (!canSend) {
      toast({ title: '학생을 선택하거나 전체 모드를 켜주세요.' })
      return
    }
    onSendReaction({
      type,
      targetIds: broadcastMode ? [] : selectedStudentIds,
      sessionId,
    })
    const label = REACTIONS.find((r) => r.type === type)?.label ?? ''
    toast({
      title: `${label} 리액션을 ${targetCount}에게 보냈습니다.`,
    })
  }

  return (
    <div className="flex items-center gap-3">
      {/* 대상 표시 */}
      <div className="flex items-center gap-2">
        <Button
          variant={broadcastMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => setBroadcastMode(!broadcastMode)}
          className="text-xs h-7"
        >
          {broadcastMode ? '전체' : '선택'}
        </Button>
        <span className="text-xs text-gray-500">
          {broadcastMode
            ? '전체 학생에게 전송'
            : selectedStudentIds.length > 0
              ? `${selectedStudentIds.length}명 선택됨`
              : '학생을 선택하세요'}
        </span>
      </div>

      {/* 구분선 */}
      <div className="h-6 w-px bg-gray-200" />

      {/* 리액션 버튼들 */}
      {REACTIONS.map((r) => {
        const Icon = r.icon
        return (
          <button
            key={r.type}
            type="button"
            onClick={() => handleReaction(r.type)}
            disabled={!canSend}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-40',
              r.color,
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{r.label}</span>
          </button>
        )
      })}
    </div>
  )
}

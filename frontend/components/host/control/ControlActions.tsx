'use client'

import { useState } from 'react'
import {
  Pause,
  Play,
  SkipForward,
  Lightbulb,
  ChevronRight,
  Timer,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'

interface ControlActionsProps {
  isPaused: boolean
  isLastQuestion: boolean
  hintRevealed: boolean
  hasHint: boolean
  hasQuestion: boolean
  onPauseResume: () => void
  onHint: () => void
  onSkip: () => void
  onNextQuestion: () => void
  onExtendTime: (seconds: number) => void
  onForceEnd: () => void
}

export default function ControlActions({
  isPaused,
  isLastQuestion,
  hintRevealed,
  hasHint,
  hasQuestion,
  onPauseResume,
  onHint,
  onSkip,
  onNextQuestion,
  onExtendTime,
  onForceEnd,
}: ControlActionsProps) {
  return (
    <div className="flex flex-col gap-2 p-4 border-t">
      {/* 일시정지/재개 */}
      <Button
        variant={isPaused ? 'default' : 'outline'}
        size="sm"
        className="w-full justify-start"
        onClick={onPauseResume}
      >
        {isPaused ? (
          <>
            <Play className="mr-2 h-4 w-4" />
            재개
          </>
        ) : (
          <>
            <Pause className="mr-2 h-4 w-4" />
            일시정지
          </>
        )}
      </Button>

      {/* 힌트 공개 */}
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start"
        onClick={onHint}
        disabled={!hasQuestion || hintRevealed || !hasHint}
      >
        <Lightbulb
          className={cn('mr-2 h-4 w-4', hintRevealed && 'text-amber-500')}
        />
        {hintRevealed ? '힌트 공개됨' : '힌트 공개'}
      </Button>

      {/* 건너뛰기 */}
      {isLastQuestion ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              disabled={!hasQuestion}
            >
              <SkipForward className="mr-2 h-4 w-4" />
              건너뛰기
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>마지막 문항입니다</AlertDialogTitle>
              <AlertDialogDescription>
                건너뛰면 게임이 종료됩니다. 계속하시겠어요?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={onSkip}>종료</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={onSkip}
          disabled={!hasQuestion}
        >
          <SkipForward className="mr-2 h-4 w-4" />
          건너뛰기
        </Button>
      )}

      {/* 시간 연장 */}
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onExtendTime(15)}
        >
          <Timer className="mr-1 h-3.5 w-3.5" />
          +15s
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onExtendTime(30)}
        >
          +30s
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onExtendTime(60)}
        >
          +60s
        </Button>
      </div>

      {/* 구분선 */}
      <div className="my-1 h-px bg-gray-200" />

      {/* 다음 문항 / 게임 종료 (핵심 CTA) */}
      {isLastQuestion ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!hasQuestion}
            >
              게임 종료
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>마지막 문항입니다</AlertDialogTitle>
              <AlertDialogDescription>
                다음으로 넘어가면 게임이 종료되고 결과 화면으로 이동합니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={onNextQuestion}>게임 종료</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={onNextQuestion}
          disabled={!hasQuestion}
        >
          다음 문항
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}

      {/* 강제 종료 */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full text-red-500 hover:text-red-700 hover:bg-red-50">
            <XCircle className="mr-2 h-4 w-4" />
            강제 종료
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게임을 강제 종료할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              지금 종료하면 현재까지의 결과로 랭킹이 집계됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={onForceEnd} className="bg-red-600 hover:bg-red-700">
              종료
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

'use client'

import {
  Pause,
  Play,
  SkipForward,
  Lightbulb,
  ChevronRight,
  Timer,
  XCircle,
  Clock,
  Users,
  LayoutDashboard,
  X,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react'
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
import { cn } from '@/lib/utils'
import type { WsQuestionShow } from '@/types'

interface HeaderControlBarProps {
  question: WsQuestionShow | null
  isPaused: boolean
  isLastQuestion: boolean
  hintRevealed: boolean
  hasHint: boolean
  timeRemaining: number
  total: number
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onPauseResume: () => void
  onHint: () => void
  onSkip: () => void
  onNextQuestion: () => void
  onExtendTime: (seconds: number) => void
  onForceEnd: () => void
  onClose: () => void
}

export default function HeaderControlBar({
  question,
  isPaused,
  isLastQuestion,
  hintRevealed,
  hasHint,
  timeRemaining,
  total,
  sidebarOpen,
  onToggleSidebar,
  onPauseResume,
  onHint,
  onSkip,
  onNextQuestion,
  onExtendTime,
  onForceEnd,
  onClose,
}: HeaderControlBarProps) {
  const isTimeCritical = timeRemaining <= 5
  const hasQuestion = !!question

  return (
    <header className="flex h-14 flex-shrink-0 items-center border-b bg-white px-4 shadow-sm gap-3">
      {/* 왼쪽: 타이틀 + 문항 정보 */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 text-gray-900">
          <LayoutDashboard className="h-5 w-5 text-blue-600" />
          <h1 className="text-base font-bold whitespace-nowrap">컨트롤 패널</h1>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        {question && (
          <Badge className="bg-blue-600 text-white text-sm px-3 py-0.5 font-mono">
            Q{question.questionIndex} / {question.totalQuestions}
          </Badge>
        )}

        <div className="flex items-center gap-1.5 text-gray-600">
          <Users className="h-4 w-4" />
          <span className="text-sm font-semibold tabular-nums whitespace-nowrap">{total}명</span>
        </div>
      </div>

      {/* 중앙: 타이머 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="h-6 w-px bg-gray-200" />
        <Clock className="h-4 w-4 text-gray-400" />
        <span
          className={cn(
            'font-mono text-2xl font-bold tabular-nums transition-colors',
            isTimeCritical ? 'text-red-600 animate-pulse' : 'text-gray-900',
          )}
        >
          {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:
          {String(timeRemaining % 60).padStart(2, '0')}
        </span>
        {isPaused && (
          <Badge className="animate-pulse bg-yellow-100 text-yellow-700 border border-yellow-300 text-xs">
            일시정지
          </Badge>
        )}
        <div className="h-6 w-px bg-gray-200" />
      </div>

      {/* 제어 버튼들 */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <Button
          variant={isPaused ? 'default' : 'outline'}
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={onPauseResume}
        >
          {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          {isPaused ? '재개' : '일시정지'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={onHint}
          disabled={!hasQuestion || hintRevealed || !hasHint}
        >
          <Lightbulb className={cn('h-3.5 w-3.5', hintRevealed && 'text-amber-500')} />
          {hintRevealed ? '힌트 공개됨' : '힌트'}
        </Button>

        <div className="flex items-center gap-0.5">
          <Button variant="outline" size="sm" className="h-8 text-xs px-2" onClick={() => onExtendTime(15)}>
            <Timer className="h-3 w-3 mr-0.5" />+15s
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs px-2" onClick={() => onExtendTime(30)}>
            +30s
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs px-2" onClick={() => onExtendTime(60)}>
            +60s
          </Button>
        </div>

        {isLastQuestion ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" disabled={!hasQuestion}>
                <SkipForward className="h-3.5 w-3.5" />
                건너뛰기
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>마지막 문항입니다</AlertDialogTitle>
                <AlertDialogDescription>건너뛰면 게임이 종료됩니다. 계속하시겠어요?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={onSkip}>종료</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={onSkip} disabled={!hasQuestion}>
            <SkipForward className="h-3.5 w-3.5" />
            건너뛰기
          </Button>
        )}

        {isLastQuestion ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 gap-1.5" disabled={!hasQuestion}>
                게임 종료
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>마지막 문항입니다</AlertDialogTitle>
                <AlertDialogDescription>다음으로 넘어가면 게임이 종료되고 결과 화면으로 이동합니다.</AlertDialogDescription>
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
            className="h-8 text-xs bg-blue-600 hover:bg-blue-700 gap-1.5"
            onClick={onNextQuestion}
            disabled={!hasQuestion}
          >
            다음 문항
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 gap-1.5">
              <XCircle className="h-3.5 w-3.5" />
              강제 종료
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>게임을 강제 종료할까요?</AlertDialogTitle>
              <AlertDialogDescription>지금 종료하면 현재까지의 결과로 랭킹이 집계됩니다.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={onForceEnd} className="bg-red-600 hover:bg-red-700">종료</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* 오른쪽: 사이드바 토글 + 나가기 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          {sidebarOpen ? '패널 접기' : '패널 열기'}
        </Button>

        <div className="h-6 w-px bg-gray-200" />

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <span className="text-sm">나가기</span>
          <X className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}

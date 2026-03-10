'use client'

import {
  Pause,
  Play,
  XCircle,
  Clock,
  Users,
  LayoutDashboard,
  X,
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

interface HeaderControlBarProps {
  isPaused: boolean
  elapsedTime: number
  totalStudents: number
  finishedCount: number
  onPauseResume: () => void
  onForceEnd: () => void
  onClose: () => void
}

export default function HeaderControlBar({
  isPaused,
  elapsedTime,
  totalStudents,
  finishedCount,
  onPauseResume,
  onForceEnd,
  onClose,
}: HeaderControlBarProps) {
  const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0')
  const seconds = String(elapsedTime % 60).padStart(2, '0')
  const allFinished = finishedCount === totalStudents && totalStudents > 0

  return (
    <header className="flex h-14 flex-shrink-0 items-center border-b bg-white px-4 shadow-sm gap-3">
      {/* 왼쪽: 타이틀 */}
      <div className="flex items-center gap-2 text-gray-900 flex-shrink-0">
        <LayoutDashboard className="h-5 w-5 text-blue-600" />
        <h1 className="text-base font-bold whitespace-nowrap">컨트롤 패널</h1>
      </div>

      <div className="h-6 w-px bg-gray-200" />

      {/* 경과 시간 */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Clock className="h-4 w-4 text-gray-400" />
        <span className="font-mono text-2xl font-bold tabular-nums text-gray-900">
          {minutes}:{seconds}
        </span>
        {isPaused && (
          <Badge className="animate-pulse bg-yellow-100 text-yellow-700 border border-yellow-300 text-xs">
            일시정지
          </Badge>
        )}
      </div>

      <div className="h-6 w-px bg-gray-200" />

      {/* 참여자 현황 */}
      <div className="flex items-center gap-1.5 text-gray-600 flex-shrink-0">
        <Users className="h-4 w-4" />
        <span className="text-sm font-semibold tabular-nums whitespace-nowrap">
          {totalStudents}명
        </span>
        <span className="text-xs text-gray-400">
          (완료 {finishedCount})
        </span>
      </div>

      <div className="h-6 w-px bg-gray-200" />

      {/* 제어 버튼 */}
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant={allFinished ? 'default' : 'ghost'}
              size="sm"
              className={
                allFinished
                  ? 'h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700'
                  : 'h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 gap-1.5'
              }
            >
              <XCircle className="h-3.5 w-3.5" />
              {allFinished ? '게임 종료' : '강제 종료'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {allFinished ? '게임을 종료할까요?' : '게임을 강제 종료할까요?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {allFinished
                  ? '모든 학생이 완료했습니다. 결과 화면으로 이동합니다.'
                  : '지금 종료하면 현재까지의 결과로 랭킹이 집계됩니다.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={onForceEnd}
                className={allFinished ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {allFinished ? '종료' : '강제 종료'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* 나가기 */}
      <div className="flex items-center flex-shrink-0">
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

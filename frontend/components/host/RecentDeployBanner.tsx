// RecentDeployBanner — 대시보드 최근 배포 현황 배너
// S-01 대시보드에서 사용

'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Session } from '@/types'

interface RecentDeployBannerProps {
  session: Session
}

const SESSION_TYPE_LABEL: Record<string, string> = {
  live: '라이브',
  assignment: '과제',
}

const STATUS_LABEL: Record<string, string> = {
  waiting: '대기 중',
  in_progress: '진행 중',
  paused: '일시정지',
  completed: '완료',
  cancelled: '취소됨',
}

export function RecentDeployBanner({ session }: RecentDeployBannerProps) {
  const router = useRouter()
  const deployedAgo = formatDistanceToNow(new Date(session.created_at), {
    addSuffix: true,
    locale: ko,
  })

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-6 py-5 shadow-soft">
      <div className="space-y-0.5">
        <p className="font-medium text-gray-800">{session.set_title}</p>
        <p className="text-sm text-gray-500">
          {SESSION_TYPE_LABEL[session.session_type]} ·{' '}
          {STATUS_LABEL[session.status]} · {deployedAgo}
        </p>
      </div>

      {session.status === 'completed' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/sessions/${session.session_id}/report/questions`)}
        >
          <BarChart2 className="mr-1 h-4 w-4" />
          리포트 보기 →
        </Button>
      )}

      {session.status === 'in_progress' && (
        <Button
          size="sm"
          onClick={() => router.push(`/live/${session.session_id}/control`)}
          className="bg-green-600 hover:bg-green-700"
        >
          컨트롤 패널 →
        </Button>
      )}
    </div>
  )
}

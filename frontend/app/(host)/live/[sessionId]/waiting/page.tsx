// S-05 QR 대기화면 (Host)
// 스펙: docs/screens/phase1-live-core.md#s-05

'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Copy, RefreshCw, UserX, Play } from 'lucide-react'
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
import { sessionsApi } from '@/lib/api'
import {
  connectSocket,
  joinSessionRoom,
  leaveSessionRoom,
  onWsEvent,
  startGame,
  kickStudent,
  regenerateQr,
} from '@/lib/websocket'
import type { Session, ParticipantType } from '@/types'

interface Participant {
  id: string
  nickname: string
  type: ParticipantType
}

export default function WaitingPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [session, setSession] = useState<Session | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([
    // Mock 참여자 (WS 미연결 상태에서도 UI 확인용)
    { id: 'p-1', nickname: '김민준', type: 'member' },
    { id: 'p-2', nickname: '이서연', type: 'member' },
    { id: 'p-3', nickname: '박지훈', type: 'guest' },
  ])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)
  const [qrUrl, setQrUrl] = useState<string>('')
  const cleanupRef = useRef<(() => void)[]>([])

  useEffect(() => {
    sessionsApi.get(sessionId).then((s) => {
      setSession(s)
      // QR 코드 이미지 URL 생성 (qr-server 또는 내부 생성)
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(s.qr_code ?? '')}`)
    })

    // WebSocket 연결
    // TODO: 실제 auth token 연결
    connectSocket('host-token')
    joinSessionRoom(sessionId)

    // 이벤트 구독
    const unsubs = [
      onWsEvent('student:joined', ({ participant }) => {
        setParticipants((prev) => [...prev, participant])
      }),
      onWsEvent('student:left', ({ participantId }) => {
        setParticipants((prev) => prev.filter((p) => p.id !== participantId))
      }),
      onWsEvent('connect_error', () => {
        toast({ title: '연결이 끊겼습니다. 재연결 중...', variant: 'destructive' })
      }),
      onWsEvent('game:start' as 'game:end', () => {
        router.push(`/live/${sessionId}/control`)
      }),
    ]
    cleanupRef.current = unsubs

    return () => {
      cleanupRef.current.forEach((fn) => fn())
      leaveSessionRoom(sessionId)
    }
  }, [sessionId, router, toast])

  const handleStart = async () => {
    if (participants.length === 0) {
      toast({ title: '아직 입장한 학생이 없어요.' })
      // AlertDialog로 확인 후 시작도 허용 (아래 AlertDialog 참고)
      return
    }
    setStarting(true)
    startGame(sessionId)
    // 실제 이동은 'game:start' WS 이벤트에서 처리
  }

  const handleRegenQr = async () => {
    const { qrCode } = await sessionsApi.regenerateQr(sessionId)
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`)
    regenerateQr(sessionId)
    toast({ title: 'QR이 재생성되었습니다.' })
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/play/${sessionId}`
    navigator.clipboard.writeText(link)
    toast({ title: '링크가 복사되었습니다.' })
  }

  const handleKick = () => {
    if (!selectedId) return
    kickStudent(selectedId)
    setParticipants((prev) => prev.filter((p) => p.id !== selectedId))
    setSelectedId(null)
    toast({ title: '학생을 강퇴했습니다.' })
  }

  return (
    <div className="flex h-screen flex-col">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <h1 className="text-lg font-semibold">{session?.set_title ?? '대기 중...'}</h1>
        <Button variant="destructive" size="sm" onClick={() => router.push('/dashboard')}>
          강제 종료
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 좌: QR */}
        <div className="flex w-80 flex-col items-center justify-center gap-6 border-r p-8">
          {qrUrl && (
            <Image src={qrUrl} alt="QR Code" width={200} height={200} className="rounded-lg" />
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <Copy className="mr-1 h-4 w-4" />
              링크 복사
            </Button>
            <Button variant="outline" size="sm" onClick={handleRegenQr}>
              <RefreshCw className="mr-1 h-4 w-4" />
              QR 재생성
            </Button>
          </div>
        </div>

        {/* 우: 참여자 목록 */}
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-gray-700">
              총 <span className="text-blue-600">{participants.length}</span>명 입장
            </p>
            <Button
              variant="outline"
              size="sm"
              disabled={!selectedId}
              onClick={handleKick}
            >
              <UserX className="mr-1 h-4 w-4" />
              강퇴
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {participants.map((p) => (
              <div
                key={p.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors
                  ${selectedId === p.id ? 'border-red-300 bg-red-50' : 'bg-white hover:bg-gray-50'}`}
                onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
              >
                <span className="text-xl">👤</span>
                <span className="flex-1 font-medium">{p.nickname}</span>
                <Badge variant={p.type === 'member' ? 'default' : 'secondary'}>
                  {p.type === 'member' ? 'Member' : 'Guest'}
                </Badge>
              </div>
            ))}
            {participants.length === 0 && (
              <p className="text-center text-gray-400 pt-12">학생 입장을 기다리는 중...</p>
            )}
          </div>
        </div>
      </div>

      {/* 하단 시작 버튼 */}
      <div className="border-t bg-white p-4 flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="lg" className="px-16" disabled={starting}>
              <Play className="mr-2 h-5 w-5" />
              게임 시작
            </Button>
          </AlertDialogTrigger>
          {participants.length === 0 && (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>아직 입장한 학생이 없어요</AlertDialogTitle>
                <AlertDialogDescription>
                  학생 없이 게임을 시작하시겠어요?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleStart}>시작</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          )}
        </AlertDialog>
      </div>
    </div>
  )
}

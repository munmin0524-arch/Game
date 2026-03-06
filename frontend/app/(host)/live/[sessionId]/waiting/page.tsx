// S-05 QR 대기화면 (Host)
// 학생 입장 현황, QR/링크 공유, 퀴즈 정보, 게임 시작

'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Copy, RefreshCw, UserX, Play, Search, Users,
  Share2, Mail, Clock, Gamepad2, FileText,
  CheckCircle2, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import type { Session, ParticipantType, GameMode } from '@/types'

// ─── 게임 유형 정의 ───────────────────────────────────────

interface GameModeInfo {
  label: string
  type: 'TEAM' | 'SINGLE'
  color: string
  emoji: string
}

const GAME_MODES: Record<GameMode, GameModeInfo> = {
  tug_of_war:       { label: '줄다리기',       type: 'TEAM',   color: 'bg-red-500',    emoji: '🪢' },
  boat_racing:      { label: '보트 레이싱',    type: 'TEAM',   color: 'bg-blue-500',   emoji: '🚤' },
  kickboard_racing: { label: '킥보드 레이싱',  type: 'SINGLE', color: 'bg-green-500',  emoji: '🛴' },
  balloon_flying:   { label: '풍선으로 날기',  type: 'SINGLE', color: 'bg-pink-500',   emoji: '🎈' },
  marathon:         { label: '마라톤',         type: 'SINGLE', color: 'bg-orange-500', emoji: '🏃' },
}

// ─── 캐릭터 목록 ──────────────────────────────────────────

const CHARACTERS = ['🐶', '🐱', '🐼', '🐰', '🦊', '🐯', '🐸', '🐵', '🐻', '🐨', '🦁', '🐷']

// ─── 참여자 타입 확장 ─────────────────────────────────────

interface Participant {
  id: string
  nickname: string
  email: string
  type: ParticipantType
  joinedAt: string // ISO timestamp
  character: string // 선택한 캐릭터
  status: 'selecting' | 'ready' // 캐릭터 선택 중 / 준비완료
}

// ─── Mock 학생 12명 ───────────────────────────────────────

const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'p-01', nickname: '김민준', email: 'minjun@school.kr', type: 'member', joinedAt: '2026-03-06T09:00:12Z', character: '🐶', status: 'ready' },
  { id: 'p-02', nickname: '이서연', email: 'seoyeon@school.kr', type: 'member', joinedAt: '2026-03-06T09:00:25Z', character: '🐱', status: 'ready' },
  { id: 'p-03', nickname: '박지훈', email: 'jihun@school.kr', type: 'guest', joinedAt: '2026-03-06T09:00:38Z', character: '🐼', status: 'ready' },
  { id: 'p-04', nickname: '최수아', email: 'sua@school.kr', type: 'member', joinedAt: '2026-03-06T09:00:45Z', character: '🐰', status: 'ready' },
  { id: 'p-05', nickname: '정하은', email: 'haeun@school.kr', type: 'member', joinedAt: '2026-03-06T09:01:02Z', character: '🦊', status: 'selecting' },
  { id: 'p-06', nickname: '강도윤', email: 'doyun@school.kr', type: 'guest', joinedAt: '2026-03-06T09:01:15Z', character: '🐯', status: 'ready' },
  { id: 'p-07', nickname: '윤지우', email: 'jiwoo@school.kr', type: 'member', joinedAt: '2026-03-06T09:01:28Z', character: '🐸', status: 'selecting' },
  { id: 'p-08', nickname: '장서준', email: 'seojun@school.kr', type: 'member', joinedAt: '2026-03-06T09:01:40Z', character: '🐵', status: 'ready' },
  { id: 'p-09', nickname: '임예은', email: 'yeeun@school.kr', type: 'guest', joinedAt: '2026-03-06T09:01:55Z', character: '🐻', status: 'ready' },
  { id: 'p-10', nickname: '한지민', email: 'jimin@school.kr', type: 'member', joinedAt: '2026-03-06T09:02:10Z', character: '🐨', status: 'selecting' },
  { id: 'p-11', nickname: '오시우', email: 'siwoo@school.kr', type: 'member', joinedAt: '2026-03-06T09:02:22Z', character: '🦁', status: 'ready' },
  { id: 'p-12', nickname: '권나윤', email: 'nayun@school.kr', type: 'guest', joinedAt: '2026-03-06T09:02:35Z', character: '🐷', status: 'ready' },
]

// ─── 시간 포매팅 ──────────────────────────────────────────

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// ─── 문항 유형 라벨 ───────────────────────────────────────

const Q_TYPE_LABELS: Record<string, string> = {
  multiple_choice: '객관식',
  ox: 'OX',
  short_answer: '단답형',
}

// ═══════════════════════════════════════════════════════════
// 메인 컴포넌트
// ═══════════════════════════════════════════════════════════

export default function WaitingPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [session, setSession] = useState<Session | null>(null)
  const [participants, setParticipants] = useState<Participant[]>(MOCK_PARTICIPANTS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)
  const [qrUrl, setQrUrl] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const cleanupRef = useRef<(() => void)[]>([])

  // 확장 세션 정보 (mock)
  const questionCount = (session as any)?.question_count ?? 15
  const questionTypes = (session as any)?.question_types ?? { multiple_choice: 10, ox: 3, short_answer: 2 }
  const roomCode = (session as any)?.room_code ?? 'QUIZ-0000'
  const gameMode = (session?.game_mode ?? 'tug_of_war') as GameMode
  const gameModeInfo = GAME_MODES[gameMode] ?? GAME_MODES.tug_of_war

  useEffect(() => {
    const playUrl = `${window.location.origin}/play/${sessionId}`

    sessionsApi.get(sessionId).then((s) => {
      setSession(s)
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(s.qr_code ?? playUrl)}`)
    })

    connectSocket('host-token')
    joinSessionRoom(sessionId)

    const unsubs = [
      onWsEvent('student:joined', ({ participant }) => {
        const p: Participant = {
          ...participant,
          email: (participant as any).email ?? '',
          joinedAt: new Date().toISOString(),
          character: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
          status: 'selecting',
        }
        setParticipants((prev) => [...prev, p])
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

  // ─── 검색 필터 ────────────────────────────────────────
  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participants
    const q = searchQuery.toLowerCase()
    return participants.filter(
      (p) => p.nickname.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
    )
  }, [participants, searchQuery])

  const readyCount = participants.filter((p) => p.status === 'ready').length
  const selectingCount = participants.filter((p) => p.status === 'selecting').length

  // ─── 핸들러 ───────────────────────────────────────────

  const handleStart = async () => {
    setStarting(true)
    startGame(sessionId)
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
    toast({ title: '참여 링크가 복사되었습니다.' })
  }

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
    toast({ title: `방 코드 ${roomCode} 가 복사되었습니다.` })
  }

  const handleKick = () => {
    if (!selectedId) return
    kickStudent(selectedId)
    setParticipants((prev) => prev.filter((p) => p.id !== selectedId))
    setSelectedId(null)
    toast({ title: '학생을 강퇴했습니다.' })
  }

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    // TODO: 실제 초대 이메일 발송
    toast({ title: `${inviteEmail}로 초대 링크를 발송했습니다.` })
    setInviteEmail('')
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* ═══ 헤더 ═══ */}
      <header className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-900">{session?.set_title ?? '대기 중...'}</h1>
          <Badge className={`${gameModeInfo.color} text-white gap-1`}>
            {gameModeInfo.emoji} {gameModeInfo.label}
          </Badge>
          <Badge variant="outline">
            {gameModeInfo.type === 'TEAM' ? '팀전' : '개인전'}
          </Badge>
        </div>
        <Button variant="destructive" size="sm" onClick={() => router.push('/dashboard')}>
          강제 종료
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ═══ 좌측: QR + 퀴즈 정보 ═══ */}
        <div className="flex w-[340px] flex-col border-r bg-white">
          {/* QR 코드 */}
          <div className="flex flex-col items-center gap-3 p-6 border-b">
            {qrUrl && (
              <Image src={qrUrl} alt="QR Code" width={180} height={180} className="rounded-xl shadow-sm" />
            )}

            {/* 방 코드 */}
            <div className="flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2">
              <span className="text-xs text-blue-500 font-medium">방 코드</span>
              <span className="text-lg font-bold text-blue-700 tracking-wider">{roomCode}</span>
              <button onClick={handleCopyRoomCode} className="text-blue-400 hover:text-blue-600">
                <Copy className="h-4 w-4" />
              </button>
            </div>

            {/* URL 표시 */}
            <div className="w-full bg-gray-50 rounded-lg px-3 py-2 text-center">
              <p className="text-[11px] text-gray-400 mb-0.5">참여 URL</p>
              <p className="text-xs text-gray-600 font-mono break-all">
                {typeof window !== 'undefined' ? `${window.location.origin}/play/${sessionId}` : ''}
              </p>
            </div>

            {/* 버튼들 */}
            <div className="flex gap-2 w-full">
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleCopyLink}>
                <Copy className="mr-1 h-3.5 w-3.5" />
                링크 복사
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleRegenQr}>
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                QR 재생성
              </Button>
            </div>

            {/* 초대하기 */}
            <div className="w-full space-y-2 pt-1">
              <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Share2 className="h-3.5 w-3.5" />
                이메일로 초대하기
              </p>
              <div className="flex gap-1.5">
                <Input
                  placeholder="student@school.kr"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                  className="text-xs h-8"
                />
                <Button size="sm" className="h-8 px-3 text-xs" onClick={handleInvite}>
                  <Mail className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* 퀴즈 정보 */}
          <div className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              퀴즈 정보
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">총 문항</span>
                <span className="font-semibold text-gray-700">{questionCount}문제</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">문항 유형</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {Object.entries(questionTypes as Record<string, number>).map(([type, count]) => (
                    <Badge key={type} variant="secondary" className="text-[10px] px-1.5">
                      {Q_TYPE_LABELS[type] ?? type} {count}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">제한 시간</span>
                <span className="font-semibold text-gray-700">{session?.time_limit_per_q ?? 20}초/문항</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">게임 유형</span>
                <span className="font-semibold text-gray-700">
                  {gameModeInfo.emoji} {gameModeInfo.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">힌트</span>
                <span className="font-semibold text-gray-700">
                  {session?.allow_hint ? '허용' : '비허용'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ 우측: 참여자 목록 ═══ */}
        <div className="flex flex-1 flex-col p-6">
          {/* 상단: 인원 현황 + 검색 */}
          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-bold text-gray-900">
                    총 <span className="text-blue-600">{participants.length}</span>명
                  </span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    준비완료 {readyCount}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    선택 중 {selectingCount}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!selectedId}
                onClick={handleKick}
                className="text-red-500 border-red-200 hover:bg-red-50"
              >
                <UserX className="mr-1 h-4 w-4" />
                강퇴
              </Button>
            </div>

            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="이름 또는 이메일로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 rounded-lg"
              />
            </div>
          </div>

          {/* 참여자 리스트 */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredParticipants.map((p) => (
              <div
                key={p.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all
                  ${selectedId === p.id
                    ? 'border-red-300 bg-red-50 shadow-sm'
                    : 'bg-white hover:bg-gray-50 border-gray-100'
                  }`}
                onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
              >
                {/* 캐릭터 */}
                <div className="relative">
                  <span className="text-2xl">{p.character}</span>
                  {p.status === 'selecting' && (
                    <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-amber-400 border-2 border-white" />
                  )}
                  {p.status === 'ready' && (
                    <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>

                {/* 이름 + 이메일 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900">{p.nickname}</span>
                    <Badge
                      variant={p.type === 'member' ? 'default' : 'secondary'}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {p.type === 'member' ? 'Member' : 'Guest'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{p.email}</p>
                </div>

                {/* 상태 */}
                <div className="text-right shrink-0">
                  {p.status === 'ready' ? (
                    <Badge variant="outline" className="text-[10px] text-green-600 border-green-200">
                      준비완료
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-200">
                      캐릭터 선택 중
                    </Badge>
                  )}
                  <p className="text-[10px] text-gray-300 mt-0.5 flex items-center justify-end gap-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    {formatTime(p.joinedAt)}
                  </p>
                </div>
              </div>
            ))}

            {filteredParticipants.length === 0 && searchQuery && (
              <p className="text-center text-gray-400 pt-12 text-sm">
                &quot;{searchQuery}&quot; 검색 결과가 없습니다.
              </p>
            )}
            {participants.length === 0 && (
              <p className="text-center text-gray-400 pt-12">학생 입장을 기다리는 중...</p>
            )}
          </div>
        </div>
      </div>

      {/* ═══ 하단 시작 버튼 ═══ */}
      <div className="border-t bg-white p-4 flex items-center justify-between px-6">
        <p className="text-sm text-gray-400">
          {selectingCount > 0
            ? `⏳ ${selectingCount}명이 아직 캐릭터를 고르고 있어요`
            : `✅ 모든 학생이 준비되었어요!`}
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="lg" className="px-12 gap-2" disabled={starting}>
              <Gamepad2 className="h-5 w-5" />
              게임 시작 ({participants.length}명)
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {participants.length === 0
                  ? '아직 입장한 학생이 없어요'
                  : selectingCount > 0
                    ? `${selectingCount}명이 아직 준비 중이에요`
                    : '게임을 시작할까요?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {participants.length === 0
                  ? '학생 없이 게임을 시작하시겠어요?'
                  : selectingCount > 0
                    ? '준비되지 않은 학생은 기본 캐릭터로 참여합니다. 시작하시겠어요?'
                    : `${participants.length}명의 학생과 ${gameModeInfo.label} 게임을 시작합니다.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleStart}>시작</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

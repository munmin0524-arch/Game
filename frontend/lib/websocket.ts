// ============================================================
// WebSocket (Socket.io) 클라이언트 유틸리티
// 실시간 기능: 대기화면 / 플레이 / 컨트롤 패널
// ============================================================

import { io, Socket } from 'socket.io-client'
import type {
  WsStudentJoined,
  WsStudentLeft,
  WsQuestionShow,
  WsQuestionEnd,
  WsAnswerCountUpdate,
  UUID,
} from '@/types'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? ''

// ─────────────────────────────────────────────────────────────
// 싱글턴 소켓 인스턴스
// ─────────────────────────────────────────────────────────────

let socket: Socket | null = null

export function getSocket(): Socket | null {
  // WS_URL이 없으면 Mock 모드 — 소켓 생성 안 함
  if (!WS_URL) return null
  if (!socket) {
    socket = io(WS_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }
  return socket
}

export function connectSocket(token: string): Socket | null {
  const s = getSocket()
  if (!s) return null
  s.auth = { token } // TODO: 인증 토큰 방식 확정 후 수정
  s.connect()
  return s
}

export function disconnectSocket(): void {
  socket?.disconnect()
  socket = null
}

// ─────────────────────────────────────────────────────────────
// 세션 채널 구독/해제
// ─────────────────────────────────────────────────────────────

export function joinSessionRoom(sessionId: UUID): void {
  getSocket()?.emit('session:join', { sessionId })
}

export function leaveSessionRoom(sessionId: UUID): void {
  getSocket()?.emit('session:leave', { sessionId })
}

// ─────────────────────────────────────────────────────────────
// Host 이벤트 발신 (대기화면)
// ─────────────────────────────────────────────────────────────

export function startGame(sessionId: UUID): void {
  getSocket()?.emit('session:start', { sessionId })
}

export function kickStudent(participantId: string): void {
  getSocket()?.emit('student:kick', { participantId })
}

export function regenerateQr(sessionId: UUID): void {
  getSocket()?.emit('qr:regenerate', { sessionId })
}

// ─────────────────────────────────────────────────────────────
// Host 이벤트 발신 (컨트롤 패널)
// ─────────────────────────────────────────────────────────────

export function pauseGame(): void {
  getSocket()?.emit('game:pause')
}

export function resumeGame(): void {
  getSocket()?.emit('game:resume')
}

export function skipQuestion(sessionId: UUID): void {
  getSocket()?.emit('question:skip', { sessionId })
}

export function extendTime(seconds = 30): void {
  getSocket()?.emit('time:extend', { seconds })
}

export function revealHint(questionId: UUID): void {
  getSocket()?.emit('hint:reveal', { questionId })
}

export function forceEndGame(sessionId: UUID): void {
  getSocket()?.emit('game:force-end', { sessionId })
}

// ─────────────────────────────────────────────────────────────
// 학생 이벤트 발신
// ─────────────────────────────────────────────────────────────

export function submitAnswer(payload: {
  questionId: UUID
  answer: string
  timeSpent: number
}): void {
  getSocket()?.emit('answer:submit', payload)
}

// ─────────────────────────────────────────────────────────────
// 이벤트 리스너 헬퍼 (타입 안전)
// ─────────────────────────────────────────────────────────────

type WsEventMap = {
  'student:joined': WsStudentJoined
  'student:left': WsStudentLeft
  'question:show': WsQuestionShow
  'question:end': WsQuestionEnd
  'answer:count-update': WsAnswerCountUpdate
  'game:pause': Record<string, never>
  'game:resume': Record<string, never>
  'game:end': { sessionId: UUID }
  'connect': undefined
  'disconnect': { reason: string }
  'connect_error': { message: string }
}

export function onWsEvent<K extends keyof WsEventMap>(
  event: K,
  handler: (data: WsEventMap[K]) => void,
): () => void {
  const s = getSocket()
  // WS_URL 없으면 no-op cleanup 반환 (Mock 모드)
  if (!s) return () => {}
  s.on(event as string, handler as (...args: unknown[]) => void)
  // 구독 해제 함수 반환 (useEffect cleanup용)
  return () => s.off(event as string, handler as (...args: unknown[]) => void)
}

// 게임 관련 공통 상수
// deploy 페이지 & 빠른 설정 페이지에서 공유

import type { GameMode } from '@/types'

export interface GameModeOption {
  value: GameMode
  label: string
  type: 'TEAM' | 'SINGLE' | 'SURVIVAL'
  desc: string
}

export const GAME_MODES: GameModeOption[] = [
  { value: 'tug_of_war', label: '줄다리기', type: 'TEAM', desc: '청팀 홍팀 2팀 경쟁' },
  { value: 'kickboard_racing', label: '킥보드 레이싱', type: 'SINGLE', desc: '개인 경쟁, 먼저 풀면 승리' },
  { value: 'boat_racing', label: '보트 레이싱', type: 'TEAM', desc: '여러팀 경쟁, 최대 6명/보트' },
  { value: 'balloon_flying', label: '풍선 타고 오르기', type: 'SURVIVAL', desc: '서바이벌, 5문제 틀리면 탈락' },
  { value: 'marathon', label: '마라톤', type: 'SINGLE', desc: '개인 경쟁, 먼저 풀면 승리' },
  { value: 'audition', label: '오디션', type: 'TEAM', desc: '최대 3명/팀, 댄스 경쟁' },
]

export const MODE_TYPE_COLORS: Record<string, string> = {
  TEAM: 'bg-blue-100 text-blue-700',
  SINGLE: 'bg-green-100 text-green-700',
  SURVIVAL: 'bg-orange-100 text-orange-700',
}

// ============================================================
// API 클라이언트 스켈레톤
// 실제 baseURL, 인증 헤더는 환경변수로 관리
// ============================================================

import type {
  QuestionSet,
  Question,
  QuestionDraft,
  Group,
  Session,
  DeployFormValues,
  ParticipantResult,
  PaginatedResponse,
  UUID,
} from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

// ─────────────────────────────────────────────────────────────
// 공통 fetch 래퍼
// ─────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: 인증 토큰 추가 (회원 체계 확정 후)
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message ?? `API error: ${res.status}`)
  }

  return res.json()
}

// ─────────────────────────────────────────────────────────────
// 세트지 (QuestionSet)
// ─────────────────────────────────────────────────────────────

export const questionSetsApi = {
  /** 세트지 목록 조회 (검색·필터·페이지네이션) */
  list: (params?: {
    search?: string
    subject?: string
    grade?: string
    page?: number
    limit?: number
    sort?: 'updated_at' | 'created_at'
  }) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {}).filter(([, v]) => v !== undefined) as [string, string][]
    )
    return apiFetch<PaginatedResponse<QuestionSet>>(`/api/question-sets?${query}`)
  },

  /** 세트지 단건 조회 */
  get: (setId: UUID) =>
    apiFetch<QuestionSet & { questions: Question[] }>(`/api/question-sets/${setId}`),

  /** 세트지 생성 */
  create: (title: string) =>
    apiFetch<QuestionSet>('/api/question-sets', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  /** 세트지 제목 수정 */
  updateTitle: (setId: UUID, title: string) =>
    apiFetch<QuestionSet>(`/api/question-sets/${setId}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    }),

  /** 세트지 복제 */
  duplicate: (setId: UUID) =>
    apiFetch<QuestionSet>(`/api/question-sets/${setId}/duplicate`, {
      method: 'POST',
    }),

  /** 세트지 삭제 (배포 이력 없을 때만 가능) */
  delete: (setId: UUID) =>
    apiFetch<void>(`/api/question-sets/${setId}`, { method: 'DELETE' }),
}

// ─────────────────────────────────────────────────────────────
// 문항 (Question)
// ─────────────────────────────────────────────────────────────

export const questionsApi = {
  /** 문항 생성 */
  create: (setId: UUID, draft: QuestionDraft) =>
    apiFetch<Question>(`/api/question-sets/${setId}/questions`, {
      method: 'POST',
      body: JSON.stringify(draft),
    }),

  /** 문항 수정 */
  update: (setId: UUID, questionId: UUID, draft: Partial<QuestionDraft>) =>
    apiFetch<Question>(`/api/question-sets/${setId}/questions/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(draft),
    }),

  /** 문항 삭제 */
  delete: (setId: UUID, questionId: UUID) =>
    apiFetch<void>(`/api/question-sets/${setId}/questions/${questionId}`, {
      method: 'DELETE',
    }),

  /** 문항 순서 변경 */
  reorder: (setId: UUID, orderedIds: UUID[]) =>
    apiFetch<void>(`/api/question-sets/${setId}/questions/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ orderedIds }),
    }),
}

// ─────────────────────────────────────────────────────────────
// 그룹 (Group)
// ─────────────────────────────────────────────────────────────

export const groupsApi = {
  /** 내 그룹 목록 */
  list: () => apiFetch<Group[]>('/api/groups'),

  /** 그룹 생성 */
  create: (name: string) =>
    apiFetch<Group>('/api/groups', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  /** 그룹 삭제 */
  delete: (groupId: UUID) =>
    apiFetch<void>(`/api/groups/${groupId}`, { method: 'DELETE' }),
}

// ─────────────────────────────────────────────────────────────
// 세션 (Session)
// ─────────────────────────────────────────────────────────────

export const sessionsApi = {
  /** 배포 생성 (라이브/과제) */
  create: (setId: UUID, form: DeployFormValues) =>
    apiFetch<Session>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ set_id: setId, ...form }),
    }),

  /** 세션 단건 조회 */
  get: (sessionId: UUID) =>
    apiFetch<Session>(`/api/sessions/${sessionId}`),

  /** 게임 시작 (대기화면 → 플레이) */
  start: (sessionId: UUID) =>
    apiFetch<void>(`/api/sessions/${sessionId}/start`, { method: 'POST' }),

  /** QR 재생성 */
  regenerateQr: (sessionId: UUID) =>
    apiFetch<{ qrCode: string; expiresAt: string }>(`/api/sessions/${sessionId}/qr`, {
      method: 'POST',
    }),

  /** 강제 종료 */
  forceEnd: (sessionId: UUID) =>
    apiFetch<void>(`/api/sessions/${sessionId}/force-end`, { method: 'POST' }),

  /** 결과 목록 조회 (랭킹 화면) */
  results: (sessionId: UUID) =>
    apiFetch<ParticipantResult[]>(`/api/sessions/${sessionId}/results`),

  /** 게스트 입장 */
  guestEnter: (sessionId: UUID, email: string, nickname: string) =>
    apiFetch<{ guest_id: UUID; cookie_token: string }>(`/api/sessions/${sessionId}/guest-enter`, {
      method: 'POST',
      body: JSON.stringify({ email, nickname }),
    }),
}

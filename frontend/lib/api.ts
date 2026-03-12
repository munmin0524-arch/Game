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
  SharedSet,
  PublishFormValues,
  AchievementStandard,
  ReportReason,
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
    source?: string
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

// ─────────────────────────────────────────────────────────────
// 마켓플레이스 (Marketplace)
// ─────────────────────────────────────────────────────────────

export const marketplaceApi = {
  /** 마켓플레이스 홈 (인기 + 최신) */
  home: () =>
    apiFetch<{ popular: SharedSet[]; recent: SharedSet[] }>('/api/marketplace'),

  /** 검색 (필터, 페이지네이션, 정렬) */
  search: (params?: {
    q?: string
    subject?: string
    grade?: string
    unit?: string
    achievement_standard?: string
    sort?: 'popular' | 'recent' | 'likes' | 'downloads'
    page?: number
    limit?: number
  }) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {}).filter(([, v]) => v !== undefined) as [string, string][]
    )
    return apiFetch<PaginatedResponse<SharedSet>>(`/api/marketplace/search?${query}`)
  },

  /** 세트 상세 + 문항 목록 */
  get: (sharedSetId: UUID) =>
    apiFetch<SharedSet>(`/api/marketplace/${sharedSetId}`),

  /** 세트 공유 (퍼블리시) */
  publish: (setId: UUID, form: PublishFormValues) =>
    apiFetch<SharedSet>('/api/marketplace', {
      method: 'POST',
      body: JSON.stringify({ set_id: setId, ...form }),
    }),

  /** 공유 정보 수정 */
  update: (sharedSetId: UUID, form: Partial<PublishFormValues>) =>
    apiFetch<SharedSet>(`/api/marketplace/${sharedSetId}`, {
      method: 'PUT',
      body: JSON.stringify(form),
    }),

  /** 공유 해제 */
  unpublish: (sharedSetId: UUID) =>
    apiFetch<void>(`/api/marketplace/${sharedSetId}`, { method: 'DELETE' }),

  /** 내가 공유한 세트 목록 */
  my: () =>
    apiFetch<SharedSet[]>('/api/marketplace/my'),

  /** 문항 단위 검색 (에디터 연동) */
  searchQuestions: (params?: {
    q?: string
    subject?: string
    grade?: string
    achievement_standard?: string
    type?: string
    page?: number
    limit?: number
  }) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {}).filter(([, v]) => v !== undefined) as [string, string][]
    )
    return apiFetch<PaginatedResponse<Question & { shared_set_title: string; host_nickname: string }>>(`/api/marketplace/questions?${query}`)
  },

  /** 좋아요 토글 */
  toggleLike: (sharedSetId: UUID) =>
    apiFetch<{ liked: boolean; like_count: number }>(`/api/marketplace/${sharedSetId}/like`, {
      method: 'POST',
    }),

  /** 다운로드 (세트/문항 복사) */
  download: (sharedSetId: UUID, payload: {
    target_set_id?: UUID
    question_ids?: UUID[]
    download_type: 'full_set' | 'partial_questions'
  }) =>
    apiFetch<{ target_set_id: UUID; question_count: number }>(`/api/marketplace/${sharedSetId}/download`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** 신고 */
  report: (sharedSetId: UUID, reason: ReportReason, detail?: string) =>
    apiFetch<void>(`/api/marketplace/${sharedSetId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, detail }),
    }),
}

// ─────────────────────────────────────────────────────────────
// 성취기준 (Achievement Standards)
// ─────────────────────────────────────────────────────────────

export const achievementStandardsApi = {
  /** 성취기준 목록 (과목/학년 필터) */
  list: (params?: { subject?: string; grade_band?: string }) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {}).filter(([, v]) => v !== undefined) as [string, string][]
    )
    return apiFetch<AchievementStandard[]>(`/api/achievement-standards?${query}`)
  },
}

// ============================================================
// 교육 퀴즈 게임 — TypeScript 타입 정의
// data-model.md 기반으로 자동 생성
// ============================================================

// ─────────────────────────────────────────────────────────────
// 공통
// ─────────────────────────────────────────────────────────────

export type UUID = string

export type Timestamp = string // ISO 8601

// ─────────────────────────────────────────────────────────────
// 회원 체계
// ─────────────────────────────────────────────────────────────

export type JoinType = 'email_direct' | 'sso_vivasem'
export type UserRole = 'host' | 'member'

export interface Member {
  member_id: UUID
  email: string
  nickname: string
  join_type: JoinType
  is_verified: boolean
  age_consent_yn: boolean
  age_consent_at: Timestamp | null
  created_at: Timestamp
  updated_at: Timestamp
}

export interface HostProfile {
  host_profile_id: UUID
  member_id: UUID
  is_certified: boolean
  created_at: Timestamp
}

export interface Guest {
  guest_id: UUID
  email: string
  nickname: string
  cookie_token: UUID | null
  linked_member_id: UUID | null
  created_at: Timestamp
}

// 클라이언트에서 현재 로그인 사용자를 표현할 때 사용
export type CurrentUser =
  | { type: 'member'; data: Member; isHost: boolean }
  | { type: 'guest'; data: Guest }

// ─────────────────────────────────────────────────────────────
// 그룹
// ─────────────────────────────────────────────────────────────

export type GroupType = 'manual' | 'auto_live'
export type ParticipantType = 'member' | 'guest'

export interface Group {
  group_id: UUID
  host_member_id: UUID
  name: string
  type: GroupType
  created_at: Timestamp
  member_count?: number // 집계 필드 (API 응답에 포함)
  // auto_live 전용 JOIN 필드
  session_id?: UUID
  session_title?: string
  session_status?: SessionStatus
  session_type?: SessionType
}

export interface GroupMember {
  group_member_id: UUID
  group_id: UUID
  member_id: UUID | null
  guest_id: UUID | null
  participant_type: ParticipantType
  joined_at: Timestamp
  removed_at: Timestamp | null
  // JOIN 필드
  nickname?: string
  email?: string
}

// ─────────────────────────────────────────────────────────────
// 콘텐츠 (세트지·문항)
// ─────────────────────────────────────────────────────────────

export type QuestionType = 'multiple_choice' | 'ox' | 'unscramble'

export interface QuestionOption {
  index: number
  text: string
}

export interface QuestionSet {
  set_id: UUID
  host_member_id: UUID
  title: string
  subject: string | null
  grade: string | null
  tags: string[]
  is_deleted: boolean
  is_shared: boolean
  original_set_id: UUID | null
  description?: string | null
  source?: string | null
  created_at: Timestamp
  updated_at: Timestamp
  question_count?: number // 집계 필드
}

export interface LearningMap {
  depth1?: string
  depth2?: string
  depth3?: string
  depth4?: string // 수학만 4depth
}

export interface Question {
  question_id: UUID
  set_id: UUID
  type: QuestionType
  order_index: number
  content: string
  options: QuestionOption[] | null // 객관식만
  answer: string // 객관식: "2", OX: "O"/"X", 단답형: 텍스트
  hint: string | null
  explanation: string | null
  media_url: string | null
  achievement_standards?: string[] | null
  created_at: Timestamp
  // 문항 뱅크 필터용 (optional)
  grade?: string        // 1학년, 2학년, 3학년
  difficulty?: string   // 상, 중, 하
  unit?: string         // 단원명
  // 게임 에디터 확장 필드
  template_code?: string        // 게임 템플릿 코드 (예: M4_WI_BIN)
  learning_map?: LearningMap    // 학습맵 (과목별 depth 다름)
  assessment_area?: string      // 영어만: 듣기/읽기/문법/어휘
  hashtags?: string[]           // 해시태그
}

// 에디터에서 사용하는 임시 상태 (저장 전)
export type QuestionDraft = Omit<Question, 'question_id' | 'set_id' | 'created_at'>

// ─────────────────────────────────────────────────────────────
// 게임 템플릿
// ─────────────────────────────────────────────────────────────

export type GameCategory = 'selection' | 'ox' | 'unscramble'
export type SubjectKey = 'math' | 'english'

export interface GameTemplate {
  code: string              // 'M4_WI_BIN'
  category: GameCategory
  subjects: SubjectKey[]    // 사용 가능 과목
  label: string             // 표시명
  optionCount: number       // 선지 수 (0 for OX/Unscramble)
  description?: string      // 레이아웃 설명
}

// ─────────────────────────────────────────────────────────────
// 마켓플레이스
// ─────────────────────────────────────────────────────────────

export type SharedSetStatus = 'published' | 'hidden' | 'removed_by_admin'
export type DownloadType = 'full_set' | 'partial_questions'
export type ReportReason = 'inappropriate' | 'copyright' | 'spam' | 'other'
export type ReportStatus = 'pending' | 'reviewed' | 'resolved'

export interface SharedSet {
  shared_set_id: UUID
  set_id: UUID
  host_member_id: UUID
  status: SharedSetStatus
  title: string
  description: string | null
  subject: string
  grade: string
  tags: string[] | null
  question_count: number
  like_count: number
  download_count: number
  achievement_standards: string[] | null
  published_at: Timestamp
  updated_at: Timestamp
  avg_rating?: number
  review_count?: number
  // JOIN 필드
  host_nickname?: string
  is_certified?: boolean
  is_liked?: boolean // 현재 사용자의 좋아요 여부
  is_bookmarked?: boolean
  questions?: Question[] // 상세 조회 시
}

export interface SharedSetLike {
  like_id: UUID
  shared_set_id: UUID
  member_id: UUID
  created_at: Timestamp
}

export interface SharedSetDownload {
  download_id: UUID
  shared_set_id: UUID
  member_id: UUID
  target_set_id: UUID | null
  download_type: DownloadType
  question_count: number
  created_at: Timestamp
}

export interface SharedSetReport {
  report_id: UUID
  shared_set_id: UUID
  reporter_member_id: UUID
  reason: ReportReason
  detail: string | null
  status: ReportStatus
  created_at: Timestamp
}

export interface AchievementStandard {
  standard_id: string // "[9수01-01]"
  subject: string
  grade_band: string
  domain: string
  description: string
}

export interface Bookmark {
  bookmark_id: UUID
  member_id: UUID
  shared_set_id: UUID
  created_at: Timestamp
}

export interface Review {
  review_id: UUID
  shared_set_id: UUID
  member_id: UUID
  rating: number // 1-5
  comment: string | null
  created_at: Timestamp
  // JOIN 필드
  nickname?: string
  is_certified?: boolean
}

export interface Follow {
  follow_id: UUID
  follower_id: UUID
  following_id: UUID
  created_at: Timestamp
}

export interface CreatorProfile {
  member_id: UUID
  nickname: string
  is_certified: boolean
  bio: string | null
  shared_count: number
  total_likes: number
  total_downloads: number
  follower_count: number
  is_following?: boolean
  created_at: Timestamp
}

export interface Collection {
  collection_id: UUID
  member_id: UUID
  title: string
  description: string | null
  is_public: boolean
  quiz_count: number
  like_count: number
  created_at: Timestamp
  updated_at: Timestamp
  // JOIN 필드
  nickname?: string
  is_certified?: boolean
  preview_items?: SharedSet[]
}

export interface CollectionItem {
  collection_id: UUID
  shared_set_id: UUID
  order: number
}

// 공유 설정 폼
export interface PublishFormValues {
  title: string
  description?: string
  subject: string
  grade: string
  unit?: string
  achievement_standards?: string[]
  tags?: string[]
}

// ─────────────────────────────────────────────────────────────
// 배포·세션
// ─────────────────────────────────────────────────────────────

export type SessionType = 'live' | 'assignment'
export type GameMode = 'tug_of_war' | 'boat_racing' | 'kickboard_racing' | 'balloon_flying' | 'marathon' | 'audition'
export type DeployType = 'existing_group' | 'new_group' | 'public_qr'
export type SessionStatus = 'waiting' | 'in_progress' | 'paused' | 'completed' | 'cancelled'
export type ScorePolicy = 'first_attempt' | 'last_attempt' | 'best_attempt'
export type AnswerReveal = 'never' | 'on_submit' | 'after_close'

export interface Session {
  session_id: UUID
  set_id: UUID
  host_member_id: UUID
  group_id: UUID | null
  deploy_type: DeployType
  session_type: SessionType
  game_mode: GameMode
  status: SessionStatus
  time_limit_per_q: number // 초, 기본값 20
  allow_retry: boolean
  allow_hint: boolean
  score_policy: ScorePolicy // 현재 'first_attempt' 고정
  max_attempts: number // 현재 1 고정
  open_at: Timestamp | null
  close_at: Timestamp | null
  answer_reveal: AnswerReveal
  qr_code: string | null
  qr_expires_at: Timestamp | null
  created_at: Timestamp
  updated_at: Timestamp
  // JOIN 필드
  set_title?: string
}

// 배포 설정 폼 입력값
export interface DeployFormValues {
  session_type: SessionType
  game_mode: GameMode
  deploy_type: DeployType
  group_id?: UUID
  new_group_name?: string
  time_limit_per_q: number
  allow_retry: boolean
  allow_hint: boolean
  // 과제형 추가
  open_at?: Timestamp
  close_at?: Timestamp
  answer_reveal?: AnswerReveal
}

// ─────────────────────────────────────────────────────────────
// 플레이·응답
// ─────────────────────────────────────────────────────────────

export type ResultStatus = 'not_started' | 'in_progress' | 'submitted' | 'abandoned' | 'pending_sync'

export interface ParticipantResult {
  result_id: UUID
  session_id: UUID
  member_id: UUID | null
  guest_id: UUID | null
  attempt_no: number
  status: ResultStatus
  current_q_index: number
  total_score: number | null
  correct_count: number | null
  total_response_time_sec: number | null
  rank: number | null
  completion_yn: boolean
  started_at: Timestamp | null
  submitted_at: Timestamp | null
  // JOIN 필드
  nickname?: string
  participant_type?: ParticipantType
}

// 응답 이벤트 타입 (이벤트 로그 방식)
export type ResponseEventType = 'first_input' | 'modify' | 'final_submit' | 'skip' | 'return'

export interface ResponseEvent {
  event_id: UUID
  session_id: UUID
  result_id: UUID
  question_id: UUID
  selected_answer: string | null
  is_correct: boolean | null
  response_time_sec: number | null
  hint_used: boolean
  is_skipped: boolean
  attempt_no: number
  answered_at: Timestamp | null
  // 이벤트 로그 확장 (1문항 = N개 이벤트)
  event_type?: ResponseEventType
  input_sequence?: number        // 입력 순서 (1=최초, 2=수정1, ...)
  time_from_show_sec?: number    // 문항 노출부터 누적 시간
  segment_time_sec?: number      // 이전 이벤트부터 구간 시간
}

// ─────────────────────────────────────────────────────────────
// 분석 (리포트용)
// ─────────────────────────────────────────────────────────────

/** 2축 크로스 분석 패턴 (학생별) */
export interface AnalysisPattern {
  understands: boolean   // 개념 이해 여부 (정답률 + 응답시간 기반)
  diligent: boolean      // 성실 여부 (수정횟수 + 풀이시간 기반)
  needsHelp: boolean     // 도움 필요 (연속 오답 + 패턴 복합)
  needsPraise: boolean   // 칭찬 필요 (연속 정답 + 성실)
}

/** 패턴 라벨 */
export type PatternLabel = '이해' | '미이해' | '성실' | '찍기'
export type CoachingLabel = '도움 필요' | '칭찬 필요' | '관찰' | '양호'

/** 학생별 분석 결과 */
export interface StudentAnalysis {
  resultId: UUID
  nickname: string
  totalScore: number
  correctCount: number
  totalQuestions: number
  totalTimeSec: number
  pattern: AnalysisPattern
  patternLabel: PatternLabel
  coachingLabel: CoachingLabel
  streaks: {
    maxCorrect: number   // 최대 연속 정답
    maxWrong: number     // 최대 연속 오답
  }
}

/** 문항별 요약 통계 */
export interface QuestionReportSummary {
  submissionRate: number    // 제출율 (0~100)
  avgScore: number          // 평균 점수
  avgTimeSec: number        // 평균 풀이시간 (초)
  topWrongQuestions: Array<{ questionId: UUID; wrongRate: number }>  // 오답율 Top3
  topCorrectQuestions: Array<{ questionId: UUID; correctRate: number }> // 정답율 Top3
  warnings: Array<{
    questionId: UUID
    type: 'high_wrong_rate' | 'late_spike'
    value: number
  }>
}

/** 개념(learning_map)별 이해도 */
export interface ConceptUnderstanding {
  concept: string          // learning_map depth1~4 중 하나
  totalQuestions: number
  correctCount: number
  rate: number             // 이해도 % (0~100)
}

/** 문항별 바 차트 데이터 */
export interface QuestionBarData {
  questionId: UUID
  orderIndex: number
  content: string
  correctRate: number      // 정답률 (0~100)
  avgTimeSec: number
  minTimeSec: number
  maxTimeSec: number
  hasWarning: boolean      // 오답율 50%+
}

// ─────────────────────────────────────────────────────────────
// 실시간 (WebSocket) 이벤트 타입
// ─────────────────────────────────────────────────────────────

// 대기화면
export interface WsStudentJoined {
  participant: {
    id: string
    nickname: string
    type: ParticipantType
  }
}

export interface WsStudentLeft {
  participantId: string
}

// 플레이
export interface WsQuestionShow {
  question: {
    question_id: UUID
    type: QuestionType
    content: string
    options: QuestionOption[] | null
    hint: string | null // allow_hint가 false면 null
  }
  questionIndex: number
  totalQuestions: number
  timeLimit: number
}

export interface WsQuestionEnd {
  correctAnswer: string
  is_correct: boolean
  score_earned: number
  my_rank: number
}

export interface WsAnswerCountUpdate {
  answered: number
  total: number
  distribution: Record<string, number> // "1": 3, "2": 8, ...
}

// ─────────────────────────────────────────────────────────────
// API 공통 응답 래퍼
// ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// ─────────────────────────────────────────────────────────────
// 컨트롤 패널
// ─────────────────────────────────────────────────────────────

export * from './control'

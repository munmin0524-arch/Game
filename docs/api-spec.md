# API 상세 스펙

> 최종 업데이트: 2026-03-07
> 현재 모든 API는 Next.js Route Handler 기반 Mock. 백엔드 연동 시 URL만 교체.

---

## 목차

1. [공통 사항](#1-공통-사항)
2. [퀴즈/문항](#2-퀴즈문항)
3. [세션/게임](#3-세션게임)
4. [플레이](#4-플레이)
5. [리포트](#5-리포트)
6. [그룹](#6-그룹)
7. [과제](#7-과제)
8. [퀴즈 광장](#8-퀴즈-광장)
9. [에러 코드](#9-에러-코드)

---

## 1. 공통 사항

### 인증 (TODO)

현재 미구현. 백엔드 연동 시 아래 헤더 필요:

```
Authorization: Bearer <jwt-token>
```

| 역할 | 토큰 발급 | 접근 범위 |
|------|----------|----------|
| Host (교사) | 로그인 | 대시보드 전체 API |
| Member (학생) | 로그인 | 과제 + 플레이 + 결과 API |
| Guest (비회원) | 게스트 입장 시 임시 토큰 | 플레이 + 결과만 |

### 응답 형식

모든 응답은 JSON. 목록 API는 페이지네이션 래핑:

```json
{
  "data": [...],
  "total": 24,
  "page": 1,
  "limit": 20
}
```

단일 객체 API는 직접 반환:

```json
{
  "session_id": "sess-1",
  "status": "completed",
  ...
}
```

### 공통 타임스탬프

모든 엔티티에 `created_at`, `updated_at` (ISO 8601) 포함.

---

## 2. 퀴즈/문항

### GET `/api/question-sets`

퀴즈 목록 조회 (검색/필터).

**Query Params:**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `search` | string | - | 제목 키워드 검색 |
| `subject` | string | - | 과목 필터 (수학/영어/과학 등) |
| `grade` | string | - | 학년 필터 (초1~고3) |
| `page` | number | - | 페이지 번호 (기본 1) |
| `limit` | number | - | 페이지 크기 (기본 20) |

**응답 200:**

```json
{
  "data": [
    {
      "set_id": "set-1",
      "host_member_id": "host-1",
      "title": "수학 1단원 -- 집합과 명제",
      "subject": "수학",
      "grade": "고1",
      "tags": ["집합", "명제"],
      "is_deleted": false,
      "original_set_id": null,
      "created_at": "2026-01-10T09:00:00Z",
      "updated_at": "2026-02-15T14:30:00Z",
      "question_count": 12
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 20
}
```

### POST `/api/question-sets`

퀴즈 생성.

**Request Body:**

```json
{
  "title": "새 퀴즈"
}
```

**응답 201:**

```json
{
  "set_id": "set-xxx",
  "host_member_id": "host-1",
  "title": "새 퀴즈",
  "subject": null,
  "grade": null,
  "tags": [],
  "question_count": 0,
  "created_at": "...",
  "updated_at": "..."
}
```

### GET `/api/question-sets/[setId]`

퀴즈 상세 + 문항 목록.

**응답 200:**

```json
{
  "set_id": "set-1",
  "title": "수학 1단원",
  "subject": "수학",
  "grade": "고1",
  "tags": ["집합"],
  "questions": [
    {
      "question_id": "q-1",
      "set_id": "set-1",
      "order_index": 0,
      "question_type": "multiple_choice",
      "content": "다음 중 집합의 원소가 될 수 없는 것은?",
      "options": [
        { "index": 0, "text": "자연수 전체의 집합" },
        { "index": 1, "text": "1보다 작은 자연수" },
        { "index": 2, "text": "짝수인 소수" },
        { "index": 3, "text": "키가 170cm인 학생" }
      ],
      "correct_answer": "3",
      "hint": "원소의 명확성 조건",
      "explanation": "키가 170cm인 학생은 기준이 모호",
      "difficulty": "normal",
      "learning_map": { "depth1": "집합", "depth2": "원소" }
    }
  ]
}
```

### POST `/api/question-sets/[setId]/duplicate`

퀴즈 복제. 제목에 "(복사본)" 자동 추가.

**응답 201:** 새 퀴즈 객체

### POST `/api/question-sets/[setId]/questions`

문항 추가.

**Request Body:**

```json
{
  "question_type": "multiple_choice",
  "content": "문제 내용",
  "options": [
    { "index": 0, "text": "보기1" },
    { "index": 1, "text": "보기2" },
    { "index": 2, "text": "보기3" },
    { "index": 3, "text": "보기4" }
  ],
  "correct_answer": "1",
  "hint": "힌트 텍스트",
  "explanation": "해설 텍스트",
  "difficulty": "normal"
}
```

### PUT `/api/question-sets/[setId]/questions/reorder`

문항 순서 변경.

**Request Body:**

```json
{
  "question_ids": ["q-3", "q-1", "q-2"]
}
```

### GET `/api/question-bank`

문항 뱅크 검색 (에디터 불러오기).

**Query Params:**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `search` | string | 키워드 |
| `type` | string | 문항 유형 (multiple_choice/ox/unscramble) |
| `subject` | string | 과목 |
| `grade` | string | 학년 |
| `difficulty` | string | 난이도 (easy/normal/hard) |
| `unit` | string | 단원 |
| `excludeSetId` | string | 이미 포함된 세트 제외 |

### POST `/api/question-bank/ai-recommend`

AI 추천 문항 생성.

**Request Body:**

```json
{
  "subject": "수학",
  "grade": "고1",
  "unit": "집합과 명제",
  "easyCount": 2,
  "normalCount": 3,
  "hardCount": 1,
  "types": ["multiple_choice", "ox"]
}
```

**응답 200:** 생성된 문항 배열

---

## 3. 세션/게임

### GET `/api/sessions`

세션 목록 (지난 게임).

**응답 200:**

```json
[
  {
    "session_id": "sess-1",
    "set_id": "set-1",
    "host_member_id": "host-1",
    "group_id": "grp-1",
    "deploy_type": "existing_group",
    "session_type": "live",
    "game_mode": "tug_of_war",
    "status": "completed",
    "time_limit_per_q": 20,
    "allow_retry": false,
    "allow_hint": true,
    "score_policy": "first_attempt",
    "max_attempts": 1,
    "open_at": null,
    "close_at": null,
    "answer_reveal": "never",
    "qr_code": null,
    "qr_expires_at": null,
    "created_at": "2026-03-01T13:00:00Z",
    "updated_at": "2026-03-01T14:00:00Z",
    "set_title": "수학 1단원",
    "participant_count": 15,
    "completion_rate": 0.87
  }
]
```

**Session 필드 설명:**

| 필드 | 타입 | 설명 |
|------|------|------|
| `session_type` | `'live' \| 'assignment'` | 라이브 / 과제 |
| `game_mode` | string | 게임 유형 (tug_of_war 등) |
| `status` | string | waiting / in_progress / paused / completed / cancelled |
| `deploy_type` | string | qr_public / existing_group / new_group |
| `score_policy` | string | first_attempt (첫 시도 기준) |
| `answer_reveal` | string | on_submit / after_close / never |

### POST `/api/sessions`

세션 생성 (게임 열기).

**Request Body:**

```json
{
  "set_id": "set-1",
  "session_type": "live",
  "game_mode": "tug_of_war",
  "deploy_type": "existing_group",
  "group_id": "grp-1",
  "time_limit_per_q": 20,
  "allow_retry": false,
  "allow_hint": true
}
```

### GET `/api/sessions/[sessionId]`

세션 상세.

### GET `/api/sessions/[sessionId]/result`

결과/랭킹.

**응답 200:**

```json
[
  {
    "result_id": "res-1",
    "session_id": "sess-1",
    "member_id": "mem-1",
    "guest_id": null,
    "nickname": "홍길동",
    "participant_type": "member",
    "attempt_no": 1,
    "status": "submitted",
    "current_q_index": 4,
    "total_score": 9500,
    "correct_count": 4,
    "total_response_time_sec": 65,
    "rank": 1,
    "completion_yn": true,
    "started_at": "2026-03-01T13:05:00Z",
    "submitted_at": "2026-03-01T13:06:05Z"
  }
]
```

### GET `/api/sessions/latest`

최근 세션 1개 (대시보드용).

---

## 4. 플레이

### POST `/api/sessions/[sessionId]/guest-enter`

게스트 입장.

**Request Body:**

```json
{
  "email": "student@school.kr",
  "nickname": "학생A"
}
```

**응답 201:**

```json
{
  "participant_id": "part-xxx",
  "session_id": "sess-1",
  "nickname": "학생A",
  "participant_type": "guest",
  "token": "guest-temp-token"
}
```

### GET `/api/sessions/[sessionId]/questions`

문항 목록 (플레이용). 정답/해설 제외.

### POST `/api/sessions/[sessionId]/answer`

개별 답변 저장 (과제 모드).

**Request Body:**

```json
{
  "question_id": "q-1",
  "answer": "2",
  "time_spent": 12.5
}
```

### POST `/api/sessions/[sessionId]/submit`

최종 제출 (과제).

### GET `/api/sessions/[sessionId]/my-result`

본인 결과 조회.

---

## 5. 리포트

### GET `/api/sessions/[sessionId]/report/questions`

문항별 리포트.

**응답 200:**

```json
{
  "session": { "session_id": "sess-1", "set_title": "수학 1단원" },
  "total_participants": 15,
  "questions": [
    {
      "question_id": "q-1",
      "order_index": 0,
      "content": "다음 중 집합의 원소가 될 수 없는 것은?",
      "question_type": "multiple_choice",
      "options": [...],
      "correct_answer": "3",
      "difficulty": "normal",
      "learning_map": { "depth1": "집합" }
    }
  ],
  "events": [
    {
      "event_id": "evt-1",
      "question_id": "q-1",
      "participant_id": "part-1",
      "event_type": "final_submit",
      "selected_answer": "3",
      "is_correct": true,
      "response_time_sec": 7.2
    }
  ]
}
```

### GET `/api/sessions/[sessionId]/report/students`

학생별 리포트.

**응답 200:**

```json
{
  "session": { "session_id": "sess-1", "set_title": "수학 1단원" },
  "results": [
    {
      "result_id": "res-1",
      "nickname": "홍길동",
      "participant_type": "member",
      "total_score": 9500,
      "correct_count": 4,
      "total_response_time_sec": 65,
      "rank": 1
    }
  ],
  "events": [...],
  "questions": [...]
}
```

> 클라이언트에서 `lib/analysis.ts` 함수로 패턴/코칭 라벨 계산.

---

## 6. 그룹

### GET `/api/groups`

그룹 목록.

**응답 200:**

```json
[
  {
    "group_id": "grp-1",
    "host_member_id": "host-1",
    "name": "1학년 A반",
    "type": "manual",
    "member_count": 15,
    "created_at": "2026-01-03T09:00:00Z"
  }
]
```

### POST `/api/groups`

그룹 생성.

**Request Body:**

```json
{
  "name": "2학년 수학반"
}
```

### GET `/api/groups/[groupId]`

그룹 상세 + 멤버 목록.

### POST `/api/groups/[groupId]/invite`

멤버 초대 (이메일 발송).

**Request Body:**

```json
{
  "email": "student@school.kr"
}
```

### DELETE `/api/groups/[groupId]/members/[memberId]`

멤버 제거.

### GET `/api/groups/[groupId]/guest-link`

게스트 초대 링크 생성.

---

## 7. 과제

### GET `/api/assignments`

본인 과제 목록 (Member).

**응답 200:**

```json
[
  {
    "session_id": "sess-2",
    "set_title": "영어 단어 퀴즈",
    "status": "in_progress",
    "question_count": 20,
    "answered_count": 4,
    "open_at": "2026-02-28T09:00:00Z",
    "close_at": "2026-03-07T23:59:00Z"
  }
]
```

### GET `/api/sessions/[sessionId]/submissions`

제출 현황 (Host).

**응답 200:**

```json
{
  "session": { "session_id": "sess-2", "close_at": "2026-03-07T23:59:00Z" },
  "submissions": [
    {
      "participant_id": "part-1",
      "nickname": "홍길동",
      "participant_type": "member",
      "status": "submitted",
      "score": 850,
      "submitted_at": "2026-03-01T15:00:00Z"
    }
  ],
  "stats": {
    "submitted": 12,
    "in_progress": 3,
    "not_started": 5,
    "total": 20
  }
}
```

### POST `/api/sessions/[sessionId]/close`

마감 처리 (Host).

---

## 8. 퀴즈 광장

### GET `/api/marketplace`

광장 홈 (인기 + 최신).

### GET `/api/marketplace/search`

검색.

**Query Params:**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `q` | string | 검색어 |
| `subject` | string | 과목 필터 |
| `grade` | string | 학년 필터 |
| `sort` | string | popular / newest / likes / downloads |
| `page` | number | 페이지 (기본 1) |
| `limit` | number | 크기 (기본 12) |

### GET `/api/marketplace/[sharedSetId]`

공유 퀴즈 상세 + 문항 미리보기.

### POST `/api/marketplace`

퀴즈 공유(퍼블리시).

**Request Body:**

```json
{
  "set_id": "set-1",
  "title": "수학 1단원 소수와 합성수",
  "description": "소수의 정의부터 합성수 판별까지",
  "subject": "수학",
  "grade": "중1",
  "tags": ["소수", "합성수"]
}
```

### POST `/api/marketplace/[sharedSetId]/like`

좋아요 토글. 응답: `{ liked: true, like_count: 43 }`

### POST `/api/marketplace/[sharedSetId]/download`

다운로드 (퀴즈 복사).

**Request Body:**

```json
{
  "target_set_id": "set-1",
  "question_ids": ["q-1", "q-3"]
}
```

- `target_set_id` 지정: 해당 세트에 선택 문항 추가
- `target_set_id` 미지정: 새 세트 생성 + 전체 복사

### POST `/api/marketplace/[sharedSetId]/report`

신고.

**Request Body:**

```json
{
  "reason": "inappropriate_content",
  "detail": "부적절한 내용 포함"
}
```

### GET `/api/marketplace/my`

내가 공유한 퀴즈 목록.

### GET `/api/marketplace/collections`

컬렉션 목록.

### GET `/api/marketplace/creator/[memberId]`

크리에이터 프로필 + 공유 퀴즈 목록.

---

## 9. 에러 코드

> 현재 Mock API는 에러 처리 미구현. 백엔드 연동 시 아래 규격 사용 권장.

**에러 응답 형식:**

```json
{
  "error": {
    "code": "NICKNAME_DUPLICATE",
    "message": "이미 사용 중인 닉네임입니다."
  }
}
```

**주요 에러 코드:**

| HTTP | 코드 | 설명 |
|------|------|------|
| 400 | `INVALID_INPUT` | 필수 필드 누락 또는 형식 오류 |
| 400 | `NICKNAME_DUPLICATE` | 닉네임 중복 (P-06) |
| 400 | `SESSION_NOT_WAITING` | 대기 상태가 아닌 세션에 시작 요청 |
| 400 | `ALREADY_SUBMITTED` | 이미 제출한 과제에 재제출 시도 |
| 401 | `UNAUTHORIZED` | 인증 토큰 없음 또는 만료 |
| 403 | `FORBIDDEN` | 권한 없음 (예: 학생이 Host API 호출) |
| 404 | `NOT_FOUND` | 리소스 없음 |
| 409 | `GUEST_IS_MEMBER` | 게스트 이메일이 기존 회원 (P-07 -> 로그인 유도) |
| 410 | `QR_EXPIRED` | QR 코드 만료 |
| 422 | `NO_CORRECT_ANSWER` | 정답 미지정 문항 저장 시도 |

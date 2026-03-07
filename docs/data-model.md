# 데이터 모델 (Data Model)

> 최종 업데이트: 2026-03-07
> 미결 정책(P-xx)은 product-spec.md 참고.

---

## 목차

1. [테이블 구조 요약](#1-테이블-구조-요약)
2. [회원 체계](#2-회원-체계)
3. [콘텐츠 (퀴즈·문항)](#3-콘텐츠-퀴즈문항)
4. [게임·세션](#4-게임세션)
5. [플레이·응답](#5-플레이응답)
6. [로그](#6-로그)
7. [학습 데이터 항목 & 리포트 활용](#7-학습-데이터-항목--리포트-활용)
8. [관계 다이어그램 (ERD)](#8-관계-다이어그램-erd)
9. [주요 쿼리 패턴](#9-주요-쿼리-패턴)
10. [퀴즈 광장](#10-퀴즈-광장)

---

## 1. 테이블 구조 요약

| # | 테이블명 | 한글명 | 역할 |
|---|----------|--------|------|
| **회원** | | | |
| 1 | `members` | 회원 | Host + Member 통합 인증 |
| 2 | `host_profiles` | 교사 프로필 | Host 전용 필드 분리 |
| 3 | `guests` | 게스트 | 비회원 참여자. 이메일+닉네임 기반 식별 |
| **그룹** | | | |
| 4 | `groups` | 그룹 | Host가 생성·관리하는 참여 대상 그룹 |
| 5 | `group_members` | 그룹 멤버 | 그룹 내 Member·Guest 연결 |
| **콘텐츠** | | | |
| 6 | `question_sets` | 퀴즈 | Host가 만든 퀴즈 꾸러미 |
| 7 | `questions` | 문항 | 퀴즈 내 개별 문제 |
| **게임·세션** | | | |
| 8 | `sessions` | 게임·세션 | 게임 설정 및 세션 (라이브 / 과제) |
| **플레이·응답** | | | |
| 9 | `participant_results` | 참여 결과 | 학생 개인별 플레이 인스턴스 + 최종 결과 |
| 10 | `response_events` | 응답 이벤트 | 문항별 응답 날것 데이터 (Redis → RDB 이관) |
| **로그** | | | |
| 11 | `report_view_logs` | 리포트 조회 로그 | Host의 리포트 열람 기록 |
| **퀴즈 광장** | | | |
| 12 | `shared_sets` | 공유 퀴즈 | 퀴즈 광장에 공유된 퀴즈 메타 |
| 13 | `shared_set_likes` | 좋아요 | 교사의 좋아요 기록 |
| 14 | `shared_set_downloads` | 다운로드 기록 | 문항 복사 이력 |
| 15 | `shared_set_reports` | 신고 | 부적절 콘텐츠 신고 |
| 16 | `achievement_standard_tags` | 성취기준 마스터 | 교육과정 성취기준 코드 |

---

## 2. 회원 체계

### 2-1. `members` (회원)

> Host(교사)와 Member(학생 계정)를 통합 관리하는 인증 테이블.
> Host 전용 필드는 `host_profiles`로 분리.

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `member_id` | UUID | PK | 고유 식별자 (자동 생성) |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | 로그인 이메일 |
| `nickname` | VARCHAR(100) | NOT NULL | 표시 이름 |
| `join_type` | ENUM | NOT NULL | `email_direct` / `sso_vivasem` (추후) |
| `is_verified` | BOOLEAN | DEFAULT false | 이메일 인증 완료 여부 |
| `age_consent_yn` | BOOLEAN | DEFAULT false | 14세 미만 부모·법정대리인 동의 여부 |
| `age_consent_at` | TIMESTAMP | NULL | 동의 일시 (법적 기록용) |
| `created_at` | TIMESTAMP | NOT NULL | 가입 일시 |
| `updated_at` | TIMESTAMP | NOT NULL | 최종 수정 일시 |

**비고**
- `host_profiles` 레코드가 있으면 Host, 없으면 Member로 구분.
- 비바샘 SSO 연동은 추후 `join_type = sso_vivasem` 추가.

---

### 2-2. `host_profiles` (교사 프로필)

> Host(교사) 전용 필드. `members` 테이블 오염 방지를 위해 분리.
> 이 레코드 존재 여부로 Host 여부 판단.

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `host_profile_id` | UUID | PK | |
| `member_id` | UUID | FK → members, UNIQUE, NOT NULL | 1:1 관계 |
| `is_certified` | BOOLEAN | DEFAULT false | 교사 인증 완료 여부 (추후 인증 프로세스 연동) |
| `created_at` | TIMESTAMP | NOT NULL | |

---

### 2-3. `guests` (게스트)

> 플랫폼 계정 없이 QR·링크로만 참여하는 비회원 참여자.

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `guest_id` | UUID | PK | 서버가 자동 생성 |
| `email` | VARCHAR(255) | NOT NULL | 참여 시 입력한 이메일 |
| `nickname` | VARCHAR(100) | NOT NULL | 참여 시 입력한 닉네임 |
| `cookie_token` | UUID | NULL | 브라우저 쿠키용 토큰. 재접속 시 입력 생략 가능 |
| `linked_member_id` | UUID | FK → members, NULL | 회원 전환 시 연결된 member_id |
| `created_at` | TIMESTAMP | NOT NULL | 최초 참여 일시 |

**식별 전략 (중요)**
```
재접속 흐름:
1. 브라우저에 cookie_token 있음
   → cookie_token으로 guest 레코드 조회 → 자동 입장 (입력 생략)

2. cookie_token 없음 (다른 기기·브라우저)
   → 이메일+닉네임 입력
   → (email, nickname) UNIQUE 조합으로 기존 guest 조회
   → 기존 레코드 있으면: 이어받기 + 해당 브라우저에 새 cookie_token 발급
   → 기존 레코드 없으면: 새 guest 생성 + cookie_token 발급

결론: email+닉네임이 식별의 PRIMARY. cookie_token은 입력 생략 편의 레이어.
```

**전환 정책**
- `linked_member_id`: 게스트 이메일과 동일 이메일로 회원가입 시 자동 연결.
  이후 해당 게스트의 `participant_results`·`response_events`가 Member 리포트에 통합.
- **게스트 입장 시 이메일이 기존 Member 이메일과 동일한 경우**: 로그인 유도 팝업 표시.
  → 로그인 선택: Member로 입장. 해당 플레이 데이터는 Member로 귀속.
  → 게스트 유지 선택: 게스트로 그대로 입장. (P-07 결정)
- 이메일은 같고 닉네임만 다를 경우: 별도 게스트로 처리. (P-07 범위 외. 앱 레벨에서 이메일 중복 체크 시 동일 처리)

**인덱스**
```sql
UNIQUE INDEX idx_guest_identity (email, nickname)
UNIQUE INDEX idx_guest_cookie (cookie_token)
INDEX idx_guest_linked_member (linked_member_id)
```

---

## 3. 콘텐츠 (퀴즈·문항)

### 3-1. `question_sets` (퀴즈)

> Host가 만든 퀴즈 꾸러미.

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `set_id` | UUID | PK | |
| `host_member_id` | UUID | FK → members, NOT NULL | 제작 Host |
| `title` | VARCHAR(300) | NOT NULL | 퀴즈명 |
| `subject` | VARCHAR(100) | NULL | 과목 |
| `grade` | VARCHAR(50) | NULL | 학년 |
| `tags` | JSON | NULL | 키워드 태그 배열 `["태그1", "태그2"]` |
| `is_deleted` | BOOLEAN | DEFAULT false | soft delete. 게임 이력 있으면 실제 삭제 불가 |
| `is_shared` | BOOLEAN | DEFAULT false | 퀴즈 광장 공유 여부 |
| `original_set_id` | UUID | FK → question_sets, NULL | 복제 시 원본 set_id |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

**비고**
- `is_deleted = true` + 게임 이력 있는 경우: UI 비활성 처리, DB 레코드 유지.
- 복제 시 `original_set_id` 기록 + 제목에 "(복사본)" suffix 자동 추가.

---

### 3-2. `questions` (문항)

> 퀴즈에 포함된 개별 문제. 정답·힌트·해설 포함.

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `question_id` | UUID | PK | |
| `set_id` | UUID | FK → question_sets, NOT NULL | 소속 퀴즈 |
| `type` | ENUM | NOT NULL | `multiple_choice` / `ox` / `short_answer` |
| `order_index` | INTEGER | NOT NULL | 문항 순서 (드래그앤드롭 변경 시 업데이트) |
| `content` | TEXT | NOT NULL | 문제 지문 |
| `options` | JSON | NULL | 객관식 선택지 `[{"index": 1, "text": "보기1"}, ...]` |
| `answer` | VARCHAR(500) | NOT NULL | 정답 (객관식: 인덱스 번호, OX: "O"/"X", 단답형: 텍스트) |
| `hint` | TEXT | NULL | 힌트 (session.allow_hint = true일 때 노출) |
| `explanation` | TEXT | NULL | 해설 (session.answer_reveal 설정에 따라 결과 화면 노출) |
| `media_url` | VARCHAR(500) | NULL | 첨부 이미지 URL (추후 개발) |
| `achievement_standards` | JSON | NULL | 성취기준 코드 배열 `["[9수01-01]", "[9수01-02]"]` |
| `grade` | VARCHAR(50) | NULL | 문항 뱅크용 학년 (예: `1학년`, `2학년`) |
| `difficulty` | VARCHAR(20) | NULL | 문항 뱅크용 난이도 (`쉬움` / `보통` / `어려움`) |
| `unit` | VARCHAR(100) | NULL | 문항 뱅크용 단원명 (예: `1단원`, `2단원`) |
| `created_at` | TIMESTAMP | NOT NULL | |

**비고**
- `grade`, `difficulty`, `unit`: 문항 뱅크 검색 및 AI 추천 필터용. 퀴즈(`question_sets`)의 grade/subject와는 별도로, 개별 문항 수준에서 메타데이터를 저장.
- AI 추천 API(`POST /api/question-bank/ai-recommend`)는 이 세 필드 + `type`을 기준으로 난이도별 문항 수를 조합하여 반환.

---

## 4. 게임·세션

### 4-1. `groups` (그룹)

> Host가 참여 대상으로 지정하는 학생 그룹. 라이브 QR 공개 게임 시 자동 생성.

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `group_id` | UUID | PK | |
| `host_member_id` | UUID | FK → members, NOT NULL | 그룹 소유 Host |
| `name` | VARCHAR(200) | NOT NULL | 그룹명 |
| `type` | ENUM | NOT NULL | `manual` (직접 생성) / `auto_live` (QR 공개 배포 시 자동) |
| `created_at` | TIMESTAMP | NOT NULL | |

**비고**
- 그룹 삭제 시 연결된 `sessions`, `participant_results`, `response_events` 유지 (데이터 보존).

---

### 4-2. `group_members` (그룹 멤버)

> 그룹에 속한 Member·Guest 연결 테이블.

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `group_member_id` | UUID | PK | |
| `group_id` | UUID | FK → groups, NOT NULL | |
| `member_id` | UUID | FK → members, NULL | Member인 경우 |
| `guest_id` | UUID | FK → guests, NULL | Guest인 경우 |
| `participant_type` | ENUM | NOT NULL | `member` / `guest` |
| `joined_at` | TIMESTAMP | NOT NULL | 그룹 참여 일시 |
| `removed_at` | TIMESTAMP | NULL | 제거 일시 (soft delete) |

**제약**
- `member_id`와 `guest_id` 중 하나만 NOT NULL (CHECK 제약 또는 앱 레벨 검증).
- 제거 후에도 기존 세션 데이터 유지 (`removed_at` 기록).

---

### 4-3. `sessions` (게임·세션)

> 퀴즈 게임 설정 및 세션 정보.
> 라이브 1회 = 1 session. 과제 1건 = 1 session.

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `session_id` | UUID | PK | |
| `set_id` | UUID | FK → question_sets, NOT NULL | 게임에 사용한 퀴즈 |
| `host_member_id` | UUID | FK → members, NOT NULL | 게임 생성 Host |
| `group_id` | UUID | FK → groups, NULL | 참여 대상 그룹 |
| `deploy_type` | ENUM | NOT NULL | `existing_group` / `new_group` / `public_qr` |
| `session_type` | ENUM | NOT NULL | `live` / `assignment` |
| `game_mode` | ENUM | NOT NULL | `tug_of_war` / `boat_racing` / `kickboard_racing` / `balloon_flying` / `marathon` (기본값: `tug_of_war`) |
| `status` | ENUM | NOT NULL | `waiting` / `in_progress` / `paused` / `completed` / `cancelled` |
| `time_limit_per_q` | INTEGER | DEFAULT 20 | 문항당 제한 시간 (초). 기본값: **20초** (P-02) |
| `allow_retry` | BOOLEAN | DEFAULT false | 오답 재도전 허용 |
| `allow_hint` | BOOLEAN | DEFAULT false | 힌트 사용 허용 |
| `score_policy` | ENUM | DEFAULT 'first_attempt' | **`first_attempt` 고정** (P-03 결정). 재도전 이력은 `response_events`에 전량 보존 |
| `max_attempts` | INTEGER | DEFAULT 1 | 과제 제출 허용 횟수 (현재: 1회 고정) |
| `open_at` | TIMESTAMP | NULL | 과제 오픈 일시 (NULL = 즉시) |
| `close_at` | TIMESTAMP | NULL | 과제 마감 일시 (NULL = 무기한) |
| `answer_reveal` | ENUM | DEFAULT 'never' | `never` / `on_submit` / `after_close` |
| `qr_code` | VARCHAR(500) | NULL | 라이브 QR 코드 값 |
| `qr_expires_at` | TIMESTAMP | NULL | QR 유효시간. 기본값: **생성 후 24시간** (P-05) |
| `created_at` | TIMESTAMP | NOT NULL | |
| `updated_at` | TIMESTAMP | NOT NULL | |

---

## 5. 플레이·응답

### 5-1. `participant_results` (참여 결과)

> 학생 개인별 플레이 인스턴스. 이어하기·제출 상태·최종 결과 관리.

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `result_id` | UUID | PK | |
| `session_id` | UUID | FK → sessions, NOT NULL | 소속 세션 |
| `member_id` | UUID | FK → members, NULL | Member 참여자 |
| `guest_id` | UUID | FK → guests, NULL | Guest 참여자 |
| `attempt_no` | INTEGER | DEFAULT 1 | 제출 회차 (현재: 1회 고정) |
| `status` | ENUM | NOT NULL | `not_started` / `in_progress` / `submitted` / `abandoned` |
| `current_q_index` | INTEGER | DEFAULT 0 | 이어하기 복원용 현재 문항 위치 |
| `total_score` | INTEGER | NULL | 최종 점수 (제출 완료 시 산출) |
| `correct_count` | INTEGER | NULL | 정답 문항 수 |
| `total_response_time_sec` | INTEGER | NULL | **동점자 처리용** 총 응답 시간 (초). `response_events.response_time_sec` 합산. 무응답 제외. |
| `rank` | INTEGER | NULL | 랭킹. 산출 기준: `total_score DESC`, 동점 시 `total_response_time_sec ASC` |
| `completion_yn` | BOOLEAN | DEFAULT false | 완료 여부 |
| `started_at` | TIMESTAMP | NULL | 플레이 시작 일시 |
| `submitted_at` | TIMESTAMP | NULL | 제출 완료 일시 |

**제약**
- `member_id`와 `guest_id` 중 하나만 NOT NULL.
- 동일 `(session_id, member_id)` 또는 `(session_id, guest_id)` 조합은 1개만 허용.

**인덱스**
```sql
INDEX idx_result_session (session_id)
INDEX idx_result_member (member_id)
INDEX idx_result_guest (guest_id)
UNIQUE INDEX idx_result_unique_member (session_id, member_id)
UNIQUE INDEX idx_result_unique_guest (session_id, guest_id)
```

---

### 5-2. `response_events` (응답 이벤트)

> 학생이 문제를 풀 때 발생하는 날것의 응답 데이터. 모든 리포트의 원천.
> **저장 방식: 플레이 중 Redis 실시간 저장 → 세션 종료 후 RDB 이관**

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `event_id` | UUID | PK | |
| `session_id` | UUID | FK → sessions, NOT NULL | 소속 세션 |
| `result_id` | UUID | FK → participant_results, NOT NULL | 소속 참여 결과 |
| `question_id` | UUID | FK → questions, NOT NULL | 응답한 문항 |
| `selected_answer` | VARCHAR(500) | NULL | 학생이 입력한 값. NULL = 무응답 |
| `is_correct` | BOOLEAN | NULL | 정오답 판정. NULL = 무응답 |
| `response_time_sec` | INTEGER | NULL | 소요 시간 (초). 무응답 시 NULL → **점수 제외** |
| `hint_used` | BOOLEAN | DEFAULT false | 힌트 버튼 클릭 여부 |
| `is_skipped` | BOOLEAN | DEFAULT false | 건너뛰기 여부 (교사 skip 또는 시간 초과) |
| `attempt_no` | INTEGER | DEFAULT 1 | 재도전 허용 시 해당 문항 시도 횟수 |
| `answered_at` | TIMESTAMP | NULL | 응답 제출 일시 |

**비고**
- `selected_answer = NULL` + `is_skipped = true`: 시간 초과 또는 교사 강제 skip → 점수 **제외** (0점 아님).
- `is_skipped = false` + `is_correct = false`: 오답 응답.
- `attempt_no > 1`: 오답 재도전 시 동일 문항에 여러 이벤트 생성. **점수는 `attempt_no = 1` 기준**으로만 산정. 나머지 시도는 학습 이력으로만 보존 (P-03 결정).
- 동점자 처리: `participant_results.total_response_time_sec` 오름차순 (P-04 결정).
- **Redis 이관 실패 대응**: 이관 완료 전까지 `participant_results.status = 'pending_sync'` 유지. 이관 완료 후 `submitted`로 전환.

**인덱스**
```sql
INDEX idx_event_session (session_id)
INDEX idx_event_result (result_id)
INDEX idx_event_question (question_id)
```

---

## 6. 로그

### 6-1. `report_view_logs` (리포트 조회 로그)

> Host가 리포트를 조회한 기록. 추후 AI 리포트 추천·활용 분석에 활용.

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `log_id` | UUID | PK | |
| `host_member_id` | UUID | FK → members, NOT NULL | 조회한 Host |
| `session_id` | UUID | FK → sessions, NOT NULL | 조회한 세션 |
| `report_type` | ENUM | NOT NULL | `by_question` (문항별) / `by_student` (학생별) |
| `viewed_at` | TIMESTAMP | NOT NULL | 조회 일시 |

---

## 7. 학습 데이터 항목 & 리포트 활용

### 7-1. 핵심 학습 데이터 6가지

> 모두 `response_events` 테이블에서 추출.

| 항목 | 컬럼 | 성격 | 리포트 활용 인사이트 |
|------|------|------|---------------------|
| **응답 로그** | `selected_answer` | 학생이 실제 입력한 값 | **[오답 패턴]** 어떤 오답을 많이 골랐는지 → 오개념 파악 |
| **정오답** | `is_correct` | true / false / NULL | **[성취도]** 학생별 점수, 반 평균 정답률, 실시간 순위 |
| **소요 시간** | `response_time_sec` | 문제 읽기~제출까지 (초) | **[난이도·찍기 판별]** 1초 이내 = 찍기 의심 / 평균 2배↑ = 고난도 문항 |
| **진행 상태** | `participant_results.status` | not_started / in_progress / submitted / abandoned | **[참여도]** 실시간 "누가 아직 안 풀었는지" 확인 |
| **재시도 횟수** | `attempt_no` | 한 문제에 시도한 횟수 | **[학습 태도]** 포기하지 않고 정답을 찾아가는지 |
| **힌트 사용** | `hint_used` | 힌트 클릭 여부 | **[도움 필요도]** 힌트 의존 문항 파악 |

### 7-2. 리포트별 데이터 매핑

| 리포트 화면 | 소스 테이블 | 집계 방식 |
|------------|------------|-----------|
| 문항별 정답률 | `response_events` | `is_correct = true` 건수 / 전체 응답 건수 (`is_skipped = false`) |
| 평균 응답 시간 | `response_events` | `response_time_sec` 평균 (NULL 제외) |
| 오답 선택지 분포 | `response_events` | `selected_answer` 별 건수 (`is_correct = false`) |
| 학생별 점수·순위 | `participant_results` | `total_score`, `correct_count`, `rank` |
| 멤버 리포트 | `participant_results` + `members` | `member_id` JOIN |
| 게스트 리포트 | `participant_results` + `guests` | `guest_id` JOIN |
| 제출 현황 대시보드 | `participant_results` | `status` 별 GROUP BY |
| 힌트 의존도 | `response_events` | `hint_used = true` 건수 / 문항별 |
| 찍기 의심 탐지 | `response_events` | `response_time_sec < N` + `is_correct = true` 건수 |

---

## 8. 관계 다이어그램 (ERD)

```
members ─────────────────────────────── question_sets
  │  (host_member_id)                         │ (set_id)
  │                                            │
  ├── host_profiles (1:1)                      │
  │                                      sessions ──────────────── participant_results
  ├── groups                                   │    (session_id)             │
  │     │ (host_member_id)             (set_id)│                    (result_id)│
  │     │                                      │                             │
  │     └── group_members                      │                     response_events
  │           ├── member_id → members          │                       (event_id)
  │           └── guest_id → guests            │
  │                  │                     questions
  │                  │                    (question_id ←── response_events)
  │           (linked_member_id → members)
  │
  └── report_view_logs (host_member_id → members)

participant_results:
  ├── member_id → members (Member 참여자)
  └── guest_id  → guests  (Guest 참여자)

question_sets ──── shared_sets (1:1, set_id UNIQUE)
                      │
                      ├── shared_set_likes (member_id → members)
                      ├── shared_set_downloads (member_id → members, target_set_id → question_sets)
                      └── shared_set_reports (reporter_member_id → members)

achievement_standard_tags (독립 마스터)
```

**핵심 관계**
- `sessions` ← 배포의 중심. `question_sets`, `groups`, `members(host)` 연결.
- `participant_results` ← 학생 1명의 1회 플레이. `sessions`에 귀속. Member 또는 Guest 중 하나만.
- `response_events` ← 모든 응답의 날것 데이터. `participant_results`와 `questions`에 귀속.
- `guests.linked_member_id` ← 게스트→멤버 전환 시 데이터 연결 브릿지.
- `shared_sets` ← 퀴즈 광장 공유. `question_sets`와 1:1. 좋아요/다운로드/신고 하위 테이블.

---

## 9. 주요 쿼리 패턴

### 9-1. 문항별 정답률
```sql
SELECT
  q.question_id,
  q.content,
  q.order_index,
  COUNT(CASE WHEN re.is_correct = true THEN 1 END)  AS correct_count,
  COUNT(re.event_id)                                  AS total_responses,
  ROUND(
    COUNT(CASE WHEN re.is_correct = true THEN 1 END) * 100.0
    / NULLIF(COUNT(re.event_id), 0), 1
  )                                                   AS correct_rate_pct
FROM questions q
LEFT JOIN response_events re ON q.question_id = re.question_id
WHERE re.session_id = :session_id
  AND re.is_skipped = false          -- 무응답·skip 제외
  AND re.attempt_no = 1              -- 첫 시도 기준 (score_policy 반영 시 수정)
GROUP BY q.question_id, q.content, q.order_index
ORDER BY q.order_index;
```

### 9-2. 제출 현황 대시보드 (과제)
```sql
SELECT
  pr.status,
  COUNT(*) AS count
FROM participant_results pr
WHERE pr.session_id = :session_id
GROUP BY pr.status;
-- 결과: not_started / in_progress / submitted / abandoned 건수
```

### 9-3. 게스트 동일 인물 식별 및 이어받기
```sql
-- 1단계: cookie_token으로 조회 (같은 브라우저)
SELECT guest_id FROM guests WHERE cookie_token = :cookie_token LIMIT 1;

-- 2단계: 없으면 email+nickname으로 조회 (다른 기기)
SELECT guest_id FROM guests WHERE email = :email AND nickname = :nickname LIMIT 1;

-- 3단계: 없으면 신규 생성
INSERT INTO guests (guest_id, email, nickname, cookie_token, created_at)
VALUES (gen_random_uuid(), :email, :nickname, gen_random_uuid(), NOW());

-- 4단계: 다른 기기에서 이어받기 성공 시 → 새 cookie_token 발급
UPDATE guests SET cookie_token = gen_random_uuid() WHERE guest_id = :guest_id;
```

### 9-4. 학생별 점수 랭킹 (Member + Guest 통합)
```sql
-- 1단계: 점수 기준 정렬 (동점 시 총 응답 시간 오름차순)
WITH ranked AS (
  SELECT
    pr.result_id,
    pr.total_score,
    pr.correct_count,
    pr.total_response_time_sec,
    RANK() OVER (
      ORDER BY pr.total_score DESC,
               pr.total_response_time_sec ASC  -- 동점자 처리 (P-04)
    ) AS calculated_rank,
    pr.member_id,
    pr.guest_id
  FROM participant_results pr
  WHERE pr.session_id = :session_id
    AND pr.status = 'submitted'
)
SELECT
  COALESCE(m.nickname, g.nickname)                                   AS nickname,
  CASE WHEN r.member_id IS NOT NULL THEN 'member' ELSE 'guest' END   AS participant_type,
  r.total_score,
  r.correct_count,
  r.total_response_time_sec,
  r.calculated_rank
FROM ranked r
LEFT JOIN members m ON r.member_id = m.member_id
LEFT JOIN guests  g ON r.guest_id  = g.guest_id
ORDER BY r.calculated_rank ASC;
```

### 9-5. 미제출 학생 목록 (과제)
```sql
-- 그룹 멤버 중 아직 제출하지 않은 학생
SELECT
  COALESCE(m.nickname, g.nickname) AS nickname,
  COALESCE(pr.status, 'not_started') AS status
FROM group_members gm
LEFT JOIN members m ON gm.member_id = m.member_id
LEFT JOIN guests  g ON gm.guest_id  = g.guest_id
LEFT JOIN participant_results pr
  ON pr.session_id = :session_id
  AND (pr.member_id = gm.member_id OR pr.guest_id = gm.guest_id)
WHERE gm.group_id = :group_id
  AND gm.removed_at IS NULL
  AND (pr.status IS NULL OR pr.status != 'submitted')
ORDER BY nickname;
```

---

## 10. 퀴즈 광장

### 10-1. `shared_sets` (공유 퀴즈)

> 퀴즈 광장에 공유된 퀴즈 메타 정보. `question_sets`와 1:1 관계.

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `shared_set_id` | UUID | PK | |
| `set_id` | UUID | FK → question_sets, UNIQUE | 원본 세트 (1:1) |
| `host_member_id` | UUID | FK → members, NOT NULL | 공유한 Host |
| `status` | ENUM | NOT NULL, DEFAULT 'published' | `published` / `hidden` / `removed_by_admin` |
| `title` | VARCHAR(300) | NOT NULL | 공유 시 제목 |
| `description` | TEXT | NULL | 설명 |
| `subject` | VARCHAR(100) | NOT NULL | 과목 (필수) |
| `grade` | VARCHAR(50) | NOT NULL | 학년 (필수) |
| `tags` | JSON | NULL | 태그 배열 `["소수", "합성수"]` |
| `question_count` | INTEGER | NOT NULL | 문항 수 스냅샷 |
| `like_count` | INTEGER | DEFAULT 0 | 좋아요 수 (비정규화) |
| `download_count` | INTEGER | DEFAULT 0 | 다운로드 수 (비정규화) |
| `achievement_standards` | JSON | NULL | 성취기준 코드 배열 |
| `published_at` | TIMESTAMP | NOT NULL | 최초 공유 일시 |
| `updated_at` | TIMESTAMP | NOT NULL | |

**비고**
- `like_count`, `download_count`: 조회 성능을 위한 비정규화. 좋아요/다운로드 시 트리거 또는 앱 레벨에서 동기 갱신.
- `status = 'hidden'`: 작성자 자발적 숨김 또는 신고 3건 누적 시 자동 전환.
- `set_id` UNIQUE: 하나의 세트는 하나의 공유만 가능. 공유 해제 후 재공유 시 새 레코드.

**인덱스**
```sql
UNIQUE INDEX idx_shared_set_id (set_id)
INDEX idx_shared_host (host_member_id)
INDEX idx_shared_subject_grade (subject, grade)
INDEX idx_shared_popularity (like_count DESC, download_count DESC)
INDEX idx_shared_published (published_at DESC)
```

---

### 10-2. `shared_set_likes` (좋아요)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `like_id` | UUID | PK | |
| `shared_set_id` | UUID | FK → shared_sets, NOT NULL | |
| `member_id` | UUID | FK → members, NOT NULL | 좋아요 누른 교사 |
| `created_at` | TIMESTAMP | NOT NULL | |

**인덱스**
```sql
UNIQUE INDEX idx_like_unique (shared_set_id, member_id)
```

---

### 10-3. `shared_set_downloads` (다운로드 기록)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `download_id` | UUID | PK | |
| `shared_set_id` | UUID | FK → shared_sets, NOT NULL | |
| `member_id` | UUID | FK → members, NOT NULL | 다운로드한 교사 |
| `target_set_id` | UUID | FK → question_sets, NULL | 복사된 대상 세트 |
| `download_type` | ENUM | NOT NULL | `full_set` / `partial_questions` |
| `question_count` | INTEGER | NOT NULL | 복사한 문항 수 |
| `created_at` | TIMESTAMP | NOT NULL | |

**인덱스**
```sql
INDEX idx_download_shared (shared_set_id)
INDEX idx_download_member (member_id)
```

---

### 10-4. `shared_set_reports` (신고)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `report_id` | UUID | PK | |
| `shared_set_id` | UUID | FK → shared_sets, NOT NULL | |
| `reporter_member_id` | UUID | FK → members, NOT NULL | 신고자 |
| `reason` | ENUM | NOT NULL | `inappropriate` / `copyright` / `spam` / `other` |
| `detail` | TEXT | NULL | 상세 사유 |
| `status` | ENUM | DEFAULT 'pending' | `pending` / `reviewed` / `resolved` |
| `created_at` | TIMESTAMP | NOT NULL | |

**비고**
- 1인 1신고 (UNIQUE 제약). 중복 신고 시 에러 반환.
- 3건 이상 누적 시 `shared_sets.status = 'hidden'` 자동 전환.

**인덱스**
```sql
UNIQUE INDEX idx_report_unique (shared_set_id, reporter_member_id)
INDEX idx_report_status (status)
```

---

### 10-5. `achievement_standard_tags` (성취기준 마스터)

> 교육과정 성취기준 코드 마스터 테이블. 수학/영어부터 시드.

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `standard_id` | VARCHAR(20) | PK | 예: `[9수01-01]` |
| `subject` | VARCHAR(100) | NOT NULL | 수학, 영어 등 |
| `grade_band` | VARCHAR(50) | NOT NULL | 중1-3, 초5-6 등 |
| `domain` | VARCHAR(200) | NOT NULL | 영역 (수와 연산, 듣기 등) |
| `description` | TEXT | NOT NULL | 성취기준 전문 |

**인덱스**
```sql
INDEX idx_standard_subject (subject)
INDEX idx_standard_grade (grade_band)
```

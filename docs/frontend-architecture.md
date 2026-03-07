# 프론트엔드 아키텍처

> 최종 업데이트: 2026-03-07

---

## 목차

1. [기술 스택](#1-기술-스택)
2. [디렉토리 구조](#2-디렉토리-구조)
3. [라우트 맵](#3-라우트-맵)
4. [주요 모듈 설명](#4-주요-모듈-설명)
5. [분석 엔진](#5-분석-엔진)
6. [컴포넌트 구조](#6-컴포넌트-구조)
7. [데이터 흐름](#7-데이터-흐름)
8. [Mock API 라우트](#8-mock-api-라우트)
9. [타입 시스템](#9-타입-시스템)

---

## 1. 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 14.x |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS | 3.x |
| UI 컴포넌트 | shadcn/ui (Radix 기반) | - |
| 차트 | Recharts | 2.x |
| 아이콘 | Lucide React | - |
| 날짜 | date-fns + ko locale | - |
| 실시간 통신 | Socket.io (클라이언트) | 4.x |
| DnD | @hello-pangea/dnd | 18.x |

---

## 2. 디렉토리 구조

```
frontend/
├── app/                          # Next.js App Router
│   ├── (host)/                   # Host(교사) 전용 라우트 그룹
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # S-01 홈 대시보드
│   │   │   ├── history/
│   │   │   │   └── page.tsx      # S-15 지난 게임 (종합대시보드+탭)
│   │   │   └── groups/
│   │   │       └── [groupId]/
│   │   │           └── page.tsx  # S-15b 그룹 상세
│   │   ├── sets/
│   │   │   ├── page.tsx          # S-02 내 퀴즈 목록
│   │   │   └── [setId]/
│   │   │       ├── edit/page.tsx # S-03 에디터 (3단계 위자드)
│   │   │       └── deploy/page.tsx # S-04 게임 설정
│   │   ├── live/
│   │   │   ├── layout.tsx        # 전체화면 레이아웃 (GNB 제거, fixed inset-0)
│   │   │   └── [sessionId]/
│   │   │       ├── waiting/page.tsx  # S-05 QR 대기화면
│   │   │       └── control/page.tsx  # S-07 컨트롤 패널 (v3)
│   │   ├── sessions/[sessionId]/
│   │   │   ├── report/
│   │   │   │   ├── questions/page.tsx  # S-16 문항별 리포트
│   │   │   │   └── students/page.tsx   # S-17 학생별 리포트
│   │   │   └── submissions/page.tsx    # S-12 제출 현황
│   │   ├── groups/page.tsx       # S-13 그룹 목록
│   │   ├── marketplace/          # 퀴즈 광장 (7페이지)
│   │   │   ├── page.tsx          # S-M01 광장 홈
│   │   │   ├── search/page.tsx   # S-M02 검색 결과
│   │   │   ├── my/page.tsx       # S-M04 내가 공유한 퀴즈
│   │   │   ├── collections/page.tsx  # 컬렉션
│   │   │   ├── bookmarks/page.tsx    # 북마크
│   │   │   ├── creator/[memberId]/page.tsx  # 크리에이터 프로필
│   │   │   └── [sharedSetId]/page.tsx  # S-M03 퀴즈 상세
│   │   └── layout.tsx            # Host 레이아웃 (GNB 포함)
│   │
│   ├── (play)/                   # 학생 플레이 라우트 그룹
│   │   ├── play/[sessionId]/
│   │   │   ├── page.tsx          # S-06 라이브 플레이
│   │   │   └── assignment/page.tsx # S-11 과제 플레이
│   │   ├── result/[sessionId]/
│   │   │   └── page.tsx          # S-08 결과/랭킹 (패턴/코칭 배지)
│   │   └── assignments/page.tsx  # S-10 학생 과제 목록
│   │
│   ├── api/                      # Mock API (46개 Route Handler)
│   │   ├── sessions/             # 세션 CRUD + 리포트
│   │   ├── groups/               # 그룹 CRUD
│   │   ├── sets/                 # 퀴즈 CRUD
│   │   ├── question-sets/        # 퀴즈 상세
│   │   ├── question-bank/        # 문항 뱅크 + AI 추천
│   │   ├── marketplace/          # 퀴즈 광장
│   │   └── achievement-standards/ # 성취기준
│   │
│   └── layout.tsx                # 루트 레이아웃
│
├── components/
│   ├── common/
│   │   ├── GNB.tsx               # 호스트 상단 내비게이션
│   │   └── EmptyState.tsx        # 빈 상태 공통 UI
│   ├── host/
│   │   ├── QuestionEditor.tsx    # 문항 편집기
│   │   ├── QuestionPreview.tsx   # 문항 미리보기
│   │   ├── QuestionSetCard.tsx   # 퀴즈 세트 카드
│   │   ├── QuestionTemplateCard.tsx # 문항 유형 선택 카드
│   │   ├── SetListItem.tsx       # 퀴즈 목록 아이템
│   │   ├── RecentDeployBanner.tsx # 최근 배포 배너
│   │   └── control/              # 컨트롤 패널 (v3)
│   │       ├── HeaderControlBar.tsx      # 헤더 (경과시간, 일시정지/종료)
│   │       ├── StudentGrid.tsx           # 학생 테이블 (순위/진행도/점수)
│   │       ├── StudentCard.tsx           # 학생 카드 (카드뷰 모드)
│   │       ├── StudentDetailModal.tsx    # 학생 상세 모달
│   │       ├── QuestionAnalyticsPanel.tsx # 문항+분석 통합 패널 (v3 신규)
│   │       ├── ReactionBar.tsx           # 리액션/알림 전송
│   │       ├── ControlActions.tsx        # (v2 잔존, 미사용)
│   │       ├── LiveAnalytics.tsx         # (v2 잔존, 미사용)
│   │       ├── LiveLeaderboard.tsx       # (v2 잔존, 미사용)
│   │       └── QuestionPanel.tsx         # (v2 잔존, 미사용)
│   ├── play/
│   │   ├── QuestionDisplay.tsx   # 플레이용 문항 표시
│   │   └── Countdown.tsx         # 카운트다운 타이머
│   ├── marketplace/              # 퀴즈 광장 전용
│   │   ├── QuizCardMarketplace.tsx  # 광장용 퀴즈 카드
│   │   ├── SearchFilterBar.tsx   # 검색 필터바
│   │   ├── PublishDialog.tsx     # 공유 설정 다이얼로그
│   │   ├── ReportDialog.tsx      # 신고 다이얼로그
│   │   └── LikeButton.tsx        # 좋아요 토글 버튼
│   └── ui/                       # shadcn/ui (21개 기본 컴포넌트)
│
├── lib/
│   ├── analysis.ts               # 분석 엔진 (패턴/코칭/개념 이해도)
│   ├── api.ts                    # API 클라이언트 유틸
│   ├── utils.ts                  # 공통 유틸 (cn())
│   ├── websocket.ts              # Socket.io 클라이언트
│   ├── filter-constants.ts       # 과목/학년 필터 상수
│   └── mock/
│       └── control-mock-data.ts  # 컨트롤 패널 mock 데이터 (24명, 5문항)
│
├── types/
│   ├── index.ts                  # 핵심 타입 정의 (550+ 라인)
│   └── control.ts                # 컨트롤 패널 전용 타입
│
└── public/                       # 정적 자산
```

---

## 3. 라우트 맵

### Host (교사) 라우트

| 라우트 | 화면 | 파일 |
|--------|------|------|
| `/dashboard` | 홈 대시보드 (S-01) | `(host)/dashboard/page.tsx` |
| `/dashboard/history` | 지난 게임 -- 종합대시보드+탭 (S-15) | `(host)/dashboard/history/page.tsx` |
| `/dashboard/groups/[groupId]` | 그룹 상세 (S-15b) | `(host)/dashboard/groups/[groupId]/page.tsx` |
| `/sets` | 내 퀴즈 목록 (S-02) | `(host)/sets/page.tsx` |
| `/sets/[setId]/edit` | 에디터 3단계 위자드 (S-03) | `(host)/sets/[setId]/edit/page.tsx` |
| `/sets/[setId]/deploy` | 게임 설정 (S-04) | `(host)/sets/[setId]/deploy/page.tsx` |
| `/live/[sessionId]/waiting` | QR 대기화면 (S-05) | `(host)/live/[sessionId]/waiting/page.tsx` |
| `/live/[sessionId]/control` | 컨트롤 패널 v3 (S-07) | `(host)/live/[sessionId]/control/page.tsx` |
| `/sessions/[sessionId]/report/questions` | 문항별 리포트 (S-16) | `(host)/sessions/[sessionId]/report/questions/page.tsx` |
| `/sessions/[sessionId]/report/students` | 학생별 리포트 (S-17) | `(host)/sessions/[sessionId]/report/students/page.tsx` |
| `/sessions/[sessionId]/submissions` | 제출 현황 (S-12) | `(host)/sessions/[sessionId]/submissions/page.tsx` |
| `/groups` | 그룹 목록 (S-13) | `(host)/groups/page.tsx` |
| `/marketplace` | 퀴즈 광장 홈 (S-M01) | `(host)/marketplace/page.tsx` |
| `/marketplace/search` | 검색 결과 (S-M02) | `(host)/marketplace/search/page.tsx` |
| `/marketplace/[sharedSetId]` | 퀴즈 상세 (S-M03) | `(host)/marketplace/[sharedSetId]/page.tsx` |
| `/marketplace/my` | 내가 공유한 퀴즈 (S-M04) | `(host)/marketplace/my/page.tsx` |
| `/marketplace/collections` | 컬렉션 | `(host)/marketplace/collections/page.tsx` |
| `/marketplace/bookmarks` | 북마크 | `(host)/marketplace/bookmarks/page.tsx` |
| `/marketplace/creator/[memberId]` | 크리에이터 프로필 | `(host)/marketplace/creator/[memberId]/page.tsx` |

### 학생(Play) 라우트

| 라우트 | 화면 | 파일 |
|--------|------|------|
| `/play/[sessionId]` | 라이브 플레이 (S-06) | `(play)/play/[sessionId]/page.tsx` |
| `/play/[sessionId]/assignment` | 과제 플레이 (S-11) | `(play)/play/[sessionId]/assignment/page.tsx` |
| `/result/[sessionId]` | 결과/랭킹 (S-08) | `(play)/result/[sessionId]/page.tsx` |
| `/assignments` | 학생 과제 목록 (S-10) | `(play)/assignments/page.tsx` |

---

## 4. 주요 모듈 설명

### 4-1. 컨트롤 패널 v3 (`live/[sessionId]/control/page.tsx`)

> **스피드 퀴즈 = 학생 개별 진행 모델**. 교사가 문항을 넘기는 동기 모델이 아닌, 학생이 자기 속도로 전체 문항을 풀고 교사는 실시간으로 모니터링.

**레이아웃: 2-패널 (3:2)**

```
+-----------------------------------------------------------------------+
| HEADER (h-14): 컨트롤 패널 | 경과시간 02:34 | 18/24명 완료             |
|   [일시정지/재개] [강제종료]                            [나가기 X]     |
+-----------------------------------------------------------------------+
| LEFT (flex-3)                          | RIGHT (flex-2)               |
|                                        |                              |
|  필터바: [전체][연속오답][찍기의심]...   |  <- Q1 / 5 ->  (화살표 네비)  |
|  +----------------------------------+  |  +-------------------------+ |
|  | # | 학생  | 진행도 | 점수 | ...  |  |  | 일차방정식 2x+3=7의 해?| |
|  | 1 | 수학천재| 5/5 v | 300 | ... |  |  | (1) x=1  (2) x=2  ... | |
|  | 2 | 김민준 | 5/5 v  | 280 | ... |  |  +-------------------------+ |
|  | 3 | 이서연 | 4/5    | 270 | ... |  |  +- 응답 분석 -------------+ |
|  | ...                               |  |  | 정답: (2) x=2 (75%)    | |
|  +----------------------------------+  |  | (1) 12% [학생A,B]      | |
|  ─────────────────────────────────── |  |  | (2) 75% [학생C,D,E...] | |
|  ReactionBar (하단 고정)              |  |  | 미응답: 3명 [학생F,G,H] | |
+-----------------------------------------------------------------------+
```

**핵심 컴포넌트:**

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| `HeaderControlBar` | `control/HeaderControlBar.tsx` | 경과시간(카운트업), 완료현황, 일시정지/강제종료 |
| `StudentGrid` | `control/StudentGrid.tsx` | 학생 테이블 -- 순위/진행도(3/5)/점수/정답률/뱃지 |
| `StudentCard` | `control/StudentCard.tsx` | 카드뷰 모드의 학생 카드 |
| `QuestionAnalyticsPanel` | `control/QuestionAnalyticsPanel.tsx` | 문항 네비 + 내용 + 선택지별 분포 + 학생 표시 |
| `StudentDetailModal` | `control/StudentDetailModal.tsx` | 학생 클릭 시 상세 모달 |
| `ReactionBar` | `control/ReactionBar.tsx` | 선택 학생에게 리액션/알림 전송 |

**v2 -> v3 제거된 기능:**
- 교사 문항 넘기기 (건너뛰기, 다음 문항)
- 힌트 공개 버튼
- 시간 연장 (+15s/+30s/+60s)
- Q번호 뱃지 (개별 진행이라 의미 없음)
- 사이드바 접기 토글

**v3 추가된 기능:**
- 학생별 진행도 표시 (completedQuestions/totalQuestions)
- 순위 컬럼 (점수 desc -> 응답시간 asc)
- 경과시간 카운트업 (카운트다운 아님)
- 문항별 선택지 분포에 학생 아바타 칩 표시
- 완료 현황 (18/24명 완료)

### 4-2. 지난 게임 (`dashboard/history/page.tsx`)

3개 섹션으로 구성:

1. **DashboardSummary** -- 종합 대시보드
   - 누적 현황 카드 4종 (함께한 날 / 총 게임 / 나의 그룹 / 완료 게임)
   - 타임라인 패널 2종 (최근 시작 Top3 / 최근 종료 Top3)
   - 그룹별 요약 그리드

2. **GamesTab** -- 게임별 탭
   - `GameCard` 컴포넌트 리스트
   - 진행 중 -> 상태분석 패널 (파란 배경)
   - 완료 -> 리포트 버튼

3. **GroupsTab** -- 그룹별 탭
   - 그룹 카드 그리드
   - 클릭 시 `/dashboard/groups/[groupId]` 이동

### 4-3. 문항별 리포트 (`report/questions/page.tsx`)

스크롤 원페이지 구조:

| 순서 | 컴포넌트 | 역할 |
|------|---------|------|
| 1 | `SummaryOverview` | 제출율/평균정답률/평균시간 카드 + Top3 오답/정답 + 경고배지 |
| 2 | `SummaryQuestionBars` | 문항별 정답률 가로바 차트 (Recharts BarChart) |
| 3 | `SummaryConceptBars` | 개념별(learning_map) 이해도 가로바 차트 |
| 4 | `QuestionReportCard` (반복) | 개별 문항 상세 -- 보기분포/min-max시간/난이도/개념 |

### 4-4. 학생별 리포트 (`report/students/page.tsx`)

스크롤 원페이지 구조:

| 순서 | 컴포넌트 | 역할 |
|------|---------|------|
| 1 | `SummarySection` | 패턴분포 스택바 + 코칭Top3/칭찬Top3 패널 |
| 2 | `StudentCard` (반복) | 순위/이름/패턴배지/코칭배지/연속정답/점수 |
| 3 | `StudentDetailPanel` (아코디언) | 문항별 O/X, 시간, 정답비교, 힌트사용 |

### 4-5. 학생 결과 화면 (`result/[sessionId]/page.tsx`)

- TOP3 포디움 + 전체 순위 리스트
- **학생 본인 결과**: 패턴 라벨, 코칭 라벨, 연속정답 배지 표시
- 분석 데이터는 `/api/sessions/{id}/report/students` 에서 가져와 `analysis.ts` 함수로 계산

### 4-6. 에디터 3단계 위자드 (`sets/[setId]/edit/page.tsx`)

4가지 모드: `edit` (기본 편집) / `template` (문항 추가 유형 선택) / `import` (문항 뱅크 불러오기) / `ai` (AI 추천)

- 좌측: 문항 리스트 + 추가 버튼
- 우측: 선택된 문항 편집 (유형/지문/보기/정답/힌트/해설)
- 문항 순서 이동, 복제, 삭제 지원
- AI 추천: 과목/학년/단원 + 난이도별 문항 수 지정 -> AI 생성 -> 선택 추가
- 문항 뱅크: 6가지 필터로 검색 -> 체크박스 다중 선택 -> 일괄 추가

---

## 5. 분석 엔진

### 파일: `lib/analysis.ts`

리포트 화면에서 사용하는 순수 분석 함수 모음. API raw 데이터 -> 계산된 인사이트 변환.

```
[API Data] -> calcQuestionSummary() -> 종합 요약
           -> calcQuestionBars()    -> 문항별 정답률 바
           -> calcConceptUnderstanding() -> 개념별 이해도
           -> calcStudentPattern()  -> 학생 패턴 (2축)
           -> calcStreaks()         -> 연속 정답/오답
           -> getPatternLabel()     -> 패턴 라벨 (이해/미이해/성실/찍기)
           -> getCoachingLabel()    -> 코칭 라벨 (도움/칭찬/관찰/양호)
```

### 2축 교차 분석 모델

```
              성실 (diligent)        비성실
          +------------------+------------------+
이해       |     이해          |      이해         |
(understands)| 정답률높+시간충분 | 정답률높+시간빠름  |
          +------------------+------------------+
미이해     |     성실          |      찍기         |
          | 정답률낮+시간충분  | 정답률낮+시간빠름  |
          +------------------+------------------+
```

### 임계값

| 지표 | 임계값 | 설명 |
|------|--------|------|
| 이해 (understands) | 정답률 >= 60% | 과반 이상 맞춤 |
| 성실 (diligent) | 학생평균시간 >= 전체평균 * 50% | 너무 빠르지 않음 |
| 도움 필요 (needsHelp) | 연속오답 >= 3 또는 정답률 < 40% | 위험 신호 |
| 칭찬 필요 (needsPraise) | 이해 + 성실 + 연속정답 >= 3 | 우수 학생 |

---

## 6. 컴포넌트 구조

### 공통 컴포넌트

| 컴포넌트 | 파일 | 용도 |
|---------|------|------|
| `GNB` | `components/common/GNB.tsx` | Host 상단 내비. 탭: 대시보드/내퀴즈/그룹/퀴즈광장/지난게임 |
| `EmptyState` | `components/common/EmptyState.tsx` | 데이터 없을 때 아이콘+메시지 표시 |

### 문항 유형 (QuestionType)

| 타입 | 한글명 | 설명 |
|------|--------|------|
| `multiple_choice` | 객관식 | 2/4/5지선다. options JSON 배열 |
| `ox` | OX | O 또는 X 선택 |
| `unscramble` | 단어 배열 | 단어를 올바른 순서로 배열 (TODO: 드래그 UI) |

> `short_answer`, `fill_in_blank`는 폐지됨.

### 컨트롤 패널 컴포넌트 (v3)

| 컴포넌트 | 상태 | 설명 |
|---------|------|------|
| `HeaderControlBar` | **사용 중** | 경과시간 카운트업, 완료현황, 일시정지/강제종료 |
| `StudentGrid` | **사용 중** | 학생 테이블 (순위/진행도/점수/정답률/뱃지), 테이블뷰+카드뷰 전환 |
| `StudentCard` | **사용 중** | 카드뷰 모드의 개별 학생 카드 |
| `QuestionAnalyticsPanel` | **사용 중** (v3 신규) | 문항 네비 + 내용 + 응답 분포 + 학생별 선택 표시 |
| `StudentDetailModal` | **사용 중** | 학생 클릭 시 상세 정보 모달 |
| `ReactionBar` | **사용 중** | 선택 학생에게 리액션/알림 전송 |
| `ControlActions` | 미사용 (v2) | v2 동기 모델용 제어 버튼 |
| `LiveAnalytics` | 미사용 (v2) | v2 실시간 분석 사이드바 |
| `LiveLeaderboard` | 미사용 (v2) | v2 리더보드 (StudentGrid에 통합) |
| `QuestionPanel` | 미사용 (v2) | v2 문항 표시 (QuestionAnalyticsPanel이 대체) |

---

## 7. 데이터 흐름

### 컨트롤 패널 데이터 흐름 (v3 스피드 퀴즈)

```
[게임 시작] -> 타이머 카운트업 (setInterval +1초)
           -> WebSocket 연결 + 세션 룸 조인

[Socket.io 이벤트]
  answer:count-update -> 학생별 진행도/점수 업데이트 (TODO: 실시간 연동)
  game:pause          -> 일시정지 (타이머 멈춤)
  game:resume         -> 재개 (타이머 재시작)
  game:end            -> /result/[sessionId]로 이동

[교사 액션]
  일시정지/재개 -> pauseGame() / resumeGame()
  강제종료      -> forceEndGame(sessionId)
  리액션 전송   -> sendReaction(payload)
  문항 탐색     -> selectedQuestionIndex 변경 (로컬 상태)

[현재 상태: Mock 데이터]
  MOCK_STUDENTS (24명) -> StudentGrid 렌더링
  MOCK_QUESTION_ANALYTICS (5문항) -> QuestionAnalyticsPanel 렌더링
```

> v3에서 제거된 이벤트: `question:show` (교사가 문항을 넘기지 않음)
> v3에서 제거된 액션: `skipQuestion`, `revealHint`, `extendTime`

### 리포트 데이터 흐름

```
[Mock API Route Handler]
  /api/sessions/[id]/report/questions  -> 문항 + 응답 이벤트 + 통계
  /api/sessions/[id]/report/students   -> 학생별 결과 + 응답 이벤트 + 문항
        |
        v
[페이지 컴포넌트] (useEffect -> fetch)
        |
        v
[lib/analysis.ts] 분석 함수 호출
  |- calcQuestionSummary()
  |- calcQuestionBars()
  |- calcConceptUnderstanding()
  |- calcAllStudentAnalyses()
  |- calcPatternDistribution()
        |
        v
[UI 렌더링] (요약 섹션 + 상세 카드/아코디언)
```

### 실시간 데이터 흐름 (라이브)

```
[Socket.io Server]
  |- student:joined     -> 대기화면 참여자 추가
  |- answer:count-update -> 컨트롤 패널 분포 갱신
  |- game:pause/resume   -> 일시정지/재개
  |- game:end            -> 결과 화면 이동

[Socket.io Client] (lib/websocket.ts)
  |- answer:submit   -> 응답 제출 (학생)
  |- session:start   -> 게임 시작 (Host)
  |- game:pause      -> 일시정지 (Host)
  |- game:resume     -> 재개 (Host)
  |- game:force-end  -> 강제 종료 (Host)
  |- reaction:send   -> 리액션 전송 (Host)
```

---

## 8. Mock API 라우트

> 현재 모든 API는 Route Handler 내 하드코딩된 mock 데이터를 반환.
> 실제 백엔드 연동 시 fetch URL만 변경하면 됨.

| 경로 | 메서드 | 반환 데이터 |
|------|--------|------------|
| `/api/sessions` | GET | 세션 3건 (완료1, 진행중1, 완료1) |
| `/api/sessions/[id]` | GET | 세션 상세 (게임설정 포함) |
| `/api/sessions/[id]/report/questions` | GET | 문항 5건 + 응답 이벤트 + 통계 |
| `/api/sessions/[id]/report/students` | GET | 학생 5명 (결과+응답+문항) |
| `/api/sessions/[id]/questions` | GET | 문항 목록 (플레이용) |
| `/api/groups` | GET | 그룹 5건 (manual 3 + auto_live 2) |
| `/api/groups/[id]` | GET | 그룹 상세 |
| `/api/sets` | GET | 퀴즈 세트 목록 |
| `/api/sets/[id]` | GET | 퀴즈 상세 + 문항 |
| `/api/question-sets/[id]` | GET | 퀴즈 상세 (별칭) |
| `/api/question-bank` | GET | 문항 뱅크 검색 |
| `/api/question-bank/ai-recommend` | POST | AI 추천 문항 |
| `/api/marketplace` | GET | 광장 홈 (인기+최신) |
| `/api/marketplace/[id]` | GET | 공유 퀴즈 상세 |
| `/api/marketplace/search` | GET | 검색 (필터+정렬+페이지네이션) |
| `/api/marketplace/my` | GET | 내가 공유한 퀴즈 |

---

## 9. 타입 시스템

### 핵심 타입 (`types/index.ts`)

```typescript
// 문항 유형
type QuestionType = 'multiple_choice' | 'ox' | 'unscramble'

// 참여자 유형
type ParticipantType = 'member' | 'guest'

// 세션 상태
type SessionStatus = 'waiting' | 'in_progress' | 'paused' | 'completed' | 'cancelled'

// 응답 이벤트 타입 (이벤트 로그)
type ResponseEventType = 'first_input' | 'modify' | 'final_submit' | 'skip' | 'return'

// 분석 패턴/코칭 라벨
type PatternLabel = '이해' | '미이해' | '성실' | '찍기'
type CoachingLabel = '도움 필요' | '칭찬 필요' | '관찰' | '양호'
```

### 컨트롤 패널 타입 (`types/control.ts`)

```typescript
// 학생 상태 (v3: 'answered' -> 'finished')
type StudentStatus = 'answering' | 'finished' | 'disconnected' | 'idle'

// 행동 뱃지
type BehaviorBadge = 'struggling' | 'guessing' | 'star' | 'slow'

// 학생 모니터링 데이터
interface StudentMonitorData {
  participantId: string
  nickname: string
  avatarColor: string
  status: StudentStatus
  score: number
  accuracy: number
  badges: BehaviorBadge[]
  completedQuestions: number    // v3: 완료한 문항 수
  totalQuestions: number        // v3: 전체 문항 수
  currentQuestionIndex: number  // v3: 현재 풀고 있는 문항
  isFinished: boolean           // v3: 모든 문항 완료 여부
  correctPattern: (boolean | null)[]  // v3: null = 아직 미응답
  perQuestionResults: PerQuestionResult[]
  totalResponseTimeSec: number
}

// 문항별 분석 (우측 패널)
interface PerQuestionAnalytics {
  questionIndex: number
  questionContent: string
  questionType: 'multiple_choice' | 'ox'
  options: { index: number; text: string }[]
  correctOptionIndex: number
  distribution: Record<string, number>
  correctCount: number
  incorrectCount: number
  unansweredCount: number
  totalStudents: number
  avgResponseTimeSec: number
}
```

### 주요 인터페이스

| 인터페이스 | 설명 |
|-----------|------|
| `Question` | 문항 (content, options, answer, hint, learning_map 등) |
| `Session` | 게임 세션 (설정, 상태, QR 등) |
| `ParticipantResult` | 학생 참여 결과 (점수, 순위, 시간 등) |
| `ResponseEvent` | 응답 이벤트 로그 (정오답, 시간, 이벤트타입 등) |
| `Group` | 그룹 (이름, 멤버수, 타입 등) |
| `AnalysisPattern` | 분석 패턴 (understands, diligent, needsHelp, needsPraise) |
| `StudentAnalysis` | 학생 종합 분석 (패턴+코칭+연속정답+점수) |
| `QuestionReportSummary` | 문항별 리포트 종합 요약 |
| `QuestionBarData` | 문항별 정답률 바 데이터 |
| `ConceptUnderstanding` | 개념별 이해도 |

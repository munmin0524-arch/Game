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
│   │   │       ├── edit/page.tsx # S-03 에디터
│   │   │       └── deploy/page.tsx # S-04 게임 설정
│   │   ├── live/[sessionId]/
│   │   │   ├── waiting/page.tsx  # S-05 QR 대기화면
│   │   │   └── control/page.tsx  # S-07 컨트롤 패널
│   │   ├── sessions/[sessionId]/
│   │   │   ├── report/
│   │   │   │   ├── questions/page.tsx  # S-16 문항별 리포트
│   │   │   │   └── students/page.tsx   # S-17 학생별 리포트
│   │   │   └── submissions/page.tsx    # S-12 제출 현황
│   │   ├── groups/page.tsx       # S-13 그룹 목록
│   │   ├── marketplace/          # 퀴즈 광장
│   │   └── layout.tsx            # Host 레이아웃 (GNB 포함)
│   │
│   ├── (play)/                   # 학생 플레이 라우트 그룹
│   │   ├── play/[sessionId]/
│   │   │   ├── page.tsx          # S-06 라이브 플레이
│   │   │   └── assignment/page.tsx # S-11 과제 플레이
│   │   └── result/[sessionId]/
│   │       └── page.tsx          # S-08 결과/랭킹 (패턴/코칭 배지)
│   │
│   ├── api/                      # Mock API (Route Handlers)
│   │   ├── sessions/             # 세션 CRUD + 리포트
│   │   ├── groups/               # 그룹 CRUD
│   │   ├── sets/                 # 퀴즈 CRUD
│   │   ├── question-sets/        # 퀴즈 상세
│   │   ├── question-bank/        # 문항 뱅크 + AI 추천
│   │   └── marketplace/          # 퀴즈 광장
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
│   │   └── control/              # 컨트롤 패널 하위 컴포넌트
│   │       ├── ControlActions.tsx
│   │       ├── LiveAnalytics.tsx
│   │       ├── LiveLeaderboard.tsx
│   │       ├── QuestionPanel.tsx
│   │       ├── ReactionBar.tsx
│   │       ├── StudentCard.tsx
│   │       ├── StudentDetailModal.tsx
│   │       └── StudentGrid.tsx
│   ├── play/
│   │   ├── QuestionDisplay.tsx   # 플레이용 문항 표시
│   │   └── Countdown.tsx         # 카운트다운 타이머
│   └── ui/                       # shadcn/ui 기본 컴포넌트
│
├── lib/
│   ├── analysis.ts               # ★ 분석 엔진 (패턴/코칭/개념 이해도)
│   ├── api.ts                    # API 클라이언트 유틸
│   ├── utils.ts                  # 공통 유틸
│   ├── websocket.ts              # Socket.io 클라이언트
│   └── mock/
│       └── control-mock-data.ts  # 컨트롤 패널 mock 데이터
│
├── types/
│   ├── index.ts                  # ★ 핵심 타입 정의 (전체)
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
| `/dashboard/history` | 지난 게임 — 종합대시보드+탭 (S-15) | `(host)/dashboard/history/page.tsx` |
| `/dashboard/groups/[groupId]` | 그룹 상세 (S-15b) | `(host)/dashboard/groups/[groupId]/page.tsx` |
| `/sets` | 내 퀴즈 목록 (S-02) | `(host)/sets/page.tsx` |
| `/sets/[setId]/edit` | 에디터 (S-03) | `(host)/sets/[setId]/edit/page.tsx` |
| `/sets/[setId]/deploy` | 게임 설정 (S-04) | `(host)/sets/[setId]/deploy/page.tsx` |
| `/live/[sessionId]/waiting` | QR 대기화면 (S-05) | `(host)/live/[sessionId]/waiting/page.tsx` |
| `/live/[sessionId]/control` | 컨트롤 패널 (S-07) | `(host)/live/[sessionId]/control/page.tsx` |
| `/sessions/[sessionId]/report/questions` | 문항별 리포트 (S-16) | `(host)/sessions/[sessionId]/report/questions/page.tsx` |
| `/sessions/[sessionId]/report/students` | 학생별 리포트 (S-17) | `(host)/sessions/[sessionId]/report/students/page.tsx` |
| `/sessions/[sessionId]/submissions` | 제출 현황 (S-12) | `(host)/sessions/[sessionId]/submissions/page.tsx` |
| `/groups` | 그룹 목록 (S-13) | `(host)/groups/page.tsx` |
| `/marketplace` | 퀴즈 광장 홈 (S-M01) | `(host)/marketplace/page.tsx` |

### 학생(Play) 라우트

| 라우트 | 화면 | 파일 |
|--------|------|------|
| `/play/[sessionId]` | 라이브 플레이 (S-06) | `(play)/play/[sessionId]/page.tsx` |
| `/play/[sessionId]/assignment` | 과제 플레이 (S-11) | `(play)/play/[sessionId]/assignment/page.tsx` |
| `/result/[sessionId]` | 결과/랭킹 (S-08) | `(play)/result/[sessionId]/page.tsx` |

---

## 4. 주요 모듈 설명

### 4-1. 지난 게임 (`dashboard/history/page.tsx`)

3개 섹션으로 구성:

1. **DashboardSummary** — 종합 대시보드
   - 누적 현황 카드 4종 (함께한 날 / 총 게임 / 나의 그룹 / 완료 게임)
   - 타임라인 패널 2종 (최근 시작 Top3 / 최근 종료 Top3)
   - 그룹별 요약 그리드

2. **GamesTab** — 게임별 탭
   - `GameCard` 컴포넌트 리스트
   - 진행 중 → 상태분석 패널 (파란 배경)
   - 완료 → 리포트 버튼

3. **GroupsTab** — 그룹별 탭
   - 그룹 카드 그리드
   - 클릭 시 `/dashboard/groups/[groupId]` 이동

### 4-2. 문항별 리포트 (`report/questions/page.tsx`)

스크롤 원페이지 구조:

| 순서 | 컴포넌트 | 역할 |
|------|---------|------|
| 1 | `SummaryOverview` | 제출율/평균정답률/평균시간 카드 + Top3 오답/정답 + 경고배지 |
| 2 | `SummaryQuestionBars` | 문항별 정답률 가로바 차트 (Recharts BarChart) |
| 3 | `SummaryConceptBars` | 개념별(learning_map) 이해도 가로바 차트 |
| 4 | `QuestionReportCard` (반복) | 개별 문항 상세 — 보기분포/min-max시간/난이도/개념 |

### 4-3. 학생별 리포트 (`report/students/page.tsx`)

스크롤 원페이지 구조:

| 순서 | 컴포넌트 | 역할 |
|------|---------|------|
| 1 | `SummarySection` | 패턴분포 스택바 + 코칭Top3/칭찬Top3 패널 |
| 2 | `StudentCard` (반복) | 순위/이름/패턴배지/코칭배지/연속정답/점수 |
| 3 | `StudentDetailPanel` (아코디언) | 문항별 O/X, 시간, 정답비교, 힌트사용 |

### 4-4. 학생 결과 화면 (`result/[sessionId]/page.tsx`)

- TOP3 포디움 + 전체 순위 리스트
- **학생 본인 결과**: 패턴 라벨, 코칭 라벨, 연속정답 배지 표시
- 분석 데이터는 `/api/sessions/{id}/report/students` 에서 가져와 `analysis.ts` 함수로 계산

---

## 5. 분석 엔진

### 파일: `lib/analysis.ts`

리포트 화면에서 사용하는 순수 분석 함수 모음. API raw 데이터 → 계산된 인사이트 변환.

```
[API Data] → calcQuestionSummary() → 종합 요약
           → calcQuestionBars()    → 문항별 정답률 바
           → calcConceptUnderstanding() → 개념별 이해도
           → calcStudentPattern()  → 학생 패턴 (2축)
           → calcStreaks()         → 연속 정답/오답
           → getPatternLabel()     → 패턴 라벨 (이해/미이해/성실/찍기)
           → getCoachingLabel()    → 코칭 라벨 (도움/칭찬/관찰/양호)
```

### 2축 교차 분석 모델

```
              성실 (diligent)        비성실
          ┌──────────────────┬──────────────────┐
이해       │     이해          │      이해         │
(understands)│ 정답률높+시간충분 │ 정답률높+시간빠름  │
          ├──────────────────┼──────────────────┤
미이해     │     성실          │      찍기         │
          │ 정답률낮+시간충분  │ 정답률낮+시간빠름  │
          └──────────────────┴──────────────────┘
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

---

## 7. 데이터 흐름

### 리포트 데이터 흐름

```
[Mock API Route Handler]
  └── /api/sessions/[id]/report/questions  → 문항 + 응답 이벤트 + 통계
  └── /api/sessions/[id]/report/students   → 학생별 결과 + 응답 이벤트 + 문항
        │
        ▼
[페이지 컴포넌트] (useEffect → fetch)
        │
        ▼
[lib/analysis.ts] 분석 함수 호출
  ├── calcQuestionSummary()
  ├── calcQuestionBars()
  ├── calcConceptUnderstanding()
  ├── calcAllStudentAnalyses()
  └── calcPatternDistribution()
        │
        ▼
[UI 렌더링] (요약 섹션 + 상세 카드/아코디언)
```

### 실시간 데이터 흐름 (라이브)

```
[Socket.io Server]
  ├── student:joined → 대기화면 참여자 추가
  ├── question:show  → 플레이 화면 문항 표시
  ├── answer:count-update → 컨트롤 패널 분포 갱신
  └── game:end       → 결과 화면 이동

[Socket.io Client] (lib/websocket.ts)
  ├── answer:submit  → 응답 제출
  └── session:start  → 게임 시작 (Host)
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

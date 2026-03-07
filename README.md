# Quiz Game Platform

> 교사(Host)가 퀴즈 세트를 만들고, 학생이 QR/링크로 참여하는 **교육용 퀴즈 게임 플랫폼**.
> **라이브(실시간 스피드 퀴즈)** 와 **과제(비동기)** 두 가지 모드 지원.

**Production:** https://game-omega-hazel.vercel.app

---

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 14.x |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS + shadcn/ui (Radix) | 3.x |
| 차트 | Recharts | 2.x |
| 실시간 통신 | Socket.io | 4.x |
| 아이콘 | Lucide React | - |
| 날짜 | date-fns (ko locale) | 3.x |
| DnD | @hello-pangea/dnd | 18.x |
| 배포 | Vercel | - |

---

## 실행 방법

```bash
cd frontend
npm install       # 최초 1회
npm run dev       # http://localhost:3000
```

---

## 현재 상태

- **프론트엔드 스켈레톤 완료** — 25개 화면 전체 (라이브 + 과제 + 리포트 + 마켓플레이스)
- **Mock 데이터**로 동작 (`app/api/` 폴더에 46개 Mock Route Handler)
- **백엔드 미연결** — 인증, WebSocket, DB 모두 연결 필요

---

## 핵심 플로우

### 라이브 모드 (스피드 퀴즈)

```
[Host] 퀴즈 제작 → 게임 설정 → QR 생성 → 대기화면
                                              ↓
[학생] QR 스캔 → 닉네임 입력(Guest) / 로그인(Member) → 대기
                                              ↓
[Host] 게임 시작 → 학생 개별 속도로 전체 문항 풀기
                                              ↓
[Host] 컨트롤 패널에서 실시간 모니터링 (학생별 진행도, 문항별 분석)
                                              ↓
[전체] 결과/랭킹 → [Host] 리포트 분석 (문항별/학생별)
```

> **스피드 퀴즈**: 동기화 모델(교사가 문항 넘기기)이 아닌, **학생 개별 진행** 모델.
> 각 학생이 자기 속도로 전체 문항을 풀고, 교사는 실시간으로 진행 상황을 모니터링.

### 과제 모드

```
[Host] 퀴즈 제작 → 과제 보내기 (기간 설정) → 링크 공유
                                              ↓
[학생] 기간 내 자율 접속 → 문항 풀기 (이어하기 가능)
                                              ↓
[학생] 최종 제출 (1회) → [Host] 제출 현황 확인 → 리포트
```

---

## 사용자 역할

| 역할 | 설명 | 식별 방식 | 접근 범위 |
|------|------|-----------|----------|
| **Host (교사)** | 퀴즈 제작, 게임 운영, 리포트 | 로그인 (UUID) | 대시보드 전체 |
| **Member (학생 계정)** | QR/링크로 참여, 데이터 누적 | 로그인 (UUID) | 과제 목록 + 플레이 + 결과 |
| **Guest (비회원 학생)** | 가입 없이 참여 | 이메일 + 닉네임 | 플레이 + 결과만 |

---

## 화면 목록 (25개)

### Phase 1 — 라이브 핵심 (8개) ✅

| # | 화면명 | 라우트 | 역할 |
|---|--------|--------|------|
| S-01 | 홈 대시보드 | `/dashboard` | Host |
| S-02 | 내 퀴즈 목록 | `/sets` | Host |
| S-03 | 에디터 (3단계 위자드) | `/sets/[setId]/edit` | Host |
| S-04 | 게임 설정 | `/sets/[setId]/deploy` | Host |
| S-05 | QR 대기화면 | `/live/[sessionId]/waiting` | Host |
| S-06 | 라이브 플레이 | `/play/[sessionId]` | 학생 |
| S-07 | 컨트롤 패널 (v3) | `/live/[sessionId]/control` | Host |
| S-08 | 결과/랭킹 | `/result/[sessionId]` | 전체 |

### Phase 1.5 — 리포트/분석 (5개) ✅

| # | 화면명 | 라우트 | 역할 |
|---|--------|--------|------|
| S-15 | 지난 게임 대시보드 | `/dashboard/history` | Host |
| S-15b | 그룹 상세 | `/dashboard/groups/[groupId]` | Host |
| S-16 | 문항별 리포트 | `/sessions/[sessionId]/report/questions` | Host |
| S-17 | 학생별 리포트 | `/sessions/[sessionId]/report/students` | Host |
| S-13 | 그룹 목록 | `/groups` | Host |

### Phase 2 — 과제 기능 (4개) ⏳

| # | 화면명 | 라우트 | 역할 |
|---|--------|--------|------|
| S-10 | 학생 과제 목록 | `/assignments` | Member |
| S-11 | 과제 플레이 | `/play/[sessionId]/assignment` | 학생 |
| S-12 | 제출 현황 | `/sessions/[sessionId]/submissions` | Host |
| S-09 | 배포 설정 (과제 탭) | `/sets/[setId]/deploy` 확장 | Host |

### Phase M — 퀴즈 광장 (7개) ✅

| # | 화면명 | 라우트 | 역할 |
|---|--------|--------|------|
| S-M01 | 광장 홈 | `/marketplace` | Host |
| S-M02 | 검색 결과 | `/marketplace/search` | Host |
| S-M03 | 퀴즈 상세 | `/marketplace/[sharedSetId]` | Host |
| S-M04 | 내가 공유한 퀴즈 | `/marketplace/my` | Host |
| — | 컬렉션 | `/marketplace/collections` | Host |
| — | 북마크 | `/marketplace/bookmarks` | Host |
| — | 크리에이터 | `/marketplace/creator/[memberId]` | Host |

---

## 프로젝트 구조

```
frontend/
├── app/
│   ├── (host)/              ← 교사 전용 (GNB 포함)
│   │   ├── dashboard/       홈, 지난게임, 그룹상세
│   │   ├── sets/            퀴즈 목록, 에디터, 게임설정
│   │   ├── live/            QR 대기화면, 컨트롤 패널
│   │   ├── sessions/        리포트(문항/학생), 제출현황
│   │   ├── groups/          그룹 관리
│   │   └── marketplace/     퀴즈 광장 (7페이지)
│   ├── (play)/              ← 학생 전용 (GNB 없음)
│   │   ├── play/            라이브 플레이, 과제 플레이
│   │   ├── result/          결과/랭킹
│   │   └── assignments/     과제 목록
│   └── api/                 ← Mock API (46개 Route Handler)
│
├── components/
│   ├── common/              GNB, EmptyState
│   ├── host/                교사 전용 (에디터, 카드, 컨트롤패널 등)
│   ├── play/                학생 전용 (문항표시, 타이머 등)
│   ├── marketplace/         광장 전용 (좋아요, 검색필터 등)
│   └── ui/                  shadcn/ui (21개 기본 컴포넌트)
│
├── lib/
│   ├── analysis.ts          ★ 분석 엔진 (패턴/코칭/개념이해도)
│   ├── api.ts               API 클라이언트
│   ├── websocket.ts         Socket.io 클라이언트
│   ├── filter-constants.ts  과목/학년 필터 상수
│   ├── utils.ts             cn() 유틸
│   └── mock/                Mock 데이터
│
└── types/
    ├── index.ts             ★ 핵심 타입 (550+ 라인)
    └── control.ts           컨트롤 패널 전용 타입
```

---

## 주요 기능 하이라이트

### 컨트롤 패널 (v3 — 스피드 퀴즈)

- **2-패널 레이아웃** (좌 3:2 우)
- **좌측**: 학생 테이블 — 순위, 진행도(3/5), 점수, 정답률, 뱃지(우수/연속오답/찍기의심/진행느림)
- **우측**: 문항+분석 통합 — ← Q1/5 → 네비게이션, 선택지별 분포 + 학생 목록, 정답/오답/미응답 통계
- **헤더**: 경과시간(카운트업), 완료 현황, 일시정지/강제종료

### 분석 엔진 (2축 교차 모델)

```
              성실 (시간 충분)     비성실 (빠른 응답)
          ┌──────────────────┬──────────────────┐
이해       │      이해         │      이해         │
(정답률≥60%)│                  │  (빠르지만 맞힘)    │
          ├──────────────────┼──────────────────┤
미이해     │      성실         │      찍기          │
(정답률<60%)│  (노력하지만 틀림) │  (빠르고 틀림)     │
          └──────────────────┴──────────────────┘
```

### 문항 유형 (3종)

| 타입 | 한글명 | 설명 |
|------|--------|------|
| `multiple_choice` | 객관식 | 2/4/5지선다 |
| `ox` | OX | O 또는 X 선택 |
| `unscramble` | 단어 배열 | 올바른 순서로 배열 |

---

## 백엔드 연결 순서 (권장)

```
1단계: 인증 API → (host)/layout.tsx 가드 활성화
2단계: 세트지 CRUD → app/api/question-sets/ 교체
3단계: 세션 생성/배포 → QR 생성 → 대기화면
4단계: WebSocket → 라이브 플레이 실시간 동기화
5단계: 그룹/리포트 → 과제 배포 → 분석 리포트
```

### 백엔드 연결 전 필수 작업

| 항목 | 설명 |
|------|------|
| 인증(Auth) | 모든 페이지 미인증 접근 가능 → 세션 확인 필요 |
| WebSocket | 라이브 플레이(S-06, S-07) 실시간 미동작 |
| 게스트 쿠키 | 과제 이어하기 로직 미동작 |
| QR 코드 | 대기화면 QR 이미지 실제 생성 필요 |

---

## 문서

### 핵심 문서 (기획/설계)

| 문서 | 경로 | 대상 | 내용 |
|------|------|------|------|
| **기획 스펙** | [docs/SPEC.md](docs/SPEC.md) | 기획자, 개발자 | 사용자 역할, 핵심 플로우, 화면별 기능 상세 (25개), 정책 결정 사항, WebSocket 이벤트, API 엔드포인트 목록 |
| **데이터 모델** | [docs/data-model.md](docs/data-model.md) | 백엔드 개발자 | DB 스키마 16개 테이블, 필드 정의, ERD, 주요 쿼리 패턴, 인덱스 전략 |
| **학생용 서비스** | [docs/student-service.md](docs/student-service.md) | 기획자, 개발자 | 학생용 서비스 전체 설계 -- 화면 구조(11개), 데이터 모델, 게임/맞춤형학습/보상/캐릭터 로직, 구현 순서 |

### 프론트엔드 문서

| 문서 | 경로 | 대상 | 내용 |
|------|------|------|------|
| **프론트엔드 아키텍처** | [docs/frontend-architecture.md](docs/frontend-architecture.md) | 프론트엔드 개발자 | 디렉토리 구조, 라우트 맵 (25개), 컴포넌트 구조, 분석 엔진, 데이터 흐름, 타입 시스템 |
| **API 상세 스펙** | [docs/api-spec.md](docs/api-spec.md) | 프론트/백엔드 개발자 | 모든 API 엔드포인트의 요청/응답 스키마, Query Params, 에러 코드 정의 |
| **디자인 시스템** | [docs/design-system.md](docs/design-system.md) | 프론트엔드 개발자, 디자이너 | 색상 체계, 타이포그래피, shadcn/ui 컴포넌트 목록(21개), 레이아웃 패턴, 아이콘, 반응형 기준 |

### 운영/관리 문서

| 문서 | 경로 | 대상 | 내용 |
|------|------|------|------|
| **진행 현황** | [docs/progress.md](docs/progress.md) | 전체 | Phase별 완료 상태, 주요 결정 이력, 문서 구조 안내 |
| **배포 및 환경 설정** | [docs/deployment.md](docs/deployment.md) | 개발자, DevOps | Vercel 배포 설정, 환경변수, 로컬 개발, 백엔드 연동 체크리스트, 알려진 이슈 |
| **테스트 전략** | [docs/testing.md](docs/testing.md) | 개발자 | 테스트 범위/우선순위, 도구 추천, 파일 구조, 분석 엔진 테스트 예시, CI 파이프라인 |

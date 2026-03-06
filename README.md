# Quiz Game Platform

> 교사(Host)가 퀴즈 세트를 만들고, 학생이 QR/링크로 참여하는 교육용 퀴즈 게임 플랫폼.
> 라이브(실시간)와 과제(비동기) 두 가지 모드 지원.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS + shadcn/ui |
| 실시간 통신 | Socket.io (라이브 모드) |
| 차트 | Recharts (리포트) |
| 배포 | Vercel |

---

## 실행 방법

```bash
cd frontend
npm install       # 최초 1회
npm run dev       # http://localhost:3000
```

---

## 배포 URL

**Production:** https://game-omega-hazel.vercel.app

---

## 현재 상태

- **프론트엔드 스켈레톤 완료** (17개 화면 전체)
- **Mock 데이터**로 동작 (`app/api/` 폴더에 하드코딩된 더미 데이터)
- **백엔드 미연결** — 인증, WebSocket, DB 모두 연결 필요

### 백엔드 연결 전 필수 작업

| 항목 | 설명 |
|------|------|
| 인증(Auth) | 모든 페이지 미인증 접근 가능 → 세션 확인 필요 |
| WebSocket | 라이브 플레이(S-06, S-07) 실시간 미동작 |
| 게스트 쿠키 | 과제 이어하기 로직 미동작 |
| QR 코드 | 대기화면 QR 이미지 실제 생성 필요 |

---

## 화면 목록 (17개)

### Phase 1 — 라이브 핵심

| # | 화면명 | 라우트 | 역할 |
|---|--------|--------|------|
| S-01 | 홈 대시보드 | `/dashboard` | Host |
| S-02 | 세트지 목록 | `/sets` | Host |
| S-03 | 에디터 | `/sets/[setId]/edit` | Host |
| S-04 | 배포 설정 | `/sets/[setId]/deploy` | Host |
| S-05 | QR 대기화면 | `/live/[sessionId]/waiting` | Host |
| S-06 | 플레이 화면 | `/play/[sessionId]` | 학생 |
| S-07 | 컨트롤 패널 | `/live/[sessionId]/control` | Host |
| S-08 | 결과/랭킹 | `/result/[sessionId]` | 전체 |

### Phase 2 — 과제 기능

| # | 화면명 | 라우트 | 역할 |
|---|--------|--------|------|
| S-09 | 배포 설정 (과제 탭) | `/sets/[setId]/deploy` 확장 | Host |
| S-10 | 학생 과제 목록 | `/assignments` | Member |
| S-11 | 과제 플레이 | `/play/[sessionId]/assignment` | 학생 |
| S-12 | 제출 현황 | `/sessions/[sessionId]/submissions` | Host |

### Phase 3 — 그룹 & 리포트

| # | 화면명 | 라우트 | 역할 |
|---|--------|--------|------|
| S-13 | 그룹 목록 | `/groups` | Host |
| S-14 | 그룹 상세 | `/groups/[groupId]` | Host |
| S-15 | 배포 히스토리 | `/dashboard/history` | Host |
| S-16 | 리포트 (문항별) | `/sessions/[sessionId]/report/questions` | Host |
| S-17 | 리포트 (학생별) | `/sessions/[sessionId]/report/students` | Host |

---

## 프로젝트 구조

```
frontend/
├── app/
│   ├── (host)/          ← 교사 전용 (GNB 포함)
│   ├── (play)/          ← 학생 전용 (GNB 없음, 어두운 배경)
│   └── api/             ← Mock API Routes
├── components/
│   ├── common/          ← GNB, EmptyState
│   ├── host/            ← 교사 전용 컴포넌트
│   ├── play/            ← 학생 전용 컴포넌트
│   └── ui/              ← shadcn/ui
├── lib/
│   ├── api.ts           ← API 클라이언트
│   ├── utils.ts         ← cn() 유틸
│   └── websocket.ts     ← Socket.io 유틸
└── types/
    └── index.ts         ← TypeScript 타입 정의
```

---

## 백엔드 연결 순서 (권장)

```
1단계: 인증 API → (host)/layout.tsx 가드 활성화
2단계: 세트지 CRUD → app/api/question-sets/ 교체
3단계: 세션 생성/배포 → QR 생성 → 대기화면
4단계: WebSocket → 라이브 플레이 실시간 동기화
5단계: 그룹/리포트 → 과제 배포 → 분석 리포트
```

---

## 문서

| 문서 | 내용 |
|------|------|
| [docs/SPEC.md](docs/SPEC.md) | 기획 스펙 (역할, 플로우, 화면별 기능, 정책, API) |
| [docs/data-model.md](docs/data-model.md) | DB 스키마 (11개 테이블, ERD, 쿼리 패턴) |

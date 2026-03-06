# 프로젝트 진행 현황

> 기술 스택: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui + Socket.io
> 업데이트: 2026-03-04

**관련 문서**
- [frontend-guide.md](frontend-guide.md) ← 프론트 구조 + 실행법 + 개선 체크리스트
- [spec-summary.md](spec-summary.md) ← 1페이지 스펙 요약
- [data-model.md](data-model.md) ← DB 스키마

---

## 범례

| 아이콘 | 의미 |
|--------|------|
| ✅ | 완료 |
| 🔄 | 진행 중 |
| ⏳ | 대기 |
| ❌ | 블로커 있음 |

---

## Phase 1 — 라이브 핵심 (8개 화면) ✅

> 목표: Host가 세트지를 만들고 → 라이브로 배포 → 학생이 QR로 참여 → 결과 확인까지 전체 플로우

### 기획·스펙

| 항목 | 상태 | 파일 |
|------|------|------|
| 화면 흐름 (Sitemap) | ✅ | [product-spec.md](product-spec.md) |
| 기능 정의표 | ✅ | [product-spec.md](product-spec.md) |
| 정책 결정 목록 (P-01~P-11) | ✅ (P-10만 미결) | [product-spec.md](product-spec.md) |
| 데이터 모델 (DB 스키마) | ✅ | [data-model.md](data-model.md) |
| 화면별 스펙 (ASCII + 컴포넌트 + API) | ✅ | [screens/phase1-live-core.md](screens/phase1-live-core.md) |

### 프론트엔드 코드 스켈레톤

| 파일 | 화면 | 상태 |
|------|------|------|
| `frontend/types/index.ts` | 전체 TypeScript 타입 | ✅ |
| `frontend/lib/api.ts` | API 클라이언트 | ✅ |
| `frontend/lib/websocket.ts` | WebSocket 유틸 | ✅ |
| `frontend/app/layout.tsx` | 루트 레이아웃 | ✅ |
| `frontend/app/(host)/layout.tsx` | Host 그룹 레이아웃 + GNB | ✅ |
| `frontend/app/(play)/layout.tsx` | 플레이 그룹 레이아웃 | ✅ |
| `frontend/app/(host)/dashboard/page.tsx` | S-01 홈 대시보드 | ✅ |
| `frontend/app/(host)/sets/page.tsx` | S-02 세트지 목록 | ✅ |
| `frontend/app/(host)/sets/[setId]/edit/page.tsx` | S-03 에디터 | ✅ |
| `frontend/app/(host)/sets/[setId]/deploy/page.tsx` | S-04 배포 설정 | ✅ |
| `frontend/app/(host)/live/[sessionId]/waiting/page.tsx` | S-05 QR 대기화면 | ✅ |
| `frontend/app/(play)/play/[sessionId]/page.tsx` | S-06 플레이 화면 (라이브) | ✅ |
| `frontend/app/(host)/live/[sessionId]/control/page.tsx` | S-07 컨트롤 패널 | ✅ |
| `frontend/app/(play)/result/[sessionId]/page.tsx` | S-08 결과·랭킹 | ✅ |
| `frontend/components/common/GNB.tsx` | GNB 내비게이션 | ✅ |
| `frontend/components/common/EmptyState.tsx` | 빈 상태 컴포넌트 | ✅ |
| `frontend/components/host/QuestionSetCard.tsx` | 세트지 카드 컴포넌트 | ✅ |
| `frontend/components/host/SetListItem.tsx` | 세트지 목록 행 컴포넌트 | ✅ |
| `frontend/components/host/RecentDeployBanner.tsx` | 최근 배포 배너 | ✅ |
| `frontend/components/host/QuestionEditor.tsx` | 문항 편집 폼 | ✅ |
| `frontend/components/play/QuestionDisplay.tsx` | 문항 표시 컴포넌트 | ✅ |
| `frontend/components/play/Countdown.tsx` | 타이머 컴포넌트 | ✅ |

---

## Phase 2 — 과제 기능 (4개 화면) ✅

> 목표: 과제 배포 → 학생이 기간 내 자유롭게 참여 → 제출 현황 관리

### 기획·스펙

| 항목 | 상태 | 파일 |
|------|------|------|
| 화면 흐름 | ✅ | [product-spec.md](product-spec.md) |
| 기능 정의표 | ✅ | [product-spec.md](product-spec.md) |
| 화면별 스펙 (ASCII + 컴포넌트 + API) | ✅ | [screens/phase2-assignment.md](screens/phase2-assignment.md) |

### 프론트엔드 코드 스켈레톤

| 파일 | 화면 | 상태 |
|------|------|------|
| `frontend/app/(host)/sets/[setId]/deploy/page.tsx` | S-09 배포 설정 (과제 탭 확장) | ✅ |
| `frontend/app/(play)/assignments/page.tsx` | S-10 학생 과제 목록 | ✅ |
| `frontend/app/(play)/play/[sessionId]/assignment/page.tsx` | S-11 과제 플레이 (이어하기+제출 팝업) | ✅ |
| `frontend/app/(host)/sessions/[sessionId]/submissions/page.tsx` | S-12 제출 현황 대시보드 | ✅ |
| `frontend/components/play/SubmitConfirmModal.tsx` | 제출 확인 팝업 | ✅ |
| `frontend/components/play/AssignmentCard.tsx` | 과제 카드 컴포넌트 | ✅ |
| `frontend/components/host/SubmissionStatusBoard.tsx` | 제출 현황 요약 카드 | ✅ |

### Phase 2 남은 작업 (실제 개발 시 연결 필요)

| 항목 | 설명 |
|------|------|
| `/api/assignments` 엔드포인트 | 본인 과제 목록 반환 (세션 + myResult 포함) |
| `/api/sessions/[id]/my-result` | 본인 결과 조회 |
| `/api/sessions/[id]/answer` | 과제 개별 답변 저장 |
| `/api/sessions/[id]/submit` | 과제 최종 제출 |
| `/api/sessions/[id]/close` | Host 마감 처리 |
| 과제 알림 이메일 발송 로직 | 배포 시 그룹 멤버 자동 발송 |

---

## Phase 3 — 그룹 & 리포트 (5개 화면) ✅

> 목표: 그룹 관리 + 배포 이력 + 문항별·학생별 리포트 분석

### 기획·스펙

| 항목 | 상태 | 파일 |
|------|------|------|
| 화면 흐름 | ✅ | [product-spec.md](product-spec.md) |
| 기능 정의표 | ✅ | [product-spec.md](product-spec.md) |
| 화면별 스펙 | ✅ | [screens/phase3-group-report.md](screens/phase3-group-report.md) |

### 프론트엔드 코드 스켈레톤

| 파일 | 화면 | 상태 |
|------|------|------|
| `frontend/app/(host)/groups/page.tsx` | S-13 그룹 목록 | ✅ |
| `frontend/app/(host)/groups/[groupId]/page.tsx` | S-14 그룹 상세 | ✅ |
| `frontend/app/(host)/dashboard/history/page.tsx` | S-15 배포 히스토리 | ✅ |
| `frontend/app/(host)/sessions/[sessionId]/report/questions/page.tsx` | S-16 리포트 (문항별) | ✅ |
| `frontend/app/(host)/sessions/[sessionId]/report/students/page.tsx` | S-17 리포트 (학생별) | ✅ |

### Phase 3 남은 작업 (실제 개발 시 연결 필요)

| 항목 | 설명 |
|------|------|
| `npm install recharts` | 문항별 리포트 차트 라이브러리 |
| `/api/groups` CRUD | 그룹 생성·목록·삭제 |
| `/api/groups/[id]/invite` | 멤버 초대 이메일 발송 |
| `/api/groups/[id]/guest-link` | 게스트 링크 생성 |
| `/api/sessions/[id]/report/questions` | 문항별 정답률·분포 |
| `/api/sessions/[id]/report/students` | 학생별 점수·응답 내역 |

---

## Phase 4 — 추후 기능 (개발 시점 미정)

| 기능 | 관련 스펙 |
|------|-----------|
| AI 저작 (문항 자동 생성) | product-spec.md 에디터 섹션 |
| 미디어 첨부 (이미지 업로드) | product-spec.md 에디터 섹션 |
| 교육과정 태깅 | product-spec.md 에디터 섹션 |
| 세트지 공유 (타 교사) | product-spec.md 세트지 목록 섹션 |
| 비바샘 SSO | data-model.md `join_type` |
| 랭킹 마감 후 공개 (과제) | product-spec.md 결과화면 섹션 |
| 마감 연장 | product-spec.md 히스토리 섹션 |
| 난이도 자동 산출 (AI) | data-model.md 리포트 섹션 |

---

## 전체 파일 구조

```
c:/Game/
├── docs/
│   ├── progress.md                          ← 이 파일 (진행 현황)
│   ├── spec-summary.md                      ← 소통용 스펙 요약
│   ├── product-spec.md                      ← 화면 흐름 + 기능 정의표 + 정책
│   ├── data-model.md                        ← DB 스키마 + 학습 데이터
│   └── screens/
│       ├── phase1-live-core.md              ✅
│       ├── phase2-assignment.md             ✅
│       └── phase3-group-report.md           ✅
└── frontend/                                ← Next.js 프로젝트
    ├── types/index.ts                       ✅
    ├── lib/
    │   ├── api.ts                           ✅
    │   └── websocket.ts                     ✅
    ├── app/
    │   ├── layout.tsx                       ✅ (루트)
    │   ├── (host)/
    │   │   ├── layout.tsx                   ✅ (GNB)
    │   │   ├── dashboard/page.tsx           ✅ S-01
    │   │   ├── sets/page.tsx                ✅ S-02
    │   │   ├── sets/[setId]/edit/           ✅ S-03
    │   │   ├── sets/[setId]/deploy/         ✅ S-04 + S-09
    │   │   ├── live/[sessionId]/waiting/    ✅ S-05
    │   │   ├── live/[sessionId]/control/    ✅ S-07
    │   │   ├── groups/page.tsx             ✅ S-13
    │   │   ├── groups/[groupId]/page.tsx   ✅ S-14
    │   │   ├── dashboard/history/          ✅ S-15
    │   │   └── sessions/[sessionId]/
    │   │       ├── submissions/             ✅ S-12
    │   │       └── report/
    │   │           ├── questions/           ✅ S-16
    │   │           └── students/            ✅ S-17
    │   └── (play)/
    │       ├── layout.tsx                   ✅
    │       ├── play/[sessionId]/page.tsx    ✅ S-06 (라이브)
    │       ├── play/[sessionId]/assignment/ ✅ S-11 (과제)
    │       ├── assignments/page.tsx         ✅ S-10
    │       └── result/[sessionId]/          ✅ S-08
    └── components/
        ├── common/
        │   ├── GNB.tsx                      ✅
        │   └── EmptyState.tsx               ✅
        ├── host/
        │   ├── QuestionSetCard.tsx          ✅
        │   ├── SetListItem.tsx              ✅
        │   ├── RecentDeployBanner.tsx       ✅
        │   ├── QuestionEditor.tsx           ✅
        │   └── SubmissionStatusBoard.tsx    ✅
        └── play/
            ├── QuestionDisplay.tsx          ✅
            ├── Countdown.tsx               ✅
            ├── AssignmentCard.tsx           ✅
            └── SubmitConfirmModal.tsx       ✅
```

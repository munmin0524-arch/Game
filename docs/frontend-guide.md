# 프론트엔드 구조 가이드

> 업데이트: 2026-03-04 (에디터 개편 반영)
> 목적: 개발 시작 전 구조 파악 + 개선 체크리스트

---

## 실행 방법

```bash
cd c:/Game/frontend
npm install       # 최초 1회
npm run dev       # 개발 서버 시작 → http://localhost:3000
```

---

## 폴더 구조

```
frontend/
├── app/                         ← Next.js 14 App Router 페이지
│   ├── layout.tsx               ← 루트 레이아웃 (ToastProvider 포함)
│   ├── globals.css              ← Tailwind + shadcn CSS 변수
│   ├── (host)/                  ← 교사(Host) 전용 라우트 그룹
│   │   ├── layout.tsx           ← GNB + 회색 배경
│   │   ├── dashboard/           ← S-01 홈
│   │   ├── sets/                ← S-02 세트지 목록
│   │   ├── sets/[setId]/edit/   ← S-03 문항 에디터
│   │   ├── sets/[setId]/deploy/ ← S-04/S-09 배포 설정
│   │   ├── live/[sessionId]/    ← S-05 대기, S-07 컨트롤
│   │   ├── groups/              ← S-13 그룹 목록
│   │   ├── groups/[groupId]/    ← S-14 그룹 상세
│   │   ├── dashboard/history/   ← S-15 배포 히스토리
│   │   └── sessions/[sessionId]/
│   │       ├── submissions/     ← S-12 제출 현황
│   │       └── report/
│   │           ├── questions/   ← S-16 문항별 리포트
│   │           └── students/    ← S-17 학생별 리포트
│   ├── (play)/                  ← 학생 플레이 라우트 그룹
│   │   ├── layout.tsx           ← 어두운 배경, GNB 없음
│   │   ├── play/[sessionId]/    ← S-06 라이브 플레이
│   │   ├── play/[sessionId]/assignment/ ← S-11 과제 플레이
│   │   ├── assignments/         ← S-10 과제 목록
│   │   └── result/[sessionId]/  ← S-08 결과/랭킹
│   └── api/                     ← Next.js API Routes (현재: 목업 데이터)
│       ├── question-sets/       ← 세트지 CRUD
│       ├── sessions/            ← 세션 CRUD + 서브 라우트
│       ├── groups/              ← 그룹 CRUD
│       └── assignments/         ← 과제 목록
├── components/
│   ├── common/
│   │   ├── GNB.tsx              ← 상단 내비게이션
│   │   └── EmptyState.tsx       ← 빈 상태 공통
│   ├── host/
│   │   ├── QuestionSetCard.tsx  ← 세트지 카드 (대시보드)
│   │   ├── SetListItem.tsx      ← 세트지 목록 행
│   │   ├── RecentDeployBanner.tsx ← 최근 배포 배너
│   │   ├── QuestionEditor.tsx   ← 문항 편집 폼
│   │   └── SubmissionStatusBoard.tsx ← 제출 현황 요약
│   ├── play/
│   │   ├── QuestionDisplay.tsx  ← 문항 렌더링 (MC/OX/단답)
│   │   ├── Countdown.tsx        ← 타이머
│   │   ├── AssignmentCard.tsx   ← 과제 카드
│   │   └── SubmitConfirmModal.tsx ← 제출 확인 팝업
│   └── ui/                      ← shadcn/ui 컴포넌트
│       ├── button, input, label, badge, progress
│       ├── dialog, alert-dialog, dropdown-menu
│       ├── select, tabs, checkbox, radio-group
│       ├── skeleton, separator, switch, textarea
│       └── use-toast, toaster
├── lib/
│   ├── api.ts                   ← API 클라이언트 (fetch 래퍼)
│   ├── utils.ts                 ← cn() 유틸
│   └── websocket.ts             ← Socket.io 유틸 (라이브 전용)
└── types/
    └── index.ts                 ← 전체 TypeScript 타입
```

---

## 현재 상태: 목업(Mock) 모드

`app/api/` 폴더의 Next.js API Routes가 **하드코딩된 더미 데이터**를 반환합니다.
실제 백엔드 연결 시에는 이 파일들을 프록시로 교체하거나 삭제합니다.

| 목업 데이터 내용 | 파일 |
|-----------------|------|
| 세트지 3개 (수학/영어/과학) | `api/question-sets/route.ts` |
| 문항 4개 (객관식/OX/단답) | `api/question-sets/[setId]/route.ts` |
| 문항 수정·삭제 | `api/question-sets/[setId]/questions/[questionId]/route.ts` |
| 문항 순서 저장 | `api/question-sets/[setId]/questions/reorder/route.ts` |
| 문항 DB 전체 검색 (9개) | `api/question-bank/route.ts` |
| 그룹 3개 + 멤버 5명 | `api/groups/` |
| 세션 3개 (라이브1 + 과제2) | `api/sessions/route.ts` |
| 문항별 리포트 (정답률/분포) | `api/sessions/[id]/report/questions` |
| 학생별 리포트 (순위/응답 내역) | `api/sessions/[id]/report/students` |

---

## 알려진 이슈 및 개선 필요 사항

### 🔴 필수 수정 (백엔드 연결 전)

| 항목 | 현황 | 수정 방법 |
|------|------|----------|
| 인증(Auth) 없음 | 모든 페이지 미인증 접근 가능 | `(host)/layout.tsx`에 세션 확인 추가 |
| `useCurrentUser()` 미구현 | 결과화면에서 Host/학생 구분 불가 | 실제 인증 연동 후 구현 |
| WebSocket 미연결 | 라이브 플레이(S-06, S-07) 실시간 안됨 | 백엔드 Socket.io 서버 연결 필요 |
| 게스트 쿠키 처리 없음 | 과제 이어하기 로직 동작 안됨 | 실제 쿠키 발급 연동 필요 |

### 🟡 UX 개선 권장

| 항목 | 설명 |
|------|------|
| `recharts` 설치 확인 | S-16 문항별 리포트 차트 (`npm install recharts`) |
| QR 코드 표시 | S-05 대기화면 QR 이미지 실제 생성 필요 |
| 반응형 미세 조정 | 일부 테이블 모바일에서 가로 스크롤 |
| 에디터 미리보기 | S-03 "미리보기" 버튼 미연결 (플레이 화면 연동 필요) |

### 🟢 잘 동작하는 부분

- 모든 페이지 라우팅 및 레이아웃
- 목업 데이터 기반 UI 렌더링
- 검색/필터/정렬 UI
- 다이얼로그, 드롭다운, 토스트 등 UI 컴포넌트
- 학생별 리포트 클릭 펼침/닫힘
- **에디터 문항 CRUD** (추가·수정·삭제·복제·이동·셔플)
- **문항 불러오기** (question-bank 필터 검색 → 체크박스 선택 → 추가)

---

## 백엔드 연결 순서 (권장)

```
1단계: 인증 API 연결 (로그인/세션)
  → (host)/layout.tsx 가드 활성화

2단계: 세트지 CRUD 연결
  → app/api/question-sets/ 목업 → 실제 API 교체

3단계: 세션 생성/배포 연결
  → 라이브 배포 → QR 생성 → 대기화면 진입

4단계: WebSocket 연결
  → 라이브 플레이 실시간 동기화

5단계: 그룹/리포트 연결
  → 과제 배포 → 제출 현황 → 분석 리포트
```

---

## 진행 현황 확인

전체 Phase별 진행 상황 → [progress.md](progress.md)

| Phase | 내용 | 상태 |
|-------|------|------|
| Phase 1 | 라이브 핵심 (8화면) | ✅ 완료 |
| Phase 2 | 과제 기능 (4화면) | ✅ 완료 |
| Phase 3 | 그룹 & 리포트 (5화면) | ✅ 완료 |
| Phase 4 | AI 저작, SSO 등 | ⏳ 미정 |

---

## 변경 이력

### 2026-03-04 — 에디터(S-03) 개편

#### 추가된 API 라우트

| 파일 | 메서드 | 설명 |
|------|--------|------|
| `api/question-sets/[setId]/questions/[questionId]/route.ts` | PUT | 문항 수정 (draft 반환) |
| `api/question-sets/[setId]/questions/[questionId]/route.ts` | DELETE | 문항 삭제 (204) |
| `api/question-sets/[setId]/questions/reorder/route.ts` | PUT | 순서 저장 (`orderedIds[]`) |
| `api/question-bank/route.ts` | GET | 전체 문항 풀 검색 (`?search=&type=&subject=&excludeSetId=`) |

#### 에디터 페이지 (`app/(host)/sets/[setId]/edit/page.tsx`)

| 기능 | 이전 | 이후 |
|------|------|------|
| 문항 목록 액션 | 삭제만 | ▲▼ 이동 + 복제 + 삭제 (hover 표시) |
| 좌측 패널 툴바 | 없음 | 문항 불러오기 + 셔플 + 문항 수 |
| 문항 불러오기 | 없음 | Dialog: 검색·유형·과목 필터 + 체크박스 다중 선택 → 추가 |
| 셔플 | 없음 | Fisher-Yates 랜덤 셔플 |
| 복제 | 없음 | 선택 문항 바로 아래 복사본 삽입 |
| 이동 | GripVertical (비기능) | ▲▼ 버튼 배열 swap |
| 저장 오류 표시 | 정답 없음 텍스트 항상 표시 | 저장 시도 후에만 showAnswerError 표시 |
| onChange 타입 | `Partial<QuestionDraft>` | `QuestionDraft` (타입 일치) |

#### 검수 URL (개발 서버 기준)

| 화면 | URL |
|------|-----|
| 대시보드 | http://localhost:3000/dashboard |
| 세트지 목록 | http://localhost:3000/sets |
| 에디터 (수학 기초) | http://localhost:3000/sets/set-1/edit |
| 에디터 (영어 단어) | http://localhost:3000/sets/set-2/edit |

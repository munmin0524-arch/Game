# 배포 및 환경 설정

> 최종 업데이트: 2026-03-07

---

## 1. 배포 환경

| 항목 | 값 |
|------|---|
| 호스팅 | Vercel |
| Production URL | https://game-omega-hazel.vercel.app |
| 프레임워크 | Next.js 14 (App Router) |
| 빌드 커맨드 | `npm run build` (Vercel 자동) |
| Output | `.next/` (서버리스) |
| Node 버전 | 18.x |

---

## 2. 로컬 개발

```bash
cd frontend
npm install       # 의존성 설치 (최초 1회)
npm run dev       # http://localhost:3000

# 빌드 확인
npm run build     # 타입 에러/빌드 오류 확인
npm run start     # 프로덕션 모드 로컬 실행
```

### 캐시 문제 해결

빌드 후 이상한 에러가 날 때 (예: "Cannot find module './xxxx.js'"):

```bash
rm -rf .next      # Next.js 빌드 캐시 삭제
npm run dev       # 다시 시작
```

---

## 3. 환경변수

> 현재 Mock 모드이므로 환경변수 없이 동작. 백엔드 연동 시 아래 변수 필요.

### `.env.local` (로컬 개발)

```env
# API 서버
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# WebSocket 서버
NEXT_PUBLIC_WS_URL=http://localhost:8080

# 인증
NEXT_PUBLIC_AUTH_URL=http://localhost:8080/auth

# QR 코드 생성 (서버 사이드)
QR_BASE_URL=https://game-omega-hazel.vercel.app
```

### `.env.production` (Vercel)

```env
NEXT_PUBLIC_API_URL=https://api.example.com/api
NEXT_PUBLIC_WS_URL=https://api.example.com
NEXT_PUBLIC_AUTH_URL=https://api.example.com/auth
QR_BASE_URL=https://game-omega-hazel.vercel.app
```

### 변수 규칙

| 접두사 | 접근 범위 | 용도 |
|--------|----------|------|
| `NEXT_PUBLIC_` | 클라이언트 + 서버 | API URL 등 브라우저에서 사용 |
| (없음) | 서버만 | DB 연결, 시크릿 키 등 |

---

## 4. Vercel 설정

### 프로젝트 설정

| 항목 | 값 |
|------|---|
| Framework Preset | Next.js |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

### 도메인

| 도메인 | 용도 |
|--------|------|
| `game-omega-hazel.vercel.app` | 기본 (자동 생성) |
| (커스텀 도메인) | TODO: 프로덕션 출시 시 설정 |

### 환경변수 설정

Vercel Dashboard > Settings > Environment Variables에서 설정.
Production / Preview / Development 환경별로 다른 값 지정 가능.

---

## 5. 브랜치 전략

| 브랜치 | 용도 | Vercel 배포 |
|--------|------|------------|
| `main` | 프로덕션 | Production 자동 배포 |
| `feature/*` | 기능 개발 | Preview 배포 (PR 시) |

---

## 6. 백엔드 연동 체크리스트

백엔드를 실제 연결할 때 순서:

```
1단계: 환경변수 설정
  - .env.local에 API_URL, WS_URL 추가
  - lib/api.ts의 fetch baseURL 변경

2단계: 인증 연동
  - (host)/layout.tsx에 세션 가드 활성화
  - 로그인/로그아웃 페이지 추가

3단계: 퀴즈 CRUD 연동
  - app/api/question-sets/* 라우트를 실제 API로 교체

4단계: 세션/게임 연동
  - 세션 생성 -> QR 실제 생성 -> 대기화면

5단계: WebSocket 연동
  - lib/websocket.ts의 서버 URL 변경
  - 라이브 플레이(S-06) + 컨트롤 패널(S-07) 실시간 동기화

6단계: 리포트/과제
  - 리포트 API 연동
  - 과제 배포/제출 연동
```

---

## 7. 알려진 이슈

| 이슈 | 상태 | 설명 |
|------|------|------|
| `.next` 캐시 오염 | 해결 방법 있음 | 대규모 파일 변경 후 `rm -rf .next` 필요 |
| QR 코드 | Mock | 실제 QR 이미지 생성 미구현 (base64 placeholder) |
| WebSocket | Mock | 실시간 통신 미동작 (이벤트 핸들러만 구현) |
| 인증 | 미구현 | 모든 페이지 미인증 접근 가능 |
| 게스트 쿠키 | 미구현 | 과제 이어하기 로직 미동작 |

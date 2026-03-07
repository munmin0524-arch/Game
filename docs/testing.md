# 테스트 전략

> 최종 업데이트: 2026-03-07
> 현재 상태: 테스트 미작성. 본 문서는 향후 테스트 작성 시 가이드.

---

## 1. 테스트 범위

### 우선순위별 테스트 대상

| 우선순위 | 대상 | 이유 |
|---------|------|------|
| **높음** | `lib/analysis.ts` | 분석 엔진 -- 순수 함수, 입출력 명확, 핵심 비즈니스 로직 |
| **높음** | 타입 정합성 | `npm run build`로 TypeScript 컴파일 에러 확인 |
| **중간** | API Route Handler | 요청/응답 형식, 필터/페이지네이션 로직 |
| **중간** | 컴포넌트 렌더링 | 핵심 컴포넌트 스냅샷/스모크 테스트 |
| **낮음** | E2E 플로우 | 퀴즈 제작 -> 게임 진행 -> 결과 확인 전체 흐름 |

---

## 2. 도구 추천

| 도구 | 용도 | 설치 |
|------|------|------|
| **Jest** | 유닛 테스트 (함수, 로직) | `npm i -D jest @types/jest ts-jest` |
| **React Testing Library** | 컴포넌트 테스트 | `npm i -D @testing-library/react @testing-library/jest-dom` |
| **Playwright** (또는 Cypress) | E2E 테스트 | `npm i -D @playwright/test` |

---

## 3. 테스트 파일 구조

```
frontend/
├── __tests__/
│   ├── lib/
│   │   └── analysis.test.ts        # 분석 엔진 유닛 테스트
│   ├── api/
│   │   └── sessions.test.ts        # API 라우트 테스트
│   └── components/
│       ├── StudentGrid.test.tsx     # 컴포넌트 테스트
│       └── QuestionAnalyticsPanel.test.tsx
├── e2e/
│   ├── quiz-creation.spec.ts       # 퀴즈 제작 플로우
│   ├── live-game.spec.ts           # 라이브 게임 플로우
│   └── report.spec.ts              # 리포트 확인 플로우
└── jest.config.ts
```

---

## 4. 분석 엔진 테스트 (최우선)

`lib/analysis.ts`의 순수 함수를 테스트:

```typescript
// __tests__/lib/analysis.test.ts

import {
  calcQuestionSummary,
  calcQuestionBars,
  calcStudentPattern,
  getPatternLabel,
  getCoachingLabel,
  calcStreaks,
} from '@/lib/analysis'

describe('calcStudentPattern', () => {
  it('정답률 높고 시간 충분 -> 이해+성실', () => {
    const pattern = calcStudentPattern(events, avgTime)
    expect(pattern.understands).toBe(true)
    expect(pattern.diligent).toBe(true)
  })

  it('정답률 낮고 시간 빠름 -> 찍기', () => {
    const pattern = calcStudentPattern(fastWrongEvents, avgTime)
    expect(pattern.understands).toBe(false)
    expect(pattern.diligent).toBe(false)
  })
})

describe('getPatternLabel', () => {
  it('understands + diligent -> 이해', () => {
    expect(getPatternLabel({ understands: true, diligent: true, ... })).toBe('이해')
  })

  it('!understands + !diligent -> 찍기', () => {
    expect(getPatternLabel({ understands: false, diligent: false, ... })).toBe('찍기')
  })
})

describe('calcStreaks', () => {
  it('연속 정답 5개 감지', () => {
    const { maxCorrect } = calcStreaks(fiveCorrectEvents)
    expect(maxCorrect).toBe(5)
  })
})
```

### 임계값 경계 테스트

| 테스트 | 입력 | 기대 결과 |
|--------|------|----------|
| 정답률 정확히 60% | accuracy=0.60 | understands=true |
| 정답률 59% | accuracy=0.59 | understands=false |
| 시간 정확히 50% | time=avg*0.5 | diligent=true |
| 연속오답 3회 | streak=3 | needsHelp=true |
| 연속오답 2회 | streak=2 | needsHelp=false (정답률에 따라) |

---

## 5. 빌드 테스트 (현재 가능)

현재도 실행 가능한 가장 기본적인 검증:

```bash
cd frontend
npm run build    # TypeScript 컴파일 + Next.js 빌드
```

이 명령이 성공하면:
- 모든 타입이 정합
- 모든 import 경로가 유효
- 모든 페이지가 빌드 가능

---

## 6. CI 파이프라인 (TODO)

Vercel이 자동 빌드하지만, PR 시 추가 검증:

```yaml
# .github/workflows/ci.yml (예시)
name: CI
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
      - run: cd frontend && npm test  # Jest (추후)
```

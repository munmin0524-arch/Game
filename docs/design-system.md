# 디자인 시스템

> 최종 업데이트: 2026-03-07
> UI 라이브러리: Tailwind CSS + shadcn/ui (Radix Primitives)

---

## 1. 색상 체계

### 기본 색상 (Tailwind 기본)

| 용도 | 색상 | 클래스 |
|------|------|--------|
| 배경 (페이지) | 회색 50 | `bg-gray-50` |
| 배경 (카드) | 흰색 | `bg-white` |
| 텍스트 (제목) | 회색 900 | `text-gray-900` |
| 텍스트 (본문) | 회색 700 | `text-gray-700` |
| 텍스트 (보조) | 회색 500 | `text-gray-500` |
| 구분선 | 회색 200 | `border-gray-200` |
| 프라이머리 | 파랑 600 | `bg-blue-600`, `text-blue-600` |
| 성공 | 초록 500 | `bg-green-500`, `text-green-600` |
| 경고 | 주황 500 | `bg-orange-500`, `text-orange-600` |
| 위험 | 빨강 500 | `bg-red-500`, `text-red-600` |

### 상태 색상

| 상태 | 배경 | 텍스트 | 사용처 |
|------|------|--------|--------|
| 정답 | `bg-green-100` | `text-green-700` | 리포트 정답 표시 |
| 오답 | `bg-red-100` | `text-red-700` | 리포트 오답 표시 |
| 미응답 | `bg-gray-100` | `text-gray-500` | 리포트 미응답 |
| 진행 중 | `bg-blue-100` | `text-blue-700` | 세션 상태 |
| 완료 | `bg-green-100` | `text-green-700` | 세션 상태 |
| 대기 | `bg-yellow-100` | `text-yellow-700` | 세션 상태 |

### 뱃지 색상

| 뱃지 | 배경 | 테두리 | 텍스트 |
|------|------|--------|--------|
| 우수 (star) | `bg-yellow-100` | `border-yellow-200` | `text-yellow-700` |
| 연속 오답 (struggling) | `bg-red-100` | `border-red-200` | `text-red-700` |
| 찍기 의심 (guessing) | `bg-orange-100` | `border-orange-200` | `text-orange-700` |
| 진행 느림 (slow) | `bg-gray-100` | `border-gray-200` | `text-gray-600` |

### 패턴/코칭 라벨 색상

| 라벨 | 배경 | 텍스트 |
|------|------|--------|
| 이해 | `bg-blue-100` | `text-blue-700` |
| 성실 | `bg-green-100` | `text-green-700` |
| 찍기 | `bg-orange-100` | `text-orange-700` |
| 미이해 | `bg-red-100` | `text-red-700` |
| 도움 필요 | `bg-red-100` | `text-red-700` |
| 칭찬 필요 | `bg-yellow-100` | `text-yellow-700` |
| 관찰 | `bg-gray-100` | `text-gray-600` |
| 양호 | `bg-green-100` | `text-green-700` |

---

## 2. 타이포그래피

Tailwind 기본 폰트 스택 사용 (시스템 폰트).

| 용도 | 클래스 | 예시 |
|------|--------|------|
| 페이지 제목 | `text-2xl font-bold` | 홈 대시보드 |
| 섹션 제목 | `text-lg font-semibold` | 최근 퀴즈 |
| 카드 제목 | `text-base font-semibold` | 수학 1단원 |
| 본문 | `text-sm` | 일반 텍스트 |
| 보조 텍스트 | `text-xs text-gray-500` | 날짜, 메타 정보 |
| 뱃지 텍스트 | `text-[10px] font-semibold` | 우수, 연속오답 |
| 통계 숫자 | `text-3xl font-bold` | 85% |

---

## 3. shadcn/ui 컴포넌트

`frontend/components/ui/` 에 설치된 21개 컴포넌트:

| 컴포넌트 | 파일 | 주요 사용처 |
|---------|------|------------|
| `Button` | `button.tsx` | 모든 버튼 (variant: default/outline/ghost/destructive) |
| `Card` | `card.tsx` | 대시보드 카드, 퀴즈 카드 |
| `Dialog` | `dialog.tsx` | 모달 (학생 상세, 공유 설정 등) |
| `AlertDialog` | `alert-dialog.tsx` | 확인 팝업 (삭제, 강제종료 등) |
| `DropdownMenu` | `dropdown-menu.tsx` | 더보기 메뉴 (...) |
| `Select` | `select.tsx` | 과목/학년/정렬 드롭다운 |
| `Input` | `input.tsx` | 텍스트 입력 |
| `Textarea` | `textarea.tsx` | 긴 텍스트 입력 (문제 내용) |
| `Badge` | `badge.tsx` | 상태 배지, 태그 |
| `Tabs` | `tabs.tsx` | 탭 전환 (게임별/그룹별, 문항별/학생별) |
| `Table` | `table.tsx` | 학생 테이블, 제출 현황 |
| `Switch` | `switch.tsx` | 토글 (오답 재도전, 힌트 사용) |
| `Slider` | `slider.tsx` | 시간 설정 |
| `Progress` | `progress.tsx` | 진행 바 |
| `Toast` | `toast.tsx` | 알림 메시지 |
| `Tooltip` | `tooltip.tsx` | 마우스오버 설명 |
| `Separator` | `separator.tsx` | 구분선 |
| `ScrollArea` | `scroll-area.tsx` | 스크롤 영역 |
| `Skeleton` | `skeleton.tsx` | 로딩 스켈레톤 |
| `Accordion` | `accordion.tsx` | 학생 상세 펼침 |
| `Checkbox` | `checkbox.tsx` | 문항 선택, 다중 선택 |

---

## 4. 레이아웃 패턴

### Host 레이아웃

```
+----------------------------------------------------------+
| GNB (h-16): [로고] [대시보드] [내퀴즈] [그룹] [광장] [지난게임] |
+----------------------------------------------------------+
| 페이지 콘텐츠 (max-w-7xl mx-auto p-6)                     |
+----------------------------------------------------------+
```

- GNB는 `(host)/layout.tsx`에서 렌더링
- `live/` 하위는 별도 레이아웃 (GNB 없음, `fixed inset-0 z-[9999]`)

### 컨트롤 패널 레이아웃

```
+-----------------------------------------------------------------------+
| HeaderControlBar (h-14)                                               |
+-----------------------------------------------------------------------+
| StudentGrid (flex-[3])             | QuestionAnalyticsPanel (flex-[2]) |
| + ReactionBar (하단 고정)           |                                   |
+-----------------------------------------------------------------------+
```

### 학생 플레이 레이아웃

- `(play)/` 라우트 그룹: GNB 없음
- 전체화면, 중앙 정렬

### 일반 페이지 간격

| 영역 | 클래스 |
|------|--------|
| 페이지 컨테이너 | `max-w-7xl mx-auto p-6` |
| 카드 간격 | `gap-4` 또는 `gap-6` |
| 섹션 간격 | `space-y-6` 또는 `space-y-8` |
| 카드 패딩 | `p-4` 또는 `p-6` |
| 카드 모서리 | `rounded-xl` |
| 카드 그림자 | `shadow-sm` (hover: `shadow-md`) |

---

## 5. 아이콘

Lucide React 사용.

| 아이콘 | 사용처 |
|--------|--------|
| `Play`, `Pause` | 게임 시작/일시정지 |
| `Users` | 참여자 수 |
| `Clock` | 경과 시간 |
| `CheckCircle` | 완료/정답 |
| `XCircle` | 오답 |
| `AlertTriangle` | 경고 |
| `ChevronLeft`, `ChevronRight` | 문항 네비게이션 |
| `Search` | 검색 |
| `Filter` | 필터 |
| `Plus` | 추가 |
| `MoreHorizontal` | 더보기 메뉴 |
| `Heart` | 좋아요 |
| `Download` | 다운로드 |
| `Share` | 공유 |
| `Flag` | 신고 |
| `QrCode` | QR 코드 |

---

## 6. 반응형 기준

현재 데스크톱 우선 설계. 모바일 대응은 학생 플레이 화면만.

| 화면 | 최소 너비 | 비고 |
|------|----------|------|
| Host 대시보드 | 1024px | 데스크톱 전용 |
| 컨트롤 패널 | 1280px | 2-패널 레이아웃 |
| 학생 플레이 | 320px | 모바일 우선 |
| 결과/랭킹 | 320px | 모바일 대응 |
| 퀴즈 광장 | 768px | 태블릿 이상 |

# UI/UX 개선 사항

> 업데이트: 2026-03-05
> 레퍼런스: Pildam (AI 수업자료 플랫폼)

---

## 디자인 개편 (2026-03-05)

### 적용된 변경

| 영역 | 이전 | 이후 |
|------|------|------|
| 기본 radius | `0.5rem` (8px) | `0.75rem` (12px) |
| 버튼 radius | `rounded-md` (6px) | `rounded-xl` (12px) |
| 카드 radius | `rounded-xl` (12px) | `rounded-2xl` (16px) |
| 그림자 | `shadow-sm` | `shadow-soft` (부드러운 큰 그림자) |
| 배경색 | `bg-gray-50` (#f9fafb) | `bg-slate-50` (#f8fafc) |
| Primary 색상 | 어두운 남색 hsl(222,47%,11%) | 파란색 hsl(217,91%,60%) |
| GNB | 직선적 border-b | 둥근 네비 + 호버 pill |
| 대시보드 | 단순 텍스트 + 카드 | 그라데이션 웰컴 배너 + 그라데이션 카드 |
| 입력 필드 | `rounded-md` (6px) | `rounded-xl` (12px) |
| Dialog | `rounded-lg` (8px) | `rounded-2xl` (16px) |

### 수정 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `globals.css` | CSS 변수: radius, primary 색상, soft shadow |
| `tailwind.config.js` | boxShadow 확장 (shadow-soft, shadow-card) |
| `components/ui/button.tsx` | 기본 radius → `rounded-xl`, 크기별 조정 |
| `components/ui/input.tsx` | `rounded-xl` 적용 |
| `components/ui/dialog.tsx` | `rounded-2xl` 적용 |
| `components/ui/select.tsx` | trigger/content `rounded-xl` 적용 |
| `components/common/GNB.tsx` | pill 스타일 탭, 부드러운 그림자 |
| `components/host/QuestionSetCard.tsx` | 그라데이션 배경 + `rounded-2xl` |
| `components/host/RecentDeployBanner.tsx` | `rounded-2xl` + soft shadow |
| `app/(host)/layout.tsx` | `bg-slate-50` 배경 |
| `app/(host)/dashboard/page.tsx` | 그라데이션 웰컴 배너 추가 |
| `app/(host)/sets/[setId]/edit/page.tsx` | 패널/카드 radius 증가 |

---

## 추가 개선 후보 (미적용)

| 항목 | 설명 | 우선순위 |
|------|------|---------|
| 멤버=호스트+참여자 역할 통합 | GNB에서 호스트/참여 뷰 전환 | 설계 필요 |
| 다크모드 | CSS 변수 기반 dark theme | 낮음 |
| 모바일 반응형 GNB | 햄버거 메뉴 or 하단 탭 | 중간 |
| 로딩 스켈레톤 통일 | Skeleton → shimmer 애니메이션 | 낮음 |
| 에디터 미리보기 버튼 | 플레이 화면 프리뷰 연결 | 중간 |
| 카드 일러스트 | 과목별 커스텀 일러스트 | 낮음 |

# 진행 현황 (Progress)

> 최종 업데이트: 2026-03-07

---

## Phase 1: 라이브 코어 ✅

> 수업용(라이브) 모드 핵심 화면 전체 스켈레톤 완성.

| 화면 | 라우트 | 상태 |
|------|--------|------|
| S-01 홈 대시보드 | `/dashboard` | ✅ 완료 |
| S-02 내 퀴즈 목록 | `/sets` | ✅ 완료 |
| S-03 에디터 (3단계 위자드) | `/sets/[setId]/edit` | ✅ 완료 |
| S-04 게임 설정 | `/sets/[setId]/deploy` | ✅ 완료 |
| S-05 QR 대기화면 | `/live/[sessionId]/waiting` | ✅ 완료 |
| S-06 라이브 플레이 | `/play/[sessionId]` | ✅ 완료 |
| S-07 컨트롤 패널 | `/live/[sessionId]/control` | ✅ 완료 |
| S-08 결과/랭킹 | `/result/[sessionId]` | ✅ 완료 |

---

## Phase M-1: 퀴즈 광장 ✅

| 화면 | 라우트 | 상태 |
|------|--------|------|
| S-M01 광장 홈 | `/marketplace` | ✅ 완료 |
| S-M02 검색 결과 | `/marketplace/search` | ✅ 완료 |
| S-M03 퀴즈 상세 | `/marketplace/[sharedSetId]` | ✅ 완료 |
| S-M04 내가 공유한 퀴즈 | `/marketplace/my` | ✅ 완료 |
| 컬렉션 | `/marketplace/collections` | ✅ 완료 |
| 북마크 | `/marketplace/bookmarks` | ✅ 완료 |
| 크리에이터 | `/marketplace/creator/[memberId]` | ✅ 완료 |

---

## Phase 1.5: 리포트/분석 재설계 ✅

> 지난 게임 구조 전면 재설계 + 분석 엔진 + 패턴/코칭 시스템.

| 항목 | 파일 | 상태 | 설명 |
|------|------|------|------|
| 타입 확장 | `types/index.ts` | ✅ | QuestionType 정리 (unscramble), 분석 타입 추가 |
| DB 모델 확장 | `docs/data-model.md` | ✅ | response_events 이벤트 로그 컬럼 4개 추가 |
| 분석 엔진 | `lib/analysis.ts` | ✅ | 패턴/코칭/개념이해도/연속정답 계산 함수 10개 |
| 문항별 리포트 | `report/questions/page.tsx` | ✅ | 스크롤 원페이지 (요약3섹션 + 상세 카드) |
| 학생별 리포트 | `report/students/page.tsx` | ✅ | 스크롤 원페이지 (패턴분포 + 아코디언) |
| 지난 게임 | `dashboard/history/page.tsx` | ✅ | 종합대시보드 + 게임별/그룹별 탭 |
| 그룹 상세 | `dashboard/groups/[groupId]/page.tsx` | ✅ | 누적현황 + 요약 + 리포트 리스트 |
| 학생 결과 뷰 | `result/[sessionId]/page.tsx` | ✅ | 패턴/코칭/연속정답 배지 추가 |
| QuestionType 정리 | 컴포넌트 전체 | ✅ | short_answer/fill_in_blank → unscramble 교체 |

---

## Phase 2: 과제 모드 ⏳

> 수업용 완성 후 진행 예정.

| 항목 | 상태 |
|------|------|
| 과제 배포 설정 확장 | ⏳ 미착수 |
| 학생 과제 목록 (S-10) | ⏳ 미착수 |
| 과제 플레이 (S-11) | ✅ 스켈레톤 완료 |
| 제출 현황 대시보드 (S-12) | ✅ 스켈레톤 완료 |
| 마감 처리 / 이어하기 | ⏳ 미착수 |

---

## 주요 결정 이력

| 날짜 | 결정 |
|------|------|
| 2026-03-07 | `short_answer`, `fill_in_blank` 폐지 → `unscramble`(단어 배열) 도입 |
| 2026-03-07 | 리포트를 스크롤 원페이지 방식으로 통일 (탭 전환 대신) |
| 2026-03-07 | 학생 패턴 분석: 2축 교차 (이해도 x 성실도) → 4개 패턴 라벨 |
| 2026-03-07 | 코칭 라벨: 패턴에서 파생 (도움필요/칭찬필요/관찰/양호) |
| 2026-03-07 | 지난 게임: 단순 리스트 → 종합대시보드 + 게임별/그룹별 탭 |
| 2026-03-07 | response_events: 1문항=1레코드 → 1문항=N이벤트 (이벤트 로그) |

---

## 문서 구조

| 문서 | 경로 | 내용 |
|------|------|------|
| 기획 스펙 | `docs/SPEC.md` | 화면별 기능 상세, 정책, API 목록, 와이어프레임 |
| 데이터 모델 | `docs/data-model.md` | DB 스키마 16개 테이블, ERD, 주요 쿼리 |
| 프론트엔드 아키텍처 | `docs/frontend-architecture.md` | 디렉토리 구조, 라우트 맵, 모듈/컴포넌트 설명, 데이터 흐름 |
| 진행 현황 | `docs/progress.md` | Phase별 완료 상태, 결정 이력 (이 파일) |

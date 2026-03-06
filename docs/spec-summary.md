# 스펙 요약 (소통용)

> 개발자·디자이너와 소통할 때 이 파일을 기준으로 사용하세요.
> 상세 내용은 각 링크된 파일을 참조.
> 업데이트: 2026-03-04

---

## 1. 서비스 한 줄 설명

> **교사(Host)가 퀴즈 세트를 만들고, 학생이 QR·링크로 참여하는 교육용 퀴즈 게임 플랫폼.**
> 라이브(실시간)와 과제(비동기) 두 가지 모드 지원.

---

## 2. 사용자 역할

| 역할 | 설명 | 식별 방식 | 접근 가능 화면 |
|------|------|-----------|---------------|
| **Host (교사)** | 세트지 제작·배포·리포트 조회 | 로그인 (UUID) | 대시보드 전체 |
| **Member (학생 계정)** | QR·링크로 참여. 학습 데이터 누적 | 로그인 (UUID) | 과제 목록 + 플레이 + 결과 |
| **Guest (비회원 학생)** | 가입 없이 QR·링크로 참여 | 이메일 + 닉네임 | 플레이 + 결과만 |

---

## 3. 핵심 플로우

```
[Host] 세트지 제작 → 배포 설정 → QR 생성
                                      ↓
[학생] QR 스캔 → 닉네임 입력 (Guest) / 로그인 (Member) → 대기
                                      ↓
[Host] 게임 시작 버튼 클릭
                                      ↓
[학생] 문항 풀기 (카운트다운 + 즉시 피드백)
                                      ↓
[Host] 실시간 컨트롤 (일시정지·건너뛰기·힌트 공개)
                                      ↓
[전체] 결과·랭킹 화면
                                      ↓
[Host] 리포트 분석 (문항별·학생별)
```

---

## 4. 배포 모드 비교

| 항목 | 라이브 (Live) | 과제 (Assignment) |
|------|--------------|-------------------|
| 진행 방식 | 교사 실시간 진행 | 학생이 기간 내 자율 진행 |
| 입장 방법 | QR·링크 (즉시) | QR·링크 (오픈 기간 내) |
| 교사 컨트롤 | 일시정지·건너뛰기·힌트 등 | 없음 |
| 이어하기 | 없음 | 있음 (UUID / 이메일+닉네임 기반) |
| 제출 횟수 | 1회 (자동) | **1회** (제출 확인 팝업) |
| 랭킹 공개 | 종료 즉시 | 마감 후 공개 (추후) |
| 정답 해설 | 즉시 | 공개 설정에 따라 |

---

## 5. 주요 정책 결정 사항

| 항목 | 결정 내용 |
|------|-----------|
| 점수 산정 | **첫 번째 시도 기준**. 재도전 이력은 별도 저장 (학습 분석용) |
| 동점자 처리 | **총 응답 시간 짧은 순** (점수 동일 시) |
| 무응답·skip | 점수 **제외** (0점 처리 아님) |
| 닉네임 중복 | **차단** — 재입력 요청 |
| Guest 식별 | **이메일+닉네임** PRIMARY. 쿠키는 재입력 생략 편의용 |
| Guest 재접속 | 이메일+닉네임 동일하면 다른 기기·브라우저여도 이어받기 |
| Guest = 기존 회원 이메일 | **로그인 유도 팝업** (게스트 유지 선택도 가능) |
| 기본 제한 시간 | **20초** |
| QR 유효시간 | **24시간** (Host가 재생성으로 갱신) |

→ 전체 정책: [product-spec.md — 4. 정책 결정 목록](product-spec.md)

---

## 6. 데이터베이스 테이블 요약 (11개)

| 테이블 | 역할 | 핵심 필드 |
|--------|------|-----------|
| `members` | Host + Member 인증 | member_id (UUID), email, nickname, role |
| `host_profiles` | 교사 전용 필드 | member_id, is_certified |
| `guests` | 비회원 참여자 | email, nickname, cookie_token |
| `groups` | 배포 대상 그룹 | host_member_id, name, type |
| `group_members` | 그룹↔멤버 연결 | group_id, member_id/guest_id |
| `question_sets` | 세트지 | host_member_id, title, subject |
| `questions` | 개별 문항 | set_id, type, content, answer |
| `sessions` | 배포·세션 설정 | set_id, session_type, status, time_limit_per_q |
| `participant_results` | 학생별 플레이 결과 | session_id, total_score, rank, total_response_time_sec |
| `response_events` | 문항별 응답 로그 | result_id, selected_answer, is_correct, response_time_sec |
| `report_view_logs` | 리포트 열람 기록 | host_member_id, session_id, report_type |

→ 상세 스키마: [data-model.md](data-model.md)

---

## 7. 실시간 통신 (WebSocket)

**사용 화면:** QR 대기화면, 플레이 화면, 컨트롤 패널

| 이벤트 | 방향 | 설명 |
|--------|------|------|
| `student:joined` | 서버 → Host | 학생 입장 실시간 반영 |
| `question:show` | 서버 → 학생 | 문항 표시 시작 |
| `answer:submit` | 학생 → 서버 | 응답 제출 |
| `answer:count-update` | 서버 → Host | N/N명 응답 실시간 집계 |
| `question:end` | 서버 → 학생 | 정오답 피드백 |
| `game:pause` / `game:resume` | Host → 서버 → 학생 | 일시정지·재개 |
| `question:skip` | Host → 서버 → 학생 | 문항 건너뛰기 |
| `hint:reveal` | Host → 서버 → 학생 | 힌트 공개 |
| `game:end` | 서버 → 전체 | 게임 종료 → 결과 화면 이동 |

→ 이벤트 타입 정의: [frontend/types/index.ts](../frontend/types/index.ts)

---

## 8. 화면 목록 전체

| Phase | # | 화면명 | 라우트 | 역할 | 스펙 |
|-------|---|--------|--------|------|------|
| **1** | S-01 | 홈 대시보드 | `/dashboard` | Host | ✅ |
| **1** | S-02 | 세트지 목록 | `/sets` | Host | ✅ |
| **1** | S-03 | 에디터 | `/sets/[setId]/edit` | Host | ✅ |
| **1** | S-04 | 배포 설정 (라이브) | `/sets/[setId]/deploy` | Host | ✅ |
| **1** | S-05 | QR 대기화면 | `/live/[sessionId]/waiting` | Host | ✅ |
| **1** | S-06 | 플레이 화면 | `/play/[sessionId]` | 학생 | ✅ |
| **1** | S-07 | 컨트롤 패널 | `/live/[sessionId]/control` | Host | ✅ |
| **1** | S-08 | 결과·랭킹 화면 | `/result/[sessionId]` | 전체 | ✅ |
| **2** | S-09 | 배포 설정 (과제 추가) | `/sets/[setId]/deploy` 확장 | Host | ⏳ |
| **2** | S-10 | 학생 과제 목록 | `/assignments` | Member | ⏳ |
| **2** | S-11 | 과제 플레이 | `/play/[sessionId]` 확장 | 학생 | ⏳ |
| **2** | S-12 | 제출 현황 대시보드 | `/sessions/[sessionId]/submissions` | Host | ⏳ |
| **3** | S-13 | 그룹 목록 | `/groups` | Host | ⏳ |
| **3** | S-14 | 그룹 상세 | `/groups/[groupId]` | Host | ⏳ |
| **3** | S-15 | 배포 히스토리 | `/dashboard/history` | Host | ⏳ |
| **3** | S-16 | 리포트 (문항별) | `/sessions/[sessionId]/report/questions` | Host | ⏳ |
| **3** | S-17 | 리포트 (학생별) | `/sessions/[sessionId]/report/students` | Host | ⏳ |

---

## 9. 미결 사항 (1개)

| # | 항목 | 결정 필요 시점 |
|---|------|---------------|
| P-10 | 단답형 오답 분포 시각화 방식 (텍스트 목록 vs 워드클라우드) | Phase 3 리포트 설계 전 |

---

## 10. 참조 문서

| 문서 | 내용 |
|------|------|
| [product-spec.md](product-spec.md) | 화면 흐름, 기능 정의표, 정책 전체 |
| [data-model.md](data-model.md) | DB 스키마, 학습 데이터, ERD, 쿼리 |
| [screens/phase1-live-core.md](screens/phase1-live-core.md) | Phase 1 화면별 상세 스펙 |
| [progress.md](progress.md) | Phase별 진행 현황 |
| [frontend/types/index.ts](../frontend/types/index.ts) | TypeScript 타입 정의 |
| [frontend/lib/api.ts](../frontend/lib/api.ts) | API 클라이언트 |

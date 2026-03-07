# 학생용 서비스 — 전체 설계 문서

## 서비스 개요

2개의 독립된 서비스로 구성. 문항 풀(DB)만 공유.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────┐          ┌─────────────────────────┐  │
│   │    수업용 서비스   │          │      학생용 서비스        │  │
│   │   (교사 중심)     │          │  (게임 + 맞춤형 학습 등)  │  │
│   │                  │          │                          │  │
│   │  교사 대시보드     │          │  학생 대시보드             │  │
│   │  퀴즈 만들기      │          │  게임하기 (NPC 대전)      │  │
│   │  라이브 게임 운영  │          │  맞춤형 학습 (Adaptive)   │  │
│   │  수업 리포트/분석  │          │  오답노트                │  │
│   │  학생 관리        │          │  보상 체계 (사탕/메달)    │  │
│   │                  │          │  캐릭터 시스템            │  │
│   │  학생: QR접속     │          │  내 학습 결과            │  │
│   │   → 라이브 플레이  │          │  학습 LMS              │  │
│   └────────┬─────────┘          └──────────┬──────────────┘  │
│            │                                │                │
│            └────────────┬───────────────────┘                │
│                         │                                    │
│                 ┌───────┴───────┐                            │
│                 │  공유 문항 풀   │                            │
│                 │  (questions)  │                            │
│                 └───────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

- **수업용**: 교사가 퀴즈를 만들고, 라이브로 운영하고, 결과를 분석. 학생은 QR/링크로 접속해서 실시간 참여만. (기존 완료)
- **학생용**: 학생이 혼자서 로그인 후 사용하는 통합 학습 서비스. 게임, 맞춤형 학습, 오답노트, 보상, 캐릭터, 학습 결과가 하나의 앱 안에서 동작. (신규)

---

## 1. 학생용 서비스 — 화면 구조

### 상단 네비게이션 (메인 탭 5개)

```
┌──────────────────────────────────────────────────────────┐
│   홈    게임하기    학습보상    캐릭터    내 결과             │
└──────────────────────────────────────────────────────────┘
```

| 탭 | 라우트 | 역할 |
|----|--------|------|
| 홈 | `/student` | 오늘의 할일 + 진도 현황 + 학습보상 미리보기 |
| 게임하기 | `/student/games` | 자동매칭 / 직접선택 / 맞춤형 학습 |
| 학습보상 | `/student/rewards` | 일일 달성 목표 + 보상 수령 |
| 캐릭터 | `/student/characters` | 캐릭터 초대 + 변경 |
| 내 결과 | `/student/my-result` | 누적 학습 통계 + 메달 |

---

### 전체 화면 맵

```
(student)/
├── layout.tsx                          → 공통 레이아웃 (상단 5탭 네비)
│
├── page.tsx                            → S-01 홈 (오늘의 할일)
│   ├── 자동 매칭 학습 목표 카드
│   ├── 오늘의 진도 (N/60문제, 정답률%)
│   ├── 오늘의 학습보상 미리보기 (달성 3/5 등 요약)
│   │   └── 클릭 → /student/rewards (학습보상 탭)
│   ├── "학습 게임 하러 가기" 버튼
│   └── "직접 학습 선택" 버튼 → /student/select
│
├── select/page.tsx                     → S-02 학습 내용 선택
│   ├── 과목 드롭다운
│   ├── Level 드롭다운 (Level 1, 2, 3...)
│   ├── Lesson 리스트 (달성마크 + 보상사탕)
│   └── "학습 게임 하러 가기" → /student/games
│
├── games/page.tsx                      → S-03 게임 선택 (통합)
│   ├── [자동매칭 게임] 섹션
│   │   └── 자동 매칭된 학습 범위로 바로 게임 시작
│   ├── [직접선택 게임] 섹션
│   │   ├── 줄다리기 / 보트레이싱 / 킥보드 / 풍선 (캐러셀)
│   │   └── 각각 "게임하기" → /student/game-play/[id]
│   ├── [맞춤형 학습] 섹션
│   │   ├── "AI 맞춤 학습" 카드
│   │   └── "시작하기" → /student/game-adaptive/[id]
│   └── 하단 "캐릭터 바꾸기"
│
├── game-play/[sessionId]/page.tsx      → S-04 게임 플레이
│   ├── NPC(AI봇) 대전 구조
│   ├── 기존 QuestionDisplay 재활용
│   ├── 문항 이동 X, 답안 수정 X (즉시 채점)
│   ├── 팀 점수 + 내 점수 + 문항번호/총문항
│   └── 완료 → /student/game-result/[id]
│
├── game-adaptive/[sessionId]/page.tsx  → S-05 맞춤형 학습 플레이
│   ├── Adaptive Learning 로직
│   ├── 문항 이동 O, 답안 수정 O, 최종 제출 O
│   ├── 현재 난이도 표시
│   ├── 연속 정답2→난이도+1, 연속 오답2→난이도-1
│   ├── 종료 조건 도달 시 자동 종료
│   └── 완료 → /student/game-result/[id]
│
├── game-result/[sessionId]/page.tsx    → S-06 게임 결과
│   ├── 게임: 승리/패배 + 시상식 (포디움)
│   ├── 맞춤형 학습: 난이도 변화 요약
│   └── "다음" → /student/rewards
│
├── rewards/page.tsx                    → S-07 학습보상
│   ├── 5개 달성 목표 카드
│   │   ├── 1. 오늘도 출석 (100%)
│   │   ├── 2. 게임 종류 다 하기 (4/4)
│   │   ├── 3. 문제 N개 풀기 (진행/목표)
│   │   ├── 4. 정답률 80% 달성
│   │   └── 5. 오답노트 풀기 (진행/목표)
│   ├── 달성 → "달성" 버튼 클릭으로 완료
│   ├── 모두 달성 → "완료 보상 / 죽순사탕" 수령
│   ├── 미달성 시 보상 클릭 → 팝업 "목표를 달성해주세요"
│   └── 오답노트 바로가기 → /student/wrong-notes
│
├── wrong-notes/page.tsx                → S-08 오답노트
│   ├── 게임 + 맞춤형 학습에서 틀린 문항 통합
│   ├── 문항 이동 O, 답안 수정 O, 최종 제출 O
│   ├── 정답 맞추면 오답 목록에서 제거
│   ├── 단원별 표시 ("여러 가지 힘" 등)
│   ├── 문항 카운트 (1/4)
│   ├── "오답노트 완료" 버튼
│   └── 접근 경로: 학습보상 탭 + 내 결과 탭 (양쪽에서 진입 가능)
│
├── characters/page.tsx                 → S-09 캐릭터 관리
│   ├── [내 캐릭터] 선택/변경 (캐러셀)
│   └── [캐릭터 초대]
│       ├── 캐릭터 카드 3장 (레서/팬더/덤덤)
│       ├── 각 캐릭터: 이름, 성격, 사탕 슬롯(4칸)
│       ├── 사탕 채우면 → "초대하기" 가능
│       ├── 초대 → 캐릭터 스토리 해금
│       └── 총 획득 젤리 수 표시
│
├── my-result/page.tsx                  → S-10 내 학습 결과
│   ├── 누적 통계: 총 문제수, 정답률, 출석일
│   ├── 메달 시스템 (동/은/금)
│   ├── 메달 가이드 (기준 안내)
│   ├── 학습 궤적 그래프 (시간별 변화)
│   ├── 오답노트 바로가기 → /student/wrong-notes
│   └── "학습 게임 하러 가기" 버튼
│
└── lms/                                → S-11 학습 LMS (학생 시점)
    ├── page.tsx                        → 내 학습 현황 대시보드
    │   ├── 모드별 학습량 (게임/맞춤형 학습/오답)
    │   ├── 단원별 이해도 히트맵
    │   ├── 주간/월간 학습 트렌드
    │   └── 취약 단원 알림
    ├── history/page.tsx                → 학습 이력
    │   ├── 날짜별 플레이 기록
    │   ├── 모드/과목 필터
    │   └── 각 세션 상세 보기
    └── analysis/page.tsx               → 내 분석 리포트
        ├── 패턴 분석 (이해도 x 성실도)
        ├── 코칭 라벨 (도움/칭찬 필요)
        ├── 난이도 적합성 (맞춤형 학습 결과 기반)
        └── 셀프 체크 리포트
```

---

## 2. 문항 풀이 방식 비교

| 구분 | 문항 노출 | 문항 이동 | 답안 입력 | 답안 수정 | 최종 제출 |
|------|---------|---------|---------|---------|---------|
| 수업용 (라이브) | O | X | O | X | X |
| 게임 (NPC대전) | O | X | O | X | X |
| 오답노트 | O | O | O | O | O |
| 맞춤형 학습 (Adaptive) | O | O | O | O | O |

---

## 3. 데이터 모델

### 3-A. 공유 (기존)
- `questions` — 문항 풀 (모든 서비스에서 공유)
- `question_sets` — 퀴즈 세트
- `guests` — 학생 정보

### 3-B. 학생용 (신규)

#### student_profiles (학생 프로필)
```
profile_id          UUID PK
member_id           UUID FK → guests
character_id        TEXT           -- 선택한 캐릭터
medal_grade         TEXT           -- none/bronze/silver/gold
total_questions     INT DEFAULT 0
total_correct       INT DEFAULT 0
attendance_days     INT DEFAULT 0
total_jelly         INT DEFAULT 0
created_at / updated_at
```

#### daily_goals (일일 학습 목표)
```
goal_id             UUID PK
member_id           UUID FK
date                DATE
target_unit         TEXT           -- 자동매칭 or 직접선택한 단원
target_accuracy     DECIMAL        -- 목표 정답률
target_questions    INT            -- 목표 문제 수
actual_questions    INT DEFAULT 0
actual_correct      INT DEFAULT 0
games_played        JSONB          -- 플레이한 게임 종류
attendance_done     BOOLEAN DEFAULT false
wrong_notes_done    BOOLEAN DEFAULT false
reward_claimed      BOOLEAN DEFAULT false
```

#### game_sessions (게임 세션 — 게임+맞춤형 학습 통합)
```
session_id          UUID PK
member_id           UUID FK
goal_id             UUID FK → daily_goals
mode                TEXT           -- game / adaptive
game_type           TEXT           -- tug_of_war / boat / kickboard / balloon / adaptive
character_id        TEXT
subject             TEXT           -- 과목
level               TEXT           -- Level 1, 2...
lesson              TEXT           -- Lesson 3...
status              TEXT           -- in_progress / completed
result              TEXT           -- win / lose / finished
score               INT
bot_score           INT            -- NPC 점수 (게임 모드)
start_difficulty    TEXT           -- 시작 난이도 (맞춤형 학습)
end_difficulty      TEXT           -- 종료 난이도 (맞춤형 학습)
started_at / completed_at
```

#### response_log (통합 응답 로그)
```
log_id              UUID PK
session_id          UUID FK
question_id         UUID FK → questions
mode                TEXT           -- game / adaptive / wrong_note
number              INT            -- 세션 내 문항 위치

-- 결과
result              BOOLEAN
continue_correct    INT            -- 연속 정답 수

-- 입력값
input_sequence      JSONB          -- [첫입력, 수정1, 수정2...]
input_count         INT            -- 수정 횟수
final_answer        TEXT

-- 시간값
time_first_input    DECIMAL        -- 문항노출 ~ 최초입력
time_modifications  JSONB          -- [수정1시간, 수정2시간...]
time_final_submit   DECIMAL        -- 마지막입력 ~ 최종제출
time_total          DECIMAL        -- 전체 풀이시간

-- 행동값
skip_count          INT DEFAULT 0  -- 건너뛰기 횟수
return_count        INT DEFAULT 0  -- 되돌아오기 횟수
retry_count         INT DEFAULT 0  -- 재시도 횟수

created_at
```

#### adaptive_difficulty_log (맞춤형 학습 난이도 변화)
```
log_id              UUID PK
session_id          UUID FK
question_id         UUID FK
step                INT            -- 몇 번째 문항
difficulty          TEXT           -- 현재 난이도
result              BOOLEAN
next_difficulty     TEXT           -- 다음 난이도
```

#### character_invites (캐릭터 초대)
```
invite_id           UUID PK
member_id           UUID FK
character_id        TEXT
candy_slots         JSONB          -- [candy1, candy2, candy3, candy4]
is_invited          BOOLEAN DEFAULT false
invited_at
```

#### learning_maps (학습맵)
```
map_id              UUID PK
subject             TEXT
depth1~depthN       TEXT           -- 계층별 분류
difficulty_levels   INT            -- 3(초등) or 4(중고등)
```

---

## 4. 핵심 로직

### 4-A. 게임 출제
- 학습맵 있으면 → 학습맵 기준
- 없으면 → 교과 과정 기준
- 난이도 필수
- 선택한 과목 > Level > Lesson 범위에서 출제

### 4-B. 맞춤형 학습 (Adaptive Learning)
- 최하위 뎁스 문항에서 시작
- 난이도 "하"에서 시작
- 연속 정답 2회 → 난이도 +1, 연속 오답 2회 → 난이도 -1, 교차 → 유지
- 종료 조건: 난이도 한계 도달 / 문항 소진

#### AI 추천 출제 비율
| 그룹 | 초등 (하:중:상) | 중고등 (하:중하:중:중상) |
|------|---------------|---------------------|
| 상 | 1:2:2 | 0:1:2:2 |
| 중 | 2:2:1 | 1:1:2:1 |
| 하 | 3:2:0 | 2:2:1:0 |
| 이력 없음 | 2:2:1 | 1:1:2:1 |

### 4-C. 분석 엔진

| 대분류 | 중분류 | 기준 |
|--------|--------|------|
| 패턴 | 이해도 | 정답률 + 풀이시간 → 안다/모른다 |
| 패턴 | 성실도 | 수정횟수 + 풀이시간 → 열심히/찍기 |
| 코칭 | 도움 | 패턴 파생 (부정적) |
| 코칭 | 칭찬 | 패턴 파생 (긍정적) |
| 셀프체크 | 난이도 적합성 | 맞춤형 학습 결과 파생 |

### 4-D. 보상 체계
- **일일 목표 5개**: 출석 / 게임 종류 / 문제 수 / 정답률 / 오답노트
- **사탕**: 레슨 완료 시 획득 → 캐릭터 초대에 사용
- **젤리**: 일일 목표 전체 달성 시 획득
- **메달**: 동/은/금 (출석일 + 누적문제 + 정답률 기준)

---

## 5. 구현 순서 (Phase별)

### Phase S-1: 학생용 기본 구조 + 게임 핵심
1. `(student)/layout.tsx` — 상단 5탭 네비게이션
2. S-01 홈 (오늘의 할일 + 학습보상 미리보기)
3. S-02 학습 선택 (과목/Level/Lesson)
4. S-03 게임 선택 (게임 4종 캐러셀 + 맞춤형 학습 카드)
5. S-04 게임 플레이 (QuestionDisplay 재활용, NPC 대전)
6. S-06 게임 결과

### Phase S-2: 보상 + 오답노트
7. S-07 학습보상 (5개 달성 카드 + 오답노트 바로가기)
8. S-08 오답노트 (이동/수정/제출 UI, 학습보상+내결과 양쪽 진입)

### Phase S-3: 캐릭터 + 메달
9. S-09 캐릭터 관리 (선택/변경 + 사탕으로 초대)
10. S-10 내 학습 결과 + 메달 시스템 (+ 오답노트 바로가기)

### Phase S-4: 맞춤형 학습
11. S-05 맞춤형 학습 플레이 (Adaptive Learning 로직)
12. S-03에 맞춤형 학습 섹션 연결

### Phase S-5: 학생 LMS
13. S-11 학습 현황 대시보드
14. 학습 이력 + 분석 리포트

---

## 6. 기술 구조

```
frontend/app/
  (host)/       ← 수업용: 교사 (기존)
  (play)/       ← 수업용: 학생 플레이 (기존)
  (student)/    ← 학생용: 게임+맞춤형학습+오답+보상+LMS (신규)
  api/          ← API 라우트

frontend/components/
  common/       ← 공용
  host/         ← 수업용 교사 전용
  play/         ← 수업용 플레이 전용
  student/      ← 학생용 전용 (StudentNav, GameCard, GoalCard, etc.)
  shared/       ← 모드간 공유 (QuestionDisplay 확장)

frontend/lib/
  analysis.ts   ← 분석 엔진 (기존 + 확장)
  adaptive.ts   ← Adaptive Learning 알고리즘
  rewards.ts    ← 보상 시스템
  questions.ts  ← 출제 로직 (학습맵/교과과정 기반)
```

---

## 7. 검증 체크리스트

- [ ] 게임 흐름: 홈 → 게임선택 → 플레이 → 결과 → 보상
- [ ] 맞춤형 학습 흐름: 게임선택 → AI맞춤 → 플레이(난이도조절) → 결과
- [ ] 오답노트: 틀린 문항 모아서 이동/수정/제출 (학습보상 + 내 결과 양쪽 진입)
- [ ] 보상: 5개 목표 달성 → 사탕/젤리 수령
- [ ] 캐릭터: 선택/변경 + 사탕으로 초대
- [ ] 메달: 누적 통계 기반 등급
- [ ] 학생 LMS: 학습현황 + 이력 + 분석
- [ ] 기존 수업용에 영향 없음
- [ ] `npm run build` 에러 없음

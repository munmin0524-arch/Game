// 세트지 선택 허브 — Mock 데이터 (백엔드 연결 전 폴백)
//
// TODO: 백엔드 `/api/sets/hub?source=...&...` 연결 시 삭제.
// 소스별 mock을 분리해 3개 소스를 한 허브에서 섞어 노출하는 시나리오를 지원한다.

import type { QuestionSet, Question } from '@/types'

// ─── 퀴즈파티 제공 (A안: 교과서 × 단원, B안: 공부력 테마) ───

export const MOCK_QUIZ_PARTY_SETS: QuestionSet[] = [
  // ── A안: 비상 교과서 × 중등 수학 ──
  { set_id: 'qp-math-01', host_member_id: 'quiz_party', title: '중1 수학 · I. 수와 연산 핵심 정리', subject: '수학', grade: '중등 수학 수학1', tags: ['수와연산', '정수'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 15, textbook: '비상 교과서', unit: 'I. 수와 연산', difficulty: '중', thumbnail_variant: 0, play_count: 482, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-math-02', host_member_id: 'quiz_party', title: '중1 수학 · II. 문자와 식 단원평가', subject: '수학', grade: '중등 수학 수학1', tags: ['문자와식', '일차식'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-05T09:00:00Z', question_count: 20, textbook: '비상 교과서', unit: 'II. 문자와 식', difficulty: '중', thumbnail_variant: 1, play_count: 312, rating_avg: 4.7, is_official: true, is_new: false, source: 'quiz_party' },
  { set_id: 'qp-math-03', host_member_id: 'quiz_party', title: '중1 수학 · III. 좌표평면과 그래프', subject: '수학', grade: '중등 수학 수학1', tags: ['좌표', '그래프'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-20T09:00:00Z', updated_at: '2026-03-28T09:00:00Z', question_count: 12, textbook: '비상 교과서', unit: 'III. 좌표평면과 그래프', difficulty: '하', thumbnail_variant: 2, play_count: 156, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-math-04', host_member_id: 'quiz_party', title: '중2 수학 · III. 일차함수 완전 정복', subject: '수학', grade: '중등 수학 수학2', tags: ['일차함수', '기울기'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-15T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 18, textbook: '비상 교과서', unit: 'III. 일차함수', difficulty: '상', thumbnail_variant: 3, play_count: 728, rating_avg: 4.9, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-math-05', host_member_id: 'quiz_party', title: '중2 수학 · IV. 확률 기초', subject: '수학', grade: '중등 수학 수학2', tags: ['확률', '경우의수'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-10T09:00:00Z', updated_at: '2026-03-22T09:00:00Z', question_count: 14, textbook: '비상 교과서', unit: 'IV. 확률', difficulty: '중', thumbnail_variant: 4, play_count: 245, rating_avg: 4.5, is_official: true, source: 'quiz_party' },

  // 천재 교과서
  { set_id: 'qp-math-06', host_member_id: 'quiz_party', title: '중1 수학 · I. 수와 연산 개념 확인 (천재)', subject: '수학', grade: '중등 수학 수학1', tags: ['정수', '유리수'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-05T09:00:00Z', updated_at: '2026-03-18T09:00:00Z', question_count: 16, textbook: '천재 교과서', unit: 'I. 수와 연산', difficulty: '중', thumbnail_variant: 5, play_count: 198, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-math-07', host_member_id: 'quiz_party', title: '중2 수학 · III. 일차함수 (미래엔)', subject: '수학', grade: '중등 수학 수학2', tags: ['일차함수'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-01T09:00:00Z', updated_at: '2026-03-12T09:00:00Z', question_count: 15, textbook: '미래엔 교과서', unit: 'III. 일차함수', difficulty: '중', thumbnail_variant: 0, play_count: 167, rating_avg: 4.5, is_official: true, source: 'quiz_party' },

  // 문제집
  { set_id: 'qp-math-08', host_member_id: 'quiz_party', title: '쎈 중2 유형별 핵심 20선', subject: '수학', grade: '중등 수학 수학2', tags: ['쎈', '유형'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-02-20T09:00:00Z', updated_at: '2026-03-30T09:00:00Z', question_count: 20, textbook: '쎈', unit: 'II. 식의 계산', difficulty: '상', thumbnail_variant: 2, play_count: 534, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-math-09', host_member_id: 'quiz_party', title: '개념원리 중1 핵심 개념 체크', subject: '수학', grade: '중등 수학 수학1', tags: ['개념원리'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-02-15T09:00:00Z', updated_at: '2026-03-28T09:00:00Z', question_count: 18, textbook: '개념원리', unit: 'I. 수와 연산', difficulty: '중', thumbnail_variant: 4, play_count: 289, rating_avg: 4.7, is_official: true, source: 'quiz_party' },

  // ── A안: 중등 영어 ──
  { set_id: 'qp-eng-01', host_member_id: 'quiz_party', title: '영어1 · Lesson 3 어휘+문법 종합', subject: '영어', grade: '중등 영어 영어1', tags: ['어휘', '문법'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-11T09:00:00Z', question_count: 18, textbook: '비상 교과서', unit: 'Lesson 3', difficulty: '중', thumbnail_variant: 1, play_count: 412, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-eng-02', host_member_id: 'quiz_party', title: '영어1 · Lesson 5 관계대명사 마스터', subject: '영어', grade: '중등 영어 영어1', tags: ['관계대명사', '문법'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-22T09:00:00Z', updated_at: '2026-04-02T09:00:00Z', question_count: 16, textbook: '비상 교과서', unit: 'Lesson 5', difficulty: '상', thumbnail_variant: 3, play_count: 356, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-eng-03', host_member_id: 'quiz_party', title: '영어2 · Lesson 2 듣기평가 대비', subject: '영어', grade: '중등 영어 영어2', tags: ['듣기'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-18T09:00:00Z', updated_at: '2026-03-29T09:00:00Z', question_count: 20, textbook: '비상 교과서', unit: 'Lesson 2', difficulty: '중', thumbnail_variant: 5, play_count: 298, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-eng-04', host_member_id: 'quiz_party', title: '영어2 · Lesson 4 독해 집중 훈련 (천재)', subject: '영어', grade: '중등 영어 영어2', tags: ['독해'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-10T09:00:00Z', updated_at: '2026-03-25T09:00:00Z', question_count: 15, textbook: '천재 교과서', unit: 'Lesson 4', difficulty: '상', thumbnail_variant: 0, play_count: 221, rating_avg: 4.5, is_official: true, source: 'quiz_party' },

  // ── B안: 공부력 테마 ──
  { set_id: 'qp-theme-eng-01', host_member_id: 'quiz_party', title: '공부력 영어 · 초등 필수 어휘 300', subject: '영어', grade: '초등 영어 5', tags: ['어휘', '초등'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-05T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 30, theme: '공부력-영어', difficulty: '하', thumbnail_variant: 1, play_count: 892, rating_avg: 4.9, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-theme-eng-02', host_member_id: 'quiz_party', title: '공부력 영어 · 초등 5학년 문법 기초', subject: '영어', grade: '초등 영어 5', tags: ['문법', '초등'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-28T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 25, theme: '공부력-영어', difficulty: '중', thumbnail_variant: 2, play_count: 445, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-theme-kor-01', host_member_id: 'quiz_party', title: '공부력 국어 · 초등 독해력 키우기 (설명문)', subject: '국어', grade: null, tags: ['독해', '설명문'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-02T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 20, theme: '공부력-국어', difficulty: '중', thumbnail_variant: 3, play_count: 612, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-theme-kor-02', host_member_id: 'quiz_party', title: '공부력 국어 · 맞춤법 OX 챌린지', subject: '국어', grade: null, tags: ['맞춤법', 'OX'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-25T09:00:00Z', updated_at: '2026-04-01T09:00:00Z', question_count: 25, theme: '공부력-국어', difficulty: '하', thumbnail_variant: 4, play_count: 789, rating_avg: 4.9, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-theme-voc-01', host_member_id: 'quiz_party', title: '공부력 어휘 · 초등 고학년 어휘 확장', subject: '국어', grade: null, tags: ['어휘', '초등'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-20T09:00:00Z', updated_at: '2026-04-07T09:00:00Z', question_count: 30, theme: '공부력-어휘', difficulty: '중', thumbnail_variant: 5, play_count: 523, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-theme-voc-02', host_member_id: 'quiz_party', title: '공부력 어휘 · 관용어·속담 정복', subject: '국어', grade: null, tags: ['관용어', '속담'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-15T09:00:00Z', updated_at: '2026-03-30T09:00:00Z', question_count: 20, theme: '공부력-어휘', difficulty: '중', thumbnail_variant: 0, play_count: 368, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-theme-han-01', host_member_id: 'quiz_party', title: '공부력 한자 · 8급 기출 50자 총정리', subject: '한자', grade: null, tags: ['한자8급', '읽기'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-18T09:00:00Z', updated_at: '2026-04-05T09:00:00Z', question_count: 25, theme: '공부력-한자', difficulty: '하', thumbnail_variant: 1, play_count: 412, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-theme-han-02', host_member_id: 'quiz_party', title: '공부력 한자 · 사자성어 60선', subject: '한자', grade: null, tags: ['사자성어'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-12T09:00:00Z', updated_at: '2026-04-01T09:00:00Z', question_count: 30, theme: '공부력-한자', difficulty: '중', thumbnail_variant: 2, play_count: 567, rating_avg: 4.9, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-theme-hist-01', host_member_id: 'quiz_party', title: '공부력 한국사 · 조선왕조 계보 퀴즈', subject: '한국사', grade: null, tags: ['조선', '왕조'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-22T09:00:00Z', updated_at: '2026-04-09T09:00:00Z', question_count: 20, theme: '공부력-한국사', difficulty: '중', thumbnail_variant: 3, play_count: 678, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-theme-hist-02', host_member_id: 'quiz_party', title: '공부력 한국사 · 독립운동가 열전', subject: '한국사', grade: null, tags: ['독립운동', '인물'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-08T09:00:00Z', updated_at: '2026-03-28T09:00:00Z', question_count: 18, theme: '공부력-한국사', difficulty: '중', thumbnail_variant: 4, play_count: 445, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-theme-math-01', host_member_id: 'quiz_party', title: '공부력 수학 · 초등 연산 스피드 테스트', subject: '수학', grade: null, tags: ['연산', '초등'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 40, theme: '공부력-수학', difficulty: '하', thumbnail_variant: 5, play_count: 1024, rating_avg: 4.9, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-theme-math-02', host_member_id: 'quiz_party', title: '공부력 수학 · 도형 개념 입문', subject: '수학', grade: null, tags: ['도형', '초등'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-15T09:00:00Z', updated_at: '2026-03-30T09:00:00Z', question_count: 20, theme: '공부력-수학', difficulty: '하', thumbnail_variant: 0, play_count: 356, rating_avg: 4.6, is_official: true, source: 'quiz_party' },

  // ── 초등 영어 5학년 — 개인화 row 용 (비상 포함 여러 교재) ──
  { set_id: 'qp-eng5-bisang-01', host_member_id: 'quiz_party', title: '비상 초5 영어 · Lesson 2 What time is it?', subject: '영어', grade: '초등 영어 5', tags: ['어휘', 'Lesson2'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-02T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 15, textbook: '비상 교과서', unit: 'Lesson 2', difficulty: '하', thumbnail_variant: 1, play_count: 378, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-eng5-bisang-02', host_member_id: 'quiz_party', title: '비상 초5 영어 · Lesson 4 How much is it?', subject: '영어', grade: '초등 영어 5', tags: ['질문표현'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-25T09:00:00Z', updated_at: '2026-04-06T09:00:00Z', question_count: 12, textbook: '비상 교과서', unit: 'Lesson 4', difficulty: '하', thumbnail_variant: 2, play_count: 256, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-eng5-cheonjae-01', host_member_id: 'quiz_party', title: '천재 초5 영어 · Lesson 3 What are you doing?', subject: '영어', grade: '초등 영어 5', tags: ['현재진행형'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-20T09:00:00Z', updated_at: '2026-04-04T09:00:00Z', question_count: 14, textbook: '천재 교과서', unit: 'Lesson 3', difficulty: '하', thumbnail_variant: 3, play_count: 198, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-eng5-mirae-01', host_member_id: 'quiz_party', title: '미래엔 초5 영어 · Lesson 5 My Family', subject: '영어', grade: '초등 영어 5', tags: ['가족', '어휘'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-18T09:00:00Z', updated_at: '2026-04-03T09:00:00Z', question_count: 13, textbook: '미래엔 교과서', unit: 'Lesson 5', difficulty: '하', thumbnail_variant: 4, play_count: 165, rating_avg: 4.5, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-eng5-donga-01', host_member_id: 'quiz_party', title: '동아 초5 영어 · Lesson 6 I like pizza', subject: '영어', grade: '초등 영어 5', tags: ['음식', '선호표현'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-15T09:00:00Z', updated_at: '2026-04-01T09:00:00Z', question_count: 12, textbook: '동아 교과서', unit: 'Lesson 6', difficulty: '하', thumbnail_variant: 5, play_count: 142, rating_avg: 4.5, is_official: true, source: 'quiz_party' },

  // ── 아이스브레이킹 ──
  { set_id: 'qp-ice-01', host_member_id: 'quiz_party', title: '🧊 수업 첫날 아이스브레이킹 OX', subject: null, grade: null, tags: ['아이스브레이킹', 'OX', '수업도입'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-05T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 10, difficulty: '하', thumbnail_variant: 0, play_count: 892, rating_avg: 4.9, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-ice-02', host_member_id: 'quiz_party', title: '🎉 우리반 이름 맞히기 빙고', subject: null, grade: null, tags: ['아이스브레이킹', '빙고'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-30T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 15, difficulty: '하', thumbnail_variant: 2, play_count: 556, rating_avg: 4.8, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-ice-03', host_member_id: 'quiz_party', title: '👋 오늘 기분 고르기 — 감정 스피드 퀴즈', subject: null, grade: null, tags: ['아이스브레이킹', '감정'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-01T09:00:00Z', updated_at: '2026-04-11T09:00:00Z', question_count: 8, difficulty: '하', thumbnail_variant: 4, play_count: 345, rating_avg: 4.7, is_official: true, is_new: true, source: 'quiz_party' },

  // ── 오늘의 유머 ──
  { set_id: 'qp-humor-01', host_member_id: 'quiz_party', title: '😂 웃긴 과학 상식 퀴즈', subject: '과학', grade: null, tags: ['유머', '과학상식'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-03T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 12, difficulty: '하', thumbnail_variant: 1, play_count: 678, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-humor-02', host_member_id: 'quiz_party', title: '😆 말장난 퀴즈 한국어 버전', subject: '국어', grade: null, tags: ['유머', '언어유희'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-28T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 15, difficulty: '하', thumbnail_variant: 3, play_count: 489, rating_avg: 4.7, is_official: true, source: 'quiz_party' },

  // ── 초등 수학 5학년 (개인화 row용: 비상·천재·미래엔·동아 교과서) ──
  { set_id: 'qp-math5-bisang-01', host_member_id: 'quiz_party', title: '비상 초5 수학 · 1단원 자연수의 혼합 계산', subject: '수학', grade: '초등 수학 5-1', tags: ['혼합계산', '단원평가'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-02T09:00:00Z', updated_at: '2026-04-12T09:00:00Z', question_count: 15, textbook: '비상 교과서', unit: '1. 자연수의 혼합 계산', difficulty: '중', thumbnail_variant: 0, play_count: 428, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-math5-bisang-02', host_member_id: 'quiz_party', title: '비상 초5 수학 · 2단원 약수와 배수', subject: '수학', grade: '초등 수학 5-1', tags: ['약수', '배수'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-26T09:00:00Z', updated_at: '2026-04-06T09:00:00Z', question_count: 14, textbook: '비상 교과서', unit: '2. 약수와 배수', difficulty: '중', thumbnail_variant: 2, play_count: 345, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-math5-bisang-03', host_member_id: 'quiz_party', title: '비상 초5 수학 · 3단원 규칙과 대응', subject: '수학', grade: '초등 수학 5-1', tags: ['규칙', '대응'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-20T09:00:00Z', updated_at: '2026-04-02T09:00:00Z', question_count: 12, textbook: '비상 교과서', unit: '3. 규칙과 대응', difficulty: '중', thumbnail_variant: 4, play_count: 267, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-math5-cheonjae-01', host_member_id: 'quiz_party', title: '천재 초5 수학 · 1단원 자연수 혼합 계산', subject: '수학', grade: '초등 수학 5-1', tags: ['혼합계산'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-22T09:00:00Z', updated_at: '2026-04-04T09:00:00Z', question_count: 14, textbook: '천재 교과서', unit: '1. 자연수의 혼합 계산', difficulty: '중', thumbnail_variant: 1, play_count: 198, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-math5-mirae-01', host_member_id: 'quiz_party', title: '미래엔 초5 수학 · 분수의 덧셈·뺄셈', subject: '수학', grade: '초등 수학 5-1', tags: ['분수', '덧셈뺄셈'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-18T09:00:00Z', updated_at: '2026-04-03T09:00:00Z', question_count: 13, textbook: '미래엔 교과서', unit: '5. 분수의 덧셈과 뺄셈', difficulty: '중', thumbnail_variant: 3, play_count: 175, rating_avg: 4.5, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-math5-donga-01', host_member_id: 'quiz_party', title: '동아 초5 수학 · 다각형의 둘레와 넓이', subject: '수학', grade: '초등 수학 5-1', tags: ['다각형', '넓이'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-15T09:00:00Z', updated_at: '2026-04-01T09:00:00Z', question_count: 15, textbook: '동아 교과서', unit: '6. 다각형의 둘레와 넓이', difficulty: '중', thumbnail_variant: 5, play_count: 142, rating_avg: 4.5, is_official: true, source: 'quiz_party' },

  // ── 수학 문제집 (쎈·개념원리·유형) — "이 문제집은 어떠세요?" row ──
  { set_id: 'qp-wb-ssen-01',   host_member_id: 'quiz_party', title: '쎈 초5 기본편 · 단원 종합 핵심 문항', subject: '수학', grade: '초등 수학 5-1', tags: ['쎈', '기본편'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-10T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 20, textbook: '쎈', unit: '기본편 1~3단원', difficulty: '중', thumbnail_variant: 0, play_count: 556, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-wb-ssen-02',   host_member_id: 'quiz_party', title: '쎈 초5 유형편 · 도형 파트', subject: '수학', grade: '초등 수학 5-1', tags: ['쎈', '유형편', '도형'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-08T09:00:00Z', updated_at: '2026-04-02T09:00:00Z', question_count: 18, textbook: '쎈', unit: '유형편 — 도형', difficulty: '상', thumbnail_variant: 2, play_count: 398, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-wb-gaenyeom-01', host_member_id: 'quiz_party', title: '개념원리 초5 · 단원 핵심 개념 점검', subject: '수학', grade: '초등 수학 5-1', tags: ['개념원리'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-06T09:00:00Z', updated_at: '2026-03-30T09:00:00Z', question_count: 16, textbook: '개념원리', unit: '핵심 개념', difficulty: '중', thumbnail_variant: 4, play_count: 312, rating_avg: 4.7, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-wb-gaenyeom-02', host_member_id: 'quiz_party', title: '개념원리 초5 · 연산 집중 훈련', subject: '수학', grade: '초등 수학 5-1', tags: ['개념원리', '연산'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-03T09:00:00Z', updated_at: '2026-03-28T09:00:00Z', question_count: 25, textbook: '개념원리', unit: '연산', difficulty: '중', thumbnail_variant: 1, play_count: 278, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-wb-yuhyeong-01', host_member_id: 'quiz_party', title: '유형 초5 · 서술형 대비 핵심 유형', subject: '수학', grade: '초등 수학 5-1', tags: ['유형', '서술형'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-01T09:00:00Z', updated_at: '2026-03-25T09:00:00Z', question_count: 14, textbook: '유형', unit: '서술형 대비', difficulty: '상', thumbnail_variant: 3, play_count: 234, rating_avg: 4.6, is_official: true, source: 'quiz_party' },
  { set_id: 'qp-wb-yuhyeong-02', host_member_id: 'quiz_party', title: '유형 초5 · 단원별 실전 유형', subject: '수학', grade: '초등 수학 5-1', tags: ['유형'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-02-25T09:00:00Z', updated_at: '2026-03-22T09:00:00Z', question_count: 20, textbook: '유형', unit: '단원별 실전', difficulty: '상', thumbnail_variant: 5, play_count: 189, rating_avg: 4.5, is_official: true, source: 'quiz_party' },

  // ── 신학기 진단 / 복습 (3~4월 학기 초) ──
  { set_id: 'qp-ns-01', host_member_id: 'quiz_party', title: '🎒 초5 신학기 진단평가 · 수학', subject: '수학', grade: '초등 수학 5-1', tags: ['신학기', '진단평가'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-05T09:00:00Z', updated_at: '2026-04-13T09:00:00Z', question_count: 20, difficulty: '중', thumbnail_variant: 0, play_count: 512, rating_avg: 4.8, is_official: true, is_new: true, source: 'quiz_party' },
  { set_id: 'qp-ns-02', host_member_id: 'quiz_party', title: '🎒 초5 신학기 국어 · 이전 학년 복습', subject: '국어', grade: null, tags: ['신학기', '복습'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-04-03T09:00:00Z', updated_at: '2026-04-11T09:00:00Z', question_count: 18, difficulty: '하', thumbnail_variant: 2, play_count: 389, rating_avg: 4.7, is_official: true, is_new: true, source: 'quiz_party' },
]

// ─── 내가 만든 세트지 ───

export const MOCK_MINE_SETS: QuestionSet[] = [
  { set_id: 'mine-01', host_member_id: 'me', title: '중1 정수와 유리수 단원평가', subject: '수학', grade: '중등 수학 수학1', tags: ['정수', '유리수'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-01T10:00:00Z', updated_at: '2026-04-10T14:30:00Z', question_count: 15, textbook: '비상 교과서', unit: 'I. 수와 연산', difficulty: '중', thumbnail_variant: 0, play_count: 12, rating_avg: 4.5 },
  { set_id: 'mine-02', host_member_id: 'me', title: '국어 비문학 독해 연습 — 설명문·논설문', subject: '국어', grade: null, tags: ['비문학', '독해'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-02-28T09:00:00Z', updated_at: '2026-03-30T11:00:00Z', question_count: 20, theme: '공부력-국어', difficulty: '상', thumbnail_variant: 1, play_count: 28, rating_avg: 4.7 },
  { set_id: 'mine-03', host_member_id: 'me', title: '사회 민주주의와 선거제도 OX 퀴즈', subject: '사회', grade: null, tags: ['민주주의', '선거'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-02-20T08:00:00Z', updated_at: '2026-03-25T16:00:00Z', question_count: 12, difficulty: '중', thumbnail_variant: 2, play_count: 8 },
  { set_id: 'mine-04', host_member_id: 'me', title: '과학 지구와 달의 운동 개념 확인', subject: '과학', grade: null, tags: ['지구과학'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-02-15T13:00:00Z', updated_at: '2026-03-22T10:00:00Z', question_count: 10, difficulty: '하', thumbnail_variant: 3, play_count: 5 },
  { set_id: 'mine-05', host_member_id: 'me', title: '한자 8급 기출 50자 읽기 테스트', subject: '한자', grade: null, tags: ['한자8급'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-02-10T11:00:00Z', updated_at: '2026-03-18T09:30:00Z', question_count: 25, theme: '공부력-한자', difficulty: '중', thumbnail_variant: 4, play_count: 42, rating_avg: 4.6 },
  { set_id: 'mine-06', host_member_id: 'me', title: '영어 Lesson 3 어휘+문법 종합', subject: '영어', grade: '중등 영어 영어2', tags: ['어휘', '문법'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-01-25T14:00:00Z', updated_at: '2026-04-12T17:00:00Z', question_count: 18, textbook: '비상 교과서', unit: 'Lesson 3', difficulty: '중', thumbnail_variant: 5, play_count: 31, rating_avg: 4.8, is_new: true },
  { set_id: 'mine-07', host_member_id: 'me', title: '국어 문학 감상 — 현대시 핵심 정리', subject: '국어', grade: null, tags: ['현대시', '문학'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-01-18T10:00:00Z', updated_at: '2026-03-15T12:00:00Z', question_count: 14, difficulty: '상', thumbnail_variant: 0, play_count: 7 },
  { set_id: 'mine-08', host_member_id: 'me', title: '과학 화학 반응식 맞추기 (산화·환원)', subject: '과학', grade: null, tags: ['화학'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-01-10T09:00:00Z', updated_at: '2026-03-10T15:00:00Z', question_count: 16, difficulty: '상', thumbnail_variant: 1, play_count: 19, rating_avg: 4.5 },
  { set_id: 'mine-09', host_member_id: 'me', title: '사회 세계 기후와 자연환경 빈칸 퀴즈', subject: '사회', grade: null, tags: ['기후', '지리'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-03-05T07:00:00Z', updated_at: '2026-04-02T10:00:00Z', question_count: 22, difficulty: '중', thumbnail_variant: 2, play_count: 14 },
  { set_id: 'mine-10', host_member_id: 'me', title: '중2 확률과 통계 실전 문제', subject: '수학', grade: '중등 수학 수학2', tags: ['확률', '통계'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-02-05T12:00:00Z', updated_at: '2026-03-28T08:00:00Z', question_count: 15, textbook: '쎈', unit: 'IV. 확률', difficulty: '상', thumbnail_variant: 3, play_count: 22, rating_avg: 4.6 },
  { set_id: 'mine-11', host_member_id: 'me', title: '한자 사자성어 60선 의미 맞추기', subject: '한자', grade: null, tags: ['사자성어'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-01-28T15:00:00Z', updated_at: '2026-03-20T11:00:00Z', question_count: 30, theme: '공부력-한자', difficulty: '중', thumbnail_variant: 4, play_count: 55, rating_avg: 4.8 },
  { set_id: 'mine-12', host_member_id: 'me', title: '과학 뉴턴의 운동 법칙 3단계 퀴즈', subject: '과학', grade: null, tags: ['물리', '뉴턴'], is_deleted: false, is_shared: false, original_set_id: null, created_at: '2026-01-15T09:30:00Z', updated_at: '2026-03-12T14:00:00Z', question_count: 12, difficulty: '상', thumbnail_variant: 5, play_count: 11 },
]

// ─── 다른 선생님이 공유한 세트지 ───

export const MOCK_COMMUNITY_SETS: QuestionSet[] = [
  { set_id: 'comm-01', host_member_id: 'h-01', title: '중1 수학 일차방정식 총정리', subject: '수학', grade: '중등 수학 수학1', tags: ['방정식'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-02-10T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 15, textbook: '비상 교과서', unit: 'II. 문자와 식', difficulty: '중', thumbnail_variant: 0, play_count: 312, rating_avg: 4.7, host_nickname: '수학쌤민지', is_certified: true, like_count: 42, download_count: 128, is_new: true, source: 'community' },
  { set_id: 'comm-02', host_member_id: 'h-02', title: '국어 비문학 독해 — 설명문·논설문 집중', subject: '국어', grade: null, tags: ['비문학'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-02-15T09:00:00Z', updated_at: '2026-03-25T09:00:00Z', question_count: 20, theme: '공부력-국어', difficulty: '상', thumbnail_variant: 1, play_count: 528, rating_avg: 4.8, host_nickname: '국어달인', is_certified: true, like_count: 58, download_count: 210, source: 'community' },
  { set_id: 'comm-03', host_member_id: 'h-03', title: '과학 — 지구와 달의 운동 개념 확인', subject: '과학', grade: null, tags: ['지구과학'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-01-20T09:00:00Z', updated_at: '2026-03-10T09:00:00Z', question_count: 10, difficulty: '하', thumbnail_variant: 2, play_count: 215, rating_avg: 4.5, host_nickname: '과학탐험가', is_certified: true, like_count: 34, download_count: 95, source: 'community' },
  { set_id: 'comm-04', host_member_id: 'h-04', title: '사회 — 민주주의와 선거제도 OX 퀴즈', subject: '사회', grade: null, tags: ['민주주의'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-02-01T09:00:00Z', updated_at: '2026-03-20T09:00:00Z', question_count: 12, difficulty: '중', thumbnail_variant: 3, play_count: 346, rating_avg: 4.6, host_nickname: '사회박사', is_certified: true, like_count: 41, download_count: 156, is_bookmarked: true, source: 'community' },
  { set_id: 'comm-05', host_member_id: 'h-05', title: '한자 8급 기출 50자 읽기 테스트', subject: '한자', grade: null, tags: ['한자8급'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-03-01T09:00:00Z', updated_at: '2026-04-05T09:00:00Z', question_count: 25, theme: '공부력-한자', difficulty: '하', thumbnail_variant: 4, play_count: 187, rating_avg: 4.3, host_nickname: '한자선생', is_certified: false, like_count: 29, download_count: 87, source: 'community' },
  { set_id: 'comm-06', host_member_id: 'h-06', title: '영어 듣기평가 대비 Lesson 5', subject: '영어', grade: '중등 영어 영어1', tags: ['듣기'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-02-20T09:00:00Z', updated_at: '2026-03-28T09:00:00Z', question_count: 25, textbook: '비상 교과서', unit: 'Lesson 5', difficulty: '중', thumbnail_variant: 5, play_count: 412, rating_avg: 4.6, host_nickname: '리스닝프로', is_certified: true, like_count: 63, download_count: 185, source: 'community' },
  { set_id: 'comm-07', host_member_id: 'h-01', title: '국어 문학 — 현대시 감상과 해석', subject: '국어', grade: null, tags: ['현대시'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-02-25T09:00:00Z', updated_at: '2026-03-30T09:00:00Z', question_count: 14, difficulty: '상', thumbnail_variant: 0, play_count: 287, rating_avg: 4.7, host_nickname: '국어달인', is_certified: true, like_count: 47, download_count: 132, source: 'community' },
  { set_id: 'comm-08', host_member_id: 'h-07', title: '과학 — 화학 반응식 맞추기 (산화·환원)', subject: '과학', grade: null, tags: ['화학'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-01-15T09:00:00Z', updated_at: '2026-03-08T09:00:00Z', question_count: 16, difficulty: '상', thumbnail_variant: 1, play_count: 523, rating_avg: 4.9, host_nickname: '화학마스터', is_certified: true, like_count: 52, download_count: 178, is_bookmarked: true, source: 'community' },
  { set_id: 'comm-09', host_member_id: 'h-08', title: '사회 — 세계 기후와 자연환경 빈칸 퀴즈', subject: '사회', grade: null, tags: ['기후', '지리'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-03-05T09:00:00Z', updated_at: '2026-04-01T09:00:00Z', question_count: 22, difficulty: '중', thumbnail_variant: 2, play_count: 194, rating_avg: 4.4, host_nickname: '지리탐험', is_certified: false, like_count: 33, download_count: 104, source: 'community' },
  { set_id: 'comm-10', host_member_id: 'h-09', title: '중2 확률과 통계 실전 문제', subject: '수학', grade: '중등 수학 수학2', tags: ['확률'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-02-08T09:00:00Z', updated_at: '2026-03-22T09:00:00Z', question_count: 15, textbook: '쎈', unit: 'IV. 확률', difficulty: '상', thumbnail_variant: 3, play_count: 268, rating_avg: 4.6, host_nickname: '통계마스터', is_certified: true, like_count: 38, download_count: 110, source: 'community' },
  { set_id: 'comm-11', host_member_id: 'h-10', title: '한자 — 사자성어 60선 의미 맞추기', subject: '한자', grade: null, tags: ['사자성어'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-03-08T09:00:00Z', updated_at: '2026-04-10T09:00:00Z', question_count: 30, theme: '공부력-한자', difficulty: '중', thumbnail_variant: 4, play_count: 612, rating_avg: 4.8, host_nickname: '한자왕', is_certified: true, like_count: 71, download_count: 243, is_new: true, source: 'community' },
  { set_id: 'comm-12', host_member_id: 'h-03', title: '영어 문법 총정리 — 관계대명사·분사', subject: '영어', grade: '중등 영어 영어2', tags: ['문법'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-02-18T09:00:00Z', updated_at: '2026-03-25T09:00:00Z', question_count: 18, textbook: '비상 교과서', unit: 'Lesson 6', difficulty: '상', thumbnail_variant: 5, play_count: 445, rating_avg: 4.8, host_nickname: 'Grammar쌤', is_certified: true, like_count: 56, download_count: 203, source: 'community' },
  { set_id: 'comm-13', host_member_id: 'h-11', title: '과학 — 뉴턴의 운동 법칙 3단계 퀴즈', subject: '과학', grade: null, tags: ['물리', '뉴턴'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-01-28T09:00:00Z', updated_at: '2026-03-15T09:00:00Z', question_count: 12, difficulty: '상', thumbnail_variant: 0, play_count: 354, rating_avg: 4.7, host_nickname: '물리쌤', is_certified: true, like_count: 44, download_count: 138, source: 'community' },
  { set_id: 'comm-14', host_member_id: 'h-12', title: '국어 — 맞춤법·띄어쓰기 OX 퀴즈', subject: '국어', grade: null, tags: ['맞춤법'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-02-12T09:00:00Z', updated_at: '2026-04-08T09:00:00Z', question_count: 20, theme: '공부력-국어', difficulty: '하', thumbnail_variant: 1, play_count: 789, rating_avg: 4.9, host_nickname: '우리말지킴이', is_certified: true, like_count: 82, download_count: 312, is_bookmarked: true, is_new: true, source: 'community' },
  { set_id: 'comm-15', host_member_id: 'h-13', title: '사회 — 대한민국 헌법과 기본권', subject: '사회', grade: null, tags: ['헌법'], is_deleted: false, is_shared: true, original_set_id: null, created_at: '2026-01-22T09:00:00Z', updated_at: '2026-03-05T09:00:00Z', question_count: 14, difficulty: '중', thumbnail_variant: 2, play_count: 228, rating_avg: 4.5, host_nickname: '법률쌤', is_certified: true, like_count: 36, download_count: 119, source: 'community' },
]

// ─── 통합 접근 헬퍼 ───

export const ALL_HUB_SETS: QuestionSet[] = [
  ...MOCK_QUIZ_PARTY_SETS.map((s) => ({ ...s, source: 'quiz_party' as const })),
  ...MOCK_MINE_SETS.map((s) => ({ ...s, source: 'mine' as const })),
  ...MOCK_COMMUNITY_SETS.map((s) => ({ ...s, source: 'community' as const })),
]

export function getHubSetById(setId: string): QuestionSet | undefined {
  return ALL_HUB_SETS.find((s) => s.set_id === setId)
}

// ─── 문항 미리보기 Mock ───
// TODO: `/api/sets/:id/preview-questions` 연결 시 제거. Phase 1은 템플릿 5문항 생성.

export function buildMockPreviewQuestions(setId: string, count = 5): Question[] {
  const set = getHubSetById(setId)
  const topic = set?.title.split(' ').slice(0, 3).join(' ') ?? '퀴즈'
  const subject = set?.subject ?? '수학'
  const now = new Date().toISOString()

  const templates: Array<Omit<Question, 'question_id' | 'set_id' | 'created_at' | 'order_index'>> = [
    {
      type: 'multiple_choice',
      content: `${topic} — 다음 중 바른 설명은?`,
      options: [
        { index: 1, text: '첫 번째 선택지 예시' },
        { index: 2, text: '두 번째 선택지 예시 (정답)' },
        { index: 3, text: '세 번째 선택지 예시' },
        { index: 4, text: '네 번째 선택지 예시' },
      ],
      answer: '2',
      hint: '핵심 개념을 떠올려 보세요.',
      explanation: `${subject} 교과 내 기본 개념입니다.`,
      media_url: null,
    },
    {
      type: 'ox',
      content: `${topic} 은(는) 교과서 핵심 개념 중 하나다.`,
      options: null,
      answer: 'O',
      hint: null,
      explanation: '맞습니다.',
      media_url: null,
    },
    {
      type: 'multiple_choice',
      content: `다음 ${topic} 관련 예시 중 가장 적절한 것은?`,
      options: [
        { index: 1, text: '예시 A' },
        { index: 2, text: '예시 B' },
        { index: 3, text: '예시 C (정답)' },
        { index: 4, text: '예시 D' },
      ],
      answer: '3',
      hint: null,
      explanation: '예시 C가 정답입니다.',
      media_url: null,
    },
    {
      type: 'ox',
      content: `${topic} 단원에서는 두 가지 핵심 원리를 모두 기억해야 한다.`,
      options: null,
      answer: 'X',
      hint: null,
      explanation: '세 가지 핵심 원리가 다뤄집니다.',
      media_url: null,
    },
    {
      type: 'unscramble',
      content: `다음 단어/문장 조각을 올바른 순서로 배열하세요.`,
      options: [
        { index: 1, text: '핵심' },
        { index: 2, text: '개념' },
        { index: 3, text: '이해' },
        { index: 4, text: '완료' },
      ],
      answer: '1,2,3,4',
      hint: null,
      explanation: '순서: 핵심 → 개념 → 이해 → 완료',
      media_url: null,
    },
  ]

  return templates.slice(0, count).map((t, i) => ({
    ...t,
    question_id: `${setId}-preview-${i + 1}`,
    set_id: setId,
    order_index: i + 1,
    created_at: now,
  }))
}

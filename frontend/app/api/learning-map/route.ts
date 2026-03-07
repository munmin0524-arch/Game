import { NextRequest, NextResponse } from 'next/server'

// GET /api/learning-map?subject=수학
// 과목별 학습맵 계층 데이터 반환 (mock)

const MATH_HIERARCHY = {
  '수와 연산': {
    '자연수의 성질': {
      '소인수분해': ['소수와 합성수', '소인수분해', '최대공약수', '최소공배수'],
      '정수와 유리수의 개념': ['양수와 음수', '정수', '유리수'],
    },
    '정수와 유리수의 계산': {
      '정수의 사칙연산': ['덧셈과 뺄셈', '곱셈과 나눗셈', '혼합 계산'],
      '유리수의 사칙연산': ['유리수의 덧셈', '유리수의 뺄셈', '유리수의 곱셈'],
    },
  },
  '문자와 식': {
    '문자의 사용과 식': {
      '문자와 식': ['문자의 사용', '식의 값', '일차식의 계산'],
      '일차방정식': ['등식의 성질', '일차방정식 풀이', '일차방정식 활용'],
    },
  },
  '함수': {
    '함수의 개념': {
      '함수와 그래프': ['함수의 뜻', '순서쌍과 좌표', '함수의 그래프'],
      '일차함수': ['일차함수의 뜻', '일차함수의 그래프', '기울기와 y절편'],
    },
  },
  '기하': {
    '기본 도형': {
      '점, 선, 면': ['점과 직선', '각', '평행선의 성질'],
    },
  },
  '확률과 통계': {
    '자료의 정리와 해석': {
      '도수분포와 그래프': ['도수분포표', '히스토그램'],
    },
  },
}

const ENGLISH_HIERARCHY = {
  'Listening': {
    '듣기 이해': {
      '세부 정보 파악': ['핵심어 듣기', '수치/시간 듣기'],
      '주제 및 요지 파악': ['주제 파악', '요지 파악'],
    },
  },
  'Reading': {
    '읽기 이해': {
      '세부 정보 파악': ['사실적 이해', '일치/불일치'],
      '주제 및 요지 파악': ['주제문 찾기', '제목 추론'],
    },
  },
  'Grammar': {
    '문장 구조': {
      '시제': ['현재시제', '과거시제', '미래시제'],
    },
  },
  'Vocabulary': {
    '어휘': {
      '기본 어휘': ['일상생활', '학교생활'],
    },
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const subject = searchParams.get('subject')

  if (subject === '수학') {
    return NextResponse.json({ subject: '수학', hierarchy: MATH_HIERARCHY })
  }
  if (subject === '영어') {
    return NextResponse.json({ subject: '영어', hierarchy: ENGLISH_HIERARCHY })
  }

  return NextResponse.json({ subject: null, hierarchy: {} })
}

// S-03 에디터 — 3-Step 위자드
// Step 1: 문항 검색/추가 | Step 2: 문항 편집 | Step 3: 세트 설정

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WizardProvider, useWizard } from './_components/WizardContext'
import { WizardStepper } from './_components/WizardStepper'
import { Step1Pool } from './_components/Step1Pool'
import { Step2Editor } from './_components/Step2Editor'
import { Step3Settings } from './_components/Step3Settings'
import { useToast } from '@/components/ui/use-toast'
import { questionSetsApi } from '@/lib/api'
import type { Question } from '@/types'

// ─── 마켓플레이스 세트 Mock (백엔드 연결 전) ───

function getMarketplaceMockQuestions(): Question[] {
  return [
    { question_id: 'mp-01', set_id: '', type: 'multiple_choice', content: '(-3) + (+7)의 값은?', options: ['-4', '4', '10', '-10'], answer: '4', order_index: 0, difficulty: '하', unit: 'I. 수와 연산' },
    { question_id: 'mp-02', set_id: '', type: 'multiple_choice', content: '(-12) ÷ (+4) × (-2)의 값을 구하시오.', options: ['6', '-6', '8', '-8'], answer: '6', order_index: 1, difficulty: '중', unit: 'I. 수와 연산' },
    { question_id: 'mp-03', set_id: '', type: 'ox', content: '두 정수의 곱이 음수이면, 두 수의 부호는 서로 다르다.', options: ['O', 'X'], answer: 'O', order_index: 2, difficulty: '하', unit: 'I. 수와 연산' },
    { question_id: 'mp-04', set_id: '', type: 'multiple_choice', content: '절댓값이 5인 정수를 모두 구하면?', options: ['5', '-5', '5와 -5', '0과 5'], answer: '5와 -5', order_index: 3, difficulty: '중', unit: 'I. 수와 연산' },
    { question_id: 'mp-05', set_id: '', type: 'multiple_choice', content: '(-2)³의 값은?', options: ['-8', '8', '-6', '6'], answer: '-8', order_index: 4, difficulty: '상', unit: 'I. 수와 연산' },
    { question_id: 'mp-06', set_id: '', type: 'ox', content: '0은 양의 정수도 음의 정수도 아니다.', options: ['O', 'X'], answer: 'O', order_index: 5, difficulty: '하', unit: 'I. 수와 연산' },
    { question_id: 'mp-07', set_id: '', type: 'multiple_choice', content: '다음 중 가장 작은 수는? -3, 0, -7, 2, -1', options: ['-3', '-7', '-1', '0'], answer: '-7', order_index: 6, difficulty: '하', unit: 'I. 수와 연산' },
    { question_id: 'mp-08', set_id: '', type: 'multiple_choice', content: '(-5) × (-4) + (-10) ÷ 2의 값은?', options: ['15', '25', '-15', '10'], answer: '15', order_index: 7, difficulty: '상', unit: 'I. 수와 연산' },
    { question_id: 'mp-09', set_id: '', type: 'multiple_choice', content: '문자와 식에서 2a + 3b, a=2, b=-1일 때 값은?', options: ['1', '7', '3', '-1'], answer: '1', order_index: 8, difficulty: '중', unit: 'II. 문자와 식' },
    { question_id: 'mp-10', set_id: '', type: 'multiple_choice', content: '일차방정식 2x + 6 = 0의 해는?', options: ['3', '-3', '6', '-6'], answer: '-3', order_index: 9, difficulty: '중', unit: 'II. 문자와 식' },
    { question_id: 'mp-11', set_id: '', type: 'multiple_choice', content: '소수(Prime number)가 아닌 것은?', options: ['2', '9', '11', '13'], answer: '9', order_index: 10, difficulty: '하', unit: 'I. 수와 연산' },
    { question_id: 'mp-12', set_id: '', type: 'ox', content: '1은 소수도 합성수도 아니다.', options: ['O', 'X'], answer: 'O', order_index: 11, difficulty: '중', unit: 'I. 수와 연산' },
  ]
}

function EditorInner() {
  const { setId } = useParams<{ setId: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { state, dispatch } = useWizard()

  const isNew = setId === 'new'
  const isFromMarketplace = searchParams.get('from') === 'marketplace'
  const [shownNotice, setShownNotice] = useState(false)

  // 마켓플레이스에서 진입 시 1회성 알림
  useEffect(() => {
    if (isFromMarketplace && !shownNotice) {
      toast({ title: '자동으로 내 퀴즈에 다운로드 되었습니다.' })
      setShownNotice(true)
    }
  }, [isFromMarketplace, shownNotice, toast])

  // 세트지 로드
  useEffect(() => {
    if (isNew) {
      questionSetsApi.create('새 퀴즈').then((newSet) => {
        router.replace(`/sets/${newSet.set_id}/edit`)
      })
      return
    }

    // 마켓플레이스에서 진입 → Mock 문항 바로 로드 + Step 2
    if (isFromMarketplace) {
      const mockQs = getMarketplaceMockQuestions()
      dispatch({
        type: 'LOAD_SET',
        set: {
          set_id: setId,
          host_member_id: '',
          title: '퀴즈 광장 세트',
          subject: '수학',
          grade: '중1-1학기',
          tags: ['정수', '연산'],
          is_deleted: false,
          is_shared: false,
          original_set_id: null,
        },
        questions: mockQs,
      })
      dispatch({ type: 'SET_STEP', step: 2 })
      return
    }

    questionSetsApi.get(setId)
      .then(({ questions: qs, ...s }) => {
        dispatch({ type: 'LOAD_SET', set: s, questions: qs })
        if (qs.length > 0) {
          dispatch({ type: 'SET_STEP', step: 2 })
        }
      })
      .catch(() => {
        toast({ title: '불러오기 실패', variant: 'destructive' })
      })
  }, [setId, isNew, isFromMarketplace, router, toast, dispatch])

  if (state.isLoading || isNew) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        로딩 중...
      </div>
    )
  }

  return (
    <div className="-mx-4 -my-8 flex h-[calc(100vh-4rem)] flex-col bg-slate-50/80">
      {/* 마켓플레이스 진입 시 상단 바 */}
      {isFromMarketplace && (
        <div className="shrink-0 flex items-center justify-between bg-blue-50 border-b border-blue-100 px-6 py-2">
          <span className="text-sm text-blue-700">퀴즈 광장에서 가져온 세트입니다.</span>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-100"
            onClick={() => router.push('/sets')}
          >
            <Download className="h-4 w-4" />
            내 퀴즈에 다운로드하기
          </Button>
        </div>
      )}
      <WizardStepper />
      <div className="flex-1 min-h-0 overflow-hidden">
        {state.step === 1 && <Step1Pool />}
        {state.step === 2 && <Step2Editor />}
        {state.step === 3 && <Step3Settings />}
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <WizardProvider>
      <EditorInner />
    </WizardProvider>
  )
}

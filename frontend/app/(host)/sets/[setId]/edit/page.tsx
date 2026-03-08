// S-03 에디터 — 3-Step 위자드
// Step 1: 문항 검색/추가 | Step 2: 문항 편집 | Step 3: 세트 설정

'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { WizardProvider, useWizard } from './_components/WizardContext'
import { WizardStepper } from './_components/WizardStepper'
import { Step1Pool } from './_components/Step1Pool'
import { Step2Editor } from './_components/Step2Editor'
import { Step3Settings } from './_components/Step3Settings'
import { useToast } from '@/components/ui/use-toast'
import { questionSetsApi } from '@/lib/api'

function EditorInner() {
  const { setId } = useParams<{ setId: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const { state, dispatch } = useWizard()

  const isNew = setId === 'new'

  // 세트지 로드
  useEffect(() => {
    if (isNew) {
      questionSetsApi.create('새 퀴즈').then((newSet) => {
        router.replace(`/sets/${newSet.set_id}/edit`)
      })
      return
    }

    questionSetsApi.get(setId)
      .then(({ questions: qs, ...s }) => {
        dispatch({ type: 'LOAD_SET', set: s, questions: qs })
        // 기존 퀴즈 편집은 Step 2에서 시작
        if (qs.length > 0) {
          dispatch({ type: 'SET_STEP', step: 2 })
        }
      })
      .catch(() => toast({ title: '불러오기 실패', variant: 'destructive' }))
  }, [setId, isNew, router, toast, dispatch])

  if (state.isLoading || isNew) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        로딩 중...
      </div>
    )
  }

  return (
    <div className="-mx-4 -my-8 flex h-[calc(100vh-4rem)] flex-col bg-slate-50/80">
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

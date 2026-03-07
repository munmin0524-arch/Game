'use client'

import { Check } from 'lucide-react'
import { useWizard } from './WizardContext'

const STEPS = [
  { step: 1 as const, label: '문항 검색/추가' },
  { step: 2 as const, label: '문항 편집' },
  { step: 3 as const, label: '설정' },
]

export function WizardStepper() {
  const { state, dispatch } = useWizard()
  const { step: current, questions } = state

  return (
    <nav className="flex items-center justify-center gap-0 py-3 px-6 bg-white border-b shrink-0">
      {STEPS.map(({ step, label }, idx) => {
        const isActive = current === step
        const isPast = current > step
        const isLast = idx === STEPS.length - 1

        return (
          <div key={step} className="flex items-center">
            <button
              onClick={() => dispatch({ type: 'SET_STEP', step })}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all
                ${isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : isPast
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold
                  ${isActive
                    ? 'bg-white text-blue-600'
                    : isPast
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-white'
                  }`}
              >
                {isPast ? <Check className="h-3.5 w-3.5" /> : step}
              </span>
              <span>{label}</span>
              {step === 2 && questions.length > 0 && (
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold
                    ${isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}
                >
                  {questions.length}
                </span>
              )}
            </button>
            {!isLast && (
              <div
                className={`mx-2 h-0.5 w-8 rounded-full transition-colors
                  ${current > step ? 'bg-blue-400' : 'bg-gray-200'}`}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}

'use client'

import { Medal, Check } from 'lucide-react'

type MedalGrade = 'none' | 'bronze' | 'silver' | 'gold'

interface MedalProgressProps {
  currentGrade: MedalGrade
  attendance: number
  totalQuestions: number
  accuracy: number
}

const MEDAL_TIERS = {
  none: { next: 'bronze', label: '동메달', color: 'text-amber-700', requirements: { attendance: 7, questions: 100, accuracy: 60 } },
  bronze: { next: 'silver', label: '은메달', color: 'text-gray-500', requirements: { attendance: 14, questions: 300, accuracy: 70 } },
  silver: { next: 'gold', label: '금메달', color: 'text-amber-500', requirements: { attendance: 30, questions: 500, accuracy: 80 } },
  gold: { next: null, label: '최고 등급!', color: 'text-amber-500', requirements: { attendance: 30, questions: 500, accuracy: 80 } },
}

const CURRENT_LABELS: Record<MedalGrade, string> = {
  none: '메달 없음',
  bronze: '동메달',
  silver: '은메달',
  gold: '금메달',
}

export function MedalProgress({ currentGrade, attendance, totalQuestions, accuracy }: MedalProgressProps) {
  const tier = MEDAL_TIERS[currentGrade]
  const isMaxed = currentGrade === 'gold'
  const req = tier.requirements

  const conditions = [
    { label: '출석', current: attendance, target: req.attendance, unit: '일' },
    { label: '문제', current: totalQuestions, target: req.questions, unit: '개' },
    { label: '정답률', current: accuracy, target: req.accuracy, unit: '%' },
  ]

  return (
    <div className="rounded-xl bg-white p-3 shadow-soft h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">메달 진행도</h3>

      {isMaxed ? (
        <div className="text-center py-3 flex-1 flex flex-col items-center justify-center">
          <Medal className="mx-auto h-8 w-8 text-amber-500" />
          <p className="mt-1 text-sm font-bold text-amber-500">금메달 달성!</p>
          <p className="text-[10px] text-gray-400">최고 등급에 도달했어요</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-center gap-2 mb-3 text-xs">
            <span className="font-semibold text-gray-600">{CURRENT_LABELS[currentGrade]}</span>
            <span className="text-gray-300">→</span>
            <span className={`font-bold ${tier.color}`}>{tier.label}</span>
          </div>

          <div className="space-y-2">
            {conditions.map((cond) => {
              const progress = Math.min(100, (cond.current / cond.target) * 100)
              const done = cond.current >= cond.target
              return (
                <div key={cond.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] text-gray-600">{cond.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-semibold text-gray-700">
                        {cond.current}/{cond.target}{cond.unit}
                      </span>
                      {done && <Check className="h-3 w-3 text-green-500" />}
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${done ? 'bg-green-500' : 'bg-blue-400'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

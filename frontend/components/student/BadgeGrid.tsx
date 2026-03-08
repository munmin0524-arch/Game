'use client'

interface Badge {
  id: string
  name: string
  icon: string
  description: string
  earned: boolean
  earnedAt?: string
}

interface BadgeGridProps {
  badges: Badge[]
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  const earned = badges.filter((b) => b.earned).length

  return (
    <div className="rounded-xl bg-white p-3 shadow-soft">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">업적 뱃지</h3>
        <span className="text-[10px] text-gray-400">{earned}/{badges.length}개 획득</span>
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {badges.map((badge) => (
          <div
            key={badge.id}
            title={badge.description}
            className={`flex flex-col items-center gap-0.5 rounded-lg p-1.5 transition-all ${
              badge.earned
                ? 'bg-amber-50'
                : 'bg-gray-50 opacity-40 grayscale'
            }`}
          >
            <span className="text-xl leading-none">{badge.icon}</span>
            <span className="text-[8px] font-medium text-gray-600 text-center leading-tight">
              {badge.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

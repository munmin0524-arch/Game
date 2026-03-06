// SubmissionStatusBoard — 제출 현황 요약 카드 3개 (S-12)
// 제출완료 / 진행 중 / 미제출 숫자를 한눈에 표시

interface SubmissionStatusBoardProps {
  submitted: number
  inProgress: number
  notSubmitted: number
  total: number
  loading?: boolean
}

interface StatCardProps {
  label: string
  count: number
  total: number
  color: string
  loading?: boolean
}

function StatCard({ label, count, total, color, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="flex-1 rounded-xl border bg-white p-4 space-y-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-8 bg-gray-200 rounded w-12" />
        <div className="h-2 bg-gray-200 rounded w-full" />
      </div>
    )
  }

  const pct = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div className="flex-1 rounded-xl border bg-white p-4 space-y-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>
        {count}
        <span className="text-sm font-normal text-gray-400 ml-1">명</span>
      </p>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all ${color.replace('text-', 'bg-')}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function SubmissionStatusBoard({
  submitted,
  inProgress,
  notSubmitted,
  total,
  loading = false,
}: SubmissionStatusBoardProps) {
  return (
    <div className="flex gap-3">
      <StatCard
        label="제출 완료"
        count={submitted}
        total={total}
        color="text-green-600"
        loading={loading}
      />
      <StatCard
        label="진행 중"
        count={inProgress}
        total={total}
        color="text-blue-600"
        loading={loading}
      />
      <StatCard
        label="미제출"
        count={notSubmitted}
        total={total}
        color="text-gray-500"
        loading={loading}
      />
    </div>
  )
}

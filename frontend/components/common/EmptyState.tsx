// EmptyState — 빈 상태 공통 컴포넌트

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  // action: 객체 형태({ label, onClick }) 또는 ReactNode 둘 다 허용
  action?: { label: string; onClick: () => void } | ReactNode
  children?: ReactNode
}

function isActionObject(
  action: EmptyStateProps['action']
): action is { label: string; onClick: () => void } {
  return typeof action === 'object' && action !== null && 'label' in action && 'onClick' in action
}

export function EmptyState({ icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {icon && <span className="text-5xl">{icon}</span>}
      <h3 className="text-base font-semibold text-gray-700">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-xs">{description}</p>}
      {action && (
        isActionObject(action)
          ? <Button onClick={action.onClick} className="mt-2">{action.label}</Button>
          : <div className="mt-2">{action as ReactNode}</div>
      )}
      {children}
    </div>
  )
}

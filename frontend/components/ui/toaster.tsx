'use client'

import { useToast } from '@/components/ui/use-toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen flex-col-reverse gap-2 p-4 sm:max-w-[420px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all',
            t.variant === 'destructive'
              ? 'border-red-200 bg-red-50 text-red-900'
              : 'border-gray-200 bg-white text-gray-900'
          )}
        >
          <div className="flex-1 space-y-1">
            {t.title && <p className="text-sm font-semibold">{t.title}</p>}
            {t.description && <p className="text-sm opacity-90">{t.description}</p>}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

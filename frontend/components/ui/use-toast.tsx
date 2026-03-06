'use client'

// Adapted from shadcn/ui toast
import * as React from 'react'

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

type ToastState = ToastProps & { id: string; open: boolean }

type ToastContextType = {
  toasts: ToastState[]
  toast: (props: ToastProps) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastState[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...props, id, open: true }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return { toast: ctx.toast, toasts: ctx.toasts, dismiss: ctx.dismiss }
}

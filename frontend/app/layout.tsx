import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '퀴즈 게임',
  description: '교육용 실시간 퀴즈 플랫폼',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  )
}

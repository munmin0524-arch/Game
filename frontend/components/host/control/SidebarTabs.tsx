'use client'

import { useState } from 'react'
import { FileText, BarChart3, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WsQuestionShow, LiveAnalyticsData, LeaderboardEntry } from '@/types'

import QuestionPanel from './QuestionPanel'
import LiveAnalytics from './LiveAnalytics'
import LiveLeaderboard from './LiveLeaderboard'

type SidebarTab = 'question' | 'analytics' | 'leaderboard'

const TABS: { key: SidebarTab; label: string; icon: React.ElementType }[] = [
  { key: 'question', label: '문항', icon: FileText },
  { key: 'analytics', label: '분석', icon: BarChart3 },
  { key: 'leaderboard', label: '순위', icon: Trophy },
]

interface SidebarTabsProps {
  question: WsQuestionShow | null
  hintRevealed: boolean
  isPaused: boolean
  analytics: LiveAnalyticsData
  leaderboardEntries: LeaderboardEntry[]
}

export default function SidebarTabs({
  question,
  hintRevealed,
  isPaused,
  analytics,
  leaderboardEntries,
}: SidebarTabsProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('question')

  return (
    <div className="flex h-full flex-col">
      {/* 탭 헤더 */}
      <div className="flex border-b bg-gray-50">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors',
                activeTab === tab.key
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'question' && (
          <QuestionPanel
            question={question}
            hintRevealed={hintRevealed}
            isPaused={isPaused}
          />
        )}
        {activeTab === 'analytics' && (
          <LiveAnalytics
            analytics={analytics}
            question={question}
            hintRevealed={hintRevealed}
          />
        )}
        {activeTab === 'leaderboard' && (
          <LiveLeaderboard entries={leaderboardEntries} />
        )}
      </div>
    </div>
  )
}

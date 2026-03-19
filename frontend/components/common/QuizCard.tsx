// QuizCard — 통합 퀴즈 카드 (내 퀴즈 + 퀴즈 광장 공용)

'use client'

import { useRouter } from 'next/navigation'
import { Heart, Download, Zap, Play, MoreHorizontal, Edit, Copy, Share2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ─── 파스텔 그라디언트 ───

const CARD_GRADIENTS = [
  'from-blue-200 to-cyan-100',
  'from-violet-200 to-purple-100',
  'from-rose-200 to-orange-100',
  'from-emerald-200 to-teal-100',
  'from-amber-200 to-yellow-100',
  'from-pink-200 to-rose-100',
]

function getGradient(id: string): string {
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return CARD_GRADIENTS[hash % CARD_GRADIENTS.length]
}

// ─── Props ───

export interface QuizCardProps {
  title: string
  questionCount: number
  subject?: string | null
  grade?: string | null
  id: string
  // 마켓플레이스 확장
  avgRating?: number
  likeCount?: number
  downloadCount?: number
  hostNickname?: string
  isCertified?: boolean
  isBookmarked?: boolean
  // 내 퀴즈 확장
  showActions?: boolean
  updatedAt?: string
  onEdit?: () => void
  onDuplicate?: () => void
  onShare?: () => void
  onDelete?: () => void
  onGameOpen?: () => void
  // 마켓플레이스 퀵 액션
  onQuickDeploy?: () => void
  onPreview?: () => void
  onQuickStart?: () => void
  // 공통
  onClick?: () => void
}

// ─── 컴포넌트 ───

export function QuizCard({
  title,
  questionCount,
  subject,
  grade,
  id,
  avgRating,
  likeCount,
  downloadCount,
  hostNickname,
  isCertified,
  showActions,
  onEdit,
  onDuplicate,
  onShare,
  onDelete,
  onGameOpen,
  onQuickDeploy,
  onPreview,
  onQuickStart,
  onClick,
}: QuizCardProps) {
  const gradient = getGradient(id)
  const isMarketplace = hostNickname != null

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* 상단 그라디언트 영역 */}
      <div className={`bg-gradient-to-br ${gradient} px-4 pt-4 pb-6 relative`}>
        <p className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 pr-8">
          {title}
        </p>
        <p className="text-gray-600/70 text-xs mt-1">
          {questionCount}문항
        </p>

        {/* 액션 메뉴 */}
        {(showActions || onQuickDeploy) && (
          <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 bg-white/60 hover:bg-white/90 backdrop-blur">
                  <MoreHorizontal className="h-3.5 w-3.5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* 마켓플레이스 퀵 출제 */}
                {onQuickDeploy && (
                  <DropdownMenuItem onClick={onQuickDeploy}>
                    <Play className="mr-2 h-4 w-4" /> 바로 퀴즈 출제하기
                  </DropdownMenuItem>
                )}
                {/* 내 퀴즈 메뉴 */}
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" /> 편집
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="mr-2 h-4 w-4" /> 복제
                  </DropdownMenuItem>
                )}
                {onGameOpen && (
                  <DropdownMenuItem onClick={onGameOpen}>
                    <Zap className="mr-2 h-4 w-4" /> 게임 열기
                  </DropdownMenuItem>
                )}
                {onShare && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onShare}>
                      <Share2 className="mr-2 h-4 w-4" /> 퀴즈 광장에 공유
                    </DropdownMenuItem>
                  </>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" /> 삭제
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* 하단 정보 영역 */}
      <div className="bg-white px-4 py-3 space-y-2">
        {/* 뱃지 행 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {subject && (
            <Badge variant="secondary" className="rounded-full text-[11px] px-2 py-0">
              {subject}
            </Badge>
          )}
          {grade && (
            <Badge variant="outline" className="rounded-full text-[11px] px-2 py-0">
              {grade}
            </Badge>
          )}
          {avgRating != null && avgRating > 0 && (
            <span className="text-[11px] text-amber-500 font-medium">
              ★ {avgRating.toFixed(1)}
            </span>
          )}
        </div>

        {/* 마켓플레이스: 작성자 + 좋아요/다운로드 */}
        {isMarketplace && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 truncate">
              by {hostNickname}
              {isCertified && <span className="ml-1 text-blue-500">✓</span>}
            </span>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              {likeCount != null && (
                <span className="flex items-center gap-0.5">
                  <Heart className="h-3 w-3" /> {likeCount}
                </span>
              )}
              {downloadCount != null && (
                <span className="flex items-center gap-0.5">
                  <Download className="h-3 w-3" /> {downloadCount}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 마켓플레이스: 미리보기 + 바로 시작 */}
        {(onPreview || onQuickStart) && (
          <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            {onPreview && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs rounded-full"
                onClick={onPreview}
              >
                미리보기
              </Button>
            )}
            {onQuickStart && (
              <Button
                size="sm"
                className="flex-1 h-8 text-xs rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={onQuickStart}
              >
                <Play className="mr-1 h-3 w-3" />
                바로시작
              </Button>
            )}
          </div>
        )}

        {/* 내 퀴즈: 게임 열기 버튼 */}
        {!isMarketplace && onGameOpen && (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-gray-500 hover:text-blue-600 px-2"
              onClick={(e) => {
                e.stopPropagation()
                onGameOpen()
              }}
            >
              <Zap className="mr-1 h-3 w-3" />
              게임 열기
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 스켈레톤 ───

export function QuizCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden animate-pulse">
      <div className="h-20 bg-gray-100" />
      <div className="bg-white px-4 py-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  )
}

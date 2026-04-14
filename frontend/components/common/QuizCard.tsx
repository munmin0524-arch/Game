// QuizCard — 통합 퀴즈 카드 (내 퀴즈 + 마켓플레이스 + 허브 공용)

'use client'

import {
  Heart,
  Download,
  Zap,
  Play,
  MoreHorizontal,
  Edit,
  Copy,
  Share2,
  Trash2,
  Eye,
  Flame,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SetBadge, type SetBadgeKind } from '@/components/common/SetBadge'
import { cn } from '@/lib/utils'

// ─── 파스텔 그라디언트 ───

const CARD_GRADIENTS = [
  'from-blue-200 to-cyan-100',
  'from-violet-200 to-purple-100',
  'from-rose-200 to-orange-100',
  'from-emerald-200 to-teal-100',
  'from-amber-200 to-yellow-100',
  'from-pink-200 to-rose-100',
]

function getGradient(id: string, variant?: number | null): string {
  if (variant != null && variant >= 0) return CARD_GRADIENTS[variant % CARD_GRADIENTS.length]
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
  // ─── 허브 확장 ───
  badges?: SetBadgeKind[]
  textbook?: string | null
  theme?: string | null
  difficulty?: '상' | '중' | '하' | null
  playCount?: number
  seen?: boolean
  /** 'footer' = 하단 버튼 (기본, 마켓플레이스 호환) / 'hover' = 호버 오버레이 CTA (허브 캐러셀) */
  overlayMode?: 'footer' | 'hover'
  thumbnailVariant?: number | null
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
  badges,
  textbook,
  theme,
  difficulty,
  playCount,
  seen,
  overlayMode = 'footer',
  thumbnailVariant,
}: QuizCardProps) {
  const gradient = getGradient(id, thumbnailVariant)
  const isMarketplace = hostNickname != null
  const isHover = overlayMode === 'hover'

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden shadow-soft transition-all cursor-pointer h-full',
        'hover:shadow-card hover:scale-[1.02]',
        seen && 'ring-2 ring-blue-400/60',
      )}
      onClick={onClick}
    >
      {/* 상단 그라디언트 영역 — 고정 높이로 카드 크기 통일 */}
      <div className={`bg-gradient-to-br ${gradient} px-4 pt-3 pb-3 relative h-[120px] flex flex-col`}>
        {/* 뱃지 — 소스 1개만 (퀴즈파티 공식 / 내가 만든 / 다른 선생님) */}
        {badges && badges.length > 0 && (
          <div className="flex gap-1 mb-1.5 shrink-0">
            <SetBadge kind={badges[0]} />
          </div>
        )}

        <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-3 pr-7 flex-1">
          {title}
        </p>
        <p className="text-gray-700/80 text-[11px] mt-1 shrink-0">
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
                {onQuickDeploy && (
                  <DropdownMenuItem onClick={onQuickDeploy}>
                    <Play className="mr-2 h-4 w-4" /> 바로 퀴즈 출제하기
                  </DropdownMenuItem>
                )}
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

        {/* Hover 오버레이 CTA (허브 캐러셀 전용) */}
        {isHover && (onPreview || onQuickStart) && (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center gap-2 bg-black/40 backdrop-blur-[1px]',
              'opacity-0 group-hover:opacity-100 transition-opacity',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {onPreview && (
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full h-8 px-3 text-xs bg-white/95 hover:bg-white"
                onClick={onPreview}
              >
                <Eye className="mr-1 h-3.5 w-3.5" />
                돋보기
              </Button>
            )}
            {onQuickStart && (
              <Button
                size="sm"
                className="rounded-full h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                onClick={onQuickStart}
              >
                <Zap className="mr-1 h-3.5 w-3.5" />
                바로 시작
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 하단 정보 영역 — flex-1로 카드 하단 높이 통일 */}
      <div className="bg-white px-4 py-3 space-y-2 flex-1 flex flex-col">
        {/* 정보 행 — 과목·학년만 (필터가 위에 있으므로 메타 최소화) */}
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
          {playCount != null && playCount > 0 && (
            <span className="text-[11px] text-gray-500 flex items-center gap-0.5">
              <Flame className="h-3 w-3 text-orange-400" /> {playCount}
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

        {/* Footer 액션 (마켓플레이스 호환 기본값) */}
        {!isHover && (onPreview || onQuickStart) && (
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
        {!isMarketplace && !isHover && onGameOpen && (
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

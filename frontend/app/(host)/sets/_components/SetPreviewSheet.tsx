'use client'

// 미리보기 팝업 — 큰 중앙 모달 (Dialog 기반)
// 세트지명 옆에 [⭐ 평가하기] [⚠️ 오답 신고] 버튼 노출
// 문항 ◀ ▶ 브라우저 + 푸터 [바로 시작]

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Zap,
  Edit,
  Star,
  BookOpen,
  Flag,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SetBadge } from '@/components/common/SetBadge'
import { cn } from '@/lib/utils'
import { SETS_HUB_LABELS } from '../_labels'
import {
  buildMockPreviewQuestions,
  getHubSetById,
} from '../_mocks/setsHubMockData'
import type { Question } from '@/types'

const GRADIENTS = [
  'from-blue-200 to-cyan-100',
  'from-violet-200 to-purple-100',
  'from-rose-200 to-orange-100',
  'from-emerald-200 to-teal-100',
  'from-amber-200 to-yellow-100',
  'from-pink-200 to-rose-100',
]

function typeLabel(t: Question['type']): string {
  const map = SETS_HUB_LABELS.preview.typeLabel
  return map[t]
}

export function SetPreviewSheet({
  open,
  onOpenChange,
  setId,
  onMarkSeen,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  setId: string | null
  onMarkSeen: (setId: string) => void
}) {
  const router = useRouter()
  const L = SETS_HUB_LABELS.preview
  const set = setId ? getHubSetById(setId) : undefined
  const questions = useMemo(() => (setId ? buildMockPreviewQuestions(setId, 5) : []), [setId])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [rating, setRating] = useState(0)
  const [showRating, setShowRating] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)

  useEffect(() => {
    if (open && setId) {
      setCurrentIndex(0)
      setRating(0)
      setShowRating(false)
      setReportOpen(false)
      onMarkSeen(setId)
    }
  }, [open, setId, onMarkSeen])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  setCurrentIndex((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, questions.length])

  if (!set) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent />
      </Dialog>
    )
  }

  const current = questions[currentIndex]
  const gradient = GRADIENTS[(set.thumbnail_variant ?? 0) % GRADIENTS.length]
  const isMine = set.source === 'mine'

  const handleStart = () => {
    onOpenChange(false)
    router.push(`/sets/${set.set_id}/deploy`)
  }
  const handleEdit = () => {
    onOpenChange(false)
    router.push(`/sets/${set.set_id}/edit`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 밴드 */}
        <div className={cn('bg-gradient-to-br px-6 pt-5 pb-4 relative shrink-0', gradient)}>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {set.is_official && <SetBadge kind="official" />}
            {set.is_new && <SetBadge kind="new" />}
            {(set.play_count ?? 0) >= 500 && <SetBadge kind="hot" />}
            {set.textbook && <SetBadge kind="textbook" text={set.textbook} />}
            {set.theme && <SetBadge kind="theme" text={set.theme.replace('공부력-', '공부력 ')} />}
          </div>

          <div className="flex items-start justify-between gap-3 pr-8">
            <DialogTitle className="text-xl font-bold leading-snug flex-1">
              {set.title}
            </DialogTitle>

            {/* 세트지명 옆 액션: 평가하기 · 오답 신고 */}
            <div className="flex gap-1.5 shrink-0">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowRating((v) => !v)}
                className="h-7 rounded-full bg-white/80 hover:bg-white text-xs px-2.5"
              >
                <Star className="h-3.5 w-3.5 mr-1 text-amber-500" />
                평가하기
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setReportOpen((v) => !v)}
                className="h-7 rounded-full bg-white/80 hover:bg-white text-xs px-2.5"
              >
                <Flag className="h-3.5 w-3.5 mr-1 text-rose-500" />
                오답 신고
              </Button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-700">
            {set.subject && <Badge variant="secondary" className="rounded-full">{set.subject}</Badge>}
            {set.grade && <Badge variant="outline" className="rounded-full bg-white/60">{set.grade}</Badge>}
            {set.unit && (
              <span className="inline-flex items-center gap-1 text-gray-700">
                <BookOpen className="h-3.5 w-3.5" />
                {set.unit}
              </span>
            )}
            <span>·</span>
            <span className="font-semibold text-gray-800">{set.question_count ?? 0}문항</span>
            {set.rating_avg != null && (
              <>
                <span>·</span>
                <span className="text-amber-600 font-semibold">★ {set.rating_avg.toFixed(1)}</span>
              </>
            )}
            {set.source === 'quiz_party' ? (
              <>
                <span>·</span>
                <span className="font-semibold text-blue-700">{L.officialBy}</span>
              </>
            ) : set.source === 'community' ? (
              <>
                <span>·</span>
                <span>by <span className="font-semibold">{set.host_nickname}</span>{set.is_certified && <span className="ml-1 text-blue-600">{L.certifiedMark}</span>}</span>
              </>
            ) : (
              <>
                <span>·</span>
                <span className="text-gray-600">{L.mineBy}</span>
              </>
            )}
          </div>
        </div>

        {/* 평가하기 · 신고 인라인 박스 */}
        {showRating && (
          <div className="border-b bg-amber-50/50 px-6 py-3">
            <p className="text-xs font-semibold text-gray-700 mb-1.5">{L.ratingHeading}</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className="p-0.5 hover:scale-110 transition-transform"
                  aria-label={`${n}점`}
                >
                  <Star className={cn('h-5 w-5', n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300')} />
                </button>
              ))}
              {rating > 0 && <span className="ml-2 text-sm font-semibold text-amber-600">{L.ratedFmt(rating)}</span>}
            </div>
          </div>
        )}
        {reportOpen && (
          <div className="border-b bg-rose-50/50 px-6 py-3">
            <p className="text-xs font-semibold text-gray-700 mb-1.5">이 문항·세트에 문제가 있나요?</p>
            <div className="flex flex-wrap gap-1.5">
              {['오답/정답 오류', '문제 오타', '부적절한 내용', '저작권 문제', '기타'].map((r) => (
                <button
                  key={r}
                  onClick={() => { setReportOpen(false); /* TODO: api/reports */ }}
                  className="rounded-full bg-white px-3 py-1 text-xs ring-1 ring-rose-200 text-rose-700 hover:bg-rose-100"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 문항 브라우저 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-gray-700">{L.questionCountFmt(currentIndex + 1, questions.length)}</div>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={cn('h-1.5 rounded-full transition-all', i === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-200 w-1.5')}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
            <Badge variant="outline" className="rounded-full text-[10px]">{typeLabel(current.type)}</Badge>
            <p className="text-base font-semibold text-gray-900 leading-relaxed">{current.content}</p>

            {current.options && current.options.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {current.options.map((opt) => {
                  const isAnswer = current.answer === String(opt.index) || current.answer.includes(String(opt.index))
                  return (
                    <div
                      key={opt.index}
                      className={cn(
                        'flex items-start gap-2 rounded-lg border px-3 py-2 text-sm',
                        isAnswer ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-gray-200 text-gray-700',
                      )}
                    >
                      <span className="font-semibold shrink-0">{opt.index}.</span>
                      <span>{opt.text}</span>
                      {isAnswer && <span className="ml-auto text-[10px] font-bold text-emerald-600">{L.correctLabel}</span>}
                    </div>
                  )
                })}
              </div>
            )}
            {current.type === 'ox' && (
              <div className="flex gap-2 pt-1">
                {(['O', 'X'] as const).map((v) => {
                  const isAnswer = current.answer === v
                  return (
                    <div
                      key={v}
                      className={cn(
                        'flex-1 rounded-lg border py-3 text-center text-lg font-bold',
                        isAnswer ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-400',
                      )}
                    >
                      {v}
                    </div>
                  )
                })}
              </div>
            )}
            {current.explanation && (
              <p className="text-xs text-gray-500 pt-2 border-t">{L.explanationPrefix} {current.explanation}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> {L.prevBtn}
            </Button>
            <span className="text-xs text-gray-400">{L.keyHint}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex >= questions.length - 1}
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="rounded-full"
            >
              {L.nextBtn} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-6 py-4 shrink-0 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full shrink-0" aria-label={L.saveAria}>
            <Heart className={cn('h-5 w-5', set.is_bookmarked && 'fill-rose-500 text-rose-500')} />
          </Button>
          {isMine && (
            <Button variant="outline" onClick={handleEdit} className="rounded-full">
              <Edit className="h-4 w-4 mr-1.5" /> {L.editBtn}
            </Button>
          )}
          <Button
            onClick={handleStart}
            className="ml-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
          >
            <Zap className="h-4 w-4 mr-1.5" />
            {L.startBtn}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

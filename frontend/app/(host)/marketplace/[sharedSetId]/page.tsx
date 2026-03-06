// S-M03: 마켓플레이스 세트지 상세
// /marketplace/[sharedSetId]

'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Flag, CheckSquare, Square, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { LikeButton } from '@/components/marketplace/LikeButton'
import { ReportDialog } from '@/components/marketplace/ReportDialog'
import type { SharedSet, Question } from '@/types'

interface PageProps {
  params: Promise<{ sharedSetId: string }>
}

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: '객관식',
  ox: 'OX',
  short_answer: '단답형',
}

export default function SharedSetDetailPage({ params }: PageProps) {
  const { sharedSetId } = use(params)
  const router = useRouter()
  const [detail, setDetail] = useState<SharedSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [reportOpen, setReportOpen] = useState(false)

  useEffect(() => {
    fetch(`/api/marketplace/${sharedSetId}`)
      .then((res) => res.json())
      .then((data) => setDetail(data))
      .finally(() => setLoading(false))
  }, [sharedSetId])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div className="space-y-3 mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!detail) return null

  const questions = (detail.questions ?? []) as Question[]

  const toggleQuestion = (qId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(qId)) next.delete(qId)
      else next.add(qId)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === questions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(questions.map((q) => q.question_id)))
    }
  }

  const handleCopySelected = () => {
    // TODO: 기존 세트 선택 다이얼로그 → marketplaceApi.download() 호출
    alert(`${selectedIds.size}개 문항을 내 세트에 추가합니다. (TODO: 세트 선택 다이얼로그)`)
  }

  const handleCopyAll = () => {
    // TODO: marketplaceApi.download() 호출 (full_set)
    alert('전체 세트를 복사합니다. (TODO: 새 세트 생성)')
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* 상단 네비 */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 text-gray-500"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        뒤로
      </Button>

      {/* 세트 정보 */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">{detail.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span>by {detail.host_nickname ?? '교사'}</span>
          <span>·</span>
          <Badge variant="secondary" className="rounded-full">
            {detail.subject}
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {detail.grade}
          </Badge>
          <span>·</span>
          <span>{detail.question_count}문항</span>
        </div>

        {/* 성취기준 */}
        {detail.achievement_standards && detail.achievement_standards.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {detail.achievement_standards.map((std) => (
              <Badge key={std} variant="outline" className="text-xs text-blue-600 border-blue-200">
                {std}
              </Badge>
            ))}
          </div>
        )}

        {/* 좋아요 / 신고 */}
        <div className="flex items-center gap-3">
          <LikeButton
            liked={detail.is_liked ?? false}
            likeCount={detail.like_count}
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-500"
            onClick={() => setReportOpen(true)}
          >
            <Flag className="h-4 w-4 mr-1" />
            신고
          </Button>
        </div>

        {/* 설명 */}
        {detail.description && (
          <p className="text-gray-600 bg-gray-50 rounded-xl p-4 text-sm leading-relaxed">
            {detail.description}
          </p>
        )}
      </div>

      {/* 문항 목록 */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">문항 미리보기</h2>
          <Button variant="ghost" size="sm" onClick={toggleAll} className="text-sm">
            {selectedIds.size === questions.length ? (
              <>
                <CheckSquare className="h-4 w-4 mr-1" />
                전체 해제
              </>
            ) : (
              <>
                <Square className="h-4 w-4 mr-1" />
                전체 선택
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          {questions.map((q, idx) => (
            <div
              key={q.question_id}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer
                ${selectedIds.has(q.question_id)
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              onClick={() => toggleQuestion(q.question_id)}
            >
              <Checkbox
                checked={selectedIds.has(q.question_id)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-400">
                    {idx + 1}.
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {TYPE_LABELS[q.type] ?? q.type}
                  </Badge>
                  {q.difficulty && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {q.difficulty}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-800">{q.content}</p>
                {q.options && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                    {q.options.map((opt) => (
                      <span key={opt.index}>
                        {opt.index}) {opt.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 고정 바 */}
      <div className="sticky bottom-0 mt-8 -mx-6 px-6 py-4 bg-white/90 backdrop-blur border-t flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {selectedIds.size > 0 ? `${selectedIds.size}개 선택` : '문항을 선택하세요'}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={selectedIds.size === 0}
            onClick={handleCopySelected}
            className="gap-1"
          >
            <Copy className="h-4 w-4" />
            선택 문항 내 세트에 추가
          </Button>
          <Button size="sm" onClick={handleCopyAll} className="gap-1">
            <Copy className="h-4 w-4" />
            전체 세트 복사
          </Button>
        </div>
      </div>

      {/* 신고 다이얼로그 */}
      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        onReport={(reason, detail) => {
          // TODO: marketplaceApi.report() 호출
          console.log('Report:', reason, detail)
        }}
      />
    </div>
  )
}

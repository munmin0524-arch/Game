// PublishDialog — 커뮤니티에 공유하기 다이얼로그
// 세트지 목록(S-02) 또는 에디터(S-03)에서 사용

'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { SUBJECT_OPTIONS, getGradeGroups } from '@/lib/filter-constants'

interface PublishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTitle?: string
  onPublish?: (form: {
    title: string
    description: string
    subject: string
    grade: string
    tags: string[]
  }) => void
}

export function PublishDialog({
  open,
  onOpenChange,
  defaultTitle = '',
  onPublish,
}: PublishDialogProps) {
  const [title, setTitle] = useState(defaultTitle)
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const gradeGroups = useMemo(() => getGradeGroups(subject || null), [subject])

  const handleSubjectChange = (v: string) => {
    setSubject(v)
    setGrade('') // 과목 변경 시 학년 초기화
  }

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = () => {
    if (!title.trim() || !subject || !grade) return
    onPublish?.({ title: title.trim(), description, subject, grade, tags })
    onOpenChange(false)
  }

  const isValid = title.trim() && subject && grade

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>커뮤니티에 공유하기</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 제목 */}
          <div className="space-y-1.5">
            <Label htmlFor="pub-title">
              제목 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pub-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공유할 퀴즈 제목"
            />
          </div>

          {/* 설명 */}
          <div className="space-y-1.5">
            <Label htmlFor="pub-desc">설명</Label>
            <Textarea
              id="pub-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="퀴즈에 대한 간단한 설명을 입력하세요"
              rows={3}
            />
          </div>

          {/* 과목 + 학년/학기 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>
                과목 <span className="text-red-500">*</span>
              </Label>
              <Select value={subject} onValueChange={handleSubjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="과목 선택" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value} disabled={!s.enabled}>
                      {s.value}{!s.enabled && ` (${s.label})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>
                학년/학기 <span className="text-red-500">*</span>
              </Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="학년/학기 선택" />
                </SelectTrigger>
                <SelectContent>
                  {gradeGroups.map((group) => (
                    <SelectGroup key={group.group}>
                      <SelectLabel className="text-xs text-gray-400">{group.group}</SelectLabel>
                      {group.items.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 태그 */}
          <div className="space-y-1.5">
            <Label>태그</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="태그 입력 후 Enter"
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                추가
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            공유하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

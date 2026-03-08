// S-09 캐릭터 관리
// Phase S-3에서 구현 예정
'use client'

import { useState } from 'react'
import { Candy } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CHARACTERS = [
  { id: 'lesser', name: '레서', emoji: '🐼', personality: '활발하고 용감한', color: 'from-orange-400 to-red-400' },
  { id: 'pander', name: '팬더', emoji: '🐻', personality: '차분하고 지혜로운', color: 'from-gray-600 to-gray-800' },
  { id: 'dumdum', name: '덤덤', emoji: '🐨', personality: '느긋하고 다정한', color: 'from-blue-400 to-indigo-400' },
]

export default function CharactersPage() {
  const [selected, setSelected] = useState('lesser')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">캐릭터</h1>
        <p className="mt-1 text-sm text-gray-500">내 캐릭터를 선택하고 새 친구를 초대하세요</p>
      </div>

      {/* 내 캐릭터 선택 */}
      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3">내 캐릭터</h2>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {CHARACTERS.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelected(char.id)}
              className={`min-w-[140px] rounded-2xl p-4 text-center transition-all ${
                selected === char.id
                  ? 'bg-blue-50 ring-2 ring-blue-500 shadow-card'
                  : 'bg-white shadow-soft hover:shadow-card'
              }`}
            >
              <span className="text-4xl">{char.emoji}</span>
              <p className="mt-2 text-sm font-bold text-gray-900">{char.name}</p>
              <p className="mt-0.5 text-xs text-gray-500">{char.personality}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 캐릭터 초대 */}
      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-3">캐릭터 초대</h2>
        <div className="space-y-3">
          {CHARACTERS.map((char) => (
            <div key={char.id} className="rounded-xl bg-white p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${char.color}`}>
                  <span className="text-2xl">{char.emoji}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{char.name}</p>
                  <p className="text-xs text-gray-500">{char.personality}</p>
                </div>
              </div>

              {/* 사탕 슬롯 */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-500">사탕:</span>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((slot) => (
                    <div
                      key={slot}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-dashed border-gray-200"
                    >
                      {slot < 2 ? (
                        <Candy className="h-4 w-4 text-pink-400" />
                      ) : (
                        <span className="text-xs text-gray-300">?</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-3 w-full rounded-lg text-sm"
                disabled
              >
                사탕을 모아서 초대하기
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

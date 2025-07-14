'use client'
import React, { useState, useEffect } from 'react'

// 显示助记词的组件（只读）
export function MnemonicDisplay({ mnemonic }: { mnemonic: string }) {
  const words = mnemonic.trim().split(/\s+/)

  return (
    <div className="max-w-md mx-auto">
      <div className="grid grid-cols-4 gap-3">
        {words.map((word, i) => (
          <span
            key={i}
            className="font-mono text-base font-normal border border-gray-300 rounded-md p-2 text-center shadow-sm"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}

interface MnemonicInputProps {
  count: number
  initialValues?: string // 空格分隔的助记词字符串
  onChange?: (mnemonic: string) => void
}
export function MnemonicInput({ count, initialValues, onChange }: MnemonicInputProps) {
  const [words, setWords] = useState<string[]>(Array(count).fill(''))

  // 初始化
  useEffect(() => {
    if (initialValues) {
      const arr = initialValues.trim().split(/\s+/)
      if (arr.length === count) {
        setWords(arr)
      }
    }
  }, [initialValues, count])

  // 修改某个单词
  const onWordChange = (index: number, value: string) => {
    const newWords = [...words]
    newWords[index] = value.trim()
    setWords(newWords)
    onChange?.(newWords.join(' '))
  }

  // 处理粘贴整串助记词
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').trim()
    const pastedWords = pasted.split(/\s+/)
    if (pastedWords.length === count) {
      e.preventDefault()
      setWords(pastedWords)
      onChange?.(pastedWords.join(' '))
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="grid grid-cols-4 gap-3">
        {words.map((word, i) => (
          <input
            key={i}
            type="text"
            value={word}
            onChange={e => onWordChange(i, e.target.value)}
            onPaste={handlePaste} // 所有输入框共享粘贴处理
            placeholder={`${i + 1}`}
            className="font-mono text-base font-normal border border-gray-300 rounded-md p-2 text-center"
            autoComplete="off"
          />
        ))}
      </div>
    </div>
  )
}

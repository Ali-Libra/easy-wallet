'use client'
import React, { useState, useEffect } from 'react'

export function MnemonicDisplay({ mnemonic }: { mnemonic: string }) {
    const words = mnemonic.trim().split(/\s+/) // 分割助记词
    const chunkSize = 4

    // 分块处理，每4个为一组
    const chunks = []
    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize))
    }

    // const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '').length
    // const widthEm = longest + 4 // +4 是为了加上序号和间距

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
    onChange?: (mnemonic: string) => void // 返回空格分隔字符串
}

export function MnemonicInput({ count, initialValues, onChange }: MnemonicInputProps) {
    const [words, setWords] = useState<string[]>(Array(count).fill(''))

    useEffect(() => {
        if (initialValues) {
            const arr = initialValues.trim().split(/\s+/)
            if (arr.length === count) {
                setWords(arr)
            }
        }
    }, [initialValues, count])

    const onWordChange = (index: number, value: string) => {
        const newWords = [...words]
        newWords[index] = value.trim()
        setWords(newWords)
        onChange?.(newWords.join(' '))
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
                        placeholder={`${i + 1}`}
                        className="font-mono text-base font-normal border border-gray-300 rounded-md p-2 text-center"
                        autoComplete="off"
                    />
                ))}
            </div>
        </div>
    )
}
'use client'
import { useRef, useState } from 'react'

type BlockType = 'paragraph' | 'h1'

export default function EditorBlock() {
    const blockRef = useRef<HTMLDivElement>(null)
    const [type, setType] = useState<BlockType>('paragraph')

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Enter') return

        const text = blockRef.current?.innerText.trim()
        if (!text) return

        if (text === '/h1') {
            e.preventDefault()
            setType('h1')
        }
    }

    // Render based on block type
    if (type === 'h1') {
        return (
            <h1
                contentEditable
                suppressContentEditableWarning
                className="outline-none text-3xl font-semibold"
            >
                Heading 1
            </h1>
        )
    }

    return (
        <div
            ref={blockRef}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            className="outline-none min-h-100 bg-white"
        />
    )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
    placeholder?: string
}

export function SearchBar({ placeholder = '楽曲を検索...' }: SearchBarProps) {
    const [query, setQuery] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/sounds?q=${encodeURIComponent(query.trim())}`)
        }
    }

    const handleClear = () => {
        setQuery('')
        inputRef.current?.focus()
    }

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <div
                className={`relative flex items-center rounded-lg border bg-background/50 backdrop-blur-sm transition-all duration-200 ${isFocused
                        ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                        : 'border-white/10'
                    }`}
            >
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full bg-transparent py-2 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </form>
    )
}

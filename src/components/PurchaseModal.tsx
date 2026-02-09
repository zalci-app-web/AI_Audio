'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Play, Pause, CreditCard } from 'lucide-react'
import Image from 'next/image'

interface Song {
    id: string
    title: string
    price: number
    preview_url: string
    image_url: string
    stripe_price_id: string
    has_wav?: boolean
    has_loop?: boolean
    has_high_res?: boolean
    has_midi?: boolean
}

interface PurchaseModalDict {
    duration: string
    preview: string
    playSample: string
    pause: string
    purchaseOptions: string
    totalAmount: string
    payWithStripe: string
    processing: string
    securedBy: string
    options: {
        wav: string
        loop: string
        highRes: string
        midi: string
    }
}

interface PurchaseModalProps {
    isOpen: boolean
    onClose: () => void
    song: Song
    dict: PurchaseModalDict
}

export function PurchaseModal({ isOpen, onClose, song, dict }: PurchaseModalProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsPlaying(false)
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.pause();
            }
        }
    }, [isOpen])

    if (!isOpen) return null

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleEnded = () => {
        setIsPlaying(false)
    }

    const handleCheckout = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    songId: song.id,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                const errorData = data
                throw new Error(errorData.error || 'Checkout failed')
            }

            if (data.url) {
                window.location.href = data.url
            } else {
                throw new Error('No checkout URL received')
            }
        } catch (error) {
            console.error('Checkout error:', error)
            const errorMessage = error instanceof Error ? error.message : '決済処理中にエラーが発生しました。'
            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md my-8 overflow-y-auto max-h-[90vh] rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl transition-all duration-300 animate-in zoom-in-95"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                        <Image
                            src={song.image_url}
                            alt={song.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{song.title}</h2>
                        <p className="text-sm text-gray-400">{dict.duration}: 3:45</p>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="mb-6 rounded-xl bg-black/20 p-4 border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300 leading-tight">
                            {dict.preview.split('(')[0]}<br /><span className="text-xs text-gray-400">({dict.preview.split('(')[1]}</span>
                        </span>
                        <button
                            onClick={togglePlay}
                            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
                        >
                            {isPlaying ? (
                                <><Pause size={12} /> {dict.pause}</>
                            ) : (
                                <><Play size={12} /> {dict.playSample}</>
                            )}
                        </button>
                    </div>
                    {/* Fake Progress Bar */}
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                            className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-[20s] ease-linear ${isPlaying ? 'w-full' : 'w-0'}`}
                        />
                    </div>
                </div>

                {/* Product Info Section */}
                <div className="mb-6 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">内容</h3>
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-200">MP3 音源（フル版）</span>
                            <span className="text-blue-400 font-semibold">✓ 含まれます</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 pt-4">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-gray-400">{dict.totalAmount}</span>
                        <span className="text-2xl font-bold text-white">¥{song.price.toLocaleString()}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CreditCard size={18} />
                        {isLoading ? dict.processing : dict.payWithStripe}
                    </button>

                    <p className="mt-3 text-center text-xs text-gray-500">
                        {dict.securedBy}
                    </p>
                </div>

                <audio
                    ref={audioRef}
                    src={song.preview_url}
                    onEnded={handleEnded}
                />
            </div>
        </div>
    )
}

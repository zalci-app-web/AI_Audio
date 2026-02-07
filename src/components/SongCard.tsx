'use client'

import { useState, useRef } from 'react'
import { Play, Pause, ShoppingCart, Music } from 'lucide-react'
import Image from 'next/image'

interface Song {
    id: string
    title: string
    price: number
    preview_url: string
    image_url: string
    stripe_price_id: string
}

interface SongCardProps {
    song: Song
    dict: {
        buyNow: string
        processing: string
        error: string
    }
}

export function SongCard({ song, dict }: SongCardProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const togglePlay = () => {
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

    const handleBuy = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: song.stripe_price_id,
                }),
            })

            if (!response.ok) {
                if (response.status === 401) {
                    // Redirect to login or show auth modal
                    // For now, redirect to login page (assuming auth flow exists)
                    window.location.href = '/login'
                    return
                }
                throw new Error('Checkout failed')
            }

            const { url } = await response.json()
            window.location.href = url
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 transition duration-500 group-hover:opacity-20 blur-xl" />

            {/* Image Container */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-900">
                {song.image_url ? (
                    <Image
                        src={song.image_url}
                        alt={song.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-600">
                        <Music size={48} />
                    </div>
                )}

                {/* Play Button Overlay */}
                <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus:opacity-100"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-110 transition-transform">
                        {isPlaying ? (
                            <Pause className="h-6 w-6 text-white" fill="currentColor" />
                        ) : (
                            <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
                        )}
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="relative mt-4 space-y-3">
                <div>
                    <h3 className="text-lg font-bold text-white truncate">{song.title}</h3>
                    <p className="text-sm text-gray-400">¥{song.price.toLocaleString()}</p>
                </div>

                <button
                    onClick={handleBuy}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShoppingCart size={16} />
                    {isLoading ? dict.processing : dict.buyNow}
                </button>
            </div>

            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={song.preview_url}
                onEnded={handleEnded}
                className="hidden"
            />
        </div>
    )
}

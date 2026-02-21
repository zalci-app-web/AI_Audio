'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, ShoppingCart, Music, Heart } from 'lucide-react'
import Image from 'next/image'
import { PurchaseModal } from './PurchaseModal'
import { createClient } from '@/lib/supabase/client'

interface Song {
    id: string
    title: string
    description?: string
    price: number
    preview_url: string
    image_url: string
    stripe_price_id: string
    has_wav?: boolean
    has_loop?: boolean
    has_high_res?: boolean
    has_midi?: boolean
}

interface SongCardProps {
    song: Song
    dict: {
        buyNow: string
        processing: string
        error: string
        inLibrary: string
        free: string
        freeDownload: string
        purchaseModal: any
    }
    user?: any
    isPurchased?: boolean
    initialIsFavorited?: boolean
}

export function SongCard({ song, dict, user, isPurchased = false, initialIsFavorited = false }: SongCardProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)

    // Quick inline for client component
    const useRouter = (require('next/navigation').useRouter)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Fetch initial favorite status if user is logged in and it wasn't provided
        if (user && initialIsFavorited === false) {
            const checkFavorite = async () => {
                const { data } = await supabase
                    .from('favorites')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('song_id', song.id)
                    .single()

                if (data) setIsFavorited(true)
            }
            checkFavorite()
        }
    }, [user, song.id, initialIsFavorited, supabase])

    const togglePlay = (e?: React.MouseEvent) => {
        e?.stopPropagation()
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

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!user) {
            router.push('/login')
            return
        }

        setIsFavoriteLoading(true)
        // Optimistic update
        setIsFavorited(!isFavorited)

        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ songId: song.id })
            })

            if (!res.ok) {
                // Revert optimistic update
                setIsFavorited(isFavorited)
            } else {
                const data = await res.json()
                setIsFavorited(data.isFavorited)
            }
            router.refresh()
        } catch (error) {
            console.error('Error toggling favorite:', error)
            setIsFavorited(isFavorited) // Revert on network error
        } finally {
            setIsFavoriteLoading(false)
        }
    }

    const handleBuyClick = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!user) {
            router.push('/login')
            return
        }

        if (isPurchased) {
            router.push('/library')
            return
        }

        // Free Campaign Logic
        try {
            setIsLoading(true)
            const response = await fetch('/api/free-claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ songId: song.id }),
            })

            if (!response.ok) {
                throw new Error('Failed to claim')
            }

            // Increment gamification stats Optimistically on client if free claim succeeds
            fetch('/api/user/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'increment_download' })
            }).catch(e => console.error("Stat update failed silently", e))

            // Refresh to show updated status
            router.refresh()
            router.push('/library')
        } catch (error) {
            console.error('Claim error:', error)
            alert('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] cursor-pointer"
                onClick={() => {
                    if (!user) {
                        router.push('/login')
                        return
                    }
                    if (isPurchased) {
                        router.push('/library')
                        return
                    }
                    handleBuyClick({ stopPropagation: () => { } } as React.MouseEvent)
                }}
            >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 transition duration-500 group-hover:opacity-20 blur-xl" />

                {/* Favorite Button Overlay (Top Right) */}
                <div className="absolute top-6 right-6 z-20">
                    <button
                        onClick={toggleFavorite}
                        disabled={isFavoriteLoading}
                        className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 
                            ${isFavorited
                                ? 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30'
                                : 'bg-black/40 text-gray-400 hover:text-rose-400 hover:bg-black/60'}
                        `}
                    >
                        <Heart
                            size={20}
                            fill={isFavorited ? "currentColor" : "none"}
                            className={`transition-transform ${isFavorited ? 'scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'scale-100 hover:scale-110'}`}
                        />
                    </button>
                </div>

                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-900 mb-4 z-10">
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
                <div className="relative mt-4 space-y-3 z-10">
                    <div>
                        <h3 className="text-lg font-bold text-white truncate pr-8">{song.title}</h3>
                        {song.description && (
                            <p className="text-xs text-gray-400 line-clamp-1 mb-1">{song.description}</p>
                        )}
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-400 line-through">¥{song.price.toLocaleString()}</p>
                            <span className="text-sm font-bold text-green-400">{dict.free}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleBuyClick}
                        disabled={isLoading}
                        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${isPurchased
                            ? 'bg-zinc-700'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600'
                            }`}
                    >
                        {isLoading ? (
                            dict.processing
                        ) : isPurchased ? (
                            dict.inLibrary
                        ) : (
                            <>
                                <ShoppingCart size={16} />
                                {dict.freeDownload}
                            </>
                        )}
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
        </>
    )
}

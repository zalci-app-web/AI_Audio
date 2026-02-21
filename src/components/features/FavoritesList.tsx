'use client'

import { Music, AlertCircle } from 'lucide-react'
import { SongCard } from '@/components/SongCard'
import Link from 'next/link'

interface Song {
    id: string
    title: string
    price: number
    image_url: string
    preview_url: string
    stripe_price_id: string
}

interface FavoritesListProps {
    songs: Song[]
    dict: any
    user: any
    purchasedIds: Set<string>
}

export function FavoritesList({ songs, dict, user, purchasedIds }: FavoritesListProps) {
    if (!songs.length) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-3xl border border-white/5 bg-zinc-900/30 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-rose-500/0 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 ring-1 ring-white/10 group-hover:ring-rose-500/30 transition-all">
                    <Music className="w-10 h-10 text-gray-500 group-hover:text-rose-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-200 mb-2">{dict.myPage.favorites.emptyTitle}</h3>
                <p className="text-gray-400 text-sm max-w-sm mb-6">
                    {dict.myPage.favorites.emptyDesc}
                </p>
                <Link
                    href="/library"
                    className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/10"
                >
                    {dict.myPage.favorites.browseButton}
                </Link>
            </div>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {songs.map((song) => (
                <div key={song.id} className="group relative z-0 hover:z-10 transition-all duration-300">
                    <SongCard
                        song={song}
                        dict={{ ...dict.card, purchaseModal: dict.purchaseModal }}
                        user={user}
                        isPurchased={purchasedIds.has(song.id)}
                        initialIsFavorited={true} // It's in this list, so it is favorited
                    />
                </div>
            ))}
        </div>
    )
}

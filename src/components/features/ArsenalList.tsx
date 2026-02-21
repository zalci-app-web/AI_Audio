'use client'

import { useState } from 'react'
import { Download, Play, Pause, Disc3, FolderDown } from 'lucide-react'
import Image from 'next/image'

interface Song {
    id: string
    title: string
    price: number
    image_url: string
    preview_url: string
    has_wav?: boolean
    has_loop?: boolean
    has_high_res?: boolean
    has_midi?: boolean
    mp3_url?: string
}

interface ArsenalListProps {
    songs: Song[]
    dict: {
        title: string
        subtitle: string
        emptyTitle: string
        emptyDesc: string
        acquired: string
        downloadMp3: string
        downloadWav: string
        downloadStems: string
    }
}

export function ArsenalList({ songs, dict }: ArsenalListProps) {
    const [playingId, setPlayingId] = useState<string | null>(null)
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

    const togglePlay = (songId: string, url: string) => {
        if (playingId === songId) {
            audioElement?.pause()
            setPlayingId(null)
            return
        }

        if (audioElement) {
            audioElement.pause()
        }

        const newAudio = new Audio(url)
        newAudio.play()
        newAudio.onended = () => setPlayingId(null)
        setAudioElement(newAudio)
        setPlayingId(songId)
    }

    const downloadFile = (url: string | undefined, filename: string) => {
        if (!url) return alert("File not available")
        // Basic implementation for MVP. Realistically would fetch blob or open new tab.
        window.open(url, '_blank')
    }

    if (!songs.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-white/5 bg-zinc-900/30">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Disc3 className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-300">{dict.emptyTitle}</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-sm">
                    {dict.emptyDesc}
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-4">
            {songs.map((song) => (
                <div
                    key={song.id}
                    className="group relative flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-white/5 bg-[#050505] transition-all hover:bg-zinc-900/50 hover:border-white/10"
                >
                    <div className="relative w-full sm:w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-900 flex items-center justify-center">
                        {song.image_url ? (
                            <Image src={song.image_url} alt={song.title} fill className="object-cover" />
                        ) : (
                            <Disc3 className="w-8 h-8 text-gray-600" />
                        )}
                        <button
                            onClick={() => togglePlay(song.id, song.preview_url)}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                {playingId === song.id ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-1" />}
                            </div>
                        </button>
                    </div>

                    <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                        <h4 className="font-bold text-gray-200 truncate pr-4">{song.title}</h4>
                        <p className="text-xs text-green-400 font-medium mt-1">{dict.acquired}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                        {/* Always available MVP formats */}
                        <button
                            onClick={() => downloadFile(song.mp3_url || song.preview_url, `${song.title}.mp3`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-gray-300 transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" /> {dict.downloadMp3}
                        </button>

                        {/* STEMS & Premium Formats */}
                        {song.has_wav && (
                            <button
                                onClick={() => alert("WAV download would initiate here")}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 text-xs font-medium transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" /> {dict.downloadWav}
                            </button>
                        )}

                        {(song.has_loop || song.has_midi || song.has_high_res) && (
                            <button
                                onClick={() => alert("STEM/Package download would initiate here")}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 text-xs font-medium transition-colors"
                            >
                                <FolderDown className="w-3.5 h-3.5" /> {dict.downloadStems}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

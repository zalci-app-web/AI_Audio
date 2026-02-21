'use client'

import { useState, useEffect } from 'react'
import { Trophy, Shield, Star, Crown } from 'lucide-react'

interface UserBadgesProps {
    stats: {
        download_count: number
        current_badge: string
        weekly_free_credits_left?: number
        max_credits?: number
    }
    dict: {
        currentTitle: string
        assetsAcquired: string
        nextRankAt: string
        downloads: string
        maxRank: string
        weeklyCredits: string
        creditsRemaining: string
        titles: {
            legendary: string
            master: string
            rising: string
            novice: string
        }
    }
}

export function UserBadges({ stats, dict }: UserBadgesProps) {
    // Animation state
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    // Determine badge icon and color based on title
    const getBadgeDetails = (badge: string) => {
        switch (badge) {
            case 'Legendary Composer':
                return { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.5)]', localizedName: dict.titles.legendary, maxCredits: 10 }
            case 'Sound Master':
                return { icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]', localizedName: dict.titles.master, maxCredits: 5 }
            case 'Rising Creator':
                return { icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]', localizedName: dict.titles.rising, maxCredits: 3 }
            default: // Novice
                return { icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]', localizedName: dict.titles.novice, maxCredits: 1 }
        }
    }

    const details = getBadgeDetails(stats.current_badge)
    const Icon = details.icon

    // Use credits from stats or fallback to badge default
    const creditsLeft = stats.weekly_free_credits_left ?? details.maxCredits
    const maxCredits = stats.max_credits ?? details.maxCredits

    return (
        <div className={`transition-all duration-700 w-full mb-8 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/5 p-6 backdrop-blur-sm shadow-2xl">
                {/* Background glow behind badge */}
                <div className={`absolute top-1/2 right-8 -translate-y-1/2 w-48 h-48 rounded-full blur-[70px] opacity-20 ${details.bg}`} />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-1">
                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em]">{dict.currentTitle}</h3>
                        <div className={`flex items-center gap-4 ${details.color}`}>
                            <div className={`p-2 rounded-xl ${details.bg} border ${details.border}`}>
                                <Icon className={`w-8 h-8 ${details.glow}`} />
                            </div>
                            <span className={`text-3xl sm:text-4xl font-black tracking-tight drop-shadow-lg`}>
                                {details.localizedName}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 font-bold flex items-center gap-2">
                            <span className="uppercase tracking-widest">{dict.assetsAcquired}:</span>
                            <span className="text-gray-200 bg-white/5 px-2 py-0.5 rounded border border-white/5">{stats.download_count}</span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start md:items-end gap-6 w-full md:w-auto">
                        {/* Weekly Credits Section */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 min-w-[200px]">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                                <Star className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{dict.weeklyCredits}</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-gray-100">{creditsLeft}</span>
                                    <span className="text-xs text-gray-500 font-bold">/ {maxCredits}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-left md:text-right space-y-2 pb-1">
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">{dict.nextRankAt}</div>
                                <div className="text-lg font-black text-gray-200">
                                    {stats.download_count < 5 ? `5 ${dict.downloads}` :
                                        stats.download_count < 20 ? `20 ${dict.downloads}` :
                                            stats.download_count < 50 ? `50 ${dict.downloads}` : dict.maxRank}
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]`}
                                    style={{
                                        width: stats.download_count < 5 ? `${(stats.download_count / 5) * 100}%` :
                                            stats.download_count < 20 ? `${(stats.download_count / 20) * 100}%` :
                                                stats.download_count < 50 ? `${(stats.download_count / 50) * 100}%` : '100%'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { Trophy, Shield, Star, Crown } from 'lucide-react'

interface UserBadgesProps {
    stats: {
        download_count: number
        current_badge: string
    }
}

export function UserBadges({ stats }: UserBadgesProps) {
    // Animation state
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    // Determine badge icon and color based on title
    const getBadgeDetails = (badge: string) => {
        switch (badge) {
            case 'Legendary Composer':
                return { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.5)]' }
            case 'Sound Master':
                return { icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]' }
            case 'Rising Creator':
                return { icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]' }
            default: // Novice
                return { icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' }
        }
    }

    const details = getBadgeDetails(stats.current_badge)
    const Icon = details.icon

    return (
        <div className={`transition-all duration-700 w-full mb-8 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/5 p-6 backdrop-blur-sm">
                {/* Background glow behind badge */}
                <div className={`absolute top-1/2 right-8 -translate-y-1/2 w-32 h-32 rounded-full blur-[50px] opacity-20 ${details.bg}`} />

                <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Current Title</h3>
                        <div className={`flex items-center gap-3 ${details.color}`}>
                            <Icon className={`w-8 h-8 ${details.glow} rounded-full`} />
                            <span className={`text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md`}>
                                {stats.current_badge}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 font-medium">Assets Acquired: <span className="text-gray-300 font-bold">{stats.download_count}</span></p>
                    </div>

                    <div className="hidden sm:block text-right">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Next Rank At</div>
                        <div className="text-sm font-bold text-gray-300">
                            {stats.download_count < 5 ? '5 Downloads' :
                                stats.download_count < 20 ? '20 Downloads' :
                                    stats.download_count < 50 ? '50 Downloads' : 'MAX RANK'}
                        </div>
                        {/* Progress bar placeholder */}
                        <div className="w-24 h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden">
                            <div
                                className={`h-full ${details.bg.replace('/10', '')}`}
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
    )
}

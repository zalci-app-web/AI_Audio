'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Play, Pause, CreditCard, Check } from 'lucide-react'
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
    const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const OPTIONS = [
        { id: 'wav', label: dict.options.wav, price: 300, isAvailable: song.has_wav || false },
        { id: 'loop', label: dict.options.loop, price: 300, isAvailable: song.has_loop || false },
        { id: 'high-res', label: dict.options.highRes, price: 500, isAvailable: song.has_high_res || false },
        { id: 'midi', label: dict.options.midi, price: 200, isAvailable: song.has_midi || false },
    ]

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsPlaying(false)
            setSelectedOptions(new Set())
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.pause();
            }
        }
    }, [isOpen])

    if (!isOpen) return null

    const toggleOption = (optionId: string) => {
        // Check if option is available
        const option = OPTIONS.find(o => o.id === optionId)
        if (!option?.isAvailable) return

        const newOptions = new Set(selectedOptions)
        if (newOptions.has(optionId)) {
            newOptions.delete(optionId)
        } else {
            newOptions.add(optionId)
        }
        setSelectedOptions(newOptions)
    }

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

    const totalPrice = song.price + Array.from(selectedOptions).reduce((acc, id) => {
        const option = OPTIONS.find(o => o.id === id)
        return acc + (option?.price || 0)
    }, 0)

    const handleCheckout = async () => {
        try {
            setIsLoading(true)
            // Note: In a real app, we would send selectedOptions to the backend
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: song.stripe_price_id,
                    // options: Array.from(selectedOptions) // Backend logic needed
                }),
            })

            if (!response.ok) throw new Error('Checkout failed')

            const { url } = await response.json()
            window.location.href = url
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Checkout failed. Please try again.')
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
                        <span className="text-sm font-medium text-gray-300">{dict.preview}</span>
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

                {/* Options Section */}
                <div className="mb-6 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{dict.purchaseOptions}</h3>

                    <div className="space-y-2">
                        {OPTIONS.map(option => (
                            <label
                                key={option.id}
                                className={`flex items-center justify-between rounded-lg border p-3 transition-all ${!option.isAvailable
                                    ? 'border-white/5 bg-zinc-800/50 opacity-50 cursor-not-allowed'
                                    : selectedOptions.has(option.id)
                                        ? 'border-blue-500/50 bg-blue-500/10 cursor-pointer'
                                        : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10 cursor-pointer'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-5 w-5 items-center justify-center rounded border ${!option.isAvailable
                                        ? 'border-gray-600 bg-gray-700'
                                        : selectedOptions.has(option.id)
                                            ? 'border-blue-500 bg-blue-500 text-white'
                                            : 'border-gray-500 bg-transparent'
                                        }`}>
                                        {selectedOptions.has(option.id) && <Check size={12} />}
                                    </div>
                                    <span className={`text-sm ${!option.isAvailable ? 'text-gray-500' : 'text-gray-200'}`}>
                                        {option.label}
                                        {!option.isAvailable && <span className="ml-2 text-xs">(利用不可)</span>}
                                    </span>
                                </div>
                                <span className={`text-sm ${!option.isAvailable ? 'text-gray-600' : 'text-gray-400'}`}>
                                    +¥{option.price}
                                </span>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedOptions.has(option.id)}
                                    onChange={() => toggleOption(option.id)}
                                    disabled={!option.isAvailable}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 pt-4">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-gray-400">{dict.totalAmount}</span>
                        <span className="text-2xl font-bold text-white">¥{totalPrice.toLocaleString()}</span>
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

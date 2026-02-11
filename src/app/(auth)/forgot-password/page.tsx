'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Music, Loader2, ArrowLeft } from 'lucide-react'
import { dictionaries } from '@/lib/dictionaries'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // Simple locale detection
    const [dict, setDict] = useState(dictionaries.en.forgotPassword)

    useEffect(() => {
        const isJa = document.cookie.includes('NEXT_LOCALE=ja') || navigator.language.startsWith('ja')
        setDict(isJa ? dictionaries.ja.forgotPassword : dictionaries.en.forgotPassword)
    }, [])

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=/update-password`,
            })

            if (error) throw error
            setSuccessMessage(dict.successDesc)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#000000] p-4 text-gray-100 font-sans">
            <Link href="/" className="mb-8 flex items-center space-x-2">
                <Music className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Zalci Audio
                </span>
            </Link>

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur shadow-xl">
                <div className="mb-6 text-center">
                    <h1 className="text-xl font-bold text-white mb-2">{dict.title}</h1>
                    <p className="text-sm text-gray-400">{dict.description}</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 rounded-lg bg-green-500/10 p-4 text-sm text-green-400 border border-green-500/20">
                        <h3 className="font-bold mb-1">{dict.successTitle}</h3>
                        <p>{successMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-400">
                            {dict.emailLabel}
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="hello@example.com"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-bold hover:opacity-90 transition-opacity py-6"
                    >
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dict.loading}</>
                        ) : (
                            dict.submitButton
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {dict.backToLogin}
                    </Link>
                </div>
            </div>
        </div>
    )
}

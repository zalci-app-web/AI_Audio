'use client'

import { useState, useEffect, Suspense } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Music, Loader2 } from 'lucide-react'
import { dictionaries } from '@/lib/dictionaries'

function LoginContent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [newsletterConsent, setNewsletterConsent] = useState(false)
    const router = useRouter()
    // useSearchParams is safe here because this component is wrapped in Suspense
    const searchParams = useSearchParams()

    // Simple way to detect locale on client for now, or default to en
    // ideally we pass this from server component wrappers
    const [dict, setDict] = useState<typeof dictionaries.en.login>(dictionaries.en.login)

    useEffect(() => {
        // Check cookie or simple detection
        const isJa = document.cookie.includes('NEXT_LOCALE=ja') || navigator.language.startsWith('ja')
        setDict(isJa ? dictionaries.ja.login : dictionaries.en.login)
    }, [])

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
                        data: {
                            newsletter_subscribed: newsletterConsent
                        }
                    },
                })
                if (error) throw error
                // Force logout just in case session was created
                await supabase.auth.signOut()
                setIsSignUp(false)
                setSuccessMessage(dict.signUpSuccess)
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/')
                router.refresh()
            }
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
                    <h1 className="text-2xl font-bold text-white">
                        {isSignUp ? dict.createAccount : dict.welcome}
                    </h1>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 rounded-lg bg-green-500/10 p-4 text-sm text-green-400 border border-green-500/20">
                        <h3 className="font-bold mb-1">{dict.welcome}</h3>
                        <p>{successMessage}</p>
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
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
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-400">
                                {dict.passwordLabel}
                            </label>
                            {!isSignUp && (
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                                >
                                    {dict.forgotPassword}
                                </Link>
                            )}
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {isSignUp && (
                        <>
                            <div className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="mt-1 h-4 w-4 rounded border-gray-300 bg-black/50 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-400">
                                    <Link href="/terms" target="_blank" className="text-blue-400 hover:underline">利用規約</Link>
                                    と
                                    <Link href="/policy" target="_blank" className="text-blue-400 hover:underline">プライバシーポリシー</Link>
                                    に同意します
                                </label>
                            </div>
                            <div className="flex items-start space-x-2 mt-4">
                                <input
                                    type="checkbox"
                                    id="newsletter"
                                    checked={newsletterConsent}
                                    onChange={(e) => setNewsletterConsent(e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-gray-300 bg-black/50 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="newsletter" className="text-sm text-gray-400">
                                    {dict.newsletterLabel}
                                </label>
                            </div>
                        </>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-bold hover:opacity-90 transition-opacity py-6"
                    >
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dict.loading}</>
                        ) : (
                            isSignUp ? dict.submitButtonSignUp : dict.submitButton
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        {isSignUp ? dict.hasAccount : dict.noAccount}
                    </button>
                    <p className="mt-4 text-xs text-gray-600">
                        <Link href="/" className="hover:text-gray-400">
                            &larr; {dict.backToHome}
                        </Link>
                    </p>
                </div>
            </div >
        </div >
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#000000]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}

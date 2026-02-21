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

        if (searchParams.get('registered') === 'true') {
            setSuccessMessage(isJa ? dictionaries.ja.login.signUpSuccess : dictionaries.en.login.signUpSuccess)
            // Optional: Clean up URL
            // router.replace('/login') 
        }
    }, [searchParams])

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
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
                if (error) throw error

                // Automatically sign in after sign up
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (signInError) throw signInError

                router.push('/')
                router.refresh()
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
            const msg = e.message || ''
            if (msg.includes('Invalid login credentials')) {
                setError(dict.errors.invalidCredentials)
            } else if (msg.includes('User already registered')) {
                setError(dict.errors.userExists)
            } else if (msg.includes('Password should be at least 6 characters')) {
                setError(dict.errors.weakPassword)
            } else {
                setError(dict.errors.unknown)
                console.error('Auth Error:', e)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleOAuthSignIn = async (provider: 'google' | 'twitter') => {
        setIsLoading(true)
        setError(null)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (e: any) {
            setError(e.message)
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
                        {isSignUp ? dict.createAccount : (successMessage ? '' : dict.welcome)}
                    </h1>
                </div>

                {email && password && !isLoading && !error && !successMessage && (
                    <div className="mb-4 text-center text-sm font-medium text-blue-400 animate-pulse">
                        {dict.inputComplete}
                    </div>
                )}

                {error && (
                    <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 rounded-lg bg-green-500/10 p-4 text-sm text-green-400 border border-green-500/20">
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

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-[#18181b] px-2 text-gray-500">{dict.continueWith}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <Button
                        variant="outline"
                        onClick={() => handleOAuthSignIn('google')}
                        disabled={isLoading}
                        className="w-full border-white/10 hover:bg-white/5 hover:text-white"
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        {dict.google}
                    </Button>
                </div>

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

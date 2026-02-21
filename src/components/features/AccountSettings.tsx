'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Mail, Github, Chrome, Twitter } from 'lucide-react'

interface AccountSettingsProps {
    dict: any
    email: string
    provider: string
}

export function AccountSettings({ dict, email, provider }: AccountSettingsProps) {
    const router = useRouter()
    const supabase = createClient()
    const [isDeleting, setIsDeleting] = useState(false)

    const getProviderDisplay = (provider: string) => {
        switch (provider) {
            case 'google':
                return { name: dict.providerGoogle, icon: Chrome, color: 'text-blue-400' }
            case 'twitter':
                return { name: dict.providerTwitter, icon: Twitter, color: 'text-sky-400' }
            default:
                return { name: dict.providerEmail, icon: Mail, color: 'text-gray-400' }
        }
    }

    const providerInfo = getProviderDisplay(provider)
    const ProviderIcon = providerInfo.icon

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        try {
            const res = await fetch('/api/auth/delete-account', {
                method: 'POST',
            })

            if (!res.ok) throw new Error('Failed to delete account')

            // Sign out and redirect happens on success
            await supabase.auth.signOut() // Client side cleanup just in case
            router.push('/')
            router.refresh()
            alert(dict.deleteSuccess)
        } catch (error) {
            console.error(error)
            alert(dict.deleteError)
            setIsDeleting(false)
        }
    }
    const [isSendingReset, setIsSendingReset] = useState(false)

    const handleChangePassword = async () => {
        setIsSendingReset(true)
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=/update-password`,
            })
            if (error) throw error
            alert(dict.passwordResetEmailSent)
        } catch (error: any) {
            console.error(error)
            if (
                error.message?.includes('security purposes') ||
                error.message?.includes('rate limit') ||
                error.status === 429
            ) {
                alert(dict.rateLimitError)
            } else {
                alert(dict.passwordResetError)
            }
        } finally {
            setIsSendingReset(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">{dict.accountSettings}</h2>

                <div className="grid gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                            {dict.email}
                        </label>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-200 flex items-center justify-between group h-14">
                            <span className="font-medium">{email}</span>
                            <Mail className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                            {dict.signInMethod}
                        </label>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-200 flex items-center justify-between group h-14">
                            <span className="font-medium">{providerInfo.name}</span>
                            <ProviderIcon className={`w-5 h-5 ${providerInfo.color} drop-shadow-[0_0_8px_currentColor]`} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    {provider === 'email' && (
                        <Button variant="outline" onClick={handleChangePassword} disabled={isSendingReset} className="rounded-xl border-white/10 hover:bg-white/5 h-11 px-6 font-bold">
                            <span>{isSendingReset ? '...' : dict.changePassword}</span>
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleSignOut} className="rounded-xl border-white/10 hover:bg-white/5 h-11 px-6 font-bold">
                        {dict.logout}
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting} className="rounded-xl h-11 px-6 font-bold">
                                <span>{isDeleting ? '...' : dict.deleteAccount}</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-950 border-white/10 rounded-3xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold">{dict.deleteConfirmTitle}</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                    {dict.deleteConfirmDescription}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 rounded-xl">{dict.cancel}</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleDeleteAccount()
                                    }}
                                    className="bg-red-600/20 text-red-500 border border-red-500/20 hover:bg-red-600/30 rounded-xl font-bold"
                                >
                                    {dict.deleteConfirmButton}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    )
}

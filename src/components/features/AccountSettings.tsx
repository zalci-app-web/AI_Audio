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

interface AccountSettingsProps {
    dict: any // Type this properly if possible, e.g. typeof dictionaries.ja.myPage
    email: string
}

export function AccountSettings({ dict, email }: AccountSettingsProps) {
    const router = useRouter()
    const supabase = createClient()
    const [isDeleting, setIsDeleting] = useState(false)

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
            <div className="space-y-4">
                <h2 className="text-lg font-medium">{dict.accountSettings}</h2>
                <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {dict.email}
                    </label>
                    <div className="p-3 rounded-md bg-muted text-sm">
                        {email}
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Button variant="outline" onClick={handleChangePassword} disabled={isSendingReset}>
                        <span>{isSendingReset ? '...' : dict.changePassword}</span>
                    </Button>
                    <Button variant="outline" onClick={handleSignOut}>
                        {dict.logout}
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
                                <span>{isDeleting ? '...' : dict.deleteAccount}</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{dict.deleteConfirmTitle}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {dict.deleteConfirmDescription}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{dict.cancel}</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleDeleteAccount()
                                    }}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

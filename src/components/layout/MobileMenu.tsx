'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { createBrowserClient } from '@supabase/ssr'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface MobileMenuProps {
    dict: any
    user: boolean
}

export function MobileMenu({ dict, user }: MobileMenuProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setOpen(false)
        router.push('/')
        router.refresh()
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinc-950 border-zinc-800">
                <VisuallyHidden>
                    <SheetTitle>Mobile Menu</SheetTitle>
                </VisuallyHidden>
                <nav className="flex flex-col space-y-4 mt-8">
                    <Link
                        href="/"
                        className="text-lg font-semibold hover:text-blue-400 transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/sounds"
                        className="text-lg font-semibold hover:text-blue-400 transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        {dict.sounds}
                    </Link>
                    <Link
                        href="/library"
                        className="text-lg font-semibold hover:text-blue-400 transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        {user ? dict.myLibrary : dict.library}
                    </Link>
                    <Link
                        href="/about"
                        className="text-lg font-semibold hover:text-blue-400 transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        {dict.about}
                    </Link>
                    <Link
                        href="/terms"
                        className="text-lg font-semibold hover:text-blue-400 transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        {dict.terms}
                    </Link>
                    <Link
                        href="/policy"
                        className="text-lg font-semibold hover:text-blue-400 transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        {dict.privacy}
                    </Link>
                    <Link
                        href="/legal"
                        className="text-lg font-semibold hover:text-blue-400 transition-colors"
                        onClick={() => setOpen(false)}
                    >
                        {dict.legal}
                    </Link>

                    <div className="h-px bg-white/10 my-4" />

                    {user ? (
                        <div className="flex flex-col space-y-3">
                            <Link href="/library" onClick={() => setOpen(false)}>
                                <Button className="w-full" variant="secondary">
                                    {dict.myPage}
                                </Button>
                            </Link>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={handleSignOut}
                            >
                                {dict.signOut}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-3">
                            <Link href="/login" onClick={() => setOpen(false)}>
                                <Button variant="outline" className="w-full">
                                    {dict.login}
                                </Button>
                            </Link>
                            <Link href="/login" onClick={() => setOpen(false)}>
                                <Button className="w-full">
                                    {dict.getStarted}
                                </Button>
                            </Link>
                        </div>
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    )
}

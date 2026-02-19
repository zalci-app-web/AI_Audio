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

                    <div className="pt-2 pb-2">
                        <p className="text-sm text-muted-foreground mb-2 px-1">Categories:</p>
                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                href="/sounds?q=RPG"
                                className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 text-center text-sm hover:bg-white/10 hover:text-blue-400 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                RPG
                            </Link>
                            <Link
                                href="/sounds?q=Battle"
                                className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 text-center text-sm hover:bg-white/10 hover:text-red-400 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                Battle
                            </Link>
                            <Link
                                href="/sounds?q=Horror"
                                className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 text-center text-sm hover:bg-white/10 hover:text-purple-400 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                Horror
                            </Link>
                            <Link
                                href="/sounds?q=Piano"
                                className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 text-center text-sm hover:bg-white/10 hover:text-cyan-400 transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                Piano
                            </Link>
                        </div>
                    </div>

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
                            <Link href="/mypage" onClick={() => setOpen(false)}>
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

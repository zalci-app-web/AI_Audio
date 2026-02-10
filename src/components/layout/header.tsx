import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { Music, Menu, X as XIcon } from 'lucide-react' // Renamed X to XIcon to avoid confusion with Twitter's X
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { SearchBar } from '@/components/SearchBar'
import { dictionaries } from '@/lib/dictionaries'
import { MobileMenu } from './MobileMenu' // New client component for mobile menu
import { NotificationBell } from '@/components/features/NotificationBell'

interface HeaderProps {
    dict: typeof dictionaries.en.header
    notifications: any
}

export async function Header({ dict, notifications }: HeaderProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fallback if dict is not provided
    const t = dict || dictionaries.en.header

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">

                {/* Mobile Menu Trigger & Logo (Mobile) */}
                <div className="md:hidden flex items-center w-full justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Music className="h-6 w-6" />
                        <span className="font-bold">
                            {t.title}
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <NotificationBell dict={notifications} />
                        <MobileMenu dict={t} user={!!user} />
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-10 flex items-center space-x-2">
                        <Music className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">
                            {t.title}
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/sounds" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            {t.sounds}
                        </Link>
                        <Link href="/library" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            {user ? t.myLibrary : t.library}
                        </Link>
                        <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            {t.about}
                        </Link>
                        <Link href="/terms" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            {t.terms}
                        </Link>
                        <Link href="/legal" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            {t.legal}
                        </Link>
                    </nav>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none md:min-w-[300px]">
                        <SearchBar placeholder={t.searchPlaceholder} />
                    </div>
                    <nav className="flex items-center space-x-4">
                        <LanguageSwitcher />
                        {user ? (
                            <Link href="/library">
                                <Button variant="secondary" size="sm">
                                    {t.myPage}
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        {t.login}
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="sm">{t.getStarted}</Button>
                                </Link>
                            </>
                        )}
                        <NotificationBell dict={notifications} />
                    </nav>
                </div>
            </div>
        </header>
    )
}

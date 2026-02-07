import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { Music } from 'lucide-react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { SearchBar } from '@/components/SearchBar'
import { dictionaries } from '@/lib/dictionaries'

interface HeaderProps {
    dict: typeof dictionaries.en.header
}

export async function Header({ dict }: HeaderProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fallback if dict is not provided (though page.tsx should pass it)
    const t = dict || dictionaries.en.header

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
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
                            Library
                        </Link>
                        <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            {t.about}
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none md:min-w-[300px]">
                        <SearchBar placeholder={t.searchPlaceholder} />
                    </div>
                    <nav className="flex items-center space-x-4">
                        <LanguageSwitcher />
                        {user ? (
                            <form action="/auth/signout" method="post">
                                <Button variant="ghost" size="sm">
                                    {t.signOut}
                                </Button>
                            </form>
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
                    </nav>
                </div>
            </div>
        </header>
    )
}

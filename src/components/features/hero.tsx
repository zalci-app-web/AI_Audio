import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { dictionaries } from '@/lib/i18n'

import { User } from '@supabase/supabase-js'

interface HeroProps {
    dict: typeof dictionaries.en.hero
    user?: User | null
}

export function Hero({ dict, user }: HeroProps) {
    // Fallback
    const t = dict || dictionaries.en.hero

    return (
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
                <Link
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(t.title)}&url=https://zalci-audio.vercel.app`}
                    className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
                    target="_blank"
                >
                    {t.twitterShare}
                </Link>
                <div className="h-4"></div> { /* Spacer */}
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance break-auto-phrase whitespace-pre-line">
                    {t.title}
                </h1>
                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-pretty whitespace-pre-line">
                    {t.description}
                </p>
                <div className="space-x-4">
                    {user ? (
                        <Button size="lg" className="h-11 px-8 gap-2" disabled>
                            {t.loggedIn}
                        </Button>
                    ) : (
                        <Link href="/login">
                            <Button size="lg" className="h-11 px-8 gap-2">
                                {t.getStarted} <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    <Link href="/library">
                        <Button variant="outline" size="lg" className="h-11 px-8">
                            {t.browseLibrary}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

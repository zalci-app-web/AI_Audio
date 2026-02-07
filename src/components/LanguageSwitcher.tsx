'use client'

import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
    const switchLanguage = (locale: 'en' | 'ja') => {
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
        window.location.reload()
    }

    return (
        <div className="flex items-center gap-1">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div className="flex text-xs font-medium">
                <button
                    onClick={() => switchLanguage('en')}
                    className="px-1 hover:text-primary transition-colors"
                >
                    EN
                </button>
                <span className="text-muted-foreground">/</span>
                <button
                    onClick={() => switchLanguage('ja')}
                    className="px-1 hover:text-primary transition-colors"
                >
                    JP
                </button>
            </div>
        </div>
    )
}

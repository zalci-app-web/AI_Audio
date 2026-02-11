import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t py-6 md:px-8 md:py-0 bg-background/50 backdrop-blur-sm">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row text-sm text-muted-foreground">
                <p>&copy; 2026 Zalci Audio. All rights reserved.</p>
                <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                    <Link href="/terms" className="hover:text-white transition-colors">
                        利用規約
                    </Link>
                    <Link href="/policy" className="hover:text-white transition-colors">
                        プライバシーポリシー
                    </Link>
                    <Link href="/legal" className="hover:text-white transition-colors">
                        特定商取引法に基づく表記
                    </Link>
                </nav>
            </div>
        </footer>
    )
}

import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t py-6 md:px-8 md:py-0 bg-background/50 backdrop-blur-sm">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row text-sm text-muted-foreground">
                <p>&copy; 2026 Zalci Audio. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <Link href="https://x.com/zalci_ai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span className="text-xs">Official X</span>
                    </Link>
                </div>
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
                    <Link href="/contact" className="hover:text-white transition-colors">
                        お問い合わせ
                    </Link>
                </nav>
            </div>
        </footer>
    )
}

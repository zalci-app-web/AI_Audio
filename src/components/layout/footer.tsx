import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t py-6 md:px-8 md:py-0 bg-background/50 backdrop-blur-sm">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row text-sm text-muted-foreground">
                <p>&copy; 2026 Zalci Audio. All rights reserved.</p>
            </div>
        </footer>
    )
}

import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getDictionary } from '@/lib/i18n'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Download, Heart } from 'lucide-react'
import Image from 'next/image'

export default async function LibraryPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const dict = await getDictionary()

    let purchasedSongs: any[] = []

    if (user) {
        // Fetch purchased songs by joining purchases with songs
        const { data, error } = await supabase
            .from('purchases')
            .select(`
                id,
                created_at,
                songs (
                    id,
                    title,
                    price,
                    preview_url,
                    image_url,
                    description
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (!error && data) {
            purchasedSongs = data.map(purchase => ({
                purchaseId: purchase.id,
                purchasedAt: purchase.created_at,
                ...purchase.songs
            }))
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans">
            <Header dict={dict.header} notifications={dict.notifications} />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="mb-12">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            {dict.library.title}
                        </h1>
                        <p className="text-xl text-gray-400">
                            {dict.library.description}
                        </p>
                    </div>

                    {!user ? (
                        <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/50 p-8 text-center">
                            <h2 className="mb-4 text-2xl font-bold text-white">{dict.library.signInTitle}</h2>
                            <p className="mb-8 text-gray-400">
                                {dict.library.signInDesc}
                            </p>
                            <Link href="/login">
                                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                                    {dict.library.signInButton}
                                </Button>
                            </Link>
                        </div>
                    ) : purchasedSongs.length === 0 ? (
                        <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/30 p-8 text-center">
                            <div className="mb-4 rounded-full bg-white/5 p-4">
                                <span className="text-4xl">🎵</span>
                            </div>
                            <h2 className="mb-2 text-xl font-bold text-white">{dict.library.emptyTitle}</h2>
                            <p className="mb-8 max-w-md text-gray-400">
                                {dict.library.emptyDesc}
                            </p>
                            <Link href="/sounds">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {dict.library.browseButton}
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {purchasedSongs.map((song) => (
                                <div
                                    key={song.purchaseId}
                                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-4 transition-all duration-300 hover:border-blue-500/50"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-900 mb-4">
                                        {song.image_url && (
                                            <Image
                                                src={song.image_url}
                                                alt={song.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-white truncate">{song.title}</h3>
                                            <p className="text-sm text-gray-400">
                                                {dict.library.purchasedPrefix} {new Date(song.purchasedAt).toLocaleDateString('ja-JP')}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link href={`/api/download?songId=${song.id}`} className="flex-1">
                                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
                                                    <Download size={16} className="mr-2" />
                                                    Download
                                                </Button>
                                            </Link>
                                            <Button variant="outline" size="icon">
                                                <Heart size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}

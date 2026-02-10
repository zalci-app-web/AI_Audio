import { createClient } from '@/lib/supabase/server'
import { SongCard } from '@/components/SongCard'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getDictionary } from '@/lib/i18n'
import { SortSelect } from '@/components/features/SortSelect'

export default async function SoundsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; sort?: string }>
}) {
    let songs = null
    let error = null
    const params = await searchParams
    const searchQuery = params.q?.trim() || ''
    const sortOption = params.sort || 'latest'

    try {
        const supabase = await createClient()
        let query = supabase
            .from('songs')
            .select('*')

        // Apply search filter if query exists
        if (searchQuery) {
            query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        }

        // Apply sorting
        switch (sortOption) {
            case 'oldest':
                query = query.order('created_at', { ascending: true })
                break
            case 'priceHigh': // Future proofing, though currently fixed
                query = query.order('price', { ascending: false })
                break
            case 'priceLow':
                query = query.order('price', { ascending: true })
                break
            case 'name_asc':
                query = query.order('title', { ascending: true })
                break
            case 'name_desc':
                query = query.order('title', { ascending: false })
                break
            case 'latest':
            default:
                query = query.order('created_at', { ascending: false })
                break
        }

        const response = await query

        songs = response.data

        // Only treat as error if there's an actual error, not just empty results
        if (response.error) {
            error = response.error
        }

    } catch (e) {
        console.error('Unexpected Error:', e)
        error = e
    }

    const dict = await getDictionary()

    return (
        <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans">
            <Header dict={dict.header} notifications={dict.notifications} />

            <main className="flex-1 pt-24 pb-16">
                <section className="container mx-auto px-4">
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                {dict.sounds.title}
                            </h1>
                            <p className="text-xl text-gray-400">
                                {searchQuery ? (
                                    <>検索結果: &quot;{searchQuery}&quot;</>
                                ) : (
                                    dict.sounds.description
                                )}
                            </p>
                        </div>

                        <div className="shrink-0">
                            <SortSelect dict={dict.sounds.sort} />
                        </div>
                    </div>

                    {error ? (
                        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 text-gray-300">
                            <p>{dict.sounds.failed}</p>
                            <p className="text-sm opacity-70 mt-2">{(error as any)?.message}</p>
                        </div>
                    ) : !songs?.length ? (
                        <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/50">
                            <p className="text-gray-400">{dict.sounds.empty}</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {songs.map((song) => (
                                <SongCard
                                    key={song.id}
                                    song={song}
                                    dict={{ ...dict.card, purchaseModal: dict.purchaseModal }}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}

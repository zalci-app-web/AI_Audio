import { createClient } from '@/lib/supabase/server'
import { SongCard } from '@/components/SongCard'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/features/hero'
import { getDictionary } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let songs = null
  let error = null
  const supabase = await createClient()

  try {
    const response = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4) // Top page only shows latest 4

    songs = response.data

    // Only set error if there's an actual error (will be shown in UI)
    if (response.error) {
      error = response.error
    }
  } catch (e) {
    console.error('Unexpected Error:', e)
    error = e as any
  }

  const dict = await getDictionary()

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100">
        <Header dict={dict.header} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl text-red-400 mb-2">Error Loading Songs</h2>
            <p className="text-gray-400 text-sm">{error.message || 'Unknown error occurred'}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans">
      <Header dict={dict.header} />

      <main className="flex-1">
        <Hero dict={dict.hero} user={user} />

        <section className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 sm:text-4xl">
              {dict.featured.title}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              {dict.featured.description}
            </p>
          </div>

          {!songs?.length ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/50">
              <p className="text-gray-400">{dict.empty}</p>
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

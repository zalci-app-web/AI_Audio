import { createClient } from '@/lib/supabase/server'
import { SongCard } from '@/components/SongCard'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/features/hero'
import { getDictionary } from '@/lib/i18n'

export default async function Home() {
  const supabase = await createClient()
  const { data: songs } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false })

  const dict = await getDictionary()

  return (
    <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100">
      <Header />

      <main className="flex-1">
        <Hero />

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
            <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <p className="text-gray-400">{dict.empty}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} dict={dict.card} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

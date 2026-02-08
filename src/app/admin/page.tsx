import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AddSongForm } from '@/components/admin/AddSongForm'
import { DeleteSongButton } from '@/components/admin/DeleteSongButton'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getDictionary } from '@/lib/i18n'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check if user is authenticated
    if (!user) {
        redirect('/login')
    }

    // Fetch all songs
    const { data: songs, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })

    const dict = await getDictionary()

    return (
        <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans">
            <Header dict={dict.header} />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="mb-12">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            楽曲管理
                        </h1>
                        <p className="text-xl text-gray-400">
                            楽曲の追加・編集・削除を行います
                        </p>
                    </div>

                    {/* Add Song Form */}
                    <div className="mb-12">
                        <AddSongForm />
                    </div>

                    {/* Songs List */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">登録済み楽曲</h2>

                        {error ? (
                            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 text-gray-300">
                                <p>楽曲の読み込みに失敗しました</p>
                            </div>
                        ) : !songs?.length ? (
                            <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/50">
                                <p className="text-gray-400">楽曲がまだ登録されていません</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {songs.map((song) => (
                                    <div
                                        key={song.id}
                                        className="rounded-xl border border-white/10 bg-zinc-900 p-4 hover:border-blue-500/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white">{song.title}</h3>
                                                <p className="text-sm text-gray-400">{song.description}</p>
                                                <div className="mt-2 flex gap-2 text-xs">
                                                    <span className="rounded bg-blue-500/20 px-2 py-1 text-blue-400">
                                                        ¥{song.price.toLocaleString()}
                                                    </span>
                                                    {song.has_wav && (
                                                        <span className="rounded bg-green-500/20 px-2 py-1 text-green-400">WAV</span>
                                                    )}
                                                    {song.has_loop && (
                                                        <span className="rounded bg-green-500/20 px-2 py-1 text-green-400">Loop</span>
                                                    )}
                                                    {song.has_high_res && (
                                                        <span className="rounded bg-green-500/20 px-2 py-1 text-green-400">Hi-Res</span>
                                                    )}
                                                    {song.has_midi && (
                                                        <span className="rounded bg-green-500/20 px-2 py-1 text-green-400">MIDI</span>
                                                    )}
                                                </div>
                                            </div>
                                            <DeleteSongButton songId={song.id} songTitle={song.title} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

import { createClient } from '@/lib/supabase/server'
import { SongCard } from '@/components/SongCard'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/features/hero'
import { getDictionary } from '@/lib/i18n'
import { Sparkles, PlayCircle, ShieldCheck, Music, CheckCircle2, Gamepad2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  // 初期ロード時のフリーズを防ぐため、Promise.allでデータを並列取得
  const [dict, userResponse, songsResponse] = await Promise.all([
    getDictionary(),
    supabase.auth.getUser(),
    supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4) // トップページは最新4件のみ表示
  ])

  const user = userResponse.data.user
  const songs = songsResponse.data
  const error = songsResponse.error

  // APIエラー時の表示（UI/UXを損なわないデザイン）
  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans selection:bg-purple-500/30">
        <Header dict={dict.header} notifications={dict.notifications} />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-red-500/20 bg-red-950/20 p-8 text-center backdrop-blur-md max-w-md w-full shadow-2xl relative overflow-hidden group">
            {/* エラー時もゲーミングテイストなグリッチ風エフェクト */}
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="rounded-full bg-red-500/10 p-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <span className="text-4xl drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">⚠️</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">システムエラー発生</h2>
            <p className="text-sm text-gray-400">ステータス異常を検知しました。再読み込みをお試しください。</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // 購入済み楽曲の判定（ログイン時のみ）
  let purchasedSongIds = new Set<string>()
  if (user) {
    const { data: purchases } = await supabase
      .from('purchases')
      .select('song_id')
      .eq('user_id', user.id)

    if (purchases) {
      purchases.forEach(p => purchasedSongIds.add(p.song_id))
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans selection:bg-purple-500/30">
      <Header dict={dict.header} notifications={dict.notifications} />

      <main className="flex-1">
        {/* キャンペーンバナー：理由を明記し、怪しさを軽減しつつエンタメ感を注入 */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600 px-4 py-4 text-white shadow-[0_0_40px_-10px_rgba(249,115,22,0.6)] group cursor-pointer transition-all hover:brightness-110">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay group-hover:opacity-30 transition-opacity"></div>
          {/* 動く光の筋（スウィープエフェクト） */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>

          <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
              <Gamepad2 className="h-5 w-5 animate-bounce text-yellow-200" />
              <span className="font-bold tracking-wide text-sm sm:text-base drop-shadow-md">
                【β版オープン記念】あなたのゲームを進化させる全楽曲・無料解放中！
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-orange-950 bg-yellow-400 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-transform duration-300 hover:scale-110 hover:bg-yellow-300">
              ※登録・ログイン不要でフルアクセス
            </span>
          </div>
        </div>

        {/* ヒーローセクション周辺：安全性の強調 */}
        <div className="relative pt-12 pb-8 md:pt-20 md:pb-12 border-b border-white/5 bg-gradient-to-b from-purple-900/10 to-transparent overflow-hidden">
          {/* ゲーミングテイストな背景の光芒 */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

          <div className="relative z-10">
            <Hero dict={dict.hero} user={user} />
          </div>

          {/* 信頼感を醸成するトラストバッジ（ホバー連動アクション） */}
          <div className="container mx-auto max-w-4xl px-4 mt-8 md:mt-12 relative z-10">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <div className="group flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <ShieldCheck className="h-4 w-4 text-emerald-400 group-hover:animate-pulse" />
                <span className="font-medium">1クリックで即・視聴開始</span>
              </div>
              <div className="group flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <CheckCircle2 className="h-4 w-4 text-blue-400 group-hover:animate-spin-slow" />
                <span className="font-medium">クレカ登録完全不要</span>
              </div>
              <div className="group flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <Sparkles className="h-4 w-4 text-purple-400 group-hover:animate-bounce" />
                <span className="font-medium">クリーンな直ダウンロード</span>
              </div>
            </div>
          </div>
        </div>

        {/* コンテンツセクション：エンタメ感とワクワクさせるコピー */}
        <section className="container mx-auto px-4 py-24 md:py-32 relative">
          {/* 背景のグローエフェクト */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-indigo-500/5 blur-[150px] pointer-events-none rounded-full" />

          <div className="relative mb-20 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold tracking-wider uppercase mb-2 animate-pulse">
              <PlayCircle className="w-4 h-4" />
              <span>Latest Drops</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 sm:text-5xl md:text-6xl drop-shadow-[0_0_30px_rgba(129,140,248,0.2)] pb-2">
              プロジェクトを覚醒させる<br className="hidden md:block" />次世代サウンド
            </h2>
            <div className="mx-auto max-w-2xl">
              <p className="text-base sm:text-lg text-gray-400 whitespace-pre-line leading-relaxed px-4 font-medium">
                クリエイターの妥協なき要求に応える、即戦力のオーディオアセット。
                あなたのゲーム、動画、配信に、胸躍る「鼓動」をインストールしよう。
              </p>
            </div>
          </div>

          {!songs?.length ? (
            <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-sm shadow-2xl relative z-10 transition-all hover:bg-zinc-900/60 group">
              <div className="rounded-full bg-white/5 p-6 mb-6 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:bg-purple-500/10 group-hover:ring-purple-500/30">
                <Music className="h-12 w-12 text-gray-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <p className="text-lg font-bold tracking-widest text-gray-400 uppercase group-hover:text-gray-300">Wait for next drop...</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative z-10">
              {songs.map((song) => (
                <div key={song.id} className="group relative transition-all duration-500 hover:-translate-y-3 z-0 hover:z-10">
                  {/* カードのホバー時に背後にゲーミングテイストなネオンエフェクトを追加 */}
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-40" />
                  <div className="absolute -inset-[1px] rounded-[1.4rem] bg-gradient-to-br from-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10 pointer-events-none" />

                  <div className="relative h-full bg-[#030303] rounded-3xl ring-1 ring-white/10 overflow-hidden shadow-2xl transition-all duration-500 group-hover:ring-white/30 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]">
                    <SongCard
                      song={song}
                      dict={{ ...dict.card, purchaseModal: dict.purchaseModal }}
                      user={user}
                      isPurchased={purchasedSongIds.has(song.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

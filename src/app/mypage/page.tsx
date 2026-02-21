import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { dictionaries } from '@/lib/dictionaries'
import { AccountSettings } from '@/components/features/AccountSettings'
import { UserBadges } from '@/components/features/UserBadges'
import { ArsenalList } from '@/components/features/ArsenalList'
import { FavoritesList } from '@/components/features/FavoritesList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Heart, Settings, Library } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MyPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Defaulting to JA for now as per project context
    const dict = dictionaries['ja']

    // Fetch data in parallel for performance
    const [statsResponse, purchasesResponse, favoritesResponse] = await Promise.all([
        supabase.from('user_stats').select('*').eq('user_id', user.id).single(),
        supabase.from('purchases').select('song_id, songs(*)').eq('user_id', user.id),
        supabase.from('favorites').select('song_id, songs(*)').eq('user_id', user.id)
    ])

    const stats = statsResponse.data || { download_count: 0, current_badge: 'Novice Creator' }

    // Process joined data, handling array vs object returns from Supabase
    const extractSongs = (data: any[]) => {
        return data.map(item => {
            if (Array.isArray(item.songs)) {
                return item.songs[0];
            }
            return item.songs;
        }).filter(Boolean);
    };

    const arsenalSongs = extractSongs(purchasesResponse.data || []);
    const favoriteSongs = extractSongs(favoritesResponse.data || []);

    // Helper to get purchased IDs for the Favorites list (to show proper button state)
    const purchasedIds = new Set(arsenalSongs.map(s => s.id));

    return (
        <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans selection:bg-purple-500/30">
            <Header dict={dict.header} notifications={dict.notifications} />

            <main className="flex-1 container max-w-5xl mx-auto py-12 md:py-24 px-4 overflow-hidden relative">
                {/* Background ambient lighting */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

                <div className="space-y-10 relative z-10">
                    <div className="space-y-3">
                        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 sm:text-5xl drop-shadow-sm flex items-center gap-3">
                            <Shield className="w-10 h-10 text-blue-400" />
                            {dict.myPage.title || "Command Center"}
                        </h1>
                        <p className="text-gray-400 text-lg">Manage your creative arsenal and account settings.</p>
                    </div>

                    <UserBadges stats={stats} />

                    <Tabs defaultValue="arsenal" className="w-full">
                        <TabsList className="bg-zinc-900/50 border border-white/5 p-1 rounded-xl mb-8 flex w-full max-w-fit">
                            <TabsTrigger
                                value="arsenal"
                                className="rounded-lg px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-gray-400 font-medium transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Library className="w-4 h-4" />
                                    Your Arsenal
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="favorites"
                                className="rounded-lg px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-gray-400 font-medium transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Heart className="w-4 h-4" />
                                    Favorites
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                className="rounded-lg px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-zinc-700 data-[state=active]:to-zinc-600 data-[state=active]:text-white text-gray-400 font-medium transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </div>
                            </TabsTrigger>
                        </TabsList>

                        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
                            {/* Inner subtle glow */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 rounded-3xl pointer-events-none" />

                            <TabsContent value="arsenal" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                                        <Library className="w-6 h-6 text-indigo-400" />
                                        Your Arsenal
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1">Acquired assets ready for your next project.</p>
                                </div>
                                <ArsenalList songs={arsenalSongs.filter(s => s !== null)} dict={dict} />
                            </TabsContent>

                            <TabsContent value="favorites" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                                        <Heart className="w-6 h-6 text-rose-400" />
                                        Saved Favorites
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1">Your curated collection of inspiring sounds.</p>
                                </div>
                                <FavoritesList
                                    songs={favoriteSongs.filter(s => s !== null)}
                                    dict={{ ...dict, card: { ...dict.card, free: 'Free' }, purchaseModal: {} }}
                                    user={user}
                                    purchasedIds={purchasedIds}
                                />
                            </TabsContent>

                            <TabsContent value="settings" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="max-w-xl">
                                    <AccountSettings dict={dict.myPage} email={user.email || ''} />
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    )
}

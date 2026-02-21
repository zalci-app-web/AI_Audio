import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getDictionary } from '@/lib/i18n'

export const metadata: Metadata = {
    title: 'Zalci Audioについて | AI生成BGMストア',
    description: 'Zalci Audioは、生成AIの力をすべてのクリエイターに届けるAIオーディオストアです。RPGや動画、ゲーム制作に最適なBGMを提供します。ハイスペックPCや複雑なプロンプトは不要。',
    alternates: { canonical: '/about' },
}

export default async function AboutPage() {
    const dict = await getDictionary()

    return (
        <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans">
            <Header dict={dict.header} notifications={dict.notifications} />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Hero Section */}
                    <div className="mb-16 text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 sm:text-6xl text-balance">
                            Zalci Audio
                        </h1>
                        <p className="mx-auto max-w-2xl text-xl text-gray-400 text-pretty break-auto-phrase">
                            {dict.about.tagline}
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="mx-auto max-w-3xl space-y-16">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white text-balance">{dict.about.conceptTitle}</h2>
                            <p className="leading-relaxed text-gray-300 text-pretty break-auto-phrase whitespace-pre-line">
                                {dict.about.conceptDesc}
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white text-balance">{dict.about.roadmapTitle}</h2>
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8">
                                <p className="leading-relaxed text-gray-300 text-pretty break-auto-phrase whitespace-pre-line">
                                    {dict.about.roadmapDesc}
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white text-balance">{dict.about.messageTitle}</h2>
                            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8 relative overflow-hidden group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition duration-500 blur-xl" />
                                <p className="leading-relaxed text-gray-300 text-pretty break-auto-phrase relative z-10">
                                    {dict.about.messageDesc}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

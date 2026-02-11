import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getDictionary } from '@/lib/i18n'

export default async function AboutPage() {
    const dict = await getDictionary()

    return (
        <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans">
            <Header dict={dict.header} notifications={dict.notifications} />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Hero Section */}
                    <div className="mb-16 text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 sm:text-6xl">
                            Zalci Audio
                        </h1>
                        <p className="mx-auto max-w-2xl text-xl text-gray-400">
                            Unleash the sound within.
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="mx-auto max-w-3xl space-y-12">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white text-balance">{dict.about.missionTitle}</h2>
                            <p className="leading-relaxed text-gray-300 text-pretty break-auto-phrase">
                                {dict.about.missionDesc}
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white text-balance">{dict.about.creatorTitle}</h2>
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-8">
                                <p className="leading-relaxed text-gray-300 text-pretty break-auto-phrase">
                                    {dict.about.creatorDesc}
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white text-balance">{dict.about.contactTitle}</h2>
                            <p className="leading-relaxed text-gray-300 text-pretty break-auto-phrase">
                                {dict.about.contactDesc}
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

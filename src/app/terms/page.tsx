import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getDictionary } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export default async function TermsPage() {
    const dict = await getDictionary()
    const t = dict.terms

    return (
        <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans">
            <Header dict={dict.header} />

            <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        {t.title}
                    </h1>

                    <div className="space-y-8 text-gray-300">
                        {t.sections.map((section: any, index: number) => (
                            <section key={index}>
                                <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
                                <p>{section.content}</p>
                            </section>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

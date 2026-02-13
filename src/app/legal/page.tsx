import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getDictionary } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: '特定商取引法に基づく表記 | Zalci Audio',
        description: 'Zalci Audioの特定商取引法に基づく表記ページです。',
        robots: {
            index: true,
            follow: true,
        },
    }
}

export default async function LegalPage() {
    const dict = await getDictionary()

    return (
        <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans">
            <Header dict={dict.header} notifications={dict.notifications} />

            <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        {dict.legal.title}
                    </h1>

                    <div className="space-y-8 text-gray-300">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">{dict.legal.distributor.title}</h2>
                            <p>{dict.legal.distributor.content}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">{dict.legal.manager.title}</h2>
                            <p>{dict.legal.manager.content}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">{dict.legal.address.title}</h2>
                            {Array.isArray(dict.legal.address.content) ? (
                                dict.legal.address.content.map((line: string, i: number) => (
                                    <p key={i}>{line}</p>
                                ))
                            ) : (
                                <p>{dict.legal.address.content}</p>
                            )}
                            {'requestButton' in dict.legal.address && (
                                <a
                                    href={`mailto:${dict.legal.email.content}?subject=${encodeURIComponent(dict.legal.address.requestButton as string)}`}
                                    className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                    {dict.legal.address.requestButton as React.ReactNode}
                                </a>
                            )}
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">{dict.legal.phone.title}</h2>
                            <p>{dict.legal.phone.content}</p>
                            <p className="text-sm text-gray-400 mt-2">{dict.legal.phone.note}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">{dict.legal.email.title}</h2>
                            <p>{dict.legal.email.content}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">{dict.legal.price.title}</h2>
                            <p>{dict.legal.price.content}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">{dict.legal.otherFees.title}</h2>
                            <p>{dict.legal.otherFees.content}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">{dict.legal.paymentMethod.title}</h2>
                            <p>{dict.legal.paymentMethod.content}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">{dict.legal.paymentTiming.title}</h2>
                            <p>{dict.legal.paymentTiming.content}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">{dict.legal.deliveryTiming.title}</h2>
                            <p>{dict.legal.deliveryTiming.content}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">{dict.legal.returns.title}</h2>
                            <p className="mb-4">{dict.legal.returns.intro}</p>

                            <h3 className="text-lg font-medium text-white mt-4 mb-2">{dict.legal.returns.customerConvenience.title}</h3>
                            <p className="mb-4 whitespace-pre-line">
                                {dict.legal.returns.customerConvenience.content}
                            </p>

                            <h3 className="text-lg font-medium text-white mt-4 mb-2">{dict.legal.returns.defective.title}</h3>
                            <p className="whitespace-pre-line">
                                {dict.legal.returns.defective.content}
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

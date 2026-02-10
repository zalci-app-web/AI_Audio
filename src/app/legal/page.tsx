import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getDictionary } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export default async function LegalPage() {
    const dict = await getDictionary()

    return (
        <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans">
            <Header dict={dict.header} notifications={dict.notifications} />

            <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        特定商取引法に基づく表記
                    </h1>

                    <div className="space-y-8 text-gray-300">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">販売業者・運営責任者</h2>
                            <p>Zalci Audio（氏名については請求があった場合に遅滞なく開示します）</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">所在地・電話番号</h2>
                            <p>六本木オフィス</p>
                            <p>〒106-0032</p>
                            <p>東京都港区六本木3丁目16番12号六本木KSビル5F</p>
                            <p className="text-sm text-gray-400 mt-2">※詳細な住所および電話番号については、請求があった場合に遅滞なく開示いたします。</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">メールアドレス</h2>
                            <p>zalciapp@gmail.com</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">販売価格</h2>
                            <p>各商品ページに記載の金額（消費税込み）</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">商品代金以外の必要料金</h2>
                            <p>なし（デジタルコンテンツのため送料は発生しません）</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">お支払い方法</h2>
                            <p>クレジットカード（Stripe）</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">商品の引渡時期</h2>
                            <p>決済完了後、マイページ（ライブラリ）より即時ダウンロードいただけます。</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">返品・キャンセルについて</h2>
                            <p>デジタルコンテンツの性質上、決済完了後のキャンセル・返品・返金には応じられません。</p>
                            <p>万が一ファイルに不備がある場合は、上記メールアドレスまでご連絡ください。</p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

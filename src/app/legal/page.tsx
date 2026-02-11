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
                        特定商取引法に基づく表記
                    </h1>

                    <div className="space-y-8 text-gray-300">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">販売業者</h2>
                            <p>Zalci Audio （代表者氏名については、請求があった場合に遅滞なく開示いたします）</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">運営責任者</h2>
                            <p>請求があった場合に遅滞なく開示いたします</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">住所</h2>
                            <p>〒106-0032</p>
                            <p>東京都港区六本木3丁目16番12号 六本木KSビル5F</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">電話番号</h2>
                            <p>080-6183-3443 （受付時間：平日10:00〜18:00）</p>
                            <p className="text-sm text-gray-400 mt-2">※お問い合わせは原則としてメールまたはフォームよりお願いいたします。</p>
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
                            <p>なし （※インターネット接続料金、通信料金、および銀行振込時の振込手数料等は、お客様のご負担となります）</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">お支払い方法</h2>
                            <p>クレジットカード決済（Stripe）</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">代金の支払時期</h2>
                            <p>商品購入時（即時決済となります）</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">商品の引渡時期</h2>
                            <p>決済完了後、ライブラリまたはダウンロードリンクより即時ダウンロードいただけます。</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">返品・キャンセルについて</h2>
                            <p className="mb-4">Stripeの規定に基づき、以下の通り定めます。</p>

                            <h3 className="text-lg font-medium text-white mt-4 mb-2">＜お客様都合による返品・交換（良品の場合）＞</h3>
                            <p className="mb-4">
                                デジタルコンテンツという商品の性質上、ダウンロード用URLの通知（またはマイページへの反映）をもって納品完了とみなします。そのため、決済完了後のお客様都合によるキャンセル・返品・返金・交換には原則として応じられません。<br />
                                （例：「思っていた音と違った」「間違えて購入した」等の理由による返品は不可となります）
                            </p>

                            <h3 className="text-lg font-medium text-white mt-4 mb-2">＜商品に不備がある場合の返品・交換（不良品の場合）＞</h3>
                            <p>
                                ダウンロードしたファイルに破損、再生不可、内容の相違等の不備（瑕疵）が認められた場合に限り、対応いたします。<br />
                                不備が確認された場合、購入後7日以内に上記メールアドレスまでご連絡ください。弊社にて確認の上、<strong>正常なファイルの再配布（交換）</strong>を行わせていただきます。商品の性質上、返金ではなく良品との交換での対応となりますことをご了承ください。
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

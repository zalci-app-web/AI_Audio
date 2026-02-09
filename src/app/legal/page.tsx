import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getDictionary } from '@/lib/i18n'

export default async function LegalPage() {
    const dict = await getDictionary()

    return (
        <div className="flex min-h-screen flex-col bg-[#000000] text-gray-100 font-sans">
            <Header dict={dict.header} />

            <main className="flex-1 container mx-auto px-4 py-8 md:py-16 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    特定商取引法に基づく表記
                </h1>

                <div className="space-y-6 text-gray-300">
                    <section className="border-b border-white/10 pb-6">
                        <h2 className="text-lg font-semibold text-white mb-2">販売業者</h2>
                        <p>Zalci Audio</p>
                    </section>

                    <section className="border-b border-white/10 pb-6">
                        <h2 className="text-lg font-semibold text-white mb-2">運営統括責任者</h2>
                        <p>山﨑 智希</p>
                    </section>

                    <section className="border-b border-white/10 pb-6">
                        <h2 className="text-lg font-semibold text-white mb-2">所在地</h2>
                        <p>請求があったら遅滞なく開示します（上記メールアドレスまでご請求いただければ速やかに開示いたします）</p>
                    </section>

                    <section className="border-b border-white/10 pb-6">
                        <h2 className="text-lg font-semibold text-white mb-2">電話番号</h2>
                        <p>請求があったら遅滞なく開示します（上記メールアドレスまでご請求いただければ速やかに開示いたします）</p>
                        <p className="text-sm text-gray-500 mt-1">※お電話でのサポートは受け付けておりません。お問い合わせはメールまたはフォームよりお願いいたします。</p>
                    </section>

                    <section className="border-b border-white/10 pb-6">
                        <h2 className="text-lg font-semibold text-white mb-2">メールアドレス</h2>
                        <p>zalciapp@gmail.com</p>
                    </section>

                    <section className="border-b border-white/10 pb-6">
                        <h2 className="text-lg font-semibold text-white mb-2">販売価格</h2>
                        <p>各商品ページに記載（表示価格は消費税込み）</p>
                    </section>

                    <section className="border-b border-white/10 pb-6">
                        <h2 className="text-lg font-semibold text-white mb-2">商品代金以外の必要料金</h2>
                        <p>インターネット接続料金、通信料金（お客様の負担となります）</p>
                    </section>

                    <section className="border-b border-white/10 pb-6">
                        <h2 className="text-lg font-semibold text-white mb-2">お支払い方法</h2>
                        <p>クレジットカード決済（Stripe）</p>
                    </section>

                    <section className="border-b border-white/10 pb-6">
                        <h2 className="text-lg font-semibold text-white mb-2">代金の支払時期</h2>
                        <p>ご利用のクレジットカード会社の締め日や契約内容により異なります。ご利用されるカード会社までお問い合わせください。</p>
                    </section>

                    <section className="border-b border-white/10 pb-6">
                        <h2 className="text-lg font-semibold text-white mb-2">商品の引渡時期</h2>
                        <p>決済完了後、ウェブサイト上のマイライブラリより即時にダウンロード、または再生してご利用いただけます。</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white mb-2">返品・キャンセルについて</h2>
                        <div className="space-y-4">
                            <p>
                                <strong>＜お客様都合の返品・交換＞</strong><br />
                                デジタルコンテンツという商品の性質上、購入確定後のお客様都合による返品・返金・キャンセルはお受けできません。
                            </p>
                            <p>
                                <strong>＜不良品・不具合について＞</strong><br />
                                万が一、ダウンロードしたファイルが破損している、または再生できない等の不具合がある場合は、お問い合わせ窓口（zalciapp@gmail.com）までご連絡ください。内容を確認の上、正常なファイルへの交換または返金対応をさせていただきます。
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}

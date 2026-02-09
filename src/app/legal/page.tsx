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
                        <p>〒106-0032 東京都港区六本木3丁目16番12号 六本木KSビル5F 六本木オフィス</p>
                    </section>

                    <section className="border-b border-white/10 pb-6">
                        <h2 className="text-lg font-semibold text-white mb-2">電話番号</h2>
                        <p>080-6183-3443</p>
                        <p className="text-sm text-gray-500 mt-1">※お電話でのサポートは受け付けておりません。お問い合わせはメールまたはフォームよりお願いいたします。</p>
                    </section>

                    <section className="border-b border-white/10 pb-6">
                        <h2 className="text-lg font-semibold text-white mb-2">メールアドレス</h2>
                        <p>support@zalciaudio.com</p>
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
                        <p>決済完了後、直ちにご利用いただけます。</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white mb-2">返品・キャンセルについて</h2>
                        <p>デジタルコンテンツの特性上、購入後の返品・キャンセルはお受けできません。商品に欠陥がある場合は、確認の上対応いたしますのでお問い合わせください。</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}

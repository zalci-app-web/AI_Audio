import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

interface CheckoutRequest {
    priceId: string
    songId: string
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: '認証が必要です。ログインしてください。' },
                { status: 401 }
            )
        }

        const { priceId, songId } = (await request.json()) as CheckoutRequest

        if (!priceId) {
            return NextResponse.json(
                { error: 'Price IDが指定されていません。' },
                { status: 400 }
            )
        }

        // ダミーPrice IDのチェック
        if (priceId.startsWith('price_dummy_')) {
            return NextResponse.json(
                { error: '商品が未登録です。管理者にお問い合わせください。' },
                { status: 400 }
            )
        }

        if (!songId) {
            return NextResponse.json(
                { error: '楽曲IDが指定されていません。' },
                { status: 400 }
            )
        }

        // 楽曲情報の取得（タイトル確認用）
        const { data: song, error: songError } = await supabase
            .from('songs')
            .select('title')
            .eq('id', songId)
            .single()

        if (songError || !song) {
            console.error('[SONG_FETCH_ERROR]', songError)
            return NextResponse.json(
                { error: '楽曲情報が見つかりませんでした。' },
                { status: 404 }
            )
        }

        // サイトURLの補正（https://必須）
        let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
            siteUrl = `https://${siteUrl}`
        }

        // Stripe Checkout Sessionの作成（シンプルバージョン）
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId, // Stripeで作成したPrice IDをそのまま使用
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${siteUrl}/library?purchase=success`,
            cancel_url: `${siteUrl}/?purchase=cancelled`,
            metadata: {
                userId: user.id,
                songId: songId,
            },
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('[STRIPE_ERROR]', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            { error: '決済処理中にエラーが発生しました。', details: errorMessage },
            { status: 500 }
        )
    }
}

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
    console.log('[DEBUG] Checkout API (Full Logic) called')

    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('[STRIPE_ERROR] STRIPE_SECRET_KEY is missing')
        return NextResponse.json({ error: 'Server configuration error: Missing Stripe Key' }, { status: 500 })
    }

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: '認証が必要です。ログインしてください。' }, { status: 401 })
        }

        const { songId } = (await request.json()) as { songId: string }

        if (!songId) {
            return NextResponse.json({ error: '楽曲IDが指定されていません。' }, { status: 400 })
        }

        // 楽曲情報の取得
        const { data: song, error: songError } = await supabase
            .from('songs')
            .select('title, price, image_url')
            .eq('id', songId)
            .single()

        if (songError || !song) {
            console.error('[SONG_FETCH_ERROR]', songError)
            return NextResponse.json({ error: '楽曲情報が見つかりませんでした。' }, { status: 404 })
        }

        // サイトURLの補正
        let siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        if (!siteUrl) {
            const origin = request.headers.get('origin')
            siteUrl = origin || 'http://localhost:3000'
        }
        if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
            siteUrl = `https://${siteUrl}`
        }

        // Stripe Checkout Sessionの作成（動的価格生成）
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'jpy',
                        unit_amount: song.price,
                        product_data: {
                            name: song.title,
                            description: 'Digital Audio - MP3',
                            images: song.image_url ? [song.image_url] : [],
                        },
                    },
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

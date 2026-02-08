import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

// オプション料金のマッピング
const OPTION_PRICES: Record<string, number> = {
    wav: 300,
    loop: 300,
    'high-res': 500,
    midi: 200,
}

// オプション名のマッピング（日本語表示用）
const OPTION_LABELS: Record<string, string> = {
    wav: 'WAV Format',
    loop: 'Loop Version',
    'high-res': 'High-Res Audio',
    midi: 'MIDI Data',
}

interface CheckoutRequest {
    priceId: string
    songId: string
    selectedOptions?: string[]
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

        const { priceId, songId, selectedOptions = [] } = (await request.json()) as CheckoutRequest

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

        // 楽曲情報の取得
        const { data: song, error: songError } = await supabase
            .from('songs')
            .select('*')
            .eq('id', songId)
            .single()

        if (songError || !song) {
            console.error('[SONG_FETCH_ERROR]', songError)
            return NextResponse.json(
                { error: '楽曲情報が見つかりませんでした。' },
                { status: 404 }
            )
        }

        // line_itemsの構築
        const lineItems: any[] = [
            {
                price_data: {
                    currency: 'jpy',
                    product_data: {
                        name: song.title,
                        description: `${song.title} - MP3 音源`,
                    },
                    unit_amount: song.price,
                },
                quantity: 1,
            },
        ]

        // 追加オプションをline_itemsに追加
        const validOptions: string[] = []
        if (selectedOptions && selectedOptions.length > 0) {
            for (const option of selectedOptions) {
                // オプションが有効かチェック
                const dbFieldName = `has_${option.replace('-', '_')}`
                const isAvailable = song[dbFieldName]

                if (!isAvailable) {
                    console.warn(`[OPTION_NOT_AVAILABLE] Option "${option}" not available for song ${songId}`)
                    continue
                }

                if (!OPTION_PRICES[option]) {
                    console.warn(`[UNKNOWN_OPTION] Unknown option "${option}"`)
                    continue
                }

                validOptions.push(option)

                lineItems.push({
                    price_data: {
                        currency: 'jpy',
                        product_data: {
                            name: `${song.title} - ${OPTION_LABELS[option]}`,
                            description: `追加オプション: ${OPTION_LABELS[option]}`,
                        },
                        unit_amount: OPTION_PRICES[option],
                    },
                    quantity: 1,
                })
            }
        }

        // Stripe Checkout Sessionの作成
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/library?purchase=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?purchase=cancelled`,
            metadata: {
                userId: user.id,
                songId: song.id,
                selectedOptions: validOptions.join(','),
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

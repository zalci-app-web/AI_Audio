import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

import { stripe } from '@/lib/stripe'
import { FIXED_SONG_IMAGE_URL } from '@/lib/constants'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const adminUserId = process.env.ADMIN_USER_ID

        if (!user || (adminUserId && user.id !== adminUserId)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            )
        }

        const body = await req.json()
        const {
            title,
            description,
            // price is fixed to 200
            // image_url is fixed
            mp3_url,
            // stripe_price_id is generated
            has_wav,
            has_loop,
            has_high_res,
            has_midi,
        } = body

        // Validate required fields
        if (!title || !mp3_url) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // 1. Create Stripe Product & Price
        const product = await stripe.products.create({
            name: `${title} (200円)`,
            description: description || 'ライブラリに追加されます。audiostore.zalci.net',
            images: [FIXED_SONG_IMAGE_URL],
            metadata: {
                app: 'zalci-audio',
            },
            default_price_data: {
                currency: 'jpy',
                unit_amount: 200, // Fixed price 200 JPY
                tax_behavior: 'inclusive',
            },
        })

        const stripe_price_id = product.default_price as string

        // 2. Insert song into Database
        // Use admin client to bypass RLS policies for insertion
        const supabaseAdmin = createAdminClient()

        const { data, error } = await supabaseAdmin
            .from('songs')
            .insert({
                title,
                description: description || 'ライブラリに追加されます。audiostore.zalci.net',
                price: 200,
                image_url: FIXED_SONG_IMAGE_URL,
                mp3_url,
                preview_url: mp3_url, // Use mp3_url as preview
                stripe_price_id,
                has_wav: has_wav || false,
                has_loop: has_loop || false,
                has_high_res: has_high_res || false,
                has_midi: has_midi || false,
            })
            .select()
            .single()

        if (error) {
            console.error('Database error:', error)
            return NextResponse.json(
                { error: 'Failed to create song' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, song: data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const adminUserId = process.env.ADMIN_USER_ID

        if (!user || (adminUserId && user.id !== adminUserId)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(req.url)
        const songId = searchParams.get('id')

        if (!songId) {
            return NextResponse.json(
                { error: 'Song ID is required' },
                { status: 400 }
            )
        }

        // Delete song
        // Use admin client to bypass RLS policies for deletion
        const supabaseAdmin = createAdminClient()

        const { error } = await supabaseAdmin
            .from('songs')
            .delete()
            .eq('id', songId)

        if (error) {
            console.error('Database error:', error)
            return NextResponse.json(
                { error: 'Failed to delete song' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}


import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPurchaseEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { songId } = body

        if (!songId) {
            return NextResponse.json({ error: 'Song ID is required' }, { status: 400 })
        }

        // 1. Get Song Details (to get price, title, etc for email)
        const { data: song, error: songError } = await supabase
            .from('songs')
            .select('*')
            .eq('id', songId)
            .single()

        if (songError || !song) {
            return NextResponse.json({ error: 'Song not found' }, { status: 404 })
        }

        // 2. Insert into purchases table
        const supabaseAdmin = createAdminClient()

        // Check if already purchased
        const { data: existing } = await supabaseAdmin
            .from('purchases')
            .select('id')
            .eq('user_id', user.id)
            .eq('song_id', songId)
            .single()

        if (existing) {
            return NextResponse.json({ message: 'Already purchased' }, { status: 200 })
        }

        // Credit Logic: If song is NOT free, check for weekly credits
        if (song.price > 0) {
            const { data: stats, error: statsError } = await supabaseAdmin
                .from('user_stats')
                .select('weekly_free_credits_left')
                .eq('user_id', user.id)
                .single()

            if (statsError || !stats || (stats.weekly_free_credits_left || 0) <= 0) {
                return NextResponse.json(
                    { error: 'No weekly credits left' },
                    { status: 403 }
                )
            }

            // Decrement credit
            const { error: decError } = await supabaseAdmin
                .from('user_stats')
                .update({ weekly_free_credits_left: stats.weekly_free_credits_left - 1 })
                .eq('user_id', user.id)

            if (decError) {
                console.error('Failed to decrement credits:', decError)
                return NextResponse.json({ error: 'Failed to use credit' }, { status: 500 })
            }
        }

        const { error: insertError } = await supabaseAdmin
            .from('purchases')
            .insert({
                user_id: user.id,
                song_id: songId,
                amount: 0, // Claimed via credit or campaign
                currency: 'jpy',
                stripe_payment_id: song.price > 0 ? 'credit_use_' + new Date().getTime() : 'free_campaign_' + new Date().getTime(),
                status: 'completed'
            })

        if (insertError) {
            console.error('Free claim insert error:', insertError)
            return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 })
        }

        // 3. Send Email
        // We need user email. `user` object from auth.getUser() should have it.
        if (user.email) {
            await sendPurchaseEmail(
                user.email,
                song.title,
                true // isFree
            )
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Free claim error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

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

        // Credit Logic: If song is NOT free, atomically consume a weekly credit
        const usedCredit = song.price > 0
        if (usedCredit) {
            const { data: remaining, error: creditError } = await supabaseAdmin
                .rpc('consume_weekly_credit', { p_user_id: user.id })

            if (creditError) {
                console.error('Failed to consume credit:', creditError)
                return NextResponse.json({ error: 'Failed to use credit' }, { status: 500 })
            }
            if (remaining === null || remaining === undefined) {
                return NextResponse.json(
                    { error: 'No weekly credits left' },
                    { status: 403 }
                )
            }
        }

        const { error: insertError } = await supabaseAdmin
            .from('purchases')
            .insert({
                user_id: user.id,
                song_id: songId,
                amount: 0, // Claimed via credit or campaign
                currency: 'jpy',
                stripe_payment_id: usedCredit ? 'credit_use_' + new Date().getTime() : 'free_campaign_' + new Date().getTime(),
                status: 'completed'
            })

        if (insertError) {
            // Give the credit back: nothing was granted
            if (usedCredit) {
                const { error: refundError } = await supabaseAdmin
                    .rpc('refund_weekly_credit', { p_user_id: user.id })
                if (refundError) console.error('Failed to refund credit:', refundError)
            }
            // 23505 = unique violation: a concurrent request already granted this song
            if (insertError.code === '23505') {
                return NextResponse.json({ message: 'Already purchased' }, { status: 200 })
            }
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

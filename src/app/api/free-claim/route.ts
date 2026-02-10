import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { songId } = body

        if (!songId) {
            return NextResponse.json(
                { error: 'Song ID is required' },
                { status: 400 }
            )
        }

        // Check if already purchased
        const { data: existingPurchase } = await supabase
            .from('purchases')
            .select('id')
            .eq('user_id', user.id)
            .eq('song_id', songId)
            .single()

        if (existingPurchase) {
            return NextResponse.json(
                { message: 'Already purchased' },
                { status: 200 }
            )
        }

        // Create purchase record
        // Use admin client to bypass RLS policies for insertion
        const supabaseAdmin = createAdminClient()

        const { error } = await supabaseAdmin
            .from('purchases')
            .insert({
                user_id: user.id,
                song_id: songId,
                amount: 0,
                currency: 'jpy',
                stripe_session_id: 'free_campaign_2026'
            })

        if (error) {
            console.error('Error creating purchase:', error)
            return NextResponse.json(
                { error: 'Failed to create purchase' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { success: true },
            { status: 200 }
        )

    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

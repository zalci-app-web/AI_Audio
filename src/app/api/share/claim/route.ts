import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabaseAdmin = createAdminClient()

        // Fetch user stats
        const { data: stats, error: statsError } = await supabaseAdmin
            .from('user_stats')
            .select('weekly_share_claimed_at, weekly_free_credits_left')
            .eq('user_id', user.id)
            .single()

        if (statsError && statsError.code !== 'PGRST116') {
            // PGRST116 = no rows found (first time user)
            console.error('Stats fetch error:', statsError)
            return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 })
        }

        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        // Check if user already claimed share credit this week
        if (stats?.weekly_share_claimed_at) {
            const lastClaimed = new Date(stats.weekly_share_claimed_at)
            if (lastClaimed > oneWeekAgo) {
                return NextResponse.json(
                    { error: 'Already claimed this week', alreadyClaimed: true },
                    { status: 409 }
                )
            }
        }

        // Grant +1 credit and update claim timestamp
        const currentCredits = stats?.weekly_free_credits_left ?? 0

        const { error: updateError } = await supabaseAdmin
            .from('user_stats')
            .upsert(
                {
                    user_id: user.id,
                    weekly_share_claimed_at: now.toISOString(),
                    weekly_free_credits_left: currentCredits + 1,
                },
                { onConflict: 'user_id' }
            )

        if (updateError) {
            console.error('Credit grant error:', updateError)
            return NextResponse.json({ error: 'Failed to grant credit' }, { status: 500 })
        }

        return NextResponse.json({ success: true, creditsLeft: currentCredits + 1 })

    } catch (error) {
        console.error('Share claim error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

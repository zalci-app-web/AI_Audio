import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyShareToken } from '@/lib/share-token'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // The claim must follow a share started via /api/share/start (and take a realistic time)
        const body = await req.json().catch(() => ({}))
        const tokenStatus = verifyShareToken(user.id, body?.token)
        if (tokenStatus !== 'ok') {
            return NextResponse.json(
                { error: 'Share not verified', reason: tokenStatus },
                { status: 400 }
            )
        }

        const supabaseAdmin = createAdminClient()

        // Atomically claim the weekly share bonus (null = already claimed this week)
        const { data: creditsLeft, error: claimError } = await supabaseAdmin
            .rpc('claim_share_credit', { p_user_id: user.id })

        if (claimError) {
            console.error('Credit grant error:', claimError)
            return NextResponse.json({ error: 'Failed to grant credit' }, { status: 500 })
        }

        if (creditsLeft === null || creditsLeft === undefined) {
            return NextResponse.json(
                { error: 'Already claimed this week', alreadyClaimed: true },
                { status: 409 }
            )
        }

        return NextResponse.json({ success: true, creditsLeft })

    } catch (error) {
        console.error('Share claim error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

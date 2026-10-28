import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: stats, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error && error.code !== 'PGRST116') {
            throw error
        }

        // Default stats if not found (because maybe trigger failed or old user)
        const defaultStats = {
            download_count: 0,
            current_badge: 'Novice Creator'
        }

        return NextResponse.json(stats || defaultStats)
    } catch (error) {
        console.error('User stats fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch user stats' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { action } = await req.json()

        if (action !== 'increment_download') {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }

        // Counter and badge are updated atomically in SQL; users cannot write user_stats directly.
        // NOTE: still client-triggered; ideally increment on the server when a download/claim succeeds.
        const { data, error } = await createAdminClient()
            .rpc('increment_download_count', { p_user_id: user.id })

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('User stats update error:', error)
        return NextResponse.json(
            { error: 'Failed to update user stats' },
            { status: 500 }
        )
    }
}

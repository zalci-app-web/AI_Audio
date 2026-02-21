import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Calculate badge based on download count
function calculateBadge(downloadCount: number): string {
    if (downloadCount >= 50) return 'Legendary Composer'
    if (downloadCount >= 20) return 'Sound Master'
    if (downloadCount >= 5) return 'Rising Creator'
    return 'Novice Creator'
}

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

        // This is an optimistic increment from client. 
        // Secure way is server-side triggered on actual checkout success/download.
        const { data: currentStats } = await supabase
            .from('user_stats')
            .select('download_count')
            .eq('user_id', user.id)
            .single()

        const newCount = (currentStats?.download_count || 0) + 1
        const newBadge = calculateBadge(newCount)

        const { data, error } = await supabase
            .from('user_stats')
            .upsert({
                user_id: user.id,
                download_count: newCount,
                current_badge: newBadge,
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

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

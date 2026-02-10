import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // Simple auth check - must be logged in
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabaseAdmin = createAdminClient()

        console.log('Wiping purchases...')
        await supabaseAdmin.from('purchases').delete().neq('id', '00000000-0000-0000-0000-000000000000')

        console.log('Wiping songs...')
        await supabaseAdmin.from('songs').delete().neq('id', '00000000-0000-0000-0000-000000000000')

        return NextResponse.json({ success: true, message: 'Library and purchases wiped successfully' })
    } catch (error) {
        console.error('Wipe error:', error)
        return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 })
    }
}

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createShareToken } from '@/lib/share-token'

// Issued when the user opens the share window; required by /api/share/claim.
export async function POST() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        return NextResponse.json({ token: createShareToken(user.id) })
    } catch (error) {
        console.error('Share start error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

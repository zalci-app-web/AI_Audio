import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(req.url)
        const songId = searchParams.get('songId')

        if (!songId) {
            return NextResponse.json(
                { error: 'Song ID is required' },
                { status: 400 }
            )
        }

        // Verify user has purchased this song
        const { data: purchase, error: purchaseError } = await supabase
            .from('purchases')
            .select('id')
            .eq('user_id', user.id)
            .eq('song_id', songId)
            .single()

        if (purchaseError || !purchase) {
            return NextResponse.json(
                { error: 'You have not purchased this song' },
                { status: 403 }
            )
        }

        // Get song details
        const { data: song, error: songError } = await supabase
            .from('songs')
            .select('title, preview_url')
            .eq('id', songId)
            .single()

        if (songError || !song) {
            return NextResponse.json(
                { error: 'Song not found' },
                { status: 404 }
            )
        }

        // In a real implementation, you would:
        // 1. Get the full audio file URL from Supabase Storage
        // 2. Generate a signed URL with expiration
        // 3. Return that URL or redirect to it

        // For now, we'll redirect to the preview URL
        // TODO: Replace with actual full audio file from Supabase Storage
        return NextResponse.redirect(song.preview_url)
    } catch (error) {
        console.error('Download error:', error)
        return NextResponse.json(
            { error: 'Failed to download song' },
            { status: 500 }
        )
    }
}

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
            .select('title, mp3_url')
            .eq('id', songId)
            .single()

        if (songError || !song) {
            return NextResponse.json(
                { error: 'Song not found' },
                { status: 404 }
            )
        }

        // Extract storage path from mp3_url
        // mp3_url format: https://[project].supabase.co/storage/v1/object/public/songs/[path/to/file]
        // We need [path/to/file] passed to from('songs')
        const storagePath = song.mp3_url.split('/songs/').pop()

        if (!storagePath) {
            console.error('Failed to parse storage path from URL:', song.mp3_url)
            return NextResponse.json(
                { error: 'File path configuration error' },
                { status: 500 }
            )
        }

        // Generate a signed URL with short expiration (60 seconds)
        // This prevents the URL from being shared effectively
        const { data: signedData, error: signedError } = await supabase
            .storage
            .from('songs')
            .createSignedUrl(storagePath, 60)

        if (signedError || !signedData) {
            console.error('Signed URL generation failed:', signedError)
            return NextResponse.json(
                { error: 'Failed to generate secure download link' },
                { status: 500 }
            )
        }

        return NextResponse.redirect(signedData.signedUrl)
    } catch (error) {
        console.error('Download error:', error)
        return NextResponse.json(
            { error: 'Failed to download song' },
            { status: 500 }
        )
    }
}

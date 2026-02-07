import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

        const { songId } = await req.json()

        if (!songId) {
            return NextResponse.json(
                { error: 'Song ID is required' },
                { status: 400 }
            )
        }

        // Add to favorites
        const { error } = await supabase
            .from('favorites')
            .insert({
                user_id: user.id,
                song_id: songId,
            })

        if (error) {
            // Check if already favorited
            if (error.code === '23505') {
                return NextResponse.json(
                    { message: 'Already in favorites' },
                    { status: 200 }
                )
            }
            throw error
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Favorites error:', error)
        return NextResponse.json(
            { error: 'Failed to add to favorites' },
            { status: 500 }
        )
    }
}

export async function DELETE(req: NextRequest) {
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

        // Remove from favorites
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('song_id', songId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Favorites error:', error)
        return NextResponse.json(
            { error: 'Failed to remove from favorites' },
            { status: 500 }
        )
    }
}

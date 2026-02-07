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

        const body = await req.json()
        const {
            title,
            description,
            price,
            image_url,
            mp3_url,
            stripe_price_id,
            has_wav,
            has_loop,
            has_high_res,
            has_midi,
        } = body

        // Validate required fields
        if (!title || !price || !image_url || !mp3_url || !stripe_price_id) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Insert song
        const { data, error } = await supabase
            .from('songs')
            .insert({
                title,
                description: description || null,
                price,
                image_url,
                mp3_url,
                preview_url: mp3_url, // Use mp3_url as preview
                stripe_price_id,
                has_wav: has_wav || false,
                has_loop: has_loop || false,
                has_high_res: has_high_res || false,
                has_midi: has_midi || false,
            })
            .select()
            .single()

        if (error) {
            console.error('Database error:', error)
            return NextResponse.json(
                { error: 'Failed to create song' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, song: data })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

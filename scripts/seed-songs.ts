/**
 * Seed script for adding sample songs to the database
 * 
 * Prerequisites:
 * 1. Create a 'songs' bucket in Supabase Storage
 * 2. Set bucket to public or configure appropriate policies
 * 3. Upload audio files to the bucket
 * 4. Update the SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * 
 * Usage:
 * npm install --save-dev tsx
 * npx tsx scripts/seed-songs.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sampleSongs = [
    {
        title: 'Cyberpunk City',
        description: 'High-energy electronic track with futuristic vibes. Perfect for sci-fi games and tech videos.',
        price: 1500,
        preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        image_url: 'https://images.unsplash.com/photo-1515630278258-407f66498911?w=800',
        stripe_price_id: 'price_cyberpunk_city', // Replace with actual Stripe Price ID
    },
    {
        title: 'Ambient Space',
        description: 'Atmospheric ambient soundscape. Ideal for meditation apps, space exploration games, and relaxation content.',
        price: 1000,
        preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        stripe_price_id: 'price_ambient_space', // Replace with actual Stripe Price ID
    },
    {
        title: 'Epic Orchestral',
        description: 'Dramatic orchestral composition with powerful crescendos. Great for trailers and cinematic scenes.',
        price: 2000,
        preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        image_url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800',
        stripe_price_id: 'price_epic_orchestral', // Replace with actual Stripe Price ID
    },
    {
        title: 'Lo-Fi Beats',
        description: 'Chill lo-fi hip-hop beats for studying, working, or relaxing. Smooth and mellow vibes.',
        price: 800,
        preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
        stripe_price_id: 'price_lofi_beats', // Replace with actual Stripe Price ID
    },
    {
        title: 'Rock Anthem',
        description: 'Energetic rock track with powerful guitar riffs. Perfect for action sequences and sports content.',
        price: 1800,
        preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        image_url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800',
        stripe_price_id: 'price_rock_anthem', // Replace with actual Stripe Price ID
    },
    {
        title: 'Jazz Cafe',
        description: 'Smooth jazz with piano and saxophone. Ideal for cafes, restaurants, and sophisticated content.',
        price: 1200,
        preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        image_url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
        stripe_price_id: 'price_jazz_cafe', // Replace with actual Stripe Price ID
    },
]

async function seedSongs() {
    console.log('Starting song seeding...')

    for (const song of sampleSongs) {
        const { data, error } = await supabase
            .from('songs')
            .insert(song)
            .select()
            .single()

        if (error) {
            console.error(`Failed to insert ${song.title}:`, error)
        } else {
            console.log(`✓ Inserted: ${song.title} (ID: ${data.id})`)
        }
    }

    console.log('Seeding complete!')
}

seedSongs().catch(console.error)

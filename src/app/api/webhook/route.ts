import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// Initialize Stripe lazily
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set')
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2026-01-28.clover', // Updated to match installed SDK version
    })
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.text()
        const signature = req.headers.get('stripe-signature')!

        let event: Stripe.Event

        try {
            const stripe = getStripe()
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

            if (!webhookSecret) {
                console.error('STRIPE_WEBHOOK_SECRET is not set')
                return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
            }

            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (err) {
            console.error('Webhook signature verification failed:', err)
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            )
        }

        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session

            const userId = session.metadata?.userId
            const songId = session.metadata?.songId

            if (!userId || !songId) {
                console.error('Missing metadata in session:', session.id)
                return NextResponse.json(
                    { error: 'Missing metadata' },
                    { status: 400 }
                )
            }

            // Create a Supabase client with service role to bypass RLS
            const supabase = await createClient()

            // Record the purchase
            const { error } = await supabase.from('purchases').insert({
                user_id: userId,
                song_id: songId,
                stripe_session_id: session.id,
                amount: session.amount_total,
                currency: session.currency,
            })

            if (error) {
                console.error('Failed to record purchase:', error)
                return NextResponse.json(
                    { error: 'Failed to record purchase' },
                    { status: 500 }
                )
            }

            console.log('Purchase recorded successfully:', { userId, songId })
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        )
    }
}

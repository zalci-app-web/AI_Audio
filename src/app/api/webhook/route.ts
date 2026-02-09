import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

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
        console.log('[Webhook] Starting webhook handler')
        const body = await req.text()
        const signature = req.headers.get('stripe-signature')!

        let event: Stripe.Event

        try {
            const stripe = getStripe()
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

            if (!webhookSecret) {
                console.error('[Webhook] STRIPE_WEBHOOK_SECRET is not set')
                return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
            }

            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
            console.log(`[Webhook] Event constructed: ${event.type}`)
        } catch (err) {
            console.error('[Webhook] Webhook signature verification failed:', err)
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            )
        }

        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session
            console.log('[Webhook] Processing checkout.session.completed', {
                sessionId: session.id,
                amount: session.amount_total,
                currency: session.currency
            })

            const userId = session.metadata?.userId
            const songId = session.metadata?.songId

            console.log('[Webhook] Metadata:', { userId, songId })

            if (!userId || !songId) {
                console.error('[Webhook] Missing metadata in session:', session.id)
                return NextResponse.json(
                    { error: 'Missing metadata' },
                    { status: 400 }
                )
            }

            // Create a Supabase admin client to bypass RLS
            const supabase = createAdminClient()

            // Record the purchase
            console.log('[Webhook] Attempting to insert purchase record...')
            const { data, error } = await supabase.from('purchases').insert({
                user_id: userId,
                song_id: songId,
                stripe_session_id: session.id,
                amount: session.amount_total,
                currency: session.currency,
            }).select()

            if (error) {
                console.error('[Webhook] Failed to record purchase:', error)
                return NextResponse.json(
                    { error: 'Failed to record purchase', details: error },
                    { status: 500 }
                )
            }

            console.log('[Webhook] Purchase recorded successfully:', { userId, songId, record: data })
        } else {
            console.log(`[Webhook] Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('[Webhook] Webhook error:', error)
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        )
    }
}

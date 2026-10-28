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
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!process.env.STRIPE_SECRET_KEY || !webhookSecret || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('[Webhook] Missing required environment variables')
        return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
        event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
        console.error('[Webhook] Signature verification failed:', err instanceof Error ? err.message : err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (event.type !== 'checkout.session.completed') {
        return NextResponse.json({ received: true })
    }

    const session = event.data.object as Stripe.Checkout.Session

    // Only grant the song once the payment has actually been collected
    if (session.payment_status !== 'paid') {
        console.warn('[Webhook] Session not paid, ignoring:', session.id, session.payment_status)
        return NextResponse.json({ received: true })
    }

    const userId = session.metadata?.userId
    const songId = session.metadata?.songId

    if (!userId || !songId) {
        // Retrying cannot fix missing metadata, so acknowledge with 200
        console.error('[Webhook] Missing metadata on session:', session.id)
        return NextResponse.json({ received: true, error: 'Missing metadata' })
    }

    try {
        const supabase = createAdminClient()
        const { error } = await supabase.from('purchases').insert({
            user_id: userId,
            song_id: songId,
            stripe_session_id: session.id,
            stripe_payment_id:
                typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
            amount: session.amount_total,
            currency: session.currency,
            status: 'completed',
        })

        if (error) {
            // 23505 = already recorded (Stripe redelivery) -> idempotent success
            if (error.code === '23505') {
                console.warn('[Webhook] Purchase already recorded:', session.id)
                return NextResponse.json({ received: true })
            }
            // Return 500 so Stripe retries instead of silently losing a paid purchase
            console.error('[Webhook] Failed to insert purchase:', session.id, error.code, error.message)
            return NextResponse.json({ error: 'DB insert failed' }, { status: 500 })
        }
    } catch (err) {
        console.error('[Webhook] Unexpected error for session:', session.id, err)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }

    return NextResponse.json({ received: true })
}

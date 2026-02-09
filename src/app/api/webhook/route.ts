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
    // Log immediately when webhook is called
    console.log('[Webhook] ===== POST request received =====')
    console.log('[Webhook] Timestamp:', new Date().toISOString())

    try {
        // Check environment variables FIRST before doing anything
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY

        console.log('[Webhook] Environment check:', {
            hasWebhookSecret: !!webhookSecret,
            hasServiceRoleKey: !!serviceRoleKey,
            hasStripeSecretKey: !!stripeSecretKey,
        })

        if (!stripeSecretKey) {
            console.error('[Webhook] CRITICAL: STRIPE_SECRET_KEY not set')
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
        }

        if (!webhookSecret) {
            console.error('[Webhook] CRITICAL: STRIPE_WEBHOOK_SECRET not set')
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
        }

        if (!serviceRoleKey) {
            console.error('[Webhook] CRITICAL: SUPABASE_SERVICE_ROLE_KEY not set')
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
        }

        console.log('[Webhook] Reading request body...')
        const body = await req.text()
        console.log('[Webhook] Body length:', body.length)

        const signature = req.headers.get('stripe-signature')
        console.log('[Webhook] Signature present:', !!signature)

        if (!signature) {
            console.error('[Webhook] No Stripe signature found in headers')
            return NextResponse.json({ error: 'No signature' }, { status: 400 })
        }

        let event: Stripe.Event

        try {
            console.log('[Webhook] Constructing Stripe event...')
            const stripe = getStripe()
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
            console.log('[Webhook] Event constructed successfully:', event.type)
            console.log('[Webhook] Event ID:', event.id)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            console.error('[Webhook] Webhook signature verification failed:', errorMessage)
            console.error('[Webhook] Error details:', err)
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            )
        }

        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            console.log('[Webhook] Processing checkout.session.completed event')
            const session = event.data.object as Stripe.Checkout.Session
            console.log('[Webhook] Session details:', {
                sessionId: session.id,
                amount: session.amount_total,
                currency: session.currency,
                paymentStatus: session.payment_status
            })

            const userId = session.metadata?.userId
            const songId = session.metadata?.songId

            console.log('[Webhook] Extracted metadata:', { userId, songId })

            if (!userId || !songId) {
                console.error('[Webhook] Missing required metadata in session')
                console.error('[Webhook] Full metadata:', session.metadata)
                // Return 200 to prevent Stripe from retrying
                return NextResponse.json(
                    { received: true, error: 'Missing metadata' },
                    { status: 200 }
                )
            }

            // Create a Supabase admin client to bypass RLS
            console.log('[Webhook] Creating Supabase admin client...')
            try {
                const supabase = createAdminClient()
                console.log('[Webhook] Admin client created successfully')

                // Record the purchase
                console.log('[Webhook] Attempting to insert purchase record...')
                const insertData = {
                    user_id: userId,
                    song_id: songId,
                    stripe_session_id: session.id,
                    amount: session.amount_total,
                    currency: session.currency,
                }
                console.log('[Webhook] Insert data:', insertData)

                const { data, error } = await supabase
                    .from('purchases')
                    .insert(insertData)
                    .select()

                if (error) {
                    console.error('[Webhook] Failed to insert purchase record')
                    console.error('[Webhook] Supabase error code:', error.code)
                    console.error('[Webhook] Supabase error message:', error.message)
                    console.error('[Webhook] Full error:', JSON.stringify(error, null, 2))
                    // Still return 200 to prevent Stripe from retrying
                    return NextResponse.json(
                        { received: true, error: 'DB insert failed' },
                        { status: 200 }
                    )
                }

                console.log('[Webhook] ✅ Purchase recorded successfully!')
                console.log('[Webhook] Inserted record:', JSON.stringify(data, null, 2))
            } catch (adminError) {
                console.error('[Webhook] Error creating admin client or inserting:', adminError)
                return NextResponse.json(
                    { received: true, error: 'Admin client error' },
                    { status: 200 }
                )
            }
        } else {
            console.log('[Webhook] Received event type:', event.type)
            console.log('[Webhook] Ignoring unhandled event type')
        }

        console.log('[Webhook] ===== Webhook processing completed successfully =====')
        return NextResponse.json({ received: true })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('[Webhook] ❌ Unexpected error in webhook handler')
        console.error('[Webhook] Error message:', errorMessage)
        console.error('[Webhook] Error stack:', error instanceof Error ? error.stack : 'No stack')
        console.error('[Webhook] Full error:', error)
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        )
    }
}

import Stripe from 'stripe'

// Use a placeholder key during build if the environment variable is not set.
// This prevents the "apiKey is required" error during static generation.
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

export const stripe = new Stripe(stripeKey, {
    apiVersion: '2026-01-28.clover', // Update to match the installed SDK types
    typescript: true,
})

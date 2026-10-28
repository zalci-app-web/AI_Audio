-- Migration: align public.purchases with what the app writes.
--  * free-claim records stripe_payment_id / status and has no Checkout session,
--    so stripe_session_id must be nullable.
--  * the Stripe webhook must be idempotent: one row per Checkout session.
ALTER TABLE public.purchases
    ADD COLUMN IF NOT EXISTS stripe_payment_id text,
    ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'completed';

ALTER TABLE public.purchases
    ALTER COLUMN stripe_session_id DROP NOT NULL;

-- NULLs are distinct, so credit/campaign claims (no session) are unaffected.
CREATE UNIQUE INDEX IF NOT EXISTS purchases_stripe_session_unique
    ON public.purchases (stripe_session_id);

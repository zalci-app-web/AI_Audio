-- Migration: lock down user_stats writes and make credit operations atomic.
-- All writes to user_stats now go through the service role (API routes) or
-- the service-role-only functions below.

-- 1. Users may only read their own stats; they can no longer update/insert directly
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert their own stats" ON public.user_stats;

-- 2. One purchase per (user, song). Remove existing duplicates first.
DELETE FROM public.purchases a
USING public.purchases b
WHERE a.user_id = b.user_id
  AND a.song_id = b.song_id
  AND a.ctid > b.ctid;

CREATE UNIQUE INDEX IF NOT EXISTS purchases_user_song_unique
    ON public.purchases (user_id, song_id);

-- 3. Atomically consume one weekly credit. Returns the remaining credits,
--    or NULL when the user has none left.
CREATE OR REPLACE FUNCTION public.consume_weekly_credit(p_user_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    UPDATE public.user_stats
    SET weekly_free_credits_left = weekly_free_credits_left - 1
    WHERE user_id = p_user_id AND weekly_free_credits_left > 0
    RETURNING weekly_free_credits_left;
$$;

-- 4. Give back a credit (used when recording the purchase failed afterwards)
CREATE OR REPLACE FUNCTION public.refund_weekly_credit(p_user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    UPDATE public.user_stats
    SET weekly_free_credits_left = weekly_free_credits_left + 1
    WHERE user_id = p_user_id;
$$;

-- 5. Atomically claim the weekly share bonus. Returns the new credit count,
--    or NULL when already claimed within the last 7 days.
CREATE OR REPLACE FUNCTION public.claim_share_credit(p_user_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    INSERT INTO public.user_stats (user_id, weekly_share_claimed_at, weekly_free_credits_left)
    VALUES (p_user_id, now(), 1)
    ON CONFLICT (user_id) DO UPDATE
    SET weekly_share_claimed_at = now(),
        weekly_free_credits_left = COALESCE(public.user_stats.weekly_free_credits_left, 0) + 1
    WHERE public.user_stats.weekly_share_claimed_at IS NULL
       OR public.user_stats.weekly_share_claimed_at <= now() - interval '7 days'
    RETURNING weekly_free_credits_left;
$$;

-- 6. Atomically bump the download counter and badge. Returns the updated row.
CREATE OR REPLACE FUNCTION public.increment_download_count(p_user_id uuid)
RETURNS public.user_stats
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    INSERT INTO public.user_stats (user_id, download_count, current_badge)
    VALUES (p_user_id, 1, 'Novice Creator')
    ON CONFLICT (user_id) DO UPDATE
    SET download_count = public.user_stats.download_count + 1,
        current_badge = CASE
            WHEN public.user_stats.download_count + 1 >= 50 THEN 'Legendary Composer'
            WHEN public.user_stats.download_count + 1 >= 20 THEN 'Sound Master'
            WHEN public.user_stats.download_count + 1 >= 5 THEN 'Rising Creator'
            ELSE 'Novice Creator'
        END,
        updated_at = now()
    RETURNING *;
$$;

-- 7. Atomically reset weekly credits when a week has passed. Returns the row.
CREATE OR REPLACE FUNCTION public.reset_weekly_credits(p_user_id uuid, p_max_credits integer)
RETURNS public.user_stats
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    UPDATE public.user_stats
    SET weekly_free_credits_left = p_max_credits,
        last_credits_reset_at = now()
    WHERE user_id = p_user_id
      AND (last_credits_reset_at IS NULL OR last_credits_reset_at < now() - interval '7 days')
    RETURNING *;
$$;

-- Only the service role may call these
REVOKE ALL ON FUNCTION public.consume_weekly_credit(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.refund_weekly_credit(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_share_credit(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_download_count(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reset_weekly_credits(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_weekly_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_weekly_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_share_credit(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_download_count(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.reset_weekly_credits(uuid, integer) TO service_role;

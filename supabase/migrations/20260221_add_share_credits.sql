-- Migration: Add weekly share credit tracking to user_stats
ALTER TABLE user_stats
ADD COLUMN IF NOT EXISTS weekly_share_claimed_at TIMESTAMP WITH TIME ZONE;

-- Comment:
-- weekly_share_claimed_at: records when user last claimed their share bonus
-- Logic: if (now - weekly_share_claimed_at) > 7 days → allow another claim

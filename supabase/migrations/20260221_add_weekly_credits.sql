-- Migration to add weekly free credits to user_stats Table
ALTER TABLE user_stats 
ADD COLUMN IF NOT EXISTS weekly_free_credits_left INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_credits_reset_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Comment describing the logic:
-- Novice Creator: 1 credit/week
-- Rising Creator: 3 credits/week
-- Sound Master: 5 credits/week
-- Legendary Composer: 10 credits/week

-- Add format availability columns to songs table
ALTER TABLE public.songs 
ADD COLUMN IF NOT EXISTS has_wav boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_loop boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_high_res boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_midi boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS mp3_url text,
ADD COLUMN IF NOT EXISTS full_audio_url text;

-- Update existing preview_url to mp3_url for existing songs
UPDATE public.songs 
SET mp3_url = preview_url 
WHERE mp3_url IS NULL;

-- Make mp3_url required (after migration)
-- ALTER TABLE public.songs ALTER COLUMN mp3_url SET NOT NULL;

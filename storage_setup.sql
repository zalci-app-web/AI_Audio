-- Create the 'songs' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('songs', 'songs', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to all files in the 'songs' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'songs');

-- Policy: Allow authenticated users to upload files to the 'songs' bucket
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'songs');

-- Policy: Allow authenticated users to update their own files (optional, for editing)
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'songs');

-- Policy: Allow authenticated users to delete files (optional, for cleanup)
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'songs');

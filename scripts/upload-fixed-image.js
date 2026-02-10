const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function uploadFixedImage() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing environment variables');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const filePath = path.join(process.cwd(), 'public', 'fixed_image.jpg');

    if (!fs.existsSync(filePath)) {
        console.error('File not found at:', filePath);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath);
    const storagePath = 'assets/fixed_image.jpg';

    console.log('Uploading fixed image to Supabase Storage...');
    const { data, error } = await supabase.storage
        .from('songs')
        .upload(storagePath, fileContent, {
            contentType: 'image/jpeg',
            upsert: true
        });

    if (error) {
        console.error('Upload error:', error);
        process.exit(1);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('songs')
        .getPublicUrl(storagePath);

    console.log('Upload successful!');
    console.log('Public URL:', publicUrl);
}

uploadFixedImage();

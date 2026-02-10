const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function clearLibrary() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing environment variables');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Clearing all purchases...');
    const { error: purchaseError } = await supabase
        .from('purchases')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (purchaseError) {
        console.error('Error clearing purchases:', purchaseError);
    } else {
        console.log('Purchases cleared.');
    }

    console.log('Clearing all songs...');
    const { error: songError } = await supabase
        .from('songs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (songError) {
        console.error('Error clearing songs:', songError);
    } else {
        console.log('Songs cleared.');
    }

    console.log('Library cleared successfully!');
}

clearLibrary();

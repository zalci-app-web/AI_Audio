const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function updatePrices() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing environment variables');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Updating all song prices to 200...');
    const { data, error } = await supabase
        .from('songs')
        .update({ price: 200 })
        .neq('price', 200);

    if (error) {
        console.error('Error updating prices:', error);
    } else {
        console.log('Successfully updated prices.');
    }
}

updatePrices();

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ijybztqtxetrwghaxevo.supabase.co'
const SUPABASE_KEY = 'sb_publishable_keCHuVzLmPYS-6T1lBxvEw_3dSINbCI' // Anon key from .env.local isn't a secret, but normally we shouldn't hardcode. Just for this test.

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function test() {
    const { data, error } = await supabase.from('favorites').select('*').limit(1)
    console.log('Favorites table check:')
    console.log('Data:', data)
    console.log('Error:', error)
}

test()

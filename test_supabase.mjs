import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ipnooyvxrsdjxlsjqcgd.supabase.co';
const supabaseKey = 'sb_publishable_sMfbOOvidLUB8gGcdCUtVw_ijphwWzm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBucket() {
    const { data, error } = await supabase.storage.from('Cursos').list();
    if (error) {
        console.error('Error fetching Cursos:', error.message);
    } else {
        console.log('Cursos:', data);
    }
    
    const { data: d2, error: e2 } = await supabase.storage.from('cursos').list();
    if (e2) {
        console.error('Error fetching cursos:', e2.message);
    } else {
        console.log('cursos:', d2);
    }
}
checkBucket();

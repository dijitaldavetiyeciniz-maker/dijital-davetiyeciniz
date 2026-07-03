const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fghafzgfkkjraeopberz.supabase.co',
  'sb_publishable_zZSgJpBJZDTIuemzkNonIA_m_RNaP9W'
);

async function checkStatus() {
  const { data: weddings, error } = await supabase.from('weddings').select('slug, is_paid, bride_name');
  console.log("Weddings:", weddings);
}

checkStatus();

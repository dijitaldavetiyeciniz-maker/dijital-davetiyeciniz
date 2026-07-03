const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fghafzgfkkjraeopberz.supabase.co',
  'sb_publishable_zZSgJpBJZDTIuemzkNonIA_m_RNaP9W'
);

async function checkRsvps() {
  const { data, error } = await supabase.from('rsvps').select('*').limit(1);
  console.log("Error:", error);
}

checkRsvps();

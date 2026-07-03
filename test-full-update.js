const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fghafzgfkkjraeopberz.supabase.co',
  'sb_publishable_zZSgJpBJZDTIuemzkNonIA_m_RNaP9W'
);

async function testFullUpdate() {
  const slug = 'aysenuralperen';
  
  // 1. Update
  const { data, error, count } = await supabase
    .from('weddings')
    .update({ is_paid: true })
    .eq('slug', slug)
    .select(); // Ask for returning rows
    
  console.log("Update Error:", error);
  console.log("Returned Data:", data);
}

testFullUpdate();

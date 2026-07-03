const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fghafzgfkkjraeopberz.supabase.co',
  'sb_publishable_zZSgJpBJZDTIuemzkNonIA_m_RNaP9W'
);

async function testUpdate() {
  const { data: weddings, error: fetchError } = await supabase.from('weddings').select('*').limit(1);
  if (fetchError) {
    console.error("Fetch Error:", fetchError);
    return;
  }
  
  if (weddings.length === 0) {
    console.log("No weddings found.");
    return;
  }
  
  const id = weddings[0].id;
  const currentStatus = weddings[0].is_paid;
  
  console.log("Attempting to update wedding:", id, "currentStatus:", currentStatus);
  
  const { error } = await supabase
    .from('weddings')
    .update({ is_paid: !currentStatus })
    .eq('id', id);
    
  console.log("Update Error:", error);
}

testUpdate();

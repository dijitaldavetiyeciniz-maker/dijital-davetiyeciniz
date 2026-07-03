const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fghafzgfkkjraeopberz.supabase.co',
  'sb_publishable_zZSgJpBJZDTIuemzkNonIA_m_RNaP9W'
);

async function checkSchema() {
  // Try to select a single row to see all columns
  const { data, error } = await supabase.from('weddings').select('*').limit(1);
  if (data && data.length > 0) {
    console.log(Object.keys(data[0]));
  } else {
    console.log("No data or error", error);
  }
}

checkSchema();

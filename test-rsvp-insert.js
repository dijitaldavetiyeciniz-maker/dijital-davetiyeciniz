const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fghafzgfkkjraeopberz.supabase.co',
  'sb_publishable_zZSgJpBJZDTIuemzkNonIA_m_RNaP9W'
);

async function testRsvpInsert() {
  const { data, error } = await supabase.from('rsvps').insert([
    {
      wedding_id: '861a4947-f37b-402a-9e1e-257a3e5c929e', // some random uuid
      guest_name: 'Test Guest',
      is_attending: true,
      guest_count: 2,
      message: 'Hello'
    }
  ]).select();
  
  console.log("Insert Error:", error);
  console.log("Returned Data:", data);
}

testRsvpInsert();

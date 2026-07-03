require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testSignup() {
  console.log("Testing Supabase Signup...");
  const { data, error } = await supabase.auth.signUp({
    email: 'test_user_12345@test.com',
    password: 'password123'
  });
  console.log("Error:", error);
  console.log("Data:", data);
}

testSignup();

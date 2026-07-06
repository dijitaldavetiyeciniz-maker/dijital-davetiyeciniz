const fs = require('fs');
const path = require('path');

// Let's read env variables from .env.local to initialize Supabase
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const processEnv = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts[1].trim().replace(/^['"]|['"]$/g, '');
    processEnv[key] = value;
  }
});

const supabaseUrl = processEnv.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = processEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase
    .from('weddings')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error fetching weddings:", error);
  } else if (data && data.length > 0) {
    console.log("Wedding columns:", Object.keys(data[0]));
  } else {
    console.log("No rows found in weddings table, but connected successfully.");
  }
}

check();

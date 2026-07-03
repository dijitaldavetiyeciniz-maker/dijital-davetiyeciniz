import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fghafzgfkkjraeopberz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_zZSgJpBJZDTIuemzkNonIA_m_RNaP9W'

export const supabase = createClient(supabaseUrl, supabaseKey)

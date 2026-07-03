import { createClient } from '@supabase/supabase-js'

// Kullanıcıdan alınacak değerler. Şimdilik geçici (placeholder) değerler.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

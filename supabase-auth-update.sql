-- Daha önce çalıştırılan SQL kodlarına ek olarak:

-- weddings tablosuna user_id eklenmesi
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Mevcut satırlar için user_id boş (NULL) kalacak, bu sorun değil.

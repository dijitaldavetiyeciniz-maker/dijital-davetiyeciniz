-- Telegram Bot Entegrasyonu İçin Gerekli Sütunlar
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS telegram_bot_token TEXT;
ALTER TABLE weddings ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

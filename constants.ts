// replace these with your actual Supabase project credentials
export const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
export const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Replace with your N8N Production Webhook URL
export const N8N_WEBHOOK_URL = process.env.REACT_APP_N8N_WEBHOOK_URL || 'https://n8n.your-domain.com/webhook/video-dubbing';

export const BUCKET_NAME = 'videos';
export const TABLE_NAME = 'dubbing_requests';

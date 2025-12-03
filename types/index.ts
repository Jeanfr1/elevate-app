export type TranslationJobStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface TranslationJob {
  id: string
  user_id: string
  source_video_url: string
  translated_video_url: string | null
  status: TranslationJobStatus
  target_language: string
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface N8NWebhookPayload {
  jobId: string
  videoUrl: string
  targetLanguage: string
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'Inglês' },
  { code: 'es', label: 'Espanhol' },
  { code: 'fr', label: 'Francês' },
  { code: 'de', label: 'Alemão' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: 'Japonês' },
  { code: 'hi', label: 'Hindi' },
  { code: 'zh', label: 'Chinês' },
  { code: 'ko', label: 'Coreano' },
] as const

export type SupportedLanguageCode = typeof SUPPORTED_LANGUAGES[number]['code']




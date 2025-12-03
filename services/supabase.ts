import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, BUCKET_NAME, TABLE_NAME } from '../constants';
import { DubbingRequest } from '../types';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Uploads a video file to Supabase Storage
 */
export const uploadVideo = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    return null;
  }
};

/**
 * Creates a new dubbing request record in the database
 */
export const createDubbingRequest = async (
  videoUrl: string,
  targetLanguage: string
): Promise<DubbingRequest | null> => {
  try {
    // Ideally, get the real user ID from auth session
    // const { data: { user } } = await supabase.auth.getUser();
    // For this demo, we'll assume a dummy ID or handle RLS accordingly on the backend
    const dummyUserId = '00000000-0000-0000-0000-000000000000'; 

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          user_id: dummyUserId, // Ensure your RLS allows this or implement auth
          status: 'pending',
          original_video_url: videoUrl,
          target_language: targetLanguage,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as DubbingRequest;
  } catch (error) {
    console.error('Error creating request:', error);
    return null;
  }
};

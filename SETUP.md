# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Supabase Setup

1. **Create Project**: Go to [supabase.com](https://supabase.com) and create a new project

2. **Run SQL Schema**:
   - Go to SQL Editor in Supabase Dashboard
   - Copy and paste the entire contents of `supabase-schema.sql`
   - Click "Run"

3. **Create Storage Bucket**:
   - Go to Storage in Supabase Dashboard
   - Click "New bucket"
   - Name it `videos`
   - Make it **Public**
   - Click "Create bucket"

4. **Enable Realtime**:
   - Go to Database > Replication
   - Find `translation_jobs` table
   - Toggle it ON to enable replication

5. **Get Credentials**:
   - Go to Settings > API
   - Copy your Project URL and anon/public key

## Step 3: Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/video-translation
NEXT_PUBLIC_STORAGE_BUCKET=videos
```

## Step 4: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 5: N8N Workflow Setup

Your N8N workflow should:

1. **Receive Webhook** with payload:
   ```json
   {
     "jobId": "uuid",
     "videoUrl": "https://...",
     "targetLanguage": "es"
   }
   ```

2. **Process Video** (your translation/lip-sync logic)

3. **Upload Result** to Supabase Storage:
   - Upload processed video to `videos` bucket
   - Get public URL

4. **Update Database**:
   ```sql
   UPDATE translation_jobs
   SET
     status = 'completed',
     translated_video_url = 'https://...'
   WHERE id = 'jobId';
   ```

   Or on failure:
   ```sql
   UPDATE translation_jobs
   SET
     status = 'failed',
     error_message = 'Error description'
   WHERE id = 'jobId';
   ```

## Troubleshooting

### Sidebar not visible on mobile
- Click the menu button (hamburger icon) in the top-left

### Videos not uploading
- Check that the `videos` bucket exists and is public
- Verify `NEXT_PUBLIC_STORAGE_BUCKET` matches your bucket name

### Real-time updates not working
- Ensure Realtime is enabled for `translation_jobs` table
- Check browser console for connection errors

### Authentication issues
- Verify Supabase credentials in `.env.local`
- Check that RLS policies are correctly set up




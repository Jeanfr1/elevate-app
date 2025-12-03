# GlobalVoice - AI Video Translation SaaS

A premium, production-ready SaaS application for AI-powered video translation and lip-syncing. Built with Next.js 14+, Supabase, and integrated with N8N automation workflows.

## 🚀 Features

- **Premium UI/UX**: Futuristic dark mode design with glassmorphism, neon gradients, and smooth animations
- **Authentication**: Secure email/password authentication via Supabase Auth
- **Video Upload**: Drag-and-drop video upload with progress tracking
- **Real-time Updates**: Live status updates using Supabase Realtime subscriptions
- **Custom Video Player**: Premium-styled video player with full controls
- **N8N Integration**: Seamless webhook integration for video processing

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, PostgreSQL, Storage, Realtime)
- **UI Components**: Shadcn/UI, Framer Motion, Lucide React
- **State Management**: Zustand
- **Notifications**: Sonner

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase project ([create one here](https://supabase.com))
- An N8N instance with a webhook endpoint

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the SQL from `supabase-schema.sql`
3. Go to **Storage** and create a bucket named `videos` (make it public)
4. Go to **Database > Replication** and enable replication for the `translation_jobs` table
5. Copy your project URL and anon key from **Settings > API**

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# N8N Webhook URL
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/video-translation

# Supabase Storage Bucket Name
NEXT_PUBLIC_STORAGE_BUCKET=videos
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── process-video/     # N8N webhook trigger
│   ├── dashboard/
│   │   ├── layout.tsx         # Dashboard layout with sidebar
│   │   ├── page.tsx           # New translation page
│   │   └── history/           # Translation history
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page (redirects)
├── components/
│   ├── dashboard/             # Dashboard components
│   ├── ui/                    # Shadcn/UI components
│   └── video/                 # Video player component
├── lib/
│   ├── supabase/              # Supabase client helpers
│   └── utils.ts               # Utility functions
├── types/
│   └── index.ts               # TypeScript types
├── middleware.ts              # Auth middleware
└── supabase-schema.sql        # Database schema
```

## 🔄 N8N Integration

The app sends POST requests to your N8N webhook with the following payload:

```json
{
  "jobId": "uuid",
  "videoUrl": "https://...",
  "targetLanguage": "es"
}
```

Your N8N workflow should:
1. Receive the webhook payload
2. Process the video (translation + lip-sync)
3. Upload the processed video to Supabase Storage
4. Update the `translation_jobs` table:
   - Set `status` to `'completed'`
   - Set `translated_video_url` to the processed video URL
   - Or set `status` to `'failed'` and `error_message` if processing fails

## 🎨 Design System

The app uses a futuristic dark theme with:
- **Colors**: Purple/cyan gradients, dark backgrounds
- **Effects**: Glassmorphism, backdrop blur, neon glows
- **Animations**: Framer Motion for smooth transitions
- **Typography**: Inter font family

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own translation jobs
- Authentication required for all dashboard routes
- Secure file uploads to Supabase Storage

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

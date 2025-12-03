import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { N8NWebhookPayload } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: N8NWebhookPayload = await request.json()
    const { jobId, videoUrl, targetLanguage } = body

    if (!jobId || !videoUrl || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify the job belongs to the user
    const { data: job, error: jobError } = await supabase
      .from('translation_jobs')
      .select('id, user_id')
      .eq('id', jobId)
      .eq('user_id', user.id)
      .single()

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found or unauthorized' },
        { status: 404 }
      )
    }

    // Get N8N webhook URL from environment
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      console.error('N8N_WEBHOOK_URL is not set in environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Send request to N8N webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId,
        videoUrl,
        targetLanguage,
      }),
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('N8N webhook error:', errorText)

      // Update job status to failed
      await supabase
        .from('translation_jobs')
        .update({
          status: 'failed',
          error_message: `N8N webhook failed: ${n8nResponse.status}`,
        })
        .eq('id', jobId)

      return NextResponse.json(
        { error: 'Failed to trigger N8N workflow' },
        { status: 502 }
      )
    }

    // Update job status to processing
    await supabase
      .from('translation_jobs')
      .update({
        status: 'processing',
      })
      .eq('id', jobId)

    return NextResponse.json({
      success: true,
      message: 'Video processing started',
    })
  } catch (error: any) {
    console.error('Error processing video:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}




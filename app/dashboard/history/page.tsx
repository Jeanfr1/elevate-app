'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TranslationJob } from '@/types'
import { JobCard } from '@/components/dashboard/job-card'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function HistoryPage() {
  const [jobs, setJobs] = useState<TranslationJob[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let channel: any = null

    const setupRealtime = async () => {
      const fetchJobs = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('translation_jobs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching jobs:', error)
        } else {
          setJobs(data || [])
        }
        setLoading(false)
        return user
      }

      const user = await fetchJobs()
      if (!user) return

      channel = supabase
        .channel('translation_jobs_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'translation_jobs',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            console.log('Real-time update:', payload)

            if (payload.eventType === 'INSERT') {
              setJobs((prev) => [payload.new as TranslationJob, ...prev])
            } else if (payload.eventType === 'UPDATE') {
              setJobs((prev) =>
                prev.map((job) =>
                  job.id === payload.new.id ? (payload.new as TranslationJob) : job
                )
              )
            } else if (payload.eventType === 'DELETE') {
              setJobs((prev) => prev.filter((job) => job.id !== payload.old.id))
            }
          }
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-foreground" strokeWidth={1.5} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 sm:mb-16"
        >
          <h1 className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 sm:mb-6 text-foreground">
            Histórico de
            <br />
            <span className="text-gradient">Traduções</span>
          </h1>
          <p className="text-body text-base sm:text-lg md:text-xl text-muted-foreground font-light max-w-2xl">
            Visualize e gerencie todas as suas traduções de vídeo
          </p>
        </motion.div>

        {jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20 sm:py-32"
          >
            <p className="text-body text-lg sm:text-xl text-muted-foreground font-light mb-2">
              Nenhuma tradução ainda
            </p>
            <p className="text-body text-sm sm:text-base text-muted-foreground font-light">
              Envie seu primeiro vídeo para começar
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

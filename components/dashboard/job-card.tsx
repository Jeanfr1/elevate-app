'use client'

import { TranslationJob } from '@/types'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
  Play,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { VideoPlayer } from '@/components/video/video-player'
import { useState } from 'react'

const statusConfig = {
  pending: {
    label: 'Pendente',
    color: 'text-muted-foreground',
  },
  processing: {
    label: 'Processando',
    color: 'text-foreground',
  },
  completed: {
    label: 'Concluído',
    color: 'text-foreground',
  },
  failed: {
    label: 'Falhou',
    color: 'text-destructive',
  },
}

export function JobCard({ job }: { job: TranslationJob }) {
  const [showPlayer, setShowPlayer] = useState(false)
  const config = statusConfig[job.status]

  const handleDownload = () => {
    if (job.translated_video_url) {
      const link = document.createElement('a')
      link.href = job.translated_video_url
      link.download = `translated-${job.id}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="card-refined rounded-xl p-6 sm:p-8 hover-lift"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-6 bg-foreground/20"></div>
                <p className="text-body text-xl sm:text-2xl text-foreground font-light">
                  {job.target_language.toUpperCase()}
                </p>
              </div>
              <p className="text-body text-sm text-muted-foreground font-light">
                {formatDate(job.created_at)}
              </p>
            </div>
            <div className={`text-xs uppercase tracking-wider font-medium ${config.color}`}>
              {job.status === 'processing' && (
                <Loader2 className="w-4 h-4 inline-block mr-1.5 animate-spin" strokeWidth={1.5} />
              )}
              {job.status === 'completed' && (
                <CheckCircle2 className="w-4 h-4 inline-block mr-1.5" strokeWidth={1.5} />
              )}
              {job.status === 'failed' && (
                <XCircle className="w-4 h-4 inline-block mr-1.5" strokeWidth={1.5} />
              )}
              {config.label}
            </div>
          </div>

          {/* Error Message */}
          {job.error_message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
            >
              <p className="text-body text-sm text-destructive font-light">{job.error_message}</p>
            </motion.div>
          )}

          {/* Actions */}
          {job.status === 'completed' && job.translated_video_url && (
            <div className="space-y-4">
              {showPlayer ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <VideoPlayer url={job.translated_video_url} />
                </motion.div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      onClick={() => setShowPlayer(true)}
                      className="font-light rounded-lg h-11 px-6 border-border hover:bg-muted"
                    >
                      <Play className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      Visualizar
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      onClick={handleDownload}
                      className="font-light rounded-lg h-11 px-6 border-border hover:bg-muted"
                    >
                      <Download className="w-4 h-4 mr-2" strokeWidth={1.5} />
                      Baixar
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

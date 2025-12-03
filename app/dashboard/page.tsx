'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { VideoUpload } from '@/components/dashboard/video-upload'

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Hero Section - Ultra Minimal */}
      <motion.div
        style={{ opacity }}
        className="relative min-h-[90vh] flex items-center justify-center px-6 sm:px-8 lg:px-12"
      >
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-8 sm:space-y-12"
          >
            {/* Minimal Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 border border-border rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/40"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">
                Tradução de Vídeo
              </span>
            </motion.div>

            {/* Main Title - Ultra Large, Ultra Light */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-display text-6xl sm:text-7xl md:text-8xl lg:text-[120px] xl:text-[140px] text-foreground"
            >
              Traduza
              <br />
              <span className="text-gradient">Vídeos</span>
            </motion.h1>

            {/* Subtitle - Minimal */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-body text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-light"
            >
              Transforme seu conteúdo com tradução precisa e tecnologia de sincronização labial perfeita
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Upload Section - Clean & Focused */}
      <div className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <VideoUpload />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

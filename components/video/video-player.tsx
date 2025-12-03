'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/lib/utils'

interface VideoPlayerProps {
  url: string
  className?: string
}

export function VideoPlayer({ url, className = '' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handlePlay = () => setPlaying(true)
    const handlePause = () => setPlaying(false)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (playing) {
      video.pause()
    } else {
      video.play()
    }
    setPlaying(!playing)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !muted
    setMuted(!muted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = parseFloat(e.target.value)
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!document.fullscreenElement) {
      video.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-muted border border-border ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-auto"
        onClick={togglePlay}
      />

      {/* Controls Overlay */}
      <motion.div
        initial={false}
        animate={{
          opacity: showControls ? 1 : 0,
        }}
        className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none"
      />

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted">
        <motion.div
          className="h-full bg-foreground"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <motion.div
        initial={false}
        animate={{
          opacity: showControls ? 1 : 0,
        }}
        className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pointer-events-none"
      >
        <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="h-10 w-10 rounded-lg border border-border hover:bg-muted"
          >
            {playing ? (
              <Pause className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Play className="w-4 h-4" strokeWidth={1.5} />
            )}
          </Button>

          <div className="flex-1 flex items-center gap-3">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, hsl(var(--foreground)) 0%, hsl(var(--foreground)) ${progress}%, hsl(var(--muted)) ${progress}%, hsl(var(--muted)) 100%)`
              }}
            />
            <span className="text-xs text-muted-foreground font-light min-w-[80px] text-right">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-10 w-10 rounded-lg border border-border hover:bg-muted"
          >
            {muted ? (
              <VolumeX className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Volume2 className="w-4 h-4" strokeWidth={1.5} />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="h-10 w-10 rounded-lg border border-border hover:bg-muted"
          >
            <Maximize className="w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { SUPPORTED_LANGUAGES } from '@/types'
import { Loader2, CheckCircle2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function VideoUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [targetLanguage, setTargetLanguage] = useState<string>('es')
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const videoFile = acceptedFiles[0]
    if (videoFile) {
      if (!videoFile.type.startsWith('video/')) {
        toast.error('Por favor, envie um arquivo de vídeo válido')
        return
      }
      if (videoFile.size > 500 * 1024 * 1024) {
        toast.error('O tamanho do arquivo deve ser menor que 500MB')
        return
      }
      setFile(videoFile)
      setUploadedUrl(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  const handleUpload = async () => {
    if (!file) {
      toast.error('Por favor, selecione um arquivo de vídeo')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `source/${fileName}`

      const bucketName = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'videos'

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl
      setUploadedUrl(publicUrl)
      setUploadProgress(100)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data: job, error: jobError } = await supabase
        .from('translation_jobs')
        .insert([
          {
            user_id: user.id,
            source_video_url: publicUrl,
            target_language: targetLanguage,
            status: 'pending',
          },
        ])
        .select()
        .single()

      if (jobError) throw jobError

      toast.success('Vídeo enviado com sucesso')

      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.id,
          videoUrl: publicUrl,
          targetLanguage: targetLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error('Falha ao iniciar processamento')
      }

      setTimeout(() => {
        setFile(null)
        setUploadedUrl(null)
        setUploadProgress(0)
        router.push('/dashboard/history')
      }, 2000)
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Falha ao enviar vídeo')
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setUploadedUrl(null)
    setUploadProgress(0)
  }

  const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === targetLanguage)

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Upload Zone - Ultra Minimal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="card-refined rounded-2xl p-8 sm:p-12 md:p-16"
      >
        <AnimatePresence mode="wait">
          {!file ? (
            <div
              key="dropzone"
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-xl cursor-pointer
                transition-all duration-300
                ${isDragActive
                  ? 'border-foreground/40 bg-muted/30'
                  : 'border-border hover:border-foreground/20'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center py-20 sm:py-28 px-4 sm:px-8 text-center">
                {/* Minimal Visual Element */}
                <motion.div
                  animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="mb-8 sm:mb-10"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-border rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border border-foreground/20 rounded-lg"></div>
                  </div>
                </motion.div>

                <motion.p
                  animate={isDragActive ? { scale: 1.02 } : { scale: 1 }}
                  className="text-body text-xl sm:text-2xl md:text-3xl font-light mb-3 sm:mb-4 text-foreground"
                >
                  {isDragActive ? 'Solte o vídeo aqui' : 'Arraste e solte o vídeo'}
                </motion.p>
                <p className="text-body text-sm sm:text-base text-muted-foreground font-light mb-6 sm:mb-8">
                  ou clique para procurar
                </p>

                {/* File Types - Minimal */}
                <div className="flex items-center gap-6 text-xs sm:text-sm text-muted-foreground font-light">
                  {['MP4', 'MOV', 'AVI', 'MKV'].map((format, i) => (
                    <span key={format} className={i < 3 ? 'after:content-["/"] after:ml-6' : ''}>
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="flex items-start gap-4 sm:gap-6">
                {/* Minimal File Indicator */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 border border-border rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 border border-foreground/30 rounded"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body text-lg sm:text-xl text-foreground mb-1.5 truncate font-light">
                    {file.name}
                  </p>
                  <p className="text-body text-sm text-muted-foreground font-light mb-4">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  {uploading && (
                    <div className="space-y-2">
                      <div className="w-full h-0.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                          className="h-full bg-foreground"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground font-light">
                        {uploadProgress}%
                      </p>
                    </div>
                  )}
                  {uploadedUrl && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-foreground mt-4"
                    >
                      <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                      <span className="text-sm font-light">Concluído</span>
                    </motion.div>
                  )}
                </div>
                {!uploading && (
                  <button
                    onClick={removeFile}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg transition-colors"
                  >
                    <span className="text-muted-foreground text-xl font-light">×</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Language & Submit - Minimal */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Language Selector - Ultra Clean */}
          <div className="space-y-3">
            <label className="label-refined block">Idioma de Destino</label>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                disabled={uploading || !!uploadedUrl}
                className="w-full flex items-center justify-between px-5 py-4 bg-card border border-border rounded-xl hover:border-foreground/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="text-body text-base sm:text-lg text-foreground font-light">
                  {selectedLanguage?.label || 'Selecione o idioma'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${showLanguageDropdown ? 'rotate-180' : ''}`}
                  strokeWidth={1.5}
                />
              </motion.button>

              <AnimatePresence>
                {showLanguageDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-2 bg-card border border-border rounded-xl shadow-refined-lg overflow-hidden"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setTargetLanguage(lang.code)
                          setShowLanguageDropdown(false)
                        }}
                        className="w-full text-left px-5 py-3.5 hover:bg-muted transition-colors text-body text-foreground font-light"
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Submit Button - Refined */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              onClick={handleUpload}
              disabled={uploading || !!uploadedUrl}
              className="btn-refined w-full h-14 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando
                </>
              ) : uploadedUrl ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Concluído
                </>
              ) : (
                'Iniciar Tradução'
              )}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

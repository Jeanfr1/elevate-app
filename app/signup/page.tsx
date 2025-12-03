'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      toast.success('Conta criada! Verifique seu e-mail para confirmar a conta.')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Falha ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 sm:px-8 bg-background">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 sm:mb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 border border-border rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/40"></span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">
              Junte-se ao GlobalVoice
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-display text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6 text-foreground"
          >
            Criar
            <br />
            <span className="text-gradient">Conta</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-body text-base sm:text-lg text-muted-foreground font-light"
          >
            Comece a traduzir vídeos hoje
          </motion.p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          onSubmit={handleSignup}
          className="space-y-6 sm:space-y-8"
        >
          <div className="space-y-2">
            <Label htmlFor="fullName" className="label-refined">
              Nome Completo
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="João Silva"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="input-refined h-12 sm:h-14"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="label-refined">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-refined h-12 sm:h-14"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="label-refined">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-refined h-12 sm:h-14"
            />
            <p className="text-xs text-muted-foreground font-light">
              Deve ter pelo menos 6 caracteres
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              type="submit"
              className="btn-refined w-full h-14 text-base sm:text-lg"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm"
        >
          <span className="text-muted-foreground font-light">
            Já tem uma conta?{" "}
          </span>
          <Link
            href="/login"
            className="text-foreground hover:opacity-70 transition-opacity font-light underline underline-offset-4"
          >
            Entrar
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

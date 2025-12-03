'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const navItems = [
  { href: '/dashboard', label: 'Nova Tradução' },
  { href: '/dashboard/history', label: 'Histórico' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Falha ao sair')
    } else {
      toast.success('Saiu com sucesso')
      router.push('/login')
    }
  }

  return (
    <>
      {/* Mobile Menu Button - Minimal */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 flex items-center justify-center border border-border rounded-lg bg-card hover:bg-muted transition-colors"
        >
          <span className="text-foreground text-xl font-light">
            {mobileOpen ? '×' : '☰'}
          </span>
        </motion.button>
      </div>

      {/* Sidebar - Ultra Minimal */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop ? 0 : (mobileOpen ? 0 : -256)
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border"
      >
        <div className="flex flex-col h-full">
          {/* Logo - Text Only */}
          <div className="p-8 border-b border-border">
            <Link href="/dashboard">
              <motion.span
                whileHover={{ opacity: 0.7 }}
                className="text-display text-2xl text-foreground"
              >
                GlobalVoice
              </motion.span>
            </Link>
          </div>

          {/* Navigation - Ultra Clean */}
          <nav className="flex-1 p-6 space-y-1">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      px-4 py-3 rounded-lg transition-all text-body font-light
                      ${isActive
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* User & Sign Out - Minimal */}
          <div className="p-6 border-t border-border space-y-4">
            {user && (
              <div className="px-4 py-2 bg-muted/30 rounded-lg">
                <p className="text-body text-sm text-muted-foreground font-light truncate">
                  {user.email}
                </p>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3 text-body text-muted-foreground hover:text-foreground font-light transition-colors"
            >
              Sair
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
        />
      )}
    </>
  )
}

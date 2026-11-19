'use client'

import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import { useEffect, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { registerLenis } from '@/lib/scroll'

function SmoothScroll() {
  useEffect(() => {
    // Only smooth-scroll for mouse/trackpad users; touch devices keep native momentum scrolling.
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference) and (pointer: fine)')
    if (!mq.matches) return
    let raf = 0
    let destroyed = false
    let instance: import('lenis').default | null = null

    import('lenis').then(({ default: Lenis }) => {
      if (destroyed) return
      instance = new Lenis({ duration: 1.1, anchors: { offset: -72 } })
      registerLenis(instance)
      const loop = (time: number) => {
        instance?.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    })

    return () => {
      destroyed = true
      cancelAnimationFrame(raf)
      instance?.destroy()
      registerLenis(null)
    }
  }, [])
  return null
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <SmoothScroll />
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: '!bg-elevated !text-fg !border-line !font-sans',
          }}
        />
      </MotionConfig>
    </ThemeProvider>
  )
}

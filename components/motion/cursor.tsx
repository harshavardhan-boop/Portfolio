'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

/** Subtle ring cursor for fine pointers only. The native cursor stays visible. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)
  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const x = useSpring(mx, { stiffness: 500, damping: 40, mass: 0.3 })
  const y = useSpring(my, { stiffness: 500, damping: 40, mass: 0.3 })

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const move = (e: PointerEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      setVisible(true)
      const t = e.target as Element | null
      setActive(!!t?.closest('a, button, [role="button"], input, textarea, [data-cursor]'))
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, mx, my])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-accent/60"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: active ? 44 : 20,
        height: active ? 44 : 20,
        opacity: visible ? 1 : 0,
        backgroundColor: active ? 'rgb(var(--accent) / 0.08)' : 'rgb(var(--accent) / 0)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    />
  )
}

'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

type RevealProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'section' | 'article'
}

/** Fade + slide in when scrolled into view. Content is never gated: a <noscript> rule in layout forces it visible. */
export function Reveal({ children, delay = 0, y = 24, as = 'div', ...rest }: RevealProps) {
  const Comp = motion[as] as typeof motion.div
  const reduce = useReducedMotion()
  return (
    <Comp
      data-reveal
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Parent that staggers its <RevealItem> children. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  stagger?: number
  as?: 'div' | 'ul' | 'ol'
}) {
  const Comp = motion[as] as typeof motion.div
  const reduce = useReducedMotion()
  return (
    <Comp
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Comp>
  )
}

export const revealItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li'
}) {
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp data-reveal className={className} variants={revealItem}>
      {children}
    </Comp>
  )
}

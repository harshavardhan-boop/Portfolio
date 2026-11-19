'use client'

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useEffect, useState, type PointerEvent } from 'react'
import { copy, profile, socials } from '@/content'
import { scrollToId } from '@/lib/scroll'
import { Magnetic } from '../motion/magnetic'
import { ArrowDownIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from '../icons'

const Terminal = dynamic(() => import('./terminal').then((m) => m.Terminal), {
  ssr: false,
  loading: () => <div className="card h-[21rem]" aria-hidden />,
})

const ease = [0.22, 1, 0.36, 1] as const

function RotatingFocus() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((n) => (n + 1) % profile.focus.length), 2600)
    return () => clearInterval(t)
  }, [reduce])

  return (
    <span className="relative inline-grid align-bottom" aria-live="off">
      {/* Reserve width for the longest phrase to prevent layout shift */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
        {[...profile.focus].sort((a, b) => b.length - a.length)[0]}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={profile.focus[i]}
          className="col-start-1 row-start-1 whitespace-nowrap font-display italic text-accent"
          initial={{ y: '60%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-60%', opacity: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          {profile.focus[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const socialIcon = { GitHub: GitHubIcon, LinkedIn: LinkedInIcon, Email: MailIcon } as const

export function Hero() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.3)
  const sx = useSpring(mx, { stiffness: 40, damping: 20 })
  const sy = useSpring(my, { stiffness: 40, damping: 20 })
  const glowX = useTransform(sx, (v) => `${v * 100}%`)
  const glowY = useTransform(sy, (v) => `${v * 100}%`)

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  const nameWords = profile.name.split(' ')

  return (
    <section
      id="top"
      onPointerMove={onMove}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24"
      aria-label="Introduction"
    >
      {/* Background: grid + aurora + pointer glow */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid mask-fade-b absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 animate-aurora rounded-full will-change-transform bg-[radial-gradient(closest-side,rgb(var(--accent)/0.2),transparent)]" />
        <div className="absolute -right-40 top-20 h-[28rem] w-[28rem] animate-aurora rounded-full will-change-transform bg-[radial-gradient(closest-side,rgb(var(--violet)/0.14),transparent)] [animation-delay:-6s]" />
        <motion.div
          className="absolute h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent)/0.10),transparent)]"
          style={{ left: glowX, top: glowY }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="mx-auto grid w-full max-w-content items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8">
        <div>
          <p className="eyebrow animate-rise flex items-center gap-3 text-[11px] tracking-[0.16em] sm:text-xs sm:tracking-[0.2em]">
            <span className="h-px w-8 bg-accent/60" aria-hidden />
            {profile.title} · {profile.location}
          </p>

          <h1 className="mt-6 text-display-xl font-semibold text-fg">
            <span className="sr-only">{profile.name}</span>
            <span aria-hidden className="flex flex-wrap gap-x-[0.25em]">
              {nameWords.map((w, i) => (
                <span key={w} className="overflow-hidden pb-[0.08em]">
                  <span
                    className={
                      i === 0
                        ? 'animate-slide-up inline-block'
                        : 'animate-slide-up inline-block font-display font-normal italic text-muted'
                    }
                    style={{ '--d': `${100 + i * 120}ms` } as React.CSSProperties}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-xl text-lg text-muted sm:text-xl"
            style={{ '--d': '450ms' } as React.CSSProperties}
          >
            <span className="block">
              {copy.hero.lead} <RotatingFocus />
            </span>
            {copy.hero.stackLine}
          </p>

          <div
            className="animate-rise mt-10 flex flex-wrap items-center gap-3"
            style={{ '--d': '600ms' } as React.CSSProperties}
          >
            <Magnetic>
              <a
                href={profile.resume}
                download
                className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-transform active:scale-[0.97]"
              >
                <DownloadIcon className="transition-transform group-hover:translate-y-0.5" />
                Download Resume
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId('contact')
                }}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/50 px-6 py-3 text-sm font-medium text-fg backdrop-blur transition-colors hover:border-accent/60 active:scale-[0.97]"
              >
                Get in touch
              </a>
            </Magnetic>

            <ul className="ml-1 flex items-center gap-1" aria-label="Social links">
              {socials.map((s) => {
                const Icon = socialIcon[s.label]
                return (
                  <li key={s.label}>
                    <Magnetic strength={0.45}>
                      <a
                        href={s.href}
                        target={s.label === 'Email' ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-fg"
                      >
                        <Icon />
                      </a>
                    </Magnetic>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="animate-rise hidden lg:block" style={{ '--d': '500ms' } as React.CSSProperties}>
          <Terminal />
          <p className="mt-3 text-center font-mono text-[11px] text-muted">
            {copy.hero.terminalHint} <span className="text-accent">help</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToId('about')}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-fg sm:flex"
      >
        <motion.span
          animate={reduce ? undefined : { y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex"
        >
          <ArrowDownIcon width={14} height={14} />
        </motion.span>
        Scroll
      </button>
    </section>
  )
}

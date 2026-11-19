'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { sections, profile, type SectionId } from '@/content'
import { cn } from '@/lib/utils'
import { openCommandPalette, scrollToId } from '@/lib/scroll'
import { CloseIcon, MenuIcon, SearchIcon } from './icons'
import { ThemeToggle } from './theme-toggle'

function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null)
  useEffect(() => {
    const ids = ['top', ...sections.map((s) => s.id)]
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          setActive(e.target.id === 'top' ? null : (e.target.id as SectionId))
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

export function Nav() {
  const active = useActiveSection()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [isMac, setIsMac] = useState(true)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent)), [])

  const go = (id: string) => {
    setOpen(false)
    // Wait for the dialog to unlock scroll before scrolling
    requestAnimationFrame(() => scrollToId(id))
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3">
      <motion.nav
        aria-label="Primary"
        initial={false}
        animate={{ maxWidth: scrolled ? 760 : 1152 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-full px-3 py-2 transition-[background-color,border-color,box-shadow] duration-300',
          scrolled
            ? 'border border-line bg-bg/70 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.35)] backdrop-blur-xl'
            : 'border border-transparent',
        )}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('top')
          }}
          className="flex items-center gap-2 rounded-full px-2 py-1 font-medium tracking-tight"
          aria-label={`${profile.name}, back to top`}
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-fg font-display text-base italic text-bg">h</span>
          <span className="hidden text-sm sm:inline">{profile.shortName}</span>
        </a>

        <ul className="hidden items-center md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId(s.id)
                }}
                aria-current={active === s.id ? 'true' : undefined}
                className={cn(
                  'relative block rounded-full px-3 py-1.5 text-sm transition-colors',
                  active === s.id ? 'text-fg' : 'text-muted hover:text-fg',
                )}
              >
                {active === s.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-elevated"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openCommandPalette}
            className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:text-fg sm:flex"
            aria-label="Open command palette"
          >
            <SearchIcon width={14} height={14} />
            <kbd className="font-mono">{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>
          <ThemeToggle />

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-elevated hover:text-fg md:hidden"
              aria-label="Open menu"
            >
              <MenuIcon />
            </Dialog.Trigger>
            <AnimatePresence>
              {open && (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild>
                    <motion.div
                      className="fixed inset-0 z-[70] bg-bg/60 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  </Dialog.Overlay>
                  <Dialog.Content asChild>
                    <motion.div
                      className="fixed inset-x-3 top-3 z-[80] rounded-3xl border border-line bg-surface p-4 shadow-2xl"
                      initial={{ opacity: 0, y: -16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -16, scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    >
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="eyebrow">Menu</Dialog.Title>
                        <Dialog.Description className="sr-only">Jump to a section</Dialog.Description>
                        <Dialog.Close
                          className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-elevated hover:text-fg"
                          aria-label="Close menu"
                        >
                          <CloseIcon />
                        </Dialog.Close>
                      </div>
                      <ul className="mt-2">
                        {sections.map((s, i) => (
                          <motion.li
                            key={s.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.04 * i }}
                          >
                            <button
                              type="button"
                              onClick={() => go(s.id)}
                              className={cn(
                                'flex w-full items-baseline gap-3 rounded-xl px-3 py-3 text-left text-2xl tracking-tight',
                                active === s.id ? 'text-fg' : 'text-muted',
                              )}
                            >
                              <span className="font-mono text-xs text-accent">0{i + 1}</span>
                              {s.label}
                            </button>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </motion.nav>
    </header>
  )
}

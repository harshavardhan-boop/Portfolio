'use client'

import * as Dialog from '@radix-ui/react-dialog'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import Image from 'next/image'
import { useRef, useState, type PointerEvent } from 'react'
import { projects, type Project } from '@/content'
import { cn } from '@/lib/utils'
import { SectionHeading } from '../section-heading'
import { Reveal } from '../motion/reveal'
import { ArrowUpRightIcon, CloseIcon } from '../icons'

const hues = [228, 265, 190]

/** Generated typographic cover, used when a project has no screenshot. */
function Cover({ project, index, large }: { project: Project; index: number; large?: boolean }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`${project.title} screenshot`}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
    )
  }
  const hue = hues[index % hues.length]
  const initials = project.title
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return (
    <div
      aria-hidden
      className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      style={{
        background: `radial-gradient(120% 90% at 0% 0%, hsl(${hue} 90% 65% / 0.35), transparent 55%),
                     radial-gradient(90% 90% at 100% 100%, hsl(${hue + 40} 85% 60% / 0.28), transparent 60%),
                     rgb(var(--elevated))`,
      }}
    >
      <div className="bg-grid absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <span
        className={cn(
          'absolute bottom-[-0.18em] right-4 select-none font-display italic leading-none text-fg/10',
          large ? 'text-[11rem] md:text-[14rem]' : 'text-[9rem]',
        )}
      >
        {initials}
      </span>
      <div className="absolute left-5 top-5 flex flex-wrap gap-1.5 pr-5">
        {project.stack.slice(0, 3).map((t) => (
          <span key={t} className="rounded-md bg-bg/50 px-2 py-1 font-mono text-[10px] text-fg/70 backdrop-blur">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  index,
  onOpen,
  featured,
}: {
  project: Project
  index: number
  onOpen: (trigger: HTMLButtonElement) => void
  featured?: boolean
}) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 })
  const sx = useTransform(px, (v) => `${v * 100}%`)
  const sy = useTransform(py, (v) => `${v * 100}%`)
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${sx} ${sy}, rgb(var(--accent) / 0.12), transparent 60%)`

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div layoutId={`card-${project.slug}`} className="h-full rounded-3xl" style={{ transformPerspective: 1000 }}>
      <motion.button
        type="button"
        onClick={(e) => onOpen(e.currentTarget)}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
        className={cn(
          'group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-surface text-left transition-colors hover:border-accent/40',
          featured && 'md:flex-row',
        )}
        aria-haspopup="dialog"
        aria-label={`${project.title} — view details`}
      >
        <motion.div
          layoutId={`cover-${project.slug}`}
          className={cn(
            'relative aspect-[16/10] w-full overflow-hidden border-b border-line',
            featured && 'md:aspect-auto md:min-h-[22rem] md:w-[58%] md:border-b-0 md:border-r',
          )}
        >
          <Cover project={project} index={index} large={featured} />
        </motion.div>

        <div className={cn('relative flex flex-1 flex-col p-6 md:p-8', featured && 'md:justify-center')}>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{project.tagline}</p>
          <motion.h3 layoutId={`title-${project.slug}`} className="mt-2 text-2xl font-semibold tracking-tight text-fg">
            {project.title}
          </motion.h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{project.description}</p>
          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.stack.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
          <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs text-accent">
            View details
            <ArrowUpRightIcon width={14} height={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>

        {/* Pointer spotlight */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spotlight }} />
      </motion.button>
    </motion.div>
  )
}

function ProjectDetail({
  project,
  index,
  onClose,
  returnFocusTo,
}: {
  project: Project
  index: number
  onClose: () => void
  returnFocusTo: () => HTMLElement | null
}) {
  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal forceMount>
        <Dialog.Overlay asChild forceMount>
          <motion.div
            className="fixed inset-0 z-[70] bg-bg/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Dialog.Overlay>
        <div className="pointer-events-none fixed inset-0 z-[75] grid place-items-center p-3 sm:p-6">
          <Dialog.Content
            asChild
            forceMount
            aria-describedby={`detail-${project.slug}-desc`}
            // Return keyboard focus to the card that opened the dialog
            onCloseAutoFocus={(e) => {
              e.preventDefault()
              returnFocusTo()?.focus({ preventScroll: true })
            }}
          >
            <motion.div
              layoutId={`card-${project.slug}`}
              className="pointer-events-auto relative flex max-h-[92svh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl"
            >
              <motion.div layoutId={`cover-${project.slug}`} className="relative aspect-[16/8] w-full flex-none overflow-hidden border-b border-line">
                <Cover project={project} index={index} large />
              </motion.div>

              <div data-lenis-prevent className="overflow-y-auto p-6 md:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{project.tagline}</p>
                <Dialog.Title asChild>
                  <motion.h3 layoutId={`title-${project.slug}`} className="mt-2 text-3xl font-semibold tracking-tight text-fg">
                    {project.title}
                  </motion.h3>
                </Dialog.Title>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
                  <p id={`detail-${project.slug}-desc`} className="mt-4 leading-relaxed text-muted">
                    {project.description}
                  </p>

                  <h4 className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-fg">What I built</h4>
                  <ul className="mt-3 space-y-2.5">
                    {project.details.map((d) => (
                      <li key={d} className="flex gap-3 leading-relaxed text-fg/85">
                        <span aria-hidden className="mt-[0.7em] h-1 w-1 flex-none rounded-full bg-accent" />
                        {d}
                      </li>
                    ))}
                  </ul>

                  <h4 className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-fg">Stack</h4>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {project.stack.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>

                  {project.links && project.links.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-3">
                      {project.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-transform active:scale-[0.97]"
                        >
                          {l.label}
                          <ArrowUpRightIcon width={16} height={16} />
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              <Dialog.Close
                className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-bg"
                aria-label="Close details"
              >
                <CloseIcon />
              </Dialog.Close>
            </motion.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function Projects() {
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const openIndex = projects.findIndex((p) => p.slug === openSlug)

  return (
    <section id="projects" aria-labelledby="projects-title" className="section">
      <SectionHeading section="projects" />

      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={i * 0.08} className={cn(i === 0 && 'md:col-span-2')}>
            <ProjectCard project={p} index={i} featured={i === 0} onOpen={(trigger) => {
                triggerRef.current = trigger
                setOpenSlug(p.slug)
              }} />
          </Reveal>
        ))}
      </ul>

      <AnimatePresence>
        {openIndex >= 0 && (
          <ProjectDetail key={openSlug} project={projects[openIndex]} index={openIndex} onClose={() => setOpenSlug(null)}
            returnFocusTo={() => triggerRef.current}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

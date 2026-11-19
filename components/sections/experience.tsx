'use client'

import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { experience, type Experience as Job } from '@/content'
import { SectionHeading } from '../section-heading'
import { Reveal } from '../motion/reveal'

const VISIBLE = 4

function TimelineEntry({ job, index }: { job: Job; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? job.highlights : job.highlights.slice(0, VISIBLE)
  const hidden = job.highlights.length - VISIBLE
  const listId = `exp-${index}-highlights`

  return (
    <li className="relative pl-10 md:pl-0">
      {/* Node */}
      <motion.span
        aria-hidden
        className="absolute left-[7px] top-2 h-[15px] w-[15px] rounded-full border-2 border-line bg-bg md:left-[calc(12rem+1.5rem-7px)]"
        initial={{ borderColor: 'rgb(var(--line))', boxShadow: '0 0 0 0 rgb(var(--accent) / 0)' }}
        whileInView={{ borderColor: 'rgb(var(--accent))', boxShadow: '0 0 0 6px rgb(var(--accent) / 0.15)' }}
        viewport={{ once: true, margin: '0px 0px -45% 0px' }}
        transition={{ duration: 0.5 }}
      />

      <div className="md:grid md:grid-cols-[12rem_1fr] md:gap-12">
        {/* Meta column */}
        <Reveal className="hidden md:block md:pt-1 md:text-right">
          <ul className="space-y-1 font-mono text-xs text-muted">
            {job.roles.map((r) => (
              <li key={r.period}>{r.period}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.05} className="card p-6 md:p-8">
          <h3 className="text-2xl font-semibold tracking-tight text-fg">
            {job.company}
            {job.location && <span className="font-normal text-muted">, {job.location}</span>}
          </h3>

          <ol className="mt-3 space-y-1.5" aria-label="Roles">
            {job.roles.map((r, i) => (
              <li key={r.title} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className={i === 0 ? 'font-medium text-accent' : 'text-fg/80'}>{r.title}</span>
                <span className="font-mono text-[11px] text-muted md:hidden">{r.period}</span>
              </li>
            ))}
          </ol>

          <p className="mt-4 font-display text-lg italic text-muted">{job.summary}</p>

          <ul id={listId} className="mt-5 space-y-3">
            <AnimatePresence initial={false}>
              {shown.map((h, i) => (
                <motion.li
                  key={h}
                  layout="position"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: i >= VISIBLE ? (i - VISIBLE) * 0.04 : 0 }}
                  className="flex gap-3 text-[15px] leading-relaxed text-fg/85"
                >
                  <span aria-hidden className="mt-[0.7em] h-1 w-1 flex-none rounded-full bg-accent" />
                  <span>{h}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {hidden > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              aria-controls={listId}
              className="link-underline mt-4 font-mono text-xs text-accent"
            >
              {expanded ? 'Show less' : `Show ${hidden} more`}
            </button>
          )}

          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
            {job.stack.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </li>
  )
}

export function Experience() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="experience" aria-labelledby="experience-title" className="section">
      <SectionHeading section="experience" />

      <div className="relative">
        {/* Track + drawn line */}
        <div aria-hidden className="absolute bottom-0 left-[14px] top-2 w-px bg-line md:left-[calc(12rem+1.5rem)]">
          <motion.div className="h-full w-full origin-top bg-gradient-to-b from-accent via-accent to-violet" style={{ scaleY }} />
        </div>

        <ol ref={ref} className="space-y-16">
          {experience.map((job, i) => (
            <TimelineEntry key={job.company} job={job} index={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}

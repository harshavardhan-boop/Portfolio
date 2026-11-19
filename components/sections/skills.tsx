'use client'

import { LayoutGroup, motion } from 'framer-motion'
import { useState } from 'react'
import { skills } from '@/content'
import { cn } from '@/lib/utils'
import { SectionHeading } from '../section-heading'
import { Reveal } from '../motion/reveal'

type Filter = 'all' | string

export function Skills() {
  const [selected, setSelected] = useState<Filter>('all')
  const [hovered, setHovered] = useState<string | null>(null)
  const focus = hovered ?? selected
  const total = skills.reduce((n, g) => n + g.skills.length, 0)

  const filters = [{ id: 'all', label: 'All', count: total }, ...skills.map((g) => ({ id: g.id, label: g.label, count: g.skills.length }))]

  return (
    <section id="skills" aria-labelledby="skills-title" className="section">
      <SectionHeading section="skills" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        {/* Filters */}
        <Reveal className="min-w-0">
          <LayoutGroup id="skill-filters">
            <div
              role="radiogroup"
              aria-label="Skill category"
              className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {filters.map((f) => {
                const active = selected === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelected(f.id)}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && f.id !== 'all' && setHovered(f.id)}
                    onPointerLeave={() => setHovered(null)}
                    className={cn(
                      'relative flex flex-none items-center justify-between gap-4 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors lg:rounded-xl lg:py-2.5',
                      active ? 'text-fg' : 'text-muted hover:text-fg',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="skill-filter-pill"
                        className="absolute inset-0 -z-10 rounded-full border border-line bg-elevated lg:rounded-xl"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span>{f.label}</span>
                    <span className="font-mono text-[11px] text-muted">{String(f.count).padStart(2, '0')}</span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>
        </Reveal>

        {/* Grid */}
        <div className="space-y-8" aria-live="polite">
          {skills.map((g, gi) => {
            const lit = focus === 'all' || focus === g.id
            return (
              <Reveal key={g.id} delay={gi * 0.04}>
                <motion.div animate={{ opacity: lit ? 1 : 0.28 }} transition={{ duration: 0.3 }}>
                  <h3 className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    <span className={cn('h-1.5 w-1.5 rounded-full transition-colors', lit && focus !== 'all' ? 'bg-accent' : 'bg-line')} />
                    {g.label}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {g.skills.map((s, si) => (
                      <motion.li
                        key={s}
                        animate={lit && focus !== 'all' ? { y: [0, -3, 0] } : { y: 0 }}
                        transition={{ duration: 0.4, delay: si * 0.03 }}
                        className={cn(
                          'rounded-xl border px-3.5 py-2 text-sm transition-colors duration-300',
                          lit && focus !== 'all'
                            ? 'border-accent/50 bg-accent/10 text-fg'
                            : 'border-line bg-surface/60 text-fg/85 hover:border-accent/40 hover:text-fg',
                        )}
                      >
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

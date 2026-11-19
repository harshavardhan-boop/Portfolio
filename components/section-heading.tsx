import type { ReactNode } from 'react'
import { getSection, type SectionId } from '@/content'
import { Reveal } from './motion/reveal'

/**
 * Section heading. Number, label, heading and description all come from content/site-copy.ts.
 * `extra` appends something after the description (e.g. a link).
 */
export function SectionHeading({ section, extra }: { section: SectionId; extra?: ReactNode }) {
  const { number, label, heading, description } = getSection(section)
  const [before, accent, after] = heading
  return (
    <Reveal className="mb-14 max-w-2xl md:mb-20">
      <p className="eyebrow flex items-center gap-3">
        <span className="text-muted">{number}</span>
        <span className="h-px w-8 bg-accent/60" aria-hidden />
        {label}
      </p>
      <h2 id={`${section}-title`} className="mt-5 text-display-lg font-semibold text-fg text-balance">
        {before} <Em>{accent}</Em>
        {after ? ` ${after}` : null}
      </h2>
      {(description || extra) && (
        <p className="mt-5 text-lg text-muted text-pretty">
          {description}
          {extra ? <> {extra}</> : null}
        </p>
      )}
    </Reveal>
  )
}

/** Serif-italic accent word used inside headings. */
export function Em({ children }: { children: ReactNode }) {
  return <em className="font-display font-normal italic text-accent">{children}</em>
}

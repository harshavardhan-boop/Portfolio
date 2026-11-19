import type { Heading } from './types'

/**
 * Sections in nav order. This list drives the nav links, the mobile menu, the command palette,
 * the section numbers (01, 02…) and each section's heading and intro line.
 *
 * heading: [text before, word in italic accent, optional text after]
 */
export const sections = [
  {
    id: 'about',
    label: 'About',
    heading: ['A little', 'about', 'me'] as Heading,
    description: '',
  },
  {
    id: 'experience',
    label: 'Experience',
    heading: ["Where I've", 'worked'] as Heading,
    description: '',
  },
  {
    id: 'projects',
    label: 'Projects',
    heading: ["Things I've", 'built'] as Heading,
    description: 'Personal and academic projects. Select a card for details.',
  },
  {
    id: 'skills',
    label: 'Skills',
    heading: ['My', 'toolbox'] as Heading,
    description: 'Pick a category to highlight its tools.',
  },
  {
    id: 'github',
    label: 'GitHub',
    heading: ['Live from', 'GitHub'] as Heading,
    description: 'Pulled from the GitHub API and refreshed hourly.',
  },
  {
    id: 'contact',
    label: 'Contact',
    heading: ["Let's", 'talk'] as Heading,
    description: "Have a role, a project or a question? Send a message and I'll reply by email.",
  },
] as const

export type SectionId = (typeof sections)[number]['id']

/** Smaller pieces of text used around the site. */
export const copy = {
  hero: {
    /** Shown before the rotating phrase from profile.focus */
    lead: 'I build',
    /** Line after the rotating phrase */
    stackLine: 'with React, Next.js, TypeScript and Node.js.',
    terminalHint: "psst — it's interactive. try",
  },
  footer: {
    year: '2026',
    builtWith: 'with Next.js, Tailwind CSS and Framer Motion.',
  },
  /** Bottom line of the social share (Open Graph) image */
  shareTagline: 'Multi-tenant SaaS · Real-time dashboards · React, Next.js, TypeScript, Node.js',
  seo: {
    keywords: [
      'Full Stack Developer',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'NestJS',
      'Socket.IO',
      'Multi-tenant SaaS',
      'Hyderabad',
    ],
    /** Topics listed in the Person structured data for search engines */
    knowsAbout: ['React', 'Next.js', 'TypeScript', 'Node.js', 'NestJS', 'MongoDB', 'PostgreSQL', 'WebSockets'],
  },
}

/** Look up a section's text by id (used by the section components). */
export function getSection(id: SectionId) {
  const index = sections.findIndex((s) => s.id === id)
  return { ...sections[index], number: String(index + 1).padStart(2, '0') }
}

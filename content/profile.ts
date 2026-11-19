import type { SocialLink } from './types'

/** Who you are. Used in the hero, About, contact, footer, terminal, SEO and the share image. */
export const profile = {
  /** Full name. In the hero, the first word is bold and the rest is italic. */
  name: 'Harshavardhan Reddy Chamala',
  /** Short name for the nav logo and footer credit. */
  shortName: 'Harshavardhan',
  title: 'Full Stack Developer',
  location: 'Hyderabad, India',
  email: 'chamalaharshavardhan55@gmail.com',
  /** Public URL of the site. Set NEXT_PUBLIC_SITE_URL on Vercel to override. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://v0-harshavardhan-portfolio.vercel.app',
  /** File inside /public. Replace public/resume.pdf to update your resume. */
  resume: '/resume.pdf',
  /** File inside /public. Replace public/images/harshavardhan.jpg to update your photo. */
  photo: '/images/harshavardhan.jpg',
  /** Phrases that rotate in the hero after "I build …". Keep each under ~25 characters. */
  focus: ['multi-tenant SaaS', 'real-time dashboards', 'AI-enabled products', 'typed data layers'],
  /** About paragraph. Also used for the SEO description and the terminal `about` command. */
  summary:
    'Full Stack Developer with over a year of experience building production multi-tenant SaaS applications with React, Next.js, TypeScript and Node.js. I build real-time, AI-enabled dashboards on REST and WebSocket APIs, with a focus on typed data layers, clean component architecture and reliable, well-tested features.',
} as const

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/harshavardhan-c', handle: 'harshavardhan-c' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/chamalaharsha', handle: 'chamalaharsha' },
  { label: 'Email', href: `mailto:${profile.email}`, handle: profile.email },
]

import type { Experience } from './types'

/**
 * Jobs, newest first. The first role of the first job is shown as "Currently" in About
 * and used as your employer in SEO data — so a new job only needs to be added here.
 *
 * Confidentiality: keep Codeprism descriptions generic (no product name, clients or internal URLs).
 */
export const experience: Experience[] = [
  {
    company: 'Codeprism Technologies',
    location: 'Hyderabad',
    roles: [
      { title: 'Full Stack Developer', period: 'May 2026 – Present' },
      { title: 'Full Stack Developer Intern', period: 'Dec 2025 – May 2026' },
    ],
    summary:
      'An AI customer engagement platform (multi-tenant SaaS) for running AI assistants across web chat, WhatsApp, Instagram, email and voice.',
    highlights: [
      'Developed core dashboard modules (shared inbox, CRM, calendar, knowledge base, billing, settings) in Next.js, React and TypeScript with role-based access.',
      'Architected the knowledge-base workflow for a RAG-powered AI assistant: upload files/URLs/images, review AI-extracted content, approve ingestion, with real-time status.',
      'Built a real-time sync and notifications layer over WebSockets (Socket.IO) and React Context.',
      'Engineered a threaded email inbox with typed data contracts and server-side pagination.',
      'Led the redesign of the scheduling module into one responsive calendar (FullCalendar, Luxon) with slot-based booking, availability, exceptions and reminders across time zones.',
      'Built a server-side CRM filtering engine using a typed query model, covered by unit tests.',
      'Integrated the Next.js frontend with a NestJS and MongoDB backend via typed Axios modules.',
      'Shipped the dashboard as an installable PWA and built a statically generated multilingual marketing site.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'NestJS', 'MongoDB', 'Socket.IO', 'FullCalendar', 'Luxon', 'react-i18next'],
  },
  {
    company: 'Datavalley',
    roles: [{ title: 'Full Stack Developer Intern', period: 'Jul 2025 – Dec 2025' }],
    summary: 'CodersWorld, a learning and career platform.',
    highlights: [
      'Built features for CodersWorld, a learning and career platform (Next.js, NestJS, PostgreSQL).',
      'Implemented JWT authentication with protected routes and a timed aptitude assessment module.',
    ],
    stack: ['Next.js', 'NestJS', 'PostgreSQL', 'JWT'],
  },
]

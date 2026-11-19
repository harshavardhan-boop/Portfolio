import type { SkillGroup } from './types'

/**
 * Skill categories, in display order. Each becomes a filter button in the Skills section.
 * `id` must be unique, lowercase, no spaces.
 */
export const skills: SkillGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    skills: ['TypeScript', 'JavaScript (ES6+)', 'Python', 'SQL', 'Java (Basics)'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    skills: ['React 19', 'Next.js (App Router, SSG)', 'Redux Toolkit', 'React Context', 'Tailwind CSS', 'shadcn/ui', 'Radix UI', 'react-i18next'],
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
    skills: ['Node.js', 'NestJS', 'Express.js', 'REST APIs', 'Socket.IO', 'Axios', 'JWT', 'OAuth 2.0'],
  },
  {
    id: 'databases',
    label: 'Databases',
    skills: ['PostgreSQL', 'MongoDB (Mongoose)', 'MySQL', 'Supabase'],
  },
  {
    id: 'devops',
    label: 'Testing & DevOps',
    skills: ['Vitest', 'Docker', 'GitLab CI/CD', 'Git', 'Postman'],
  },
  {
    id: 'ai',
    label: 'AI Tools',
    skills: ['Claude Code', 'Cursor', 'GitHub Copilot', 'Google Antigravity'],
  },
  {
    id: 'concepts',
    label: 'Concepts',
    skills: ['Multi-tenant SaaS', 'Real-time Systems (WebSockets)', 'Role-Based Access Control', 'Internationalization'],
  },
]

import type { Certification } from './types'

/** Shown in About. `school` is also used as alumniOf in SEO data. */
export const education = {
  degree: 'B.Tech – Computer Science and Engineering',
  school: 'Sree Venkateswara College of Engineering, Nellore',
  period: '2021 – 2025',
  cgpa: '7.64',
}

export const certifications: Certification[] = [
  { name: 'SQL and Relational Databases', issuer: 'IBM' },
  { name: 'Python', issuer: 'IBM' },
  { name: 'React.js Developer', issuer: 'HackerRank' },
]

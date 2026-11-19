/**
 * Shapes of the content data. You normally don't need to edit this file —
 * it only makes the editor warn you if a field is missing or misspelled.
 */

export type SocialLink = {
  label: 'GitHub' | 'LinkedIn' | 'Email'
  href: string
  handle: string
}

export type Role = { title: string; period: string }

export type Experience = {
  company: string
  location?: string
  roles: Role[]
  summary: string
  highlights: string[]
  stack: string[]
}

export type Project = {
  slug: string
  title: string
  tagline: string
  description: string
  details: string[]
  stack: string[]
  links?: { label: string; href: string }[]
  /** Optional cover image path in /public. When absent a generated cover is rendered. */
  image?: string
}

export type SkillGroup = { id: string; label: string; skills: string[] }

export type Certification = { name: string; issuer: string }

/**
 * A section heading: plain text, then one word in the italic accent font, then optional text after.
 * e.g. ["Things I've", 'built'] → Things I've *built*
 */
export type Heading = [before: string, accent: string, after?: string]

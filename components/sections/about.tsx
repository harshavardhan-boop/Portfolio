import Image from 'next/image'
import { certifications, education, experience, profile } from '@/content'
import { SectionHeading } from '../section-heading'
import { Reveal, RevealItem, Stagger } from '../motion/reveal'

export function About() {
  const current = experience[0]
  const facts: { label: string; value: React.ReactNode }[] = [
    { label: 'Based in', value: profile.location },
    {
      label: 'Currently',
      value: (
        <>
          {current.roles[0].title}
          <span className="text-muted"> at </span>
          {current.company}
        </>
      ),
    },
    {
      label: 'Education',
      value: (
        <>
          {education.degree}
          <span className="block text-sm text-muted">
            {education.school} · {education.period} · CGPA {education.cgpa}
          </span>
        </>
      ),
    },
    {
      label: 'Certified',
      value: (
        <ul className="space-y-0.5">
          {certifications.map((c) => (
            <li key={c.name}>
              {c.name} <span className="text-muted">— {c.issuer}</span>
            </li>
          ))}
        </ul>
      ),
    },
  ]

  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <SectionHeading section="about" />

      <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <Reveal className="md:sticky md:top-28 md:self-start">
          <figure className="group relative mx-auto max-w-sm md:max-w-none">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/30 via-transparent to-violet/30 opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-elevated">
                <Image
                  src={profile.photo}
                  alt={`Portrait of ${profile.name}`}
                  fill
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="object-cover object-[50%_20%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="flex items-center justify-between px-2 pb-1 pt-3 font-mono text-[11px] text-muted">
                <span>{profile.name}</span>
                <span>{profile.location}</span>
              </figcaption>
            </div>
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-xl leading-relaxed text-fg text-pretty md:text-2xl md:leading-relaxed">
              {profile.summary}
            </p>
          </Reveal>

          <Stagger as="ul" className="mt-12 divide-y divide-line border-y border-line">
            {facts.map((f) => (
              <RevealItem as="li" key={f.label} className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted sm:pt-1">{f.label}</span>
                <div className="text-fg">{f.value}</div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}

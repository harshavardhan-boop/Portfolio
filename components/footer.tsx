'use client'

import { scrollToId } from '@/lib/scroll'
import { copy, profile, socials } from '@/content'
import { ArrowUpIcon } from './icons'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-sm text-fg">© {copy.footer.year} {profile.name}</p>
          <p className="mt-1 text-sm text-muted">
            Designed &amp; built by {profile.shortName} {copy.footer.builtWith}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <ul className="flex items-center gap-4 text-sm text-muted">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.label === 'Email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="link-underline transition-colors hover:text-fg"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => scrollToId('top')}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent/50 hover:text-fg"
            aria-label="Back to top"
          >
            <ArrowUpIcon width={16} height={16} />
          </button>
        </div>
      </div>
    </footer>
  )
}

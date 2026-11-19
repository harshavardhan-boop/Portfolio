import { getGitHubData, type ContributionDay, type GitHubData } from '@/lib/github'
import { githubConfig } from '@/content'
import { SectionHeading } from '../section-heading'
import { Reveal, RevealItem, Stagger } from '../motion/reveal'
import { ArrowUpRightIcon, ForkIcon, GitHubIcon, StarIcon } from '../icons'

const langColor: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#663399',
  Shell: '#89e051',
}

const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="card p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-fg">{value}</p>
    </div>
  )
}

function Heatmap({ weeks, total }: { weeks: ContributionDay[][]; total: number }) {
  const max = Math.max(1, ...weeks.flat().map((d) => d.count))
  const level = (c: number) => (c === 0 ? 0 : Math.ceil((c / max) * 4))
  const alpha = [0, 0.25, 0.45, 0.7, 1]
  return (
    <Reveal className="card mt-6 overflow-hidden p-5">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="text-sm text-fg">
          <span className="font-semibold">{total.toLocaleString('en-US')}</span>{' '}
          <span className="text-muted">contributions in the last year</span>
        </p>
      </div>
      <div className="overflow-x-auto [scrollbar-width:thin]" data-lenis-prevent>
        <div
          className="grid w-max grid-flow-col grid-rows-7 gap-[3px]"
          role="img"
          aria-label={`Contribution heatmap: ${total} contributions in the last year`}
        >
          {weeks.flat().map((d) => (
            <span
              key={d.date}
              title={`${d.count} on ${d.date}`}
              className="h-[11px] w-[11px] rounded-[3px]"
              style={{
                backgroundColor: level(d.count) === 0 ? 'rgb(var(--elevated))' : `rgb(var(--accent) / ${alpha[level(d.count)]})`,
              }}
            />
          ))}
        </div>
      </div>
    </Reveal>
  )
}

function Fallback() {
  const url = `https://github.com/${githubConfig.user}`
  return (
    <Reveal className="card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-lg text-fg">GitHub is taking a breather.</p>
        <p className="mt-1 text-muted">Live stats are unavailable right now — you can still browse my profile directly.</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-none items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg"
      >
        <GitHubIcon /> @{githubConfig.user}
      </a>
    </Reveal>
  )
}

function Content({ data }: { data: GitHubData }) {
  const totalLang = data.languages.reduce((n, l) => n + l.count, 0)
  return (
    <>
      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <RevealItem>
          <Stat label="Public repos" value={data.user.publicRepos} />
        </RevealItem>
        <RevealItem>
          <Stat label="Top language" value={data.languages[0]?.name ?? '—'} />
        </RevealItem>
        <RevealItem>
          <Stat label="Languages" value={data.languages.length} />
        </RevealItem>
        <RevealItem>
          <Stat label="Last push" value={data.lastPush ? monthYear(data.lastPush) : '—'} />
        </RevealItem>
      </Stagger>

      {totalLang > 0 && (
        <Reveal className="mt-6">
          <div className="flex h-2 overflow-hidden rounded-full bg-elevated" role="img" aria-label="Language breakdown across repositories">
            {data.languages.map((l) => (
              <span
                key={l.name}
                style={{ width: `${(l.count / totalLang) * 100}%`, backgroundColor: langColor[l.name] ?? 'rgb(var(--muted))' }}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
            {data.languages.map((l) => (
              <li key={l.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: langColor[l.name] ?? 'rgb(var(--muted))' }} />
                {l.name} <span className="font-mono">{Math.round((l.count / totalLang) * 100)}%</span>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {data.contributions && <Heatmap weeks={data.contributions.weeks} total={data.contributions.total} />}

      <Stagger as="ul" className="mt-10 grid gap-3 md:grid-cols-2">
        {data.repos.map((r) => (
          <RevealItem as="li" key={r.name}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group card flex h-full flex-col p-5 transition-colors hover:border-accent/40"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="break-all font-mono text-sm text-fg">{r.name}</h3>
                <ArrowUpRightIcon
                  width={16}
                  height={16}
                  className="flex-none text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </div>
              {r.description && <p className="mt-2 text-sm text-muted">{r.description}</p>}
              <div className="mt-auto flex flex-wrap items-center gap-4 pt-4 text-xs text-muted">
                {r.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: langColor[r.language] ?? 'rgb(var(--muted))' }} />
                    {r.language}
                  </span>
                )}
                {r.stars > 0 && (
                  <span className="flex items-center gap-1">
                    <StarIcon width={13} height={13} /> {r.stars}
                  </span>
                )}
                {r.forks > 0 && (
                  <span className="flex items-center gap-1">
                    <ForkIcon width={13} height={13} /> {r.forks}
                  </span>
                )}
                <span className="font-mono">Updated {monthYear(r.pushedAt)}</span>
              </div>
            </a>
          </RevealItem>
        ))}
      </Stagger>
    </>
  )
}

export async function GitHub() {
  const data = await getGitHubData()
  return (
    <section id="github" aria-labelledby="github-title" className="section">
      <SectionHeading
        section="github"
        extra={
          <a
              className="link-underline text-fg"
              href={`https://github.com/${githubConfig.user}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{githubConfig.user}
            </a>
        }
      />
      {data ? <Content data={data} /> : <Fallback />}
    </section>
  )
}

import 'server-only'
import { githubConfig } from '@/content'

const API = 'https://api.github.com'
const REVALIDATE = 60 * 60 // 1 hour (ISR)

export type Repo = {
  name: string
  description: string | null
  url: string
  homepage: string | null
  language: string | null
  stars: number
  forks: number
  pushedAt: string
}

export type ContributionDay = { date: string; count: number }

export type GitHubData = {
  user: { login: string; url: string; publicRepos: number; followers: number; avatar: string }
  repos: Repo[]
  languages: { name: string; count: number }[]
  lastPush: string | null
  contributions: { total: number; weeks: ContributionDay[][] } | null
}

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'portfolio-site',
  }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: headers(), next: { revalidate: REVALIDATE } })
  if (!res.ok) throw new Error(`GitHub ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

type RawUser = { login: string; html_url: string; public_repos: number; followers: number; avatar_url: string }
type RawRepo = {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  pushed_at: string
  fork: boolean
  archived: boolean
}

async function getContributions(login: string): Promise<GitHubData['contributions']> {
  // The contribution calendar is only available through GraphQL, which requires a token.
  if (!process.env.GITHUB_TOKEN) return null
  try {
    const res = await fetch(`${API}/graphql`, {
      method: 'POST',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`,
        variables: { login },
      }),
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return null
    const json = (await res.json()) as {
      data?: {
        user?: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: number
              weeks: { contributionDays: { date: string; contributionCount: number }[] }[]
            }
          }
        }
      }
    }
    const cal = json.data?.user?.contributionsCollection.contributionCalendar
    if (!cal) return null
    return {
      total: cal.totalContributions,
      weeks: cal.weeks.map((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))),
    }
  } catch {
    return null
  }
}

/** Fetches public GitHub data. Returns null on any failure so the UI can fall back gracefully. */
export async function getGitHubData(): Promise<GitHubData | null> {
  const login = githubConfig.user
  try {
    const [user, rawRepos, contributions] = await Promise.all([
      getJSON<RawUser>(`/users/${login}`),
      getJSON<RawRepo[]>(`/users/${login}/repos?per_page=100&sort=pushed&type=owner`),
      getContributions(login),
    ])

    const own = rawRepos.filter((r) => !r.fork && !r.archived && !githubConfig.excludeRepos.includes(r.name))

    const langCounts = new Map<string, number>()
    for (const r of own) if (r.language) langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1)

    const repos: Repo[] = own
      .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.pushed_at) - +new Date(a.pushed_at))
      .slice(0, githubConfig.maxRepos)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        homepage: r.homepage || null,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        pushedAt: r.pushed_at,
      }))

    return {
      user: { login: user.login, url: user.html_url, publicRepos: user.public_repos, followers: user.followers, avatar: user.avatar_url },
      repos,
      languages: [...langCounts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      lastPush: own.map((r) => r.pushed_at).sort().at(-1) ?? null,
      contributions,
    }
  } catch (err) {
    console.error('[github] falling back:', err instanceof Error ? err.message : err)
    return null
  }
}

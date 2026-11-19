# Harshavardhan Reddy Chamala — Portfolio

Personal portfolio built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS and Framer Motion.

## Features

- **Content in one folder** — all text lives in [`content/`](content/), one file per topic. See [CONTENT_GUIDE.md](CONTENT_GUIDE.md).
- **Contact form** — server action with zod validation, honeypot + fill-time spam checks, IP rate limiting (3 per 10 min) and email delivery via [Resend](https://resend.com).
- **Command palette** — <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> to jump to sections, toggle theme, copy email, open links. Loaded on first use.
- **Live GitHub section** — public repos and language stats from the GitHub API, cached with ISR (hourly). Contribution heatmap when `GITHUB_TOKEN` is set. Falls back gracefully if the API is unavailable.
- **Interactive terminal** in the hero (desktop): `help`, `about`, `experience`, `projects`, `skills`, `contact`, `resume`, `theme`, `goto <section>`, `clear`.
- Dark / light theme, smooth scrolling (Lenis, mouse users only), scroll-drawn experience timeline, 3D-tilt project cards with shared-layout detail view, magnetic buttons, custom cursor (fine pointers only).
- Respects `prefers-reduced-motion`; all content stays visible without JavaScript.
- SEO: metadata, generated Open Graph image, `sitemap.xml`, `robots.txt`, Person JSON-LD.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in values (all optional for local dev)
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | For the contact form | Resend API key. Without it the form shows a "not configured" message with your email. |
| `CONTACT_TO_EMAIL` | No | Inbox that receives messages. Defaults to the email in `content/profile.ts`. |
| `CONTACT_FROM_EMAIL` | No | Sender address. Must be on a domain verified in Resend. Defaults to `Portfolio <onboarding@resend.dev>`, which only delivers to your Resend account's email. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public URL, used for canonical/OG/sitemap. |
| `GITHUB_TOKEN` | No | Enables the contribution heatmap and higher API rate limits. A fine-grained token with no permissions is enough. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | No | Shares rate-limit counters across serverless instances. Without them an in-memory limiter is used (per instance, best effort). |

## Deploy to Vercel

1. Push to GitHub — the existing Vercel project redeploys automatically from `main`.
   (New project: import the repo at [vercel.com/new](https://vercel.com/new); the framework is detected as Next.js.)
2. In **Project → Settings → Environment Variables**, add the variables above for *Production* (and *Preview* if wanted), then redeploy.
3. To send from your own address, verify a domain in Resend and set `CONTACT_FROM_EMAIL`, e.g. `Portfolio <hello@yourdomain.com>`.

## Updating content

See **[CONTENT_GUIDE.md](CONTENT_GUIDE.md)** for step-by-step instructions with file and line references.

- Profile, summary, links: `content/profile.ts`
- Jobs: `content/experience.ts` · Projects: `content/projects.ts` · Skills: `content/skills.ts`
- Education & certifications: `content/education.ts` · GitHub settings: `content/github.ts`
- Headings, nav, footer, SEO keywords: `content/site-copy.ts`
- Resume: replace `public/resume.pdf` · Photo: replace `public/images/harshavardhan.jpg`

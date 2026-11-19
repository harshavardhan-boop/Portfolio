# Content Update Guide

How to change anything on the portfolio: which file, which line, and what to type.

> **Line numbers** are correct for the current version. They shift as soon as you add or remove lines,
> so each step also says **what to search for** (<kbd>⌘F</kbd> / <kbd>Ctrl F</kbd> in VS Code).

## How content works

All text on the site lives in the **`content/`** folder, one file per topic.
Every section, the nav, the terminal, the command palette, SEO data and the share image **read from these files**, so a change in one place shows up everywhere it's used.

```
content/
├── profile.ts      ← name, title, email, location, summary, hero phrases, social links, resume, photo
├── experience.ts   ← jobs
├── projects.ts     ← projects
├── skills.ts       ← skill categories (tech stack)
├── education.ts    ← degree + certifications
├── github.ts       ← GitHub section settings
├── site-copy.ts    ← section headings, nav, footer, SEO keywords, share-image text
├── types.ts        ← data shapes (rarely edited)
└── index.ts        ← re-exports everything (don't edit)
```

**Automatic connections** (you don't need to update these by hand):

| You change… | It also updates… |
| --- | --- |
| `profile.ts` → `name` | hero name, footer, browser tab title, SEO, share image |
| `profile.ts` → `summary` | About, SEO description, terminal `about` |
| `profile.ts` → `email` | hero icon, contact section, copy-email button, command palette, form error messages |
| `experience.ts` → first job | About "Currently" row, SEO employer (`worksFor`), terminal `experience` |
| `education.ts` → `school` | About, SEO `alumniOf` |
| `projects.ts`, `skills.ts` | their sections + terminal `projects` / `skills` |
| `site-copy.ts` → `sections` | nav, mobile menu, command palette, section numbers 01–06, headings |

---

## Quick reference

| I want to change… | File | Line | Search for |
| --- | --- | --- | --- |
| Name, title, location, email | `content/profile.ts` | 6–11 | `name:` |
| Hero rotating phrases | `content/profile.ts` | 19 | `focus:` |
| About summary | `content/profile.ts` | 21 | `summary:` |
| GitHub / LinkedIn links | `content/profile.ts` | 25 | `export const socials` |
| Experience / jobs | `content/experience.ts` | 9 | `export const experience` |
| Projects | `content/projects.ts` | 7 | `export const projects` |
| Skills / tech stack | `content/skills.ts` | 7 | `export const skills` |
| Education | `content/education.ts` | 4 | `export const education` |
| Certifications | `content/education.ts` | 11 | `export const certifications` |
| GitHub section (hide repos, count) | `content/github.ts` | 2 | `githubConfig` |
| Section headings & intros | `content/site-copy.ts` | 9–46 | `heading:` |
| Hero "I build … with React…" text | `content/site-copy.ts` | 54–57 | `hero:` |
| Footer year & credit | `content/site-copy.ts` | 59–61 | `footer:` |
| Share-image tagline | `content/site-copy.ts` | 64 | `shareTagline` |
| SEO keywords | `content/site-copy.ts` | 66 | `keywords:` |
| **Resume PDF** | `public/resume.pdf` | — | replace the file |
| **Profile photo** | `public/images/harshavardhan.jpg` | — | replace the file |
| Accent colour | `app/globals.css` | 14 and 29 | `--accent:` |

After any change, save. With `npm run dev` running, the browser updates instantly.
Before pushing, run `npm run lint && npm run build` (see §13).

---

## 1. Update your resume

1. Export your resume as **PDF**.
2. Rename it to exactly **`resume.pdf`**.
3. Replace the file at **`public/resume.pdf`**.

The "Download Resume" button, command palette and terminal `resume` command all use it.

> Different filename? Change `resume:` in `content/profile.ts` **line 15**.

---

## 2. Change your photo

1. Use a portrait image (about **4:5** ratio, at least 800px wide; JPG or PNG).
2. Replace **`public/images/harshavardhan.jpg`** keeping the same name.

Next.js converts and resizes it automatically.

> Different filename? Change `photo:` in `content/profile.ts` **line 17**.
> Face cut off? In `components/sections/about.tsx` **line 63**, change `object-[50%_20%]` — lower the `20%` to show more of the top.

---

## 3. Personal details

**File:** `content/profile.ts`

| Field | Line | Used for |
| --- | --- | --- |
| `name` | 6 | Hero (first word bold, rest italic), footer, tab title, SEO, share image |
| `shortName` | 8 | Nav logo, footer credit |
| `title` | 9 | Hero label, SEO, share image |
| `location` | 10 | Hero label, About, contact |
| `email` | 11 | All email links and buttons |
| `url` | 13 | SEO / sitemap (or set `NEXT_PUBLIC_SITE_URL` on Vercel) |

---

## 4. Hero text

- **Rotating phrases**: `content/profile.ts` **line 19** (`focus:`). Keep each under ~25 characters.
- **"I build"** (before the phrase): `content/site-copy.ts` **line 54** (`lead:`).
- **"with React, Next.js, TypeScript and Node.js."**: `content/site-copy.ts` **line 56** (`stackLine:`).
- **"psst — it's interactive. try help"**: `content/site-copy.ts` **line 57** (`terminalHint:`).

---

## 5. About / summary

`content/profile.ts` **line 21** (`summary:`).
The "Currently" row is automatic: it shows the first role of your first job (§6).

---

## 6. Experience (jobs)

**File:** `content/experience.ts` — **line 9**

Jobs show **in the order listed**, so put the newest first.

### Add a new job
Paste this right after `export const experience: Experience[] = [` (line 9):

```ts
  {
    company: 'Company Name',
    location: 'City',                       // optional — delete the line if not needed
    roles: [
      { title: 'Job Title', period: 'Jan 2027 – Present' },
    ],
    summary: 'One line about the product or team.',
    highlights: [
      'What you built or achieved #1.',
      'What you built or achieved #2.',
    ],
    stack: ['React', 'Node.js'],
  },
```

Then update the old job's end date (`'Present'` → `'Dec 2026'`).
The About "Currently" row and SEO employer switch to the new company automatically.

### Promotion at the same company
Add a role at the **top** of that job's `roles` (Codeprism: **line 13**):

```ts
    roles: [
      { title: 'Senior Full Stack Developer', period: 'Jun 2027 – Present' },   // ← new
      { title: 'Full Stack Developer', period: 'May 2026 – Jun 2027' },         // ← end date updated
      { title: 'Full Stack Developer Intern', period: 'Dec 2025 – May 2026' },
    ],
```

### Bullet points
Edit `highlights: [...]`: Codeprism **line 19**, Datavalley **line 35**.
Only the first **4** bullets show until "Show N more" is clicked (change in `components/sections/experience.tsx` **line 9**, `const VISIBLE = 4`).

### Tech chips under a job
`stack: [...]`: Codeprism **line 29**, Datavalley **line 39**.

> ⚠️ Codeprism confidentiality: keep descriptions generic (no product name, client names or internal URLs).

---

## 7. Projects

**File:** `content/projects.ts` — **line 7**

The **first** project is the large featured card. Order = display order.

| Project | Starts at line | Stack line |
| --- | --- | --- |
| Emart | 9 | 19 (live demo link: 21) |
| Recommendation System | 25 | 35 |
| K-12 LMS | 38 | 49 |

### Add a project
Paste inside the `projects` array:

```ts
  {
    slug: 'my-project',                     // unique, lowercase, no spaces
    title: 'My Project',
    tagline: 'Short Category',              // small grey label above the title
    description: 'One or two sentences shown on the card.',
    details: [                              // bullets in the detail popup
      'Feature or responsibility #1.',
      'Feature or responsibility #2.',
    ],
    stack: ['Next.js', 'PostgreSQL'],
    links: [                                // optional — delete if none
      { label: 'Live demo', href: 'https://...' },
      { label: 'Source code', href: 'https://github.com/harshavardhan-c/...' },
    ],
    image: '/images/projects/my-project.png', // optional screenshot
  },
```

### Add a screenshot
1. Put the image in `public/images/projects/` (create the folder). A 16:10 ratio looks best.
2. Add `image: '/images/projects/emart.png',` to that project.

Without `image`, a generated cover with the project's initials is shown.
Cover colours: `components/sections/projects.tsx` **line 21** (`const hues`, values 0–360).

### Remove a project
Delete its whole `{ ... },` block.

---

## 8. Skills / tech stack

**File:** `content/skills.ts`

| Category | `skills:` line |
| --- | --- |
| Languages | 11 |
| Frontend | 16 |
| Backend & APIs | 21 |
| Databases | 26 |
| Testing & DevOps | 31 |
| AI Tools | 36 |
| Concepts | 41 |

- **Add a skill:** add a string to the right list, e.g. `'GraphQL'`.
- **New category:** add a block anywhere in the array; its filter button and count appear automatically:
  ```ts
  {
    id: 'cloud',          // unique, lowercase
    label: 'Cloud',
    skills: ['AWS', 'Vercel'],
  },
  ```

---

## 9. Education & certifications

**File:** `content/education.ts`

- Education, **lines 5–8**: `degree`, `school`, `period`, `cgpa`.
- Certifications, **line 11**. To add one:
  ```ts
  { name: 'AWS Cloud Practitioner', issuer: 'Amazon' },
  ```

---

## 10. GitHub section

**File:** `content/github.ts`

| Field | Line | Meaning |
| --- | --- | --- |
| `user` | 3 | GitHub username |
| `maxRepos` | 5 | How many repo cards to show |
| `excludeRepos` | 7 | Repos to hide, e.g. `['Portfolio', 'old-repo']` |

- Data refreshes **every hour** automatically.
- Repo descriptions come from GitHub: edit each repo's **About** box on github.com.
- The contribution heatmap appears only when `GITHUB_TOKEN` is set (§12).

---

## 11. Section headings, nav & footer

**File:** `content/site-copy.ts`

Each section has a `label` (nav + small label), a `heading` and an optional `description`:

```ts
  {
    id: 'projects',                                   // don't change ids
    label: 'Projects',                                // nav link + "03 — PROJECTS"
    heading: ["Things I've", 'built'] as Heading,     // → Things I've *built*
    description: 'Personal and academic projects. Select a card for details.',
  },
```

`heading` is `[text before, word in italic accent, optional text after]`, so `['A little', 'about', 'me']` renders as "A little *about* me".

| Section | Heading line |
| --- | --- |
| About | 13 |
| Experience | 19 |
| Projects | 25 |
| Skills | 31 |
| GitHub | 37 |
| Contact | 43 |

- **Footer:** `year` (line 60) and `builtWith` (line 61).
- **Share image tagline:** line 64.
- **SEO keywords:** line 66. **Structured-data topics:** `knowsAbout`, line 78.

> **Reorder sections:** reorder the blocks in `sections` (nav + numbers follow) **and** the components inside `<main>` in `app/page.tsx` (lines 25–31) so the page matches.

---

## 12. Look & feel, and environment variables

| What | File | Where |
| --- | --- | --- |
| Accent colour, light theme | `app/globals.css` | line 14 `--accent: 54 81 217;` |
| Accent colour, dark theme | `app/globals.css` | line 29 `--accent: 124 156 255;` |
| All theme colours | `app/globals.css` | lines 6–36 (`:root` = light, `.dark` = dark) |
| Default theme | `components/providers.tsx` | line 41 `defaultTheme="dark"` |
| Heading serif font | `app/layout.tsx` | line 9 `Instrument_Serif` |
| Terminal commands | `components/sections/terminal.tsx` | `help` list from line 36 |
| Contact form limit (3 per 10 min) | `app/actions/contact.ts` | line 42 |

Colours are **R G B** numbers without commas (`124 156 255` = `#7C9CFF`).

**Environment variables:** copy `.env.example` → `.env.local` locally; on Vercel use **Project → Settings → Environment Variables**, then redeploy.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | **Required** for the contact form to send email |
| `CONTACT_FROM_EMAIL` | Sender on your verified Resend domain |
| `CONTACT_TO_EMAIL` | Where messages arrive (default: your Gmail) |
| `NEXT_PUBLIC_SITE_URL` | Your live URL |
| `GITHUB_TOKEN` | Optional: contribution heatmap |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Optional: shared rate limiting |

Never commit `.env.local` (it's already in `.gitignore`).

---

## 13. Check and publish

```bash
npm run dev          # preview at http://localhost:3000  (busy? use: npx next dev -p 3005)
npm run lint         # must say "No ESLint warnings or errors"
npm run typecheck    # must finish with no output
npm run build        # must finish without errors
git add .
git commit -m "Update portfolio content"
git push             # Vercel deploys automatically from main
```

### Common mistakes

| Error | Fix |
| --- | --- |
| `Unterminated string` / red squiggle | A quote is missing or an apostrophe breaks the string. Use double quotes: `"It's"`. |
| `',' expected` | Missing comma after a `}` or after a string in a list. |
| `Type '"xyz"' is not assignable…` | A field name is misspelled or a required field is missing. Compare with the template above. |
| Image not showing | Path must start with `/` and match the file in `public/` exactly (case-sensitive). |
| Resume shows the old version | Hard refresh (<kbd>⌘⇧R</kbd>); browsers cache PDFs. |

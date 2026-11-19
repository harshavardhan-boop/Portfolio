'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { experience, projects, sections, profile, skills, socials } from '@/content'
import { scrollToId } from '@/lib/scroll'

type Line = { id: number; kind: 'in' | 'out'; content: ReactNode }

const COMMANDS = ['help', 'about', 'experience', 'projects', 'skills', 'contact', 'resume', 'theme', 'clear'] as const

export function Terminal() {
  const { resolvedTheme, setTheme } = useTheme()
  const [lines, setLines] = useState<Line[]>([
    { id: 0, kind: 'out', content: <span className="text-muted">Welcome. Type <Cmd>help</Cmd> to see what I can do.</span> },
  ])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const idRef = useRef(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  const print = (kind: Line['kind'], content: ReactNode) =>
    setLines((l) => [...l, { id: idRef.current++, kind, content }])

  const respond = (raw: string): ReactNode | null => {
    const [cmd, arg] = raw.trim().toLowerCase().split(/\s+/)
    switch (cmd) {
      case '':
        return null
      case 'help':
        return (
          <div className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-0.5">
            {[
              ['about', 'who I am'],
              ['experience', 'where I have worked'],
              ['projects', 'things I have built'],
              ['skills', 'my toolbox'],
              ['contact', 'how to reach me'],
              ['resume', 'open my resume'],
              ['theme', 'toggle light / dark'],
              ['goto <section>', 'scroll to a section'],
              ['clear', 'clear the screen'],
            ].map(([c, d]) => (
              <div key={c} className="contents">
                <Cmd>{c}</Cmd>
                <span className="text-muted">{d}</span>
              </div>
            ))}
          </div>
        )
      case 'about':
      case 'whoami':
        return (
          <p>
            <span className="text-fg">{profile.name}</span> — {profile.title}, {profile.location}.<br />
            <span className="text-muted">{profile.summary}</span>
          </p>
        )
      case 'experience':
        return (
          <ul>
            {experience.map((e) => (
              <li key={e.company}>
                <span className="text-fg">{e.company}</span>{' '}
                <span className="text-muted">— {e.roles.map((r) => `${r.title} (${r.period})`).join(', ')}</span>
              </li>
            ))}
          </ul>
        )
      case 'projects':
        return (
          <ul>
            {projects.map((p) => (
              <li key={p.slug}>
                <span className="text-fg">{p.title}</span> <span className="text-muted">— {p.stack.join(', ')}</span>
              </li>
            ))}
          </ul>
        )
      case 'skills':
        return (
          <ul>
            {skills.map((g) => (
              <li key={g.id}>
                <span className="text-accent">{g.label}:</span> <span className="text-muted">{g.skills.join(', ')}</span>
              </li>
            ))}
          </ul>
        )
      case 'contact':
        return (
          <ul>
            {socials.map((s) => (
              <li key={s.label}>
                <span className="inline-block w-20 text-muted">{s.label}</span>
                <a className="link-underline text-fg" href={s.href} target={s.label === 'Email' ? undefined : '_blank'} rel="noopener noreferrer">
                  {s.handle}
                </a>
              </li>
            ))}
          </ul>
        )
      case 'resume':
        window.open(profile.resume, '_blank', 'noopener,noreferrer')
        return <span className="text-muted">Opening resume…</span>
      case 'theme': {
        const next = resolvedTheme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        return <span className="text-muted">Switched to {next} theme.</span>
      }
      case 'goto':
      case 'cd': {
        const target = sections.find((s) => s.id === arg || s.label.toLowerCase() === arg)
        if (!target) return <span className="text-muted">Sections: {sections.map((s) => s.id).join(', ')}</span>
        setTimeout(() => scrollToId(target.id), 150)
        return <span className="text-muted">→ {target.label}</span>
      }
      case 'sudo':
        return <span className="text-muted">Permission denied. Nice try, though.</span>
      case 'ls':
        return <span className="text-muted">{sections.map((s) => s.id).join('  ')}</span>
      default:
        return (
          <span className="text-muted">
            command not found: <span className="text-fg">{cmd}</span>. Try <Cmd>help</Cmd>.
          </span>
        )
    }
  }

  const submit = () => {
    const raw = value
    setValue('')
    setCursor(-1)
    if (raw.trim().toLowerCase() === 'clear') {
      setLines([])
      return
    }
    print('in', raw)
    if (raw.trim()) setHistory((h) => [raw, ...h].slice(0, 30))
    const out = respond(raw)
    if (out) print('out', out)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(cursor + 1, history.length - 1)
      if (history[next] !== undefined) {
        setCursor(next)
        setValue(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = cursor - 1
      setCursor(Math.max(next, -1))
      setValue(next >= 0 ? history[next] : '')
    } else if (e.key === 'Tab') {
      const match = COMMANDS.find((c) => c.startsWith(value.trim().toLowerCase()))
      if (value && match) {
        e.preventDefault()
        setValue(match)
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div
      className="card overflow-hidden font-mono text-[12.5px] leading-relaxed shadow-[0_30px_80px_-30px_rgb(0_0_0/0.5)] backdrop-blur"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-2 text-[11px] text-muted">~/harshavardhan — zsh</span>
      </div>
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="h-72 overflow-y-auto px-4 py-3"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {lines.map((l) =>
          l.kind === 'in' ? (
            <div key={l.id} className="mt-2 first:mt-0">
              <Prompt /> <span className="text-fg">{l.content}</span>
            </div>
          ) : (
            <div key={l.id} className="mt-1 text-fg/90">
              {l.content}
            </div>
          ),
        )}
        <label className="mt-2 flex items-center gap-2">
          <Prompt />
          <span className="sr-only">Terminal command</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            className="w-full bg-transparent text-fg caret-accent outline-none"
            aria-describedby="terminal-hint"
          />
        </label>
      </div>
      <p id="terminal-hint" className="sr-only">
        Type help and press Enter to list commands.
      </p>
    </div>
  )
}

function Prompt() {
  return (
    <span aria-hidden className="select-none text-accent">
      ❯
    </span>
  )
}

function Cmd({ children }: { children: ReactNode }) {
  return <span className="text-accent">{children}</span>
}

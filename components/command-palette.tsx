'use client'

import { Command } from 'cmdk'
import * as Dialog from '@radix-ui/react-dialog'
import { useTheme } from 'next-themes'
import { useEffect, useState, type ReactNode } from 'react'
import { copyEmail } from '@/lib/clipboard'
import { sections, profile, socials } from '@/content'
import { OPEN_PALETTE_EVENT, scrollToId } from '@/lib/scroll'
import { ArrowUpRightIcon, CopyIcon, FileIcon, GitHubIcon, HashIcon, LinkedInIcon, MoonIcon, SearchIcon, SunIcon } from './icons'

function Item({ children, onSelect, value }: { children: ReactNode; onSelect: () => void; value: string }) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted data-[selected=true]:bg-elevated data-[selected=true]:text-fg"
    >
      {children}
    </Command.Item>
  )
}

const groupClass =
  '[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-muted'

export function CommandPalette({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen)
    }
  }, [])

  const run = (fn: () => void) => {
    setOpen(false)
    requestAnimationFrame(fn)
  }
  const external = (href: string) => window.open(href, '_blank', 'noopener,noreferrer')
  const github = socials.find((s) => s.label === 'GitHub')!
  const linkedin = socials.find((s) => s.label === 'LinkedIn')!

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-bg/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-[12vh] z-[95] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <Command loop label="Command palette">
            <div className="flex items-center gap-3 border-b border-line px-4">
              <SearchIcon className="text-muted" />
              <Command.Input
                autoFocus
                placeholder="Type a command or search…"
                className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
              />
              <kbd className="chip">esc</kbd>
            </div>
            <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-6 text-center text-sm text-muted">No results.</Command.Empty>

              <Command.Group heading="Navigate" className={groupClass}>
                <Item value="home top hero" onSelect={() => run(() => scrollToId('top'))}>
                  <HashIcon /> Home
                </Item>
                {sections.map((s) => (
                  <Item key={s.id} value={`go ${s.label}`} onSelect={() => run(() => scrollToId(s.id))}>
                    <HashIcon /> {s.label}
                  </Item>
                ))}
              </Command.Group>

              <Command.Group heading="Actions" className={groupClass}>
                <Item
                  value="toggle theme dark light"
                  onSelect={() => run(() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'))}
                >
                  {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />} Toggle theme
                </Item>
                <Item value="copy email" onSelect={() => run(copyEmail)}>
                  <CopyIcon /> Copy email
                </Item>
                <Item value="download resume cv" onSelect={() => run(() => external(profile.resume))}>
                  <FileIcon /> Open resume
                </Item>
              </Command.Group>

              <Command.Group heading="Links" className={groupClass}>
                <Item value="github" onSelect={() => run(() => external(github.href))}>
                  <GitHubIcon /> GitHub <ArrowUpRightIcon className="ml-auto" width={14} height={14} />
                </Item>
                <Item value="linkedin" onSelect={() => run(() => external(linkedin.href))}>
                  <LinkedInIcon /> LinkedIn <ArrowUpRightIcon className="ml-auto" width={14} height={14} />
                </Item>
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

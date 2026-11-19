'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useActionState, useEffect, useRef, useState } from 'react'
import { sendContact } from '@/app/actions/contact'
import type { ContactState } from '@/lib/contact-schema'
import { profile, socials } from '@/content'
import { cn } from '@/lib/utils'
import { SectionHeading } from '../section-heading'
import { Reveal } from '../motion/reveal'
import { Magnetic } from '../motion/magnetic'
import { copyEmail } from '@/lib/clipboard'
import { ArrowUpRightIcon, CheckIcon, CopyIcon, GitHubIcon, LinkedInIcon, MailIcon } from '../icons'

const initial: ContactState = { status: 'idle' }
const socialIcon = { GitHub: GitHubIcon, LinkedIn: LinkedInIcon, Email: MailIcon } as const

function Field({
  id,
  label,
  error,
  textarea,
  ...props
}: {
  id: 'name' | 'email' | 'message'
  label: string
  error?: string
  textarea?: boolean
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const cls = cn(
    'peer w-full rounded-xl border bg-bg/60 px-4 pb-2.5 pt-6 text-fg outline-none transition-colors placeholder:text-transparent focus:border-accent focus-visible:outline-none',
    error ? 'border-red-500/70' : 'border-line hover:border-fg/20',
  )
  const errId = `${id}-error`
  return (
    <div>
      <div className="relative">
        {textarea ? (
          <textarea id={id} name={id} rows={5} placeholder={label} aria-invalid={!!error} aria-describedby={error ? errId : undefined} className={cn(cls, 'resize-y')} {...props} />
        ) : (
          <input id={id} name={id} placeholder={label} aria-invalid={!!error} aria-describedby={error ? errId : undefined} className={cls} {...props} />
        )}
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors peer-focus:text-accent"
        >
          {label}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={errId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Contact() {
  const [state, action, pending] = useActionState(sendContact, initial)
  const [startedAt, setStartedAt] = useState(0)
  const [copied, setCopied] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => setStartedAt(Date.now()), [])
  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
      setStartedAt(Date.now())
    }
  }, [state])

  const onCopy = async () => {
    await copyEmail()
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="section">
      <SectionHeading section="contact" />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal className="space-y-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Email</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <a href={`mailto:${profile.email}`} className="link-underline break-all text-lg text-fg sm:text-xl">
                {profile.email}
              </a>
              <button
                type="button"
                onClick={onCopy}
                className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-fg"
                aria-label="Copy email address"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={copied ? 'y' : 'n'} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    {copied ? <CheckIcon className="text-accent" /> : <CopyIcon />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Elsewhere</p>
            <ul className="mt-3 space-y-1">
              {socials
                .filter((s) => s.label !== 'Email')
                .map((s) => {
                  const Icon = socialIcon[s.label]
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group -mx-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-fg transition-colors hover:bg-elevated"
                      >
                        <Icon className="text-muted group-hover:text-fg" />
                        {s.label}
                        <span className="text-muted">/{s.handle}</span>
                        <ArrowUpRightIcon width={14} height={14} className="ml-auto text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    </li>
                  )
                })}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Based in</p>
            <p className="mt-2 text-fg">{profile.location}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form ref={formRef} action={action} noValidate className="card relative space-y-4 p-5 sm:p-8" aria-describedby="form-status">
            {/* Spam protection: honeypot (hidden from humans & assistive tech) + fill-time check */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <input type="hidden" name="startedAt" value={startedAt} />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="name"
                label="Name"
                autoComplete="name"
                required
                maxLength={80}
                defaultValue={state.values?.name}
                key={`name-${state.values?.name ?? ''}`}
                error={state.fieldErrors?.name}
              />
              <Field
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                defaultValue={state.values?.email}
                key={`email-${state.values?.email ?? ''}`}
                error={state.fieldErrors?.email}
              />
            </div>
            <Field
              id="message"
              label="Message"
              textarea
              required
              maxLength={2000}
              defaultValue={state.values?.message}
              key={`message-${state.values?.message ?? ''}`}
              error={state.fieldErrors?.message}
            />

            <div className="flex flex-col-reverse items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div id="form-status" role="status" aria-live="polite" className="min-h-[1.5rem] text-sm">
                <AnimatePresence mode="wait">
                  {state.status !== 'idle' && !pending && (
                    <motion.p
                      key={state.message}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn('flex items-center gap-2', state.status === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}
                    >
                      {state.status === 'success' && <CheckIcon width={16} height={16} />}
                      {state.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <Magnetic>
                <button
                  type="submit"
                  disabled={pending}
                  className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-[transform,opacity] active:scale-[0.97] disabled:opacity-70"
                >
                  {pending ? (
                    <>
                      <motion.span
                        className="h-3.5 w-3.5 rounded-full border-2 border-bg/30 border-t-bg"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message <ArrowUpRightIcon width={16} height={16} />
                    </>
                  )}
                </button>
              </Magnetic>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

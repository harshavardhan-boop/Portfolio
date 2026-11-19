'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { profile } from '@/content'
import { contactSchema, type ContactState } from '@/lib/contact-schema'
import { rateLimit } from '@/lib/rate-limit'

const MIN_FILL_MS = 2500 // humans take longer than this to fill the form

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
  }

  // 1. Spam: honeypot + minimum fill time. Pretend success so bots learn nothing.
  const honeypot = String(formData.get('company') ?? '')
  const startedAt = Number(formData.get('startedAt') ?? 0)
  if (honeypot || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: 'success', message: 'Thanks! Your message is on its way.' }
  }

  // 2. Validate
  const parsed = contactSchema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors: ContactState['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof values
      fieldErrors[key] ??= issue.message
    }
    return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors, values }
  }

  // 3. Rate limit by IP
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  const rl = await rateLimit(ip, { limit: 3, windowSec: 600 })
  if (!rl.ok) {
    const minutes = Math.ceil(rl.resetInSeconds / 60)
    return {
      status: 'error',
      message: `Too many messages. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
      values,
    }
  }

  // 4. Deliver
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set')
    return {
      status: 'error',
      message: `The contact form isn't configured yet. Please email me directly at ${profile.email}.`,
      values,
    }
  }

  const { name, email, message } = parsed.data
  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO_EMAIL || profile.email],
      replyTo: email,
      subject: `New message from ${name} via portfolio`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}<br/><strong>Email:</strong> ${escapeHtml(email)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    })
    if (error) throw new Error(error.message)
  } catch (err) {
    console.error('[contact] send failed:', err instanceof Error ? err.message : err)
    return {
      status: 'error',
      message: `Something went wrong sending your message. Please try again or email ${profile.email}.`,
      values,
    }
  }

  return { status: 'success', message: "Thanks! Your message is on its way — I'll get back to you soon." }
}

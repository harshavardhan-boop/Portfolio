import { toast } from 'sonner'
import { profile } from '@/content'

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    toast.success('Email copied to clipboard')
  } catch {
    toast.error(`Couldn't copy. Email: ${profile.email}`)
  }
}

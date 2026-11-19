import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function registerLenis(instance: Lenis | null) {
  lenis = instance
}

/** Smoothly scroll to a section id, using Lenis when active. */
export function scrollToId(id: string) {
  const target = id === 'top' ? document.body : document.getElementById(id)
  if (!target) return
  if (lenis) {
    lenis.scrollTo(id === 'top' ? 0 : target, { offset: -72 })
  } else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (id === 'top') window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }
  // Move focus for keyboard & screen reader users
  if (id !== 'top') {
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
  history.replaceState(null, '', id === 'top' ? ' ' : `#${id}`)
}

export const OPEN_PALETTE_EVENT = 'open-command-palette'
export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))
}

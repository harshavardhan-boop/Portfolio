'use client'

import { useEffect, useState, type ComponentType } from 'react'
import { OPEN_PALETTE_EVENT } from '@/lib/scroll'

type Palette = ComponentType<{ initialOpen?: boolean }>

/**
 * Keeps cmdk + the palette out of the initial bundle.
 * The first ⌘K / Ctrl+K (or a click on the nav hint) loads it and opens it;
 * after that the palette manages its own shortcuts.
 */
export function CommandPaletteLoader() {
  const [Palette, setPalette] = useState<Palette | null>(null)

  useEffect(() => {
    if (Palette) return
    const load = () => import('./command-palette').then((m) => setPalette(() => m.CommandPalette))
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        load()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_PALETTE_EVENT, load)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_PALETTE_EVENT, load)
    }
  }, [Palette])

  return Palette ? <Palette initialOpen /> : null
}

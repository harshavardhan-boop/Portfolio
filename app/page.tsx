import { Nav } from '@/components/nav'
import { CommandPaletteLoader } from '@/components/command-palette-loader'
import { ScrollProgress } from '@/components/motion/scroll-progress'
import { Cursor } from '@/components/motion/cursor'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Experience } from '@/components/sections/experience'
import { Projects } from '@/components/sections/projects'
import { Skills } from '@/components/sections/skills'
import { GitHub } from '@/components/sections/github'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/footer'

// Re-generate the page (and GitHub data) at most once an hour.
export const revalidate = 3600

export default function Page() {
  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Nav />
      <CommandPaletteLoader />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <GitHub />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

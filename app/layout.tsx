import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Instrument_Serif } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { copy, education, experience, profile, socials } from '@/content'

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const description = profile.summary

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.shortName}`,
  },
  description,
  applicationName: `${profile.shortName} — Portfolio`,
  authors: [{ name: profile.name, url: profile.url }],
  creator: profile.name,
  keywords: [...copy.seo.keywords, profile.name],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: profile.name,
    title: `${profile.name} — ${profile.title}`,
    description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.title}`,
    description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0B' },
    { media: '(prefers-color-scheme: light)', color: '#FAFAF7' },
  ],
  colorScheme: 'dark light',
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.title,
  url: profile.url,
  email: `mailto:${profile.email}`,
  image: `${profile.url}${profile.photo}`,
  address: { '@type': 'PostalAddress', addressLocality: profile.location.split(',')[0], addressCountry: 'IN' },
  sameAs: socials.filter((s) => s.label !== 'Email').map((s) => s.href),
  alumniOf: { '@type': 'CollegeOrUniversity', name: education.school },
  worksFor: { '@type': 'Organization', name: experience[0]?.company },
  knowsAbout: copy.seo.knowsAbout,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${GeistSans.variable} ${GeistMono.variable} ${display.variable}`}
    >
      <head>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Harshavardhan Reddy - Full Stack Developer',
  description: 'Passionate Full Stack Developer specializing in MERN stack with modern UI/UX design',
  keywords: 'Full Stack Developer, React, Node.js, MongoDB, Next.js, JavaScript, TypeScript',
  authors: [{ name: 'Chamala Harshavardhan Reddy' }],
  openGraph: {
    title: 'Harshavardhan Reddy - Full Stack Developer',
    description: 'Passionate Full Stack Developer specializing in MERN stack',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}

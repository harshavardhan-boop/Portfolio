import { ImageResponse } from 'next/og'
import { copy, profile } from '@/content'

const [firstName, ...restOfName] = profile.name.split(' ')

export const alt = `${profile.name} — ${profile.title}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#0A0A0B',
          backgroundImage:
            'radial-gradient(800px 400px at 15% 0%, rgba(124,156,255,0.28), transparent), radial-gradient(600px 400px at 100% 100%, rgba(167,139,250,0.2), transparent)',
          color: '#EDEDEF',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 24, color: '#7C9CFF', letterSpacing: 4 }}>
          <div style={{ width: 48, height: 2, background: '#7C9CFF' }} />
          {`${profile.title.toUpperCase()} · ${profile.location.toUpperCase()}`}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{firstName}</div>
          <div style={{ fontSize: 92, fontStyle: 'italic', color: '#8B8B93', letterSpacing: -2, lineHeight: 1.1 }}>
            {restOfName.join(' ')}
          </div>
        </div>
        <div style={{ fontSize: 28, color: '#8B8B93' }}>
          {copy.shareTagline}
        </div>
      </div>
    ),
    size,
  )
}

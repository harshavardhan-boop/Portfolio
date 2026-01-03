'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  left: number
  top: number
  duration: number
  delay: number
}

const ParticleBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Generate deterministic particles only on client side
    const generateParticles = (): Particle[] => {
      const particleArray: Particle[] = []
      
      // Use a seed-based approach for consistent but varied positions
      for (let i = 0; i < 50; i++) {
        const seed = i * 137.508 // Golden angle for better distribution
        particleArray.push({
          id: i,
          x: (Math.sin(seed) * 50),
          y: (Math.cos(seed) * 50),
          left: ((seed * 7) % 100),
          top: ((seed * 11) % 100),
          duration: 2 + ((seed * 3) % 3),
          delay: (seed * 2) % 2
        })
      }
      
      return particleArray
    }

    setParticles(generateParticles())
    setIsMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return <div className="absolute inset-0" />
  }

  return (
    <div className="absolute inset-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          animate={{
            x: [0, particle.x],
            y: [0, particle.y],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
        />
      ))}
    </div>
  )
}

export default ParticleBackground
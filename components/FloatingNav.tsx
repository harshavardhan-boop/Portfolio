'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  CodeBracketIcon,
  WrenchScrewdriverIcon,
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { icon: HomeIcon, label: 'Home', href: '#hero' },
    { icon: UserIcon, label: 'About', href: '#about' },
    { icon: BriefcaseIcon, label: 'Experience', href: '#experience' },
    { icon: CodeBracketIcon, label: 'Projects', href: '#projects' },
    { icon: WrenchScrewdriverIcon, label: 'Skills', href: '#skills' },
    { icon: EnvelopeIcon, label: 'Contact', href: '#contact' },
  ]

  const scrollToSection = (href: string) => {
    try {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (error) {
      console.warn('Error scrolling to section:', error)
    }
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
          >
            <div className="flex flex-col space-y-3">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors group"
                >
                  <item.icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6 text-white" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-white" />
          )}
        </motion.div>
      </motion.button>
    </div>
  )
}

export default FloatingNav
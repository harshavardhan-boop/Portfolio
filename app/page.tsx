'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  ChevronDownIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import FloatingNav from '@/components/FloatingNav'
import ScrollProgress from '@/components/ScrollProgress'
import ParticleBackground from '@/components/ParticleBackground'
import ClientOnly from '@/components/ClientOnly'

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('hero')
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    const handleScroll = () => {
      try {
        const sections = ['hero', 'about', 'experience', 'projects', 'skills', 'contact']
        const scrollPosition = window.scrollY + 100

        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const { offsetTop, offsetHeight } = element
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section)
              break
            }
          }
        }
      } catch (error) {
        console.warn('Error in scroll handler:', error)
      }
    }

    // Throttle scroll events for better performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  }

  return (
    <div className="min-h-screen">
      <ClientOnly>
        <ScrollProgress />
        <FloatingNav />
      </ClientOnly>
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Harshavardhan
            </motion.div>
            <div className="hidden md:flex space-x-8">
              {['About', 'Experience', 'Projects', 'Skills', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.toLowerCase()
                      ? 'text-blue-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item}
                </motion.a>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="md:hidden text-white"
              onClick={() => setActiveSection('menu')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"
        />
        
        {/* Animated background particles */}
        <ParticleBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            
            {/* Left Side - Text Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-gray-300 text-4xl lg:text-5xl font-normal block mb-2">
                    Hello! I'm
                  </span>
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Harshavardhan
                  </span>
                  <br />
                  <span className="text-white">Reddy</span>
                </h1>
              </motion.div>

              <motion.div variants={itemVariants}>
                <p className="text-xl lg:text-2xl text-gray-400 max-w-lg">
                  Full Stack Developer specializing in MERN stack & modern web technologies
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold shadow-lg inline-flex items-center justify-center"
                >
                  Get Resume
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </motion.a>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-white/20 rounded-full text-white font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Video
                </motion.button>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center space-x-4 pt-4">
                <span className="text-gray-400 text-sm">Connect with me:</span>
                <div className="flex space-x-3">
                  <motion.a
                    href="mailto:chamalaharshavardhan55@gmail.com"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-blue-400/20 transition-all"
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com/in/chamalaharsha"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-blue-400/20 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </motion.a>
                  <motion.a
                    href="https://github.com/harshavardhan-c"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-blue-400/20 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </motion.a>
                  <motion.a
                    href="tel:+919948024552"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-blue-400 hover:bg-blue-400/20 transition-all"
                  >
                    <PhoneIcon className="w-5 h-5" />
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Main Image Container */}
                <div className="w-80 h-80 lg:w-96 lg:h-96 relative">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-1">
                    <div className="w-full h-full rounded-3xl bg-slate-900 overflow-hidden">
                      <img 
                        src="/images/Gemini_Generated_Image_axuwepaxuwepaxuw.png"
                        alt="Harshavardhan Reddy - Full Stack Developer"
                        className="w-full h-full object-cover rounded-3xl"
                        style={{ objectPosition: '50% 20%' }}
                        loading="eager"
                        onError={(e) => {
                          console.log('Image failed to load, using fallback')
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full rounded-3xl bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center"><span class="text-6xl font-bold text-white">HR</span></div>'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Floating Social Icons */}
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                  >
                    <span className="text-blue-400 font-bold">f</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                  >
                    <span className="text-blue-400 font-bold">@</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                  >
                    <span className="text-blue-400 font-bold">in</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                  >
                    <span className="text-blue-400 font-bold">gh</span>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -left-4 w-8 h-8 border-2 border-blue-400/30 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-6 -right-8 w-6 h-6 bg-purple-400/20 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDownIcon className="w-8 h-8 text-white/60" />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Professional Summary</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                A passionate Full Stack Web Developer with hands-on experience in building dynamic, 
                responsive, and scalable web applications using the MERN stack. I specialize in creating 
                interactive UIs with React.js and Next.js, designing RESTful APIs, and managing databases efficiently.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Proficient in JavaScript, TypeScript, Python, and Java, with strong problem-solving, 
                debugging, and collaboration skills. Eager to contribute as a Full Stack, Frontend, 
                or Backend Developer, delivering high-quality, user-centric and performance-driven solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <AcademicCapIcon className="w-8 h-8 text-blue-400 mr-3" />
                  <h4 className="text-xl font-semibold">Education</h4>
                </div>
                <p className="text-gray-300">Bachelor of Engineering – Computer Science</p>
                <p className="text-gray-400">Sree Venkateshwara College of Engineering, Nellore</p>
                <p className="text-blue-400 font-semibold">CGPA: 7.6 / 10 (Apr 2025)</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <StarIcon className="w-8 h-8 text-purple-400 mr-3" />
                  <h4 className="text-xl font-semibold">Certifications</h4>
                </div>
                <ul className="text-gray-300 space-y-2">
                  <li>• SQL and Relational Databases (IBM)</li>
                  <li>• Python for Data Science (IBM)</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Experience
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Full Stack Developer Intern</h3>
                    <p className="text-blue-400 font-semibold">Datavalley Inc</p>
                  </div>
                  <span className="text-gray-400 font-medium">July 2025 - Present</span>
                </div>
                
                <h4 className="text-lg font-semibold text-purple-400 mb-3">Project: Coders World</h4>
                <p className="text-gray-300 mb-4">
                  Contributed to developing CodersWorld, an integrated learning and career platform 
                  combining aptitude prep, coding labs, and opportunity discovery.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-black/20 rounded-lg p-4">
                    <h5 className="font-semibold text-white mb-2">Tech Stack</h5>
                    <div className="flex flex-wrap gap-2">
                      {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'NestJS', 'PostgreSQL'].map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <h5 className="font-semibold text-white mb-2">Key Achievements</h5>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Built responsive UI components</li>
                      <li>• Implemented JWT authentication</li>
                      <li>• Created interactive dashboards</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "K-12 Education Platform",
                description: "Full-stack learning platform with role-based access and interactive dashboards",
                tech: ["React.js", "Node.js", "MongoDB", "Express.js"],
                features: ["Student/Parent Registration", "Email Verification", "Interactive Dashboards", "MVC Architecture"]
              },
              {
                title: "Emart E-Commerce",
                description: "Grocery shopping platform with real-time cart management and admin dashboard",
                tech: ["React.js", "TypeScript", "Supabase", "Tailwind CSS"],
                features: ["OTP Authentication", "Hybrid Cart System", "Admin Dashboard", "Image Upload"]
              },
              {
                title: "Product Recommendation System",
                description: "AI-powered recommendation engine using collaborative filtering algorithms",
                tech: ["Python", "NumPy", "Pandas", "MySQL"],
                features: ["Collaborative Filtering", "Content-Based Algorithms", "Real-time Suggestions", "Model Optimization"]
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <CodeBracketIcon className="w-8 h-8 text-blue-400" />
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">{project.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">Key Features</h4>
                  <ul className="text-gray-400 text-xs space-y-1">
                    {project.features.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Technical Skills
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                category: "Frontend",
                skills: ["HTML", "CSS", "React.js", "Next.js", "Redux", "Tailwind CSS", "Bootstrap"],
                icon: "🎨"
              },
              {
                category: "Backend",
                skills: ["Node.js", "Express.js", "RESTful APIs", "JWT Auth", "Socket.io"],
                icon: "⚙️"
              },
              {
                category: "Database",
                skills: ["MongoDB", "Mongoose", "PostgreSQL", "Supabase", "SQL"],
                icon: "🗄️"
              },
              {
                category: "Tools & Others",
                skills: ["Git", "GitHub", "Vercel", "Render", "Postman", "VS Code"],
                icon: "🛠️"
              }
            ].map((skillGroup, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
              >
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{skillGroup.icon}</div>
                  <h3 className="text-xl font-bold text-white">{skillGroup.category}</h3>
                </div>
                
                <div className="space-y-3">
                  {skillGroup.skills.map((skill, i) => (
                    <motion.div
                      key={i}
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full p-3"
                    >
                      <span className="text-sm text-gray-300">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Let's Connect
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to bring your ideas to life? Let's discuss how we can work together to create something amazing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <motion.a
                href="mailto:chamalaharshavardhan55@gmail.com"
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-400/30 hover:border-blue-400/60 transition-all"
              >
                <EnvelopeIcon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                <p className="text-gray-300 text-center text-sm">chamalaharshavardhan55@gmail.com</p>
              </motion.a>

              <motion.a
                href="tel:+919948024552"
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30 hover:border-purple-400/60 transition-all"
              >
                <PhoneIcon className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
                <p className="text-gray-300 text-center text-sm">+91 9948024552</p>
              </motion.a>

              <motion.a
                href="https://linkedin.com/in/chamalaharsha"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-center p-6 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-2xl border border-pink-400/30 hover:border-pink-400/60 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">in</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">LinkedIn</h3>
                <p className="text-gray-300 text-center text-sm">Connect with me</p>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 Chamala Harshavardhan Reddy. Crafted with ❤️ and lots of ☕
          </p>
        </div>
      </footer>
    </div>
  )
}
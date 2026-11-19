import type { Project } from './types'

/**
 * Projects in display order. The first one is the large featured card.
 * Add `image: '/images/projects/name.png'` to show a screenshot instead of the generated cover.
 */
export const projects: Project[] = [
  {
    slug: 'emart',
    title: 'Emart',
    tagline: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce app with Supabase OTP sign-in, a hybrid LocalStorage + database cart, and an admin dashboard for product CRUD and pricing.',
    details: [
      'Supabase OTP authentication with PostgreSQL storage.',
      'Hybrid cart synced between LocalStorage and the database.',
      'Admin dashboard for product CRUD and pricing.',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Supabase', 'Tailwind CSS'],
    links: [
      { label: 'Live demo', href: 'https://e-cart-frontend-73013qvbq-harshavardhan-chamalas-projects.vercel.app/' },
    ],
  },
  {
    slug: 'recommendation-system',
    title: 'Personalized Product Recommendation System',
    tagline: 'Recommendation Engine',
    description:
      'A Python recommendation engine combining collaborative filtering and content-based techniques to suggest products from user preferences.',
    details: [
      'Collaborative filtering and content-based recommendations.',
      'Data extraction from MySQL with SQL queries.',
      'Data cleaning and structuring with Pandas and NumPy.',
    ],
    stack: ['Python', 'Pandas', 'NumPy', 'MySQL'],
  },
  {
    slug: 'k12-lms',
    title: 'K-12 Learning Management System',
    tagline: 'Learning Platform',
    description:
      'A learning management system with role-based authentication, email verification and dashboards on an MVC REST backend.',
    details: [
      'Role-based authentication.',
      'Email verification via SendGrid.',
      'MVC REST backend with Express and MongoDB.',
      'Interactive dashboards.',
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'SendGrid'],
  },
]

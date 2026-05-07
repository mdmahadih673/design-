import { Category, Project, Service, Testimonial, Experience } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Modern Minimal Logo',
    category: Category.LOGO,
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626785774625-ddc7c82a1e5c?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'A clean, geometric logo for a tech startup focusing on cloud solutions.',
    client: 'CloudPeak Systems',
    year: '2024',
    tools: ['Adobe Illustrator', 'Figma'],
    approach: 'Focus on scalability and recognition at small sizes.',
    colors: ['#000000', '#FFFFFF', '#3B82F6'],
    typography: ['Inter Bold', 'Inter Regular']
  },
  {
    id: '2',
    title: 'Eco-Friendly Packaging',
    category: Category.PACKAGING,
    thumbnail: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Sustainable packaging design for a localized organic coffee brand.',
    client: 'Pure Brew Coffee',
    year: '2023',
    tools: ['Adobe Illustrator', 'Photoshop'],
    approach: 'Used earth tones and recycled paper textures to emphasize sustainability.',
    colors: ['#3D2B1F', '#F5EFE6', '#2D5A27'],
    typography: ['DM Sans', 'Playfair Display']
  },
  {
    id: '3',
    title: 'Luxury Brand Identity',
    category: Category.BRANDING,
    thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Full branding suite for a high-end personal concierge service.',
    client: 'Elite Living',
    year: '2023',
    tools: ['Illustrator', 'Figma', 'InDesign'],
    approach: 'Minimalist approach with gold accents to convey luxury and exclusivity.',
    colors: ['#1A1A1B', '#D4AF37', '#F5F5F5'],
    typography: ['Cormorant Garamond', 'Montserrat']
  },
  {
    id: '4',
    title: 'Neon Festival Poster',
    category: Category.POSTER,
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Vibrant neon poster for an electronic music festival in London.',
    client: 'Lumina Beats',
    year: '2024',
    tools: ['Adobe Photoshop', 'After Effects'],
    approach: 'High contrast visuals and custom typography for a dynamic feel.',
    colors: ['#FF00FF', '#00FFFF', '#000000'],
    typography: ['Space Grotesk', 'Outfit']
  }
];

export const SERVICES: Service[] = [
  {
    id: 'logo',
    title: 'Logo Design',
    description: 'Unique, memorable logos that represent your brand perfectly',
    icon: 'Layout',
    deliverables: ['Custom logo concepts', 'Multiple revisions', 'Final files (AI, PNG, SVG)', 'Brand mark variants'],
    startingPrice: '$199'
  },
  {
    id: 'branding',
    title: 'Brand Identity',
    description: 'Complete branding packages including colors, typography, and guidelines',
    icon: 'Palette',
    deliverables: ['Logo design', 'Color palette', 'Typography selection', 'Full Brand Guidelines'],
    startingPrice: '$499'
  },
  {
    id: 'social',
    title: 'Social Media Design',
    description: 'Eye-catching posts, stories, and banners for all platforms',
    icon: 'Share2',
    deliverables: ['Post templates', 'Story templates', 'Cover photos', 'Content calendar layout'],
    startingPrice: '$249'
  },
  {
    id: 'packaging',
    title: 'Packaging Design',
    description: 'Product packaging that stands out on the shelf',
    icon: 'Package',
    deliverables: ['Product labels', 'Box/bag designs', 'Mockup presentations'],
    startingPrice: '$349'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechFlow',
    content: 'The branding work provided exceeded our expectations. Our new identity is modern, clean, and perfectly captures our vision.',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Founder',
    company: 'GreenEats',
    content: 'Incredible attention to detail. The packaging design significantly boosted our shelf presence and sales.',
    avatar: 'https://i.pravatar.cc/150?u=michael',
    rating: 5
  }
];

export const EXPERIENCE: Experience[] = [
  {
    year: '2023 - Present',
    role: 'Freelance Graphic Designer',
    company: 'Self-employed',
    description: 'Working with international clients to build strong brand identities and visual stories.'
  },
  {
    year: '2022 - 2023',
    role: 'Junior Designer',
    company: 'Creative Studio X',
    description: 'Assisted in large scale branding projects and social media campaigns for retail brands.'
  }
];

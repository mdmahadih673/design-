export enum Category {
  ALL = 'All',
  LOGO = 'Logo Design',
  BRANDING = 'Brand Identity',
  SOCIAL = 'Social Media',
  POSTER = 'Poster & Banner',
  PACKAGING = 'Packaging',
  PRINT = 'Print Design',
}

export interface Project {
  id: string;
  title: string;
  category: string;
  categoryName?: string;
  categoryId?: string;
  thumbnail: string;
  images: string[];
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  client?: string;
  year?: string;
  date?: string;
  tools: string[];
  approach?: string;
  colors: string[];
  typography: string[];
  status?: 'published' | 'draft';
  isFeatured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string;
  createdAt: string;
  status: 'published' | 'draft';
  isFeatured: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  deliverables: string[];
  startingPrice?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface Experience {
  year: string;
  role: string;
  company: string;
  description: string;
}

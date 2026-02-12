// Magazine/Publication Mock Data
export interface Magazine {
  id: string
  workspaceId: string
  title: string
  description?: string
  coverImage?: string
  status: 'draft' | 'published' | 'archived'
  pages: MagazinePage[]
  settings: {
    width: number
    height: number
    theme: 'light' | 'dark'
    flipSound: boolean
    allowDownload: boolean
    showSocial: boolean
  }
  createdAt: string
  updatedAt: string
  views: number
  shares: number
}

export interface MagazinePage {
  id: string
  pageNumber: number
  type: 'cover' | 'content' | 'back'
  image?: string
  content?: string
  layout: 'single' | 'spread'
}

// Generate 20 demo magazines
export const mockMagazines: Magazine[] = Array.from({ length: 20 }, (_, i) => ({
  id: `mag-${i + 1}`,
  workspaceId: 'demo',
  title: [
    'Spring Collection 2024',
    'Product Catalog',
    'Company Annual Report',
    'Travel Guide: Europe',
    'Recipe Book',
    'Portfolio Showcase',
    'Event Program',
    'Real Estate Brochure',
    'Fashion Lookbook',
    'Photography Magazine',
    'Tech Product Guide',
    'Wedding Album',
    'Restaurant Menu',
    'Fitness Guide',
    'Interior Design',
    'Car Catalog',
    'Wine Collection',
    'Art Gallery',
    'Music Festival Program',
    'Corporate Presentation',
  ][i],
  description: `A professional digital magazine with interactive features`,
  coverImage: `https://images.unsplash.com/photo-${1500000000000 + i}?w=800&h=1200`,
  status: ['published', 'draft', 'published'][i % 3] as 'draft' | 'published' | 'archived',
  pages: Array.from({ length: Math.floor(Math.random() * 20) + 10 }, (_, pageIdx) => ({
    id: `page-${pageIdx + 1}`,
    pageNumber: pageIdx + 1,
    type: pageIdx === 0 ? 'cover' : 'content' as 'cover' | 'content' | 'back',
    image: `https://images.unsplash.com/photo-${1500000000000 + i + pageIdx}?w=800&h=1200`,
    layout: 'single' as 'single' | 'spread',
  })),
  settings: {
    width: 800,
    height: 1200,
    theme: 'light',
    flipSound: true,
    allowDownload: true,
    showSocial: true,
  },
  createdAt: new Date(2024, 0, i + 1).toISOString(),
  updatedAt: new Date(2024, 1, i + 1).toISOString(),
  views: Math.floor(Math.random() * 5000),
  shares: Math.floor(Math.random() * 500),
}))

export function getMagazineById(id: string) {
  return mockMagazines.find(m => m.id === id)
}

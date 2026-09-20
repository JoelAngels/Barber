export const BRAND_CONFIG = {
  // Software Platform Branding (Easily replaceable by replacing this value)
  name: 'Trimly',
  tagline: 'Run your barbershop. Keep every chair busy.',
  subtagline: 'The modern, mobile-first management platform designed specifically for barbershops and premium grooming lounges.',
  logoAccentColor: '#f59e0b', // Amber 500
  heroBadge: '✨ Designed for Modern Barbershops & Lounges',
  contactEmail: 'hello@trimlyapp.com',
  demoPhone: '+1 (800) 555-TRIM',
  
  // Default Sample Shop
  sampleShop: {
    name: "The Gentlemen's Cut",
    tagline: 'Premium Haircuts & Artisanal Beard Grooming',
    address: '142 Main Street, Suite 101, Downtown',
    phone: '+1 (555) 019-2834',
    rating: 4.9,
    reviewCount: 384,
    openingHours: 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: 10:00 AM - 5:00 PM',
  },

  // Locations
  locations: [
    {
      id: 'loc-1',
      name: "The Gentlemen's Cut - Downtown (Main)",
      address: '142 Main Street, Suite 101',
      phone: '+1 (555) 019-2834',
      rating: 4.9,
      isMainBranch: true,
    },
    {
      id: 'loc-2',
      name: "The Gentlemen's Cut - Uptown Flagship",
      address: '880 North Boulevard, Level 2',
      phone: '+1 (555) 019-9944',
      rating: 4.8,
      isMainBranch: false,
    }
  ]
};

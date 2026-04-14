export const heroSlides = [
  ['Temple Silk Drape', 'Lotus Gold Finish', 'Evening Banarasi'],
  ['Organza Bloom Edit', 'Classic Cotton Grace', 'Maroon Heritage Loom'],
  ['Festive Salwar Story', 'Signature Chudi Set', 'Soft Linen Luxe']
];

export const categories = [
  { title: 'Sarees', description: 'Festive drapes in silk, organza, and Banarasi textures.' },
  { title: 'Chudi Materials', description: 'Curated materials designed for graceful tailoring.' },
  { title: 'Salwars', description: 'Polished silhouettes for ceremony and everyday elegance.' }
];

export const fabrics = ['Silk', 'Cotton', 'Organza', 'Chiffon', 'Banarasi', 'Linen'];

export const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/collections' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' }
];

export const priceRanges = [
  { label: 'Rs. 1,000 - 1,999', min: 1000, max: 1999 },
  { label: 'Rs. 2,000 - 2,499', min: 2000, max: 2499 },
  { label: 'Rs. 2,500 - 3,000', min: 2500, max: 3000 }
];

export const festivalMessages = [
  'Festival Edit Live',
  'Enjoy complimentary shipping above Rs. 8,000',
  'Private styling by appointment'
];

export const contactDetails = {
  address: 'G1, 6th St, Kuppakonam Pudur, Coimbatore, Tamil Nadu 641038',
  phone: '093631 26467',
  email: 'hello@raesboutique.com',
  hours: 'Closed · Opens 10 am Sun'
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value || 0);

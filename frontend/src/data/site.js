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
  { label: 'Under Rs. 5,000', min: 0, max: 5000 },
  { label: 'Rs. 5,000 - 10,000', min: 5000, max: 10000 },
  { label: 'Above Rs. 10,000', min: 10000, max: 100000 }
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

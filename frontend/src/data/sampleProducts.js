export const sampleProducts = [
  {
    _id: 'sample-saree-temple-gold',
    name: 'Temple Gold Kanchipuram Saree',
    price: 14999,
    description: 'A regal silk saree with zari temple borders and a structured drape for festive evenings.',
    fabric: 'Silk',
    category: 'Sarees',
    color: 'Maroon',
    image: '',
    badge: 'New Arrival',
    featured: true,
    stock: 12,
    createdAt: '2026-03-19T20:42:28.000Z'
  },
  {
    _id: 'sample-saree-champagne-organza',
    name: 'Champagne Organza Bloom Saree',
    price: 9899,
    description: 'Lightweight organza with subtle sheen and floral-inspired woven detailing.',
    fabric: 'Organza',
    category: 'Sarees',
    color: 'Gold',
    image: '',
    badge: 'Limited Edit',
    featured: true,
    stock: 8,
    createdAt: '2026-03-19T20:44:40.000Z'
  },
  {
    _id: 'sample-saree-ivory-banarasi',
    name: 'Ivory Banarasi Weave Saree',
    price: 13250,
    description: 'Soft Banarasi drape finished with ornate pallu motifs and elegant contrast edging.',
    fabric: 'Banarasi',
    category: 'Sarees',
    color: 'White',
    image: '',
    badge: 'Signature',
    featured: true,
    stock: 6,
    createdAt: '2026-03-19T20:45:39.000Z'
  },
  {
    _id: 'sample-chudi-ruby-silk',
    name: 'Ruby Silk Chudi Material Set',
    price: 4590,
    description: 'Luxury chudi material with a silk-blend top, premium lining, and embellished dupatta.',
    fabric: 'Silk',
    category: 'Chudi Materials',
    color: 'Maroon',
    image: '',
    badge: 'Popular',
    featured: false,
    stock: 16,
    createdAt: '2026-03-19T21:14:37.000Z'
  },
  {
    _id: 'sample-chudi-soft-linen',
    name: 'Soft Linen Chudi Material',
    price: 3250,
    description: 'Breathable linen set designed for understated elegance and all-day comfort.',
    fabric: 'Linen',
    category: 'Chudi Materials',
    color: 'Beige',
    image: '',
    badge: 'Classic',
    featured: false,
    stock: 21,
    createdAt: '2026-03-19T21:14:46.000Z'
  },
  {
    _id: 'sample-salwar-pearl-chiffon',
    name: 'Pearl Chiffon Salwar Edit',
    price: 5499,
    description: 'Flowing chiffon salwar ensemble with hand-finished neckline and airy dupatta.',
    fabric: 'Chiffon',
    category: 'Salwars',
    color: 'White',
    image: '',
    badge: 'Bestseller',
    featured: true,
    stock: 14,
    createdAt: '2026-03-19T21:14:58.000Z'
  },
  {
    _id: 'sample-salwar-lotus-cotton',
    name: 'Lotus Cotton Salwar Set',
    price: 3999,
    description: 'A polished cotton salwar with tailored fit, delicate trims, and a refined silhouette.',
    fabric: 'Cotton',
    category: 'Salwars',
    color: 'Pink',
    image: '',
    badge: 'Everyday Luxe',
    featured: false,
    stock: 18,
    createdAt: '2026-03-19T21:15:06.000Z'
  },
  {
    _id: 'sample-salwar-royal-organza',
    name: 'Royal Organza Salwar Set',
    price: 6190,
    description: 'A festive organza set balancing richness and softness with a contemporary cut.',
    fabric: 'Organza',
    category: 'Salwars',
    color: 'Gold',
    image: '',
    badge: 'Festive',
    featured: true,
    stock: 10,
    createdAt: '2026-03-19T21:15:30.000Z'
  },
  {
    _id: 'sample-chudi-heritage-banarasi',
    name: 'Heritage Banarasi Chudi Material',
    price: 6990,
    description: 'Structured Banarasi suit material with detailed weaving and celebratory finish.',
    fabric: 'Banarasi',
    category: 'Chudi Materials',
    color: 'Red',
    image: '',
    badge: 'Celebration',
    featured: false,
    stock: 9,
    createdAt: '2026-03-19T21:15:40.000Z'
  }
];

export const applyProductFilters = (products, filters) => {
  const searchText = (filters.search || '').trim().toLowerCase();
  const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;

  const filtered = products.filter((product) => {
    if (filters.color && product.color !== filters.color) {
      return false;
    }

    if (filters.fabric && product.fabric !== filters.fabric) {
      return false;
    }

    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (minPrice !== null && product.price < minPrice) {
      return false;
    }

    if (maxPrice !== null && product.price > maxPrice) {
      return false;
    }

    if (searchText && !product.name.toLowerCase().includes(searchText)) {
      return false;
    }

    return true;
  });

  filtered.sort((first, second) => {
    const firstTime = new Date(first.createdAt || 0).getTime();
    const secondTime = new Date(second.createdAt || 0).getTime();
    return filters.sort === 'oldest' ? firstTime - secondTime : secondTime - firstTime;
  });

  return filtered;
};

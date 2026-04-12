import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client';
import contactDesk from '../assets/contact/contact-desk.png';
import contactDisplay from '../assets/contact/contact-display.png';
import heroLotus from '../assets/raes-hero-lotus-cutout.png';
import categoryLookBlack from '../assets/hero/new-set/hero-look-black.png';
import categorySareeCoral from '../assets/hero/new-set/hero-saree-coral.png';
import categorySalwarGreen from '../assets/hero/new-set/hero-salwar-green.png';
import heroImageOne from '../assets/hero/Screenshot 2026-03-19 204228.png';
import heroImageTwo from '../assets/hero/Screenshot 2026-03-19 204626.png';
import heroImageThree from '../assets/hero/Screenshot 2026-03-19 211625.png';
import heroImageFour from '../assets/hero/Screenshot 2026-03-19 213517.png';
import heroImageFive from '../assets/hero/Screenshot 2026-03-19 213755.png';
import heroImageSix from '../assets/hero/Screenshot 2026-03-19 213908.png';
import HeroCarousel from '../components/shared/HeroCarousel';
import SectionHeading from '../components/shared/SectionHeading';
import { materialImages } from '../data/productMedia';
import { sampleProducts } from '../data/sampleProducts';
import { categories } from '../data/site';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();
  const categoryImages = {
    Sarees: {
      src: categorySareeCoral,
      alt: 'Coral saree detail'
    },
    'Chudi Materials': {
      src: categorySalwarGreen,
      alt: 'Green chudi material set'
    },
    Salwars: {
      src: categoryLookBlack,
      alt: 'Black salwar look'
    }
  };
  const heroItems = [
    { id: 'hero-2', src: heroImageTwo, alt: 'Raes Boutique hero image 2' },
    { id: 'hero-6', src: heroImageSix, alt: 'Raes Boutique hero image 6' },
    { id: 'hero-4', src: heroImageFour, alt: 'Raes Boutique hero image 4' },
    { id: 'hero-5', src: heroImageFive, alt: 'Raes Boutique hero image 5' },
    { id: 'hero-3', src: heroImageThree, alt: 'Raes Boutique hero image 3' },
    { id: 'hero-1', src: heroImageOne, alt: 'Raes Boutique hero image 1' }
  ];

  useEffect(() => {
    apiRequest('/products/featured')
      .then(setFeaturedProducts)
      .catch(() => setFeaturedProducts(sampleProducts.filter((product) => product.featured).slice(0, 6)));
  }, []);

  const featuredGalleryItems = materialImages.slice(0, 12).map((src, index) => {
    const product = featuredProducts[index % featuredProducts.length];

    return {
      id: `${product?._id || 'featured'}-${index}`,
      src,
      product
    };
  }).filter((item) => item.product);

  return (
    <div className="pb-10">
      <section className="relative min-h-[48vh] overflow-hidden bg-gradient-to-br from-[#6B0F1A] via-[#5c0d18] to-[#2A060B] md:min-h-[56vh] lg:min-h-[62vh]">
        <HeroCarousel lotusSrc={heroLotus} items={heroItems} className="min-h-[48vh] md:min-h-[56vh] lg:min-h-[62vh]" />
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-4 md:px-8">
        <div className="glass-panel relative overflow-hidden px-6 py-10 md:px-10">
          <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 md:block">
            <div className="relative h-44 w-[18rem]">
              <div className="absolute right-0 top-1/2 z-20 h-44 w-44 -translate-y-1/2 overflow-hidden rounded-full border border-boutique-gold/25 shadow-[0_18px_42px_rgba(107,15,26,0.12)]">
                <img
                  src={contactDesk}
                  alt="Raes Boutique interior"
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              <div
                className="absolute left-[1.45rem] top-1/2 z-10 h-36 w-36 -translate-y-1/2 overflow-hidden rounded-full border border-boutique-gold/20 shadow-[0_14px_34px_rgba(107,15,26,0.1)]"
                style={{
                  WebkitMaskImage: 'radial-gradient(circle at 86% 50%, transparent 31%, black 32%)',
                  maskImage: 'radial-gradient(circle at 86% 50%, transparent 31%, black 32%)'
                }}
              >
                <img
                  src={contactDisplay}
                  alt="Raes Boutique display wall"
                  className="absolute inset-y-0 left-[-12%] h-full w-[136%] max-w-none object-cover object-left"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <SectionHeading
            eyebrow="Discover"
            title="A boutique story told through fine drape and detail."
            description="Elegant silhouettes designed with quiet luxury, celebratory warmth, and boutique craftsmanship."
          />
          <Link to="/collections" className="gold-button mt-6 inline-flex">
            Discover Collection
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow="Categories"
          title="Signature wardrobe sections"
          description="Minimal, elevated, and ready for every festive moment."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category.title}
              type="button"
              onClick={() => navigate(`/collections?category=${encodeURIComponent(category.title)}`)}
              className="group relative overflow-hidden rounded-[2rem] bg-white px-6 py-8 text-left shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-luxe active:-translate-y-1 active:shadow-luxe"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-boutique-maroon to-[#2f050d] opacity-0 transition duration-500 group-hover:opacity-100 group-active:opacity-100" />
              <div className="absolute inset-y-6 right-0 z-10 hidden w-[6.75rem] items-center justify-end md:flex">
                <div className="relative h-full w-full max-h-[13.5rem] overflow-hidden rounded-l-full border border-boutique-gold/35 bg-[#f7efe6] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.08)] transition duration-500 group-hover:border-boutique-gold/55 group-hover:shadow-[0_18px_40px_rgba(107,15,26,0.18)]">
                  <img
                    src={categoryImages[category.title]?.src}
                    alt={categoryImages[category.title]?.alt || category.title}
                    className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/8 via-transparent to-transparent group-hover:from-boutique-maroon/15" />
                </div>
              </div>
              <div className="relative z-20 max-w-[13rem] md:max-w-[12rem]">
                <img
                  src={heroLotus}
                  alt=""
                  className="h-8 w-auto object-contain opacity-95 transition duration-500 group-hover:scale-105 group-active:scale-105"
                  loading="lazy"
                />
                <h3 className="mt-5 font-display text-4xl text-boutique-maroon transition group-hover:text-white group-active:text-white">
                  {category.title}
                </h3>
                <p className="mt-4 max-w-[14rem] text-sm leading-7 text-boutique-ink/65 transition group-hover:text-white/80 group-active:text-white/80">
                  {category.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-[#f7f0eb] px-6 py-10 shadow-[0_24px_70px_rgba(107,15,26,0.12)] md:px-10 md:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(107,15,26,0.08),transparent_32%)]" />
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Featured Products"
              title="Curated boutique highlights"
              description="A focused edit of elevated drapes and tailoring."
            />
            <Link to="/collections" className="text-sm font-medium text-boutique-maroon transition hover:text-boutique-gold">
              View All Collections
            </Link>
          </div>
          <div className="relative z-10 mt-8 flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-boutique-gold/25 md:gap-5">
            {featuredGalleryItems.map(({ id, src, product }) => (
              <Link
                key={id}
                to={`/collections/${product._id}`}
                className="group block w-[10.25rem] shrink-0 overflow-hidden rounded-[1.2rem] bg-white p-2.5 shadow-[0_14px_34px_rgba(107,15,26,0.07)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(107,15,26,0.11)] md:w-[11.5rem]"
              >
                <div className="aspect-[4/4.55] w-full overflow-hidden rounded-[0.95rem] bg-[#f8f1eb]">
                  <img
                    src={src}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="px-1 pt-2.5">
                  <h3 className="truncate font-display text-[0.9rem] leading-tight text-boutique-maroon md:text-[0.98rem]">
                    {product.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
import { getProductImage } from '../data/productMedia';
import { sampleProducts } from '../data/sampleProducts';
import { categories } from '../data/site';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState(sampleProducts.filter((product) => product.featured).slice(0, 6));
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const navigate = useNavigate();
  const featuredCarouselRef = useRef(null);
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
      .then((data) =>
        setFeaturedProducts(
          Array.isArray(data) && data.length
            ? data
            : sampleProducts.filter((product) => product.featured).slice(0, 6)
        )
      )
      .catch(() => setFeaturedProducts(sampleProducts.filter((product) => product.featured).slice(0, 6)));
  }, []);

  const featuredGalleryItems = featuredProducts
    .slice(0, 8)
    .map((product, index) => ({
      id: `${product?._id || 'featured'}-${index}`,
      src: getProductImage(product),
      product
    }))
    .filter((item) => item.product && item.src);

  useEffect(() => {
    if (!featuredGalleryItems.length) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % featuredGalleryItems.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [featuredGalleryItems.length]);

  useEffect(() => {
    if (!featuredCarouselRef.current || !featuredGalleryItems.length) {
      return;
    }

    const firstCard = featuredCarouselRef.current.querySelector('[data-featured-card="true"]');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 180;

    featuredCarouselRef.current.scrollTo({
      left: featuredIndex * (cardWidth + 10),
      behavior: 'smooth'
    });
  }, [featuredIndex, featuredGalleryItems.length]);

  const scrollFeatured = (direction) => {
    if (!featuredCarouselRef.current || !featuredGalleryItems.length) {
      return;
    }

    setFeaturedIndex((current) => {
      const nextIndex = current + direction;

      if (nextIndex < 0) {
        return featuredGalleryItems.length - 1;
      }

      if (nextIndex >= featuredGalleryItems.length) {
        return 0;
      }

      return nextIndex;
    });
  };

  return (
    <div className="pb-10">
      <section className="relative min-h-[48vh] overflow-hidden bg-gradient-to-br from-[#6B0F1A] via-[#5c0d18] to-[#2A060B] md:min-h-[56vh] lg:min-h-[62vh]">
        <HeroCarousel lotusSrc={heroLotus} items={heroItems} className="min-h-[48vh] md:min-h-[56vh] lg:min-h-[62vh]" />
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="glass-panel relative overflow-hidden px-5 py-8 md:px-8 md:py-10 lg:px-10">
          <div className="relative mb-8 flex justify-center md:mb-10">
            <div className="relative h-[7.5rem] w-[12.5rem] sm:h-[9.5rem] sm:w-[15rem] md:h-[11rem] md:w-[17.5rem]">
              <div className="absolute left-1/2 top-1/2 z-20 h-24 w-24 -translate-y-1/2 translate-x-4 overflow-hidden rounded-full border border-boutique-gold/25 shadow-[0_18px_42px_rgba(107,15,26,0.12)] sm:h-32 sm:w-32 sm:translate-x-6 md:h-36 md:w-36 md:translate-x-7">
                <img
                  src={contactDesk}
                  alt="Raes Boutique interior"
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              <div
                className="absolute left-1/2 top-1/2 z-10 h-20 w-20 -translate-x-[3.2rem] -translate-y-1/2 overflow-hidden rounded-full border border-boutique-gold/20 shadow-[0_14px_34px_rgba(107,15,26,0.1)] sm:h-28 sm:w-28 sm:-translate-x-[4.7rem] md:h-32 md:w-32 md:-translate-x-[5.65rem]"
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

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Categories"
          title="Signature wardrobe sections"
          description="Minimal, elevated, and ready for every festive moment."
        />
        <div className="mt-10 flex gap-2.5 overflow-x-auto pb-2 md:grid md:gap-6 md:overflow-visible md:pb-0 md:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category.title}
              type="button"
              onClick={() => navigate(`/collections?category=${encodeURIComponent(category.title)}`)}
              className="group relative min-w-[186px] shrink-0 overflow-hidden rounded-[1.55rem] bg-white px-3.5 py-4.5 text-left shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-luxe active:-translate-y-1 active:shadow-luxe md:min-w-0 md:rounded-[2rem] md:px-6 md:py-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-boutique-maroon to-[#2f050d] opacity-0 transition duration-500 group-hover:opacity-100 group-active:opacity-100" />
              <div className="absolute inset-y-4 right-0 z-10 flex w-[4.85rem] items-center justify-end md:inset-y-6 md:w-[6.75rem]">
                <div className="relative h-full w-full max-h-[8.9rem] overflow-hidden rounded-l-full border border-boutique-gold/35 bg-[#f7efe6] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.08)] transition duration-500 group-hover:border-boutique-gold/55 group-hover:shadow-[0_18px_40px_rgba(107,15,26,0.18)] md:max-h-[13.5rem]">
                  <img
                    src={categoryImages[category.title]?.src}
                    alt={categoryImages[category.title]?.alt || category.title}
                    className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/8 via-transparent to-transparent group-hover:from-boutique-maroon/15" />
                </div>
              </div>
              <div className="relative z-20 max-w-[6.6rem] md:max-w-[12rem]">
                <img
                  src={heroLotus}
                  alt=""
                  className="h-5 w-auto object-contain opacity-95 transition duration-500 group-hover:scale-105 group-active:scale-105 md:h-8"
                  loading="lazy"
                />
                <h3 className="mt-3.5 font-display text-[1.34rem] text-boutique-maroon transition group-hover:text-white group-active:text-white md:mt-5 md:text-4xl">
                  {category.title}
                </h3>
                <p className="mt-2.5 max-w-[6.35rem] overflow-hidden text-[10.5px] leading-[1.1rem] text-boutique-ink/65 transition [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] group-hover:text-white/80 group-active:text-white/80 md:mt-4 md:max-w-[14rem] md:text-sm md:leading-7 md:[-webkit-line-clamp:unset]">
                  {category.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-[#f7f0eb] px-5 py-8 shadow-[0_24px_70px_rgba(107,15,26,0.12)] md:px-8 md:py-12 lg:px-10 lg:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(107,15,26,0.08),transparent_32%)]" />
          <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Featured Products"
              title="Curated boutique highlights"
              description="A focused edit of elevated drapes and tailoring."
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollFeatured(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-boutique-maroon shadow-soft transition hover:bg-boutique-gold"
                aria-label="Previous featured products"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollFeatured(1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-boutique-maroon shadow-soft transition hover:bg-boutique-gold"
                aria-label="Next featured products"
              >
                <ChevronRight size={16} />
              </button>
              <Link to="/collections" className="text-sm font-medium text-boutique-maroon transition hover:text-boutique-gold">
                View All Collections
              </Link>
            </div>
          </div>
          <div
            ref={featuredCarouselRef}
            className="relative z-10 mt-8 flex snap-x snap-mandatory items-stretch gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-boutique-gold/25 md:gap-4"
          >
            {featuredGalleryItems.map(({ id, src, product }) => (
              <Link
                key={id}
                to={`/collections/${product._id}`}
                data-featured-card="true"
                className="group block min-w-[8.9rem] shrink-0 snap-start overflow-hidden rounded-[1rem] bg-white p-1.5 shadow-[0_14px_34px_rgba(107,15,26,0.07)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(107,15,26,0.11)] sm:min-w-[10.25rem] md:min-w-[12.5rem] md:rounded-[1rem] md:p-2"
              >
                <div className="relative h-[7.8rem] w-full overflow-hidden rounded-[0.8rem] bg-[#f8f1eb] sm:h-[9rem] md:h-44 md:rounded-[0.85rem]">
                  <img
                    src={src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-25 blur-xl"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,241,235,0.16),rgba(248,241,235,0.08))]" />
                  <img
                    src={src}
                    alt={product.name}
                    className="relative z-10 h-full w-full object-contain object-center p-1.5 transition duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="px-1 pt-1.5">
                  <h3 className="truncate font-body text-[0.68rem] font-medium leading-tight text-boutique-maroon md:text-[0.86rem]">
                    {product.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="relative z-10 mt-5 flex justify-center gap-2">
            {featuredGalleryItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFeaturedIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  featuredIndex === index ? 'w-7 bg-boutique-gold' : 'w-2 bg-boutique-maroon/20 hover:bg-boutique-maroon/35'
                }`}
                aria-label={`View featured product ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

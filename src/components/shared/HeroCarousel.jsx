import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const getStackStyle = (offset, isMobile) => {
  if (isMobile) {
    if (offset === 0) {
      return {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        zIndex: 60,
        filter: 'blur(0px)'
      };
    }

    if (Math.abs(offset) === 1) {
      return {
        x: offset > 0 ? 136 : -136,
        y: 12,
        scale: 0.78,
        opacity: 0.92,
        zIndex: 40,
        filter: 'blur(0px)'
      };
    }

    return {
      x: offset > 0 ? 210 : -210,
      y: 24,
      scale: 0.76,
      opacity: 0,
      zIndex: 10,
      filter: 'blur(4px)'
    };
  }

  if (offset === 0) {
    return {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      zIndex: 70,
      filter: 'blur(0px)'
    };
  }

    if (Math.abs(offset) === 1) {
      return {
        x: offset > 0 ? 310 : -310,
        y: 18,
        scale: 0.84,
        opacity: 0.92,
        zIndex: 55,
        filter: 'blur(0px)'
      };
    }

    if (Math.abs(offset) === 2) {
      return {
        x: offset > 0 ? 585 : -585,
        y: 36,
        scale: 0.64,
        opacity: 0.42,
        zIndex: 28,
        filter: 'blur(0.8px)'
      };
    }

  return {
    x: offset > 0 ? 780 : -780,
    y: 50,
    scale: 0.64,
    opacity: 0,
    zIndex: 10,
    filter: 'blur(4px)'
  };
};

const PlaceholderCard = ({ centered = false, item }) => (
  <div
    className={`relative overflow-hidden rounded-[1rem] bg-white/6 shadow-[0_24px_56px_rgba(0,0,0,0.28)] backdrop-blur-[2px] md:rounded-[1.2rem] ${
      centered ? 'shadow-[0_30px_72px_rgba(0,0,0,0.34)]' : ''
    }`}
  >
      <div className="relative p-2 md:p-2.5">
      <div className="relative h-[248px] w-[140px] overflow-hidden rounded-[0.9rem] bg-[#b5b5b5] text-white md:h-[360px] md:w-[245px] md:rounded-[1.05rem] lg:h-[430px] lg:w-[300px]">
        {item?.src ? (
          <>
            <img
              src={item.src}
              alt={item.alt || 'Hero showcase'}
              className="h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_22%,transparent_78%,rgba(0,0,0,0.06))]" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="font-display text-3xl tracking-[0.18em] text-white/95 md:text-5xl">Image</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function HeroCarousel({ className = '', items = [], lotusSrc = '' }) {
  const carouselItems = items.length ? items : Array.from({ length: 5 }, (_, i) => ({ id: i }));
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const next = () => setActive((prev) => (prev + 1) % carouselItems.length);
  const prev = () => setActive((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(next, 4000);
    return () => window.clearInterval(timer);
  }, [carouselItems.length]);

  const getOffset = (index) => {
    let diff = index - active;

    if (diff > carouselItems.length / 2) {
      diff -= carouselItems.length;
    }

    if (diff < -carouselItems.length / 2) {
      diff += carouselItems.length;
    }

    return diff;
  };

  return (
    <div className={`relative flex w-full flex-col justify-start overflow-hidden pb-8 pt-10 md:pb-10 md:pt-14 ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_24%),radial-gradient(circle_at_bottom,rgba(212,175,55,0.12),transparent_30%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[14rem] w-[14rem] -translate-x-1/2 -translate-y-[40%] rounded-full bg-boutique-gold/10 blur-3xl md:h-[20rem] md:w-[20rem]" />
      {lotusSrc ? (
        <div className="pointer-events-none absolute left-1/2 top-5 z-30 -translate-x-1/2 md:top-6">
          <img
            src={lotusSrc}
            alt=""
            className="h-12 w-auto object-contain md:h-14 lg:h-16"
          />
        </div>
      ) : null}

      <div className="relative mx-auto flex w-full max-w-[1760px] items-center justify-center px-2 md:px-8">
        <button
          type="button"
          onClick={prev}
          className="absolute left-4 z-30 rounded-full border border-white/15 bg-white/5 p-3 text-white transition hover:border-boutique-gold hover:text-boutique-gold md:left-6"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="relative h-[390px] w-full md:h-[500px] lg:h-[580px]">
          {carouselItems.map((item, index) => {
            const offset = getOffset(index);
            const style = getStackStyle(offset, isMobile);
            const hidden = isMobile && Math.abs(offset) > 1;
            const centered = offset === 0;

            return (
              <div
                key={item.id ?? index}
                className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] ${
                  hidden ? 'hidden md:block' : ''
                }`}
              >
                <motion.button
                  type="button"
                  onClick={() => setActive(index)}
                  animate={style}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{ zIndex: style.zIndex }}
                  className="pointer-events-auto relative bg-transparent"
                >
                  <div className="absolute bottom-[-22px] left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-full bg-black/35 blur-2xl md:bottom-[-28px]" />
                  <PlaceholderCard centered={centered} item={item} />
                </motion.button>
              </div>
            );
          })}

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 justify-center gap-2 md:bottom-6">
            {carouselItems.map((item, index) => (
              <button
                key={item.id ?? index}
                type="button"
                onClick={() => setActive(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  active === index ? 'w-8 bg-boutique-gold' : 'w-2 bg-white/35 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          className="absolute right-4 z-30 rounded-full border border-white/15 bg-white/5 p-3 text-white transition hover:border-boutique-gold hover:text-boutique-gold md:right-6"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
}

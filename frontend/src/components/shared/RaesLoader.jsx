import { motion } from 'framer-motion';
import heroLotus from '../../assets/raes-hero-lotus-cutout.png';

const letterVariants = {
  initial: { y: 0, opacity: 0.4 },
  animate: (index) => ({
    y: [0, -8, 0],
    opacity: [0.55, 1, 0.7],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: index * 0.08
    }
  })
};

const letters = ['R', 'A', 'E', 'S'];

const RaesLoader = ({ label = 'Loading product' }) => (
  <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
    <div className="relative flex w-full max-w-xl flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.16),transparent_26%),linear-gradient(145deg,#fffaf6,#f7efe8)] px-8 py-14 text-center shadow-[0_28px_70px_rgba(107,15,26,0.12)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(107,15,26,0.08),transparent_32%)]" />

      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, -1.5, 0, 1.5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 mb-8"
      >
        <div className="absolute inset-x-6 bottom-[-1.2rem] h-6 rounded-full bg-boutique-maroon/18 blur-xl" />
        <div className="relative overflow-hidden rounded-[1.6rem] border border-boutique-gold/30 bg-[linear-gradient(145deg,#6B0F1A,#7d1723_50%,#3f0910)] px-8 py-10 shadow-[0_22px_50px_rgba(107,15,26,0.28)]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_36%,transparent_64%,rgba(212,175,55,0.14))]" />
          <img
            src={heroLotus}
            alt=""
            className="relative mx-auto h-14 w-auto object-contain"
          />
        </div>
      </motion.div>

      <div className="relative z-10 flex items-center gap-1 font-display text-[2.4rem] tracking-[0.26em] md:text-[3rem]">
        {letters.map((letter, index) => (
          <motion.span
            key={letter}
            custom={index}
            variants={letterVariants}
            initial="initial"
            animate="animate"
            className="inline-block bg-[linear-gradient(180deg,#f7d96c,#D4AF37_55%,#8d5e10)] bg-clip-text text-transparent [text-shadow:0_1px_0_rgba(255,255,255,0.18),0_10px_18px_rgba(107,15,26,0.18)]"
          >
            {letter}
          </motion.span>
        ))}
      </div>

      <p className="relative z-10 mt-4 text-sm uppercase tracking-[0.34em] text-boutique-maroon/72">
        {label}
      </p>
    </div>
  </div>
);

export default RaesLoader;

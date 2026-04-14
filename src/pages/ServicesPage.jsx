import { useNavigate } from 'react-router-dom';
import SectionHeading from '../components/shared/SectionHeading';
import heroLotus from '../assets/raes-hero-lotus-cutout.png';
import { fabrics } from '../data/site';

const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <SectionHeading
          eyebrow="Services"
          title="Boutique fabric guidance"
          description="Explore fabrics only. Each card filters the main collections page instantly."
        />
        <img src={heroLotus} alt="" className="mt-1 h-7 w-auto object-contain opacity-90 md:h-9" />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {fabrics.map((fabric, index) => (
          <button
            key={fabric}
            type="button"
            onClick={() => navigate(`/collections?fabric=${encodeURIComponent(fabric)}`)}
            className="group rounded-[1.45rem] bg-white p-4 text-left shadow-soft transition duration-500 hover:-translate-y-1 hover:bg-boutique-maroon hover:text-white hover:shadow-luxe md:rounded-[2rem] md:p-8"
          >
            <p className="text-xs uppercase tracking-[0.36em] text-boutique-gold">{`0${index + 1}`}</p>
            <h3 className="mt-3 font-display text-[1.08rem] leading-tight text-boutique-maroon transition group-hover:text-boutique-gold md:mt-5 md:text-4xl">
              {fabric}
            </h3>
            <p className="mt-2 text-[10px] leading-[1.05rem] text-boutique-ink/65 transition group-hover:text-white/75 md:mt-4 md:text-sm md:leading-6">
              Tap to view curated boutique styles crafted in {fabric.toLowerCase()}.
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ServicesPage;

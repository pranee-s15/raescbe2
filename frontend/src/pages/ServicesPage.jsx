import { useNavigate } from 'react-router-dom';
import SectionHeading from '../components/shared/SectionHeading';
import { fabrics } from '../data/site';

const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <SectionHeading
        eyebrow="Services"
        title="Boutique fabric guidance"
        description="Explore fabrics only. Each card filters the main collections page instantly."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {fabrics.map((fabric, index) => (
          <button
            key={fabric}
            type="button"
            onClick={() => navigate(`/collections?fabric=${encodeURIComponent(fabric)}`)}
            className="group rounded-[2rem] bg-white p-8 text-left shadow-soft transition duration-500 hover:-translate-y-1 hover:bg-boutique-maroon hover:text-white hover:shadow-luxe"
          >
            <p className="text-xs uppercase tracking-[0.36em] text-boutique-gold">{`0${index + 1}`}</p>
            <h3 className="mt-5 font-display text-4xl text-boutique-maroon transition group-hover:text-boutique-gold">
              {fabric}
            </h3>
            <p className="mt-4 text-sm text-boutique-ink/65 transition group-hover:text-white/75">
              Tap to view curated boutique styles crafted in {fabric.toLowerCase()}.
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ServicesPage;

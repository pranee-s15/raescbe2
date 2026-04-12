const StatCard = ({ label, value, accent = false }) => (
  <div
    className={`rounded-[1.7rem] border p-5 shadow-soft ${
      accent
        ? 'border-boutique-maroon/20 bg-boutique-maroon text-boutique-white'
        : 'border-boutique-gold/10 bg-white text-boutique-maroon'
    }`}
  >
    <p className={`text-[10px] uppercase tracking-[0.3em] ${accent ? 'text-boutique-gold/85' : 'text-boutique-gold'}`}>
      {label}
    </p>
    <p className="mt-2.5 font-section text-[1.55rem] leading-none tracking-[-0.03em] [font-variant-numeric:tabular-nums] md:text-[1.75rem]">
      {value}
    </p>
  </div>
);

export default StatCard;

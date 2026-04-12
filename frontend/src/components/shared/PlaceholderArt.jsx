const PlaceholderArt = ({
  title = 'Luxury Placeholder',
  subtitle = 'Raes Boutique',
  className = '',
  compact = false
}) => (
  <div
    className={`relative overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,#6B0F1A,#3F0710)] p-5 text-boutique-white shadow-luxe ${className}`}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.22),transparent_36%)]" />
    <div className="absolute -right-10 top-8 h-28 w-28 rounded-full border border-white/10 bg-white/5" />
    <div className="absolute -left-14 bottom-2 h-32 w-32 rounded-full border border-boutique-gold/25" />
    <div className="absolute inset-x-6 bottom-4 top-auto h-px bg-gradient-to-r from-transparent via-boutique-gold/60 to-transparent" />
    <div className="relative flex h-full min-h-[220px] flex-col justify-between rounded-[1.6rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.36em] text-boutique-gold/80">
        <span>Raes Edit</span>
        <span>Lotus</span>
      </div>
      <div>
        <p className={`font-display ${compact ? 'text-2xl' : 'text-4xl'} leading-none`}>{title}</p>
        <p className="mt-3 max-w-[14rem] text-sm text-white/70">{subtitle}</p>
      </div>
      <div className="flex gap-2">
        <span className="h-3 w-10 rounded-full bg-boutique-gold/70" />
        <span className="h-3 w-3 rounded-full bg-white/30" />
        <span className="h-3 w-3 rounded-full bg-white/20" />
      </div>
    </div>
  </div>
);

export default PlaceholderArt;

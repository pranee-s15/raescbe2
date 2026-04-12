import { festivalMessages } from '../../data/site';

const Banner = () => (
  <div className="sticky top-0 z-50 overflow-hidden bg-boutique-maroon py-2 text-boutique-white">
    <div className="animate-marquee whitespace-nowrap text-center text-[11px] uppercase tracking-[0.38em] text-boutique-gold">
      {festivalMessages.map((message, index) => (
        <span key={message} className="mx-6">
          {message}
          {index < festivalMessages.length - 1 ? ' • ' : ''}
        </span>
      ))}
    </div>
  </div>
);

export default Banner;

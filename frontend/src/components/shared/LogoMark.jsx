import raesLogo from '../../assets/raes-logo.jpeg';

const LogoMark = ({
  className = 'h-12 w-12',
  withText = false,
  titleClassName = 'text-boutique-gold',
  subtitleClassName = 'text-boutique-maroon'
}) => (
  <div className="flex items-center gap-3">
    <img
      src={raesLogo}
      alt="Raes Boutique logo"
      className={className}
    />
    {withText ? (
      <div>
        <p className={`font-display text-2xl font-semibold tracking-[0.24em] ${titleClassName}`}>RAES</p>
        <p className={`-mt-1 font-display text-lg ${subtitleClassName}`}>Boutique</p>
      </div>
    ) : null}
  </div>
);

export default LogoMark;

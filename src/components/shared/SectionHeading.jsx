const SectionHeading = ({ eyebrow, title, description, align = 'left' }) => (
  <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
    {eyebrow ? (
      <p className="mb-2 font-body text-[10px] uppercase tracking-[0.3em] text-boutique-gold md:text-[11px]">{eyebrow}</p>
    ) : null}
    <h2 className="font-section text-[1.65rem] leading-tight tracking-[-0.02em] text-boutique-maroon md:text-[2.1rem] lg:text-[2.45rem]">
      {title}
    </h2>
    {description ? (
      <p className="mt-3 max-w-xl text-sm leading-6 text-boutique-ink/68 md:text-[15px] lg:text-base">
        {description}
      </p>
    ) : null}
  </div>
);

export default SectionHeading;

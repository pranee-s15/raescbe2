import { getProductImage } from '../../data/productMedia';

const ProductImage = ({
  product,
  className = '',
  imageClassName = '',
  alt = '',
  fit = 'cover'
}) => {
  const src = getProductImage(product);
  const imageAlt = alt || product?.name || 'Raes Boutique product';
  const fitClassName = fit === 'contain' ? 'object-contain' : 'object-cover';

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-[#f4ece7] ${className}`}>
        <span className="font-display text-2xl text-boutique-maroon/50">Raes Boutique</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#f4ece7] ${className}`}>
      {fit === 'contain' ? (
        <>
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-35 blur-xl"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,239,232,0.28),rgba(247,239,232,0.1))]" />
        </>
      ) : null}
      <img
        src={src}
        alt={imageAlt}
        className={`relative z-10 h-full w-full ${fitClassName} object-center ${imageClassName}`}
        loading="lazy"
      />
    </div>
  );
};

export default ProductImage;

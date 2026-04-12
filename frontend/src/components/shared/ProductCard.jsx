import { Link } from 'react-router-dom';
import { formatCurrency } from '../../data/site';
import ProductImage from './ProductImage';

const ProductCard = ({ product }) => (
  <article className="group overflow-hidden rounded-[1rem] bg-white shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-luxe">
    <Link to={`/collections/${product._id}`} className="block">
      <ProductImage
        product={product}
        fit="contain"
        className="aspect-[4/4.75] w-full bg-[#f7efe8]"
        imageClassName="transition duration-500 group-hover:scale-[1.02]"
      />
      <div className="px-3 py-2.5">
        <p className="text-[9px] uppercase tracking-[0.2em] text-boutique-gold">
          {product.fabric} · {product.category}
        </p>
        <h3 className="mt-1.5 font-display text-[1.02rem] leading-tight text-boutique-maroon">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-boutique-maroon">{formatCurrency(product.price)}</p>
            <p className="mt-0.5 overflow-hidden text-[10px] leading-4 text-boutique-ink/65 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]">
              {product.description}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-boutique-background px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-boutique-maroon transition group-hover:bg-boutique-gold/25">
            View
          </span>
        </div>
      </div>
    </Link>
  </article>
);

export default ProductCard;

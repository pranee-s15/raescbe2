import { Heart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/shared/BackButton';
import ProductImage from '../components/shared/ProductImage';
import QuantitySelector from '../components/shared/QuantitySelector';
import SectionHeading from '../components/shared/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { sampleProducts } from '../data/sampleProducts';
import { formatCurrency } from '../data/site';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { wishlistIds, toggleWishlist } = useAuth();
  const { addToCart, startBuyNow } = useShop();
  const product = useMemo(() => sampleProducts.find((item) => item._id === id) || null, [id]);

  if (!product) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 md:px-8">
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft">
          <h2 className="font-display text-4xl text-boutique-maroon">Product not found</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
      <BackButton fallbackTo="/collections" label="Back" />
      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[0.88fr,1.12fr] lg:gap-8">
        <div className="overflow-hidden rounded-[1.35rem] bg-white p-3 shadow-soft md:rounded-[1.75rem]">
          <ProductImage
            product={product}
            fit="contain"
            className="h-[250px] rounded-[1.05rem] bg-[#f7efe8] sm:h-[290px] md:h-[320px] lg:h-[360px]"
            imageClassName="p-3 md:p-4"
          />
        </div>

        <div className="space-y-5">
          <SectionHeading eyebrow={product.fabric} title={product.name} description="" />
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-boutique-maroon md:text-3xl">{formatCurrency(product.price)}</p>
            <p className="text-sm uppercase tracking-[0.24em] text-boutique-gold md:tracking-[0.32em]">{product.category}</p>
            <p className="max-w-2xl text-sm leading-6 text-boutique-ink/70">{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm uppercase tracking-[0.32em] text-boutique-ink/55">Quantity</span>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => toggleWishlist(product._id)}
              className={`rounded-full px-5 py-3 text-sm transition ${
                wishlistIds.includes(product._id)
                  ? 'bg-boutique-maroon text-white'
                  : 'bg-white text-boutique-maroon shadow-soft hover:bg-boutique-gold'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Heart size={16} fill={wishlistIds.includes(product._id) ? 'currentColor' : 'none'} />
                Wishlist
              </span>
            </button>
            <button type="button" onClick={() => addToCart(product, quantity)} className="gold-button">
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => {
                const checkoutItem = { ...product, quantity };
                startBuyNow(product, quantity);
                navigate('/checkout', { state: { mode: 'buy-now', items: [checkoutItem] } });
              }}
              className="rounded-full bg-boutique-gold px-6 py-3 text-sm font-medium text-boutique-maroon transition hover:bg-boutique-maroon hover:text-white"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;

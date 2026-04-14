import { Link, useNavigate } from 'react-router-dom';
import ProductImage from '../components/shared/ProductImage';
import QuantitySelector from '../components/shared/QuantitySelector';
import SectionHeading from '../components/shared/SectionHeading';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../data/site';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart } = useShop();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 md:gap-6">
        <SectionHeading eyebrow="Cart" title="Your selected boutique pieces" />
        {cart.length ? (
          <button
            type="button"
            onClick={() => navigate('/checkout', { state: { mode: 'cart' } })}
            className="gold-button hidden md:inline-flex"
          >
            Proceed to Checkout
          </button>
        ) : null}
      </div>

      {cart.length ? (
        <div className="mt-10 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr),340px] xl:gap-8">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="grid gap-4 rounded-[1.55rem] bg-white p-3.5 shadow-soft sm:grid-cols-[110px,minmax(0,1fr)] md:grid-cols-[160px,minmax(0,1fr)] md:rounded-[2rem] md:p-5">
                <ProductImage
                  product={item}
                  fit="contain"
                  className="h-[120px] rounded-[1.1rem] md:h-[170px] md:rounded-[1.4rem]"
                  imageClassName="p-2.5"
                />
                <div className="flex flex-col justify-between gap-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">{item.category}</p>
                    <h3 className="mt-2 font-display text-[1.15rem] leading-tight text-boutique-maroon md:mt-3 md:text-[1.9rem]">{item.name}</h3>
                    <p className="mt-2 text-sm text-boutique-ink/68">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <QuantitySelector value={item.quantity} onChange={(qty) => updateCartQuantity(item._id, qty)} />
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="rounded-full bg-boutique-background px-5 py-3 text-sm text-boutique-maroon"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[1.55rem] bg-white p-4 shadow-soft md:rounded-[2rem] md:p-6">
            <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Summary</p>
            <div className="mt-6 space-y-4 text-sm text-boutique-ink/68">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{subtotal > 8000 ? 'Free' : formatCurrency(250)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/checkout', { state: { mode: 'cart' } })}
              className="gold-button mt-8 w-full justify-center"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-10 rounded-[2rem] bg-white p-10 text-center shadow-soft">
          <h3 className="font-display text-4xl text-boutique-maroon">Your cart is currently empty</h3>
          <Link to="/collections" className="gold-button mt-6 inline-flex">
            Explore Collections
          </Link>
        </div>
      )}
    </section>
  );
};

export default CartPage;

import { Link } from 'react-router-dom';
import SectionHeading from '../components/shared/SectionHeading';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../data/site';

const OrderConfirmationPage = () => {
  const { lastOrder } = useShop();

  if (!lastOrder) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft">
          <h2 className="font-display text-4xl text-boutique-maroon">No recent order found</h2>
          <Link to="/collections" className="gold-button mt-6 inline-flex">
            Return to Collections
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft md:p-10">
        <SectionHeading
          eyebrow="Order Confirmed"
          title="Thank you for shopping with Raes Boutique"
          description="Your order has been placed successfully and will move through our boutique delivery flow."
        />

        <div className="mt-8 grid gap-4 rounded-[1.8rem] bg-boutique-background p-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Order ID</p>
            <p className="mt-2 text-sm text-boutique-maroon">{lastOrder._id}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Payment</p>
            <p className="mt-2 text-sm text-boutique-maroon">{lastOrder.paymentMethod}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Status</p>
            <p className="mt-2 text-sm text-boutique-maroon">{lastOrder.status}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Total</p>
            <p className="mt-2 text-sm text-boutique-maroon">{formatCurrency(lastOrder.totalAmount)}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/collections" className="gold-button inline-flex">
            Continue Shopping
          </Link>
          <Link
            to="/contact"
            className="rounded-full bg-boutique-background px-6 py-3 text-sm text-boutique-maroon transition hover:bg-boutique-gold"
          >
            Contact Boutique
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmationPage;

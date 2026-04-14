import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
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
        <div className="mb-8 flex justify-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border-2 border-emerald-400/70"
            />
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.16, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.12 }}
              className="absolute inset-[-8px] rounded-full border border-emerald-300/60"
            />
            <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_12px_28px_rgba(34,197,94,0.35)]">
              <Check size={30} strokeWidth={3} />
            </span>
          </motion.div>
        </div>

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

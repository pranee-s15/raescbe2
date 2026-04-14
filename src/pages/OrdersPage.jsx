import { Link } from 'react-router-dom';
import { CircleCheckBig, PackageCheck, PhoneCall, RotateCcw, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api/client';
import BackButton from '../components/shared/BackButton';
import ProductImage from '../components/shared/ProductImage';
import SectionHeading from '../components/shared/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../data/site';
import { useShop } from '../context/ShopContext';

const demoOrders = [
  {
    _id: 'demo-order-1',
    status: 'Ordered',
    paymentMethod: 'Credit Card',
    totalAmount: 14999,
    cancellationReason: '',
    sizeChangeRequest: '',
    items: [
      {
        _id: 'demo-product-1',
        name: 'Temple Gold Kanchipuram Saree',
        quantity: 1,
        fabric: 'Silk',
        category: 'Sarees'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

const BOUTIQUE_SUPPORT_NUMBER = '09363126467';

const OrdersPage = () => {
  const { token, user } = useAuth();
  const { lastOrder, orderHistory, updateOrder } = useShop();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [cancelInputs, setCancelInputs] = useState({});
  const [sizeInputs, setSizeInputs] = useState({});

  const isDemoMode = user?.isDemoMode;

  useEffect(() => {
    if (isDemoMode) {
      setOrders([...orderHistory, ...demoOrders]);
      return;
    }

    apiRequest('/orders/mine', { token })
      .then((data) => setOrders(lastOrder ? [lastOrder, ...data] : data))
      .catch((fetchError) => setError(fetchError.message));
  }, [isDemoMode, lastOrder, orderHistory, token]);

  const uniqueOrders = useMemo(() => {
    const seen = new Set();
    return orders.filter((order) => {
      if (seen.has(order._id)) {
        return false;
      }

      seen.add(order._id);
      return true;
    });
  }, [orders]);

  const handleCancelOrder = (orderId) => {
    const reason = cancelInputs[orderId]?.trim();

    if (!reason) {
      setError('Please enter a cancellation reason before cancelling the order.');
      return;
    }

    setError('');
    updateOrder(orderId, {
      status: 'Cancelled',
      cancellationReason: reason
    });
  };

  const handleSizeRequest = (orderId) => {
    const request = sizeInputs[orderId]?.trim();

    if (!request) {
      setError('Please enter the size change details before sending the request.');
      return;
    }

    setError('');
    updateOrder(orderId, {
      sizeChangeRequest: request
    });
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <BackButton fallbackTo="/account" label="Back" />
      <SectionHeading
        eyebrow="Orders"
        title="Your boutique order history"
        description="Track recent purchases, payment methods, and delivery status in one place."
      />

      {error ? (
        <div className="mt-8 rounded-[2rem] bg-white p-6 text-sm text-red-600 shadow-soft">{error}</div>
      ) : null}

      {uniqueOrders.length ? (
        <div className="mt-10 space-y-5">
          {uniqueOrders.map((order) => (
            <div key={order._id} className="rounded-[2rem] bg-white p-6 shadow-soft">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Order ID</p>
                  <p className="mt-2 text-sm text-boutique-maroon">{order._id}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Status</p>
                    <div
                      className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
                        order.status === 'Cancelled'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {order.status === 'Cancelled' ? <XCircle size={15} /> : <CircleCheckBig size={15} />}
                      <span>{order.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Payment</p>
                    <p className="mt-2 text-sm text-boutique-maroon">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Total</p>
                    <p className="mt-2 text-sm text-boutique-maroon">{formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] bg-boutique-background p-5">
                <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Items</p>
                <div className="mt-3 space-y-3">
                  {(order.items || []).map((item, index) => (
                    <div
                      key={`${order._id}-${item.name}-${index}`}
                      className="grid gap-3 rounded-[1.2rem] bg-white/70 p-3 sm:grid-cols-[82px,1fr,auto] sm:items-center"
                    >
                      <ProductImage
                        product={item}
                        fit="contain"
                        className="h-20 rounded-[0.95rem] bg-[#f7efe8]"
                        imageClassName="p-2"
                      />
                      <div>
                        <p className="text-sm font-medium text-boutique-maroon">{item.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-boutique-gold">
                          {[item.fabric, item.category].filter(Boolean).join(' · ') || 'Raes Boutique'}
                        </p>
                      </div>
                      <p className="text-sm text-boutique-ink/65">Qty {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[1.5rem] bg-boutique-background p-5">
                  <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Cancel Order</p>
                  <textarea
                    value={cancelInputs[order._id] || order.cancellationReason || ''}
                    onChange={(event) =>
                      setCancelInputs((current) => ({ ...current, [order._id]: event.target.value }))
                    }
                    placeholder="Tell us why you want to cancel this order."
                    disabled={order.status === 'Cancelled'}
                    className="mt-3 min-h-[96px] w-full rounded-[1.15rem] bg-white px-4 py-3 text-sm text-boutique-maroon outline-none ring-1 ring-transparent transition focus:ring-boutique-gold disabled:cursor-not-allowed disabled:bg-white/70"
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={order.status === 'Cancelled'}
                      className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-200"
                    >
                      {order.status === 'Cancelled' ? 'Order Cancelled' : 'Cancel This Order'}
                    </button>
                    {order.cancellationReason ? (
                      <p className="text-xs text-boutique-ink/65">Reason saved for this order.</p>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-boutique-background p-5">
                  <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Change Product Size</p>
                  <textarea
                    value={sizeInputs[order._id] || order.sizeChangeRequest || ''}
                    onChange={(event) =>
                      setSizeInputs((current) => ({ ...current, [order._id]: event.target.value }))
                    }
                    placeholder="Example: Change blouse size to 36 or update salwar size to L."
                    className="mt-3 min-h-[96px] w-full rounded-[1.15rem] bg-white px-4 py-3 text-sm text-boutique-maroon outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSizeRequest(order._id)}
                      className="inline-flex items-center gap-2 rounded-full bg-boutique-maroon px-5 py-2.5 text-sm font-medium text-white transition hover:bg-boutique-gold hover:text-boutique-maroon"
                    >
                      <RotateCcw size={15} />
                      Request Change
                    </button>
                    {order.sizeChangeRequest ? (
                      <p className="text-xs text-boutique-ink/65">Size request saved for this order.</p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`tel:${BOUTIQUE_SUPPORT_NUMBER}`}
                  className="inline-flex items-center gap-2 rounded-full bg-boutique-maroon px-5 py-2.5 text-sm font-medium text-white transition hover:bg-boutique-gold hover:text-boutique-maroon"
                >
                  <PhoneCall size={15} />
                  Help With Call
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[2rem] bg-white p-10 text-center shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-boutique-background text-boutique-maroon">
            <PackageCheck size={28} />
          </div>
          <h2 className="mt-6 font-display text-4xl text-boutique-maroon">No orders yet</h2>
          <p className="mt-3 text-sm text-boutique-ink/65">Once you place an order, it will appear here.</p>
          <Link to="/collections" className="gold-button mt-6 inline-flex">
            Explore Collections
          </Link>
        </div>
      )}
    </section>
  );
};

export default OrdersPage;

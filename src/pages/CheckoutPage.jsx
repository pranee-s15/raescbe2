import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, Landmark, MapPinHouse, Package, QrCode, Truck } from 'lucide-react';
import { apiRequest, IS_FRONTEND_ONLY } from '../api/client';
import BackButton from '../components/shared/BackButton';
import ProductImage from '../components/shared/ProductImage';
import SectionHeading from '../components/shared/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { getProductImage } from '../data/productMedia';
import { formatCurrency } from '../data/site';

const paymentMethods = [
  {
    value: 'UPI',
    label: 'UPI',
    description: 'Pay instantly with your UPI app.',
    icon: QrCode
  },
  {
    value: 'Net Banking',
    label: 'Net Banking',
    description: 'Use your bank account directly.',
    icon: Landmark
  },
  {
    value: 'Credit Card',
    label: 'Credit Card',
    description: 'Secure payment with your credit card.',
    icon: CreditCard
  },
  {
    value: 'Debit Card',
    label: 'Debit Card',
    description: 'Pay with any major debit card.',
    icon: CreditCard
  },
  {
    value: 'Cash on Delivery',
    label: 'Cash on Delivery',
    description: 'Pay when the order reaches you.',
    icon: Truck
  }
];

const checkoutSteps = [
  { id: 1, title: 'Products' },
  { id: 2, title: 'Shipping' },
  { id: 3, title: 'Payment' },
  { id: 4, title: 'Place Order' }
];

const createCheckoutForm = (user) => ({
  fullName: user?.address?.fullName || user?.name || '',
  phone: user?.phone || '',
  addressLine1: user?.address?.addressLine1 || '',
  addressLine2: user?.address?.addressLine2 || '',
  city: user?.address?.city || '',
  state: user?.address?.state || '',
  postalCode: user?.address?.postalCode || '',
  country: user?.address?.country || 'India',
  paymentMethod: 'UPI',
  upiId: '',
  accountNumber: '',
  cardNumber: '',
  cardHolderName: '',
  expiryDate: '',
  cvv: ''
});

const createLocalOrder = ({ items, form, subtotal, shipping, tax, total }) => ({
  _id: `demo-order-${Date.now()}`,
  status: 'Ordered',
  paymentMethod: form.paymentMethod,
  totalAmount: total,
  subtotal,
  shippingFee: shipping,
  taxAmount: tax,
  createdAt: new Date().toISOString(),
  shippingAddress: {
    fullName: form.fullName,
    phone: form.phone,
    addressLine1: form.addressLine1,
    addressLine2: form.addressLine2,
    city: form.city,
    state: form.state,
    postalCode: form.postalCode,
    country: form.country
  },
  items: items.map((item) => ({
    _id: item._id,
    product: item._id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image || getProductImage(item),
    fabric: item.fabric || '',
    category: item.category || ''
  }))
});

const isServerUnavailable = (message = '') =>
  IS_FRONTEND_ONLY ||
  message === 'Cannot reach the Raes Boutique server. Make sure the backend is running.' ||
  message === 'Resource not found.' ||
  message.startsWith('Request failed with status 5');

const validateShipping = (form) => {
  const requiredFields = [
    ['fullName', 'Full name'],
    ['phone', 'Phone number'],
    ['addressLine1', 'Address line 1'],
    ['city', 'City'],
    ['state', 'State'],
    ['postalCode', 'Postal code'],
    ['country', 'Country']
  ];

  const missing = requiredFields.find(([key]) => !form[key]?.trim());
  return missing ? `${missing[1]} is required before you continue.` : '';
};

const validatePayment = (form) => {
  if (form.paymentMethod === 'Cash on Delivery') {
    return '';
  }

  if (form.paymentMethod === 'UPI' && !form.upiId.trim()) {
    return 'UPI ID is required before you continue.';
  }

  if (form.paymentMethod === 'Net Banking' && !form.accountNumber.trim()) {
    return 'Account number is required before you continue.';
  }

  if ((form.paymentMethod === 'Credit Card' || form.paymentMethod === 'Debit Card') && !form.cardNumber.trim()) {
    return `${form.paymentMethod} number is required before you continue.`;
  }

  if ((form.paymentMethod === 'Credit Card' || form.paymentMethod === 'Debit Card') && !form.cardHolderName.trim()) {
    return 'Card holder name is required before you continue.';
  }

  if ((form.paymentMethod === 'Credit Card' || form.paymentMethod === 'Debit Card') && !form.expiryDate.trim()) {
    return 'Expiry date is required before you continue.';
  }

  if ((form.paymentMethod === 'Credit Card' || form.paymentMethod === 'Debit Card') && !form.cvv.trim()) {
    return 'CVV is required before you continue.';
  }

  return '';
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user, updateProfile } = useAuth();
  const { cart, pendingCheckout, clearCart, clearPendingCheckout, addOrder } = useShop();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [saveAddress, setSaveAddress] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(() => createCheckoutForm(user));

  useEffect(() => {
    setForm((current) => ({
      ...current,
      ...createCheckoutForm(user),
      paymentMethod: current.paymentMethod
    }));
  }, [user]);

  const directCheckoutItems = location.state?.items || [];
  const mode = location.state?.mode || (pendingCheckout.length ? 'buy-now' : 'cart');
  const items = useMemo(() => {
    if (mode === 'buy-now') {
      return directCheckoutItems.length ? directCheckoutItems : pendingCheckout;
    }

    return cart;
  }, [mode, directCheckoutItems, pendingCheckout, cart]);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 8000 ? 0 : 250;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  const goToNextStep = () => {
    setError('');

    if (currentStep === 2) {
      const shippingError = validateShipping(form);
      if (shippingError) {
        setError(shippingError);
        return;
      }
    }

    if (currentStep === 3) {
      const paymentError = validatePayment(form);
      if (paymentError) {
        setError(paymentError);
        return;
      }
    }

    setCurrentStep((step) => Math.min(step + 1, 4));
  };

  const goToPreviousStep = () => {
    setError('');
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const shippingAddress = {
      fullName: form.fullName,
      phone: form.phone,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country
    };

    try {
      if (saveAddress && user) {
        await updateProfile({
          name: user.name,
          phone: form.phone,
          address: shippingAddress
        });
      }

      const data = await apiRequest('/orders', {
        method: 'POST',
        token,
        body: {
          items: items.map((item) => ({
            productId: item._id,
            quantity: item.quantity
          })),
          shippingAddress,
          paymentMethod: form.paymentMethod
        }
      });

      addOrder(data.order);
    } catch (submitError) {
      if ((import.meta.env.DEV || IS_FRONTEND_ONLY) && (user?.isDemoMode || isServerUnavailable(submitError.message))) {
        addOrder(createLocalOrder({ items, form, subtotal, shipping, tax, total }));
      } else {
        setError(submitError.message);
        setSubmitting(false);
        return;
      }
    }

    if (mode === 'buy-now') {
      clearPendingCheckout();
    } else {
      clearCart();
    }

    setSubmitting(false);
    navigate('/order-confirmation');
  };

  if (!items.length) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft">
          <h2 className="font-display text-4xl text-boutique-maroon">No items ready for checkout</h2>
          <button type="button" onClick={() => navigate('/collections')} className="gold-button mt-6">
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <div className="rounded-[1.6rem] bg-white p-4 shadow-soft md:rounded-[2rem] md:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-boutique-maroon text-white">
              <Package size={18} />
            </span>
            <div>
              <h3 className="mt-1 font-display text-3xl text-boutique-maroon">Selected products</h3>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="grid gap-3 rounded-[1.3rem] bg-boutique-background p-3 sm:grid-cols-[92px,1fr,auto] sm:items-center md:rounded-[1.6rem] md:p-4">
                <ProductImage
                  product={item}
                  fit="contain"
                  className="h-24 rounded-[1rem] bg-[#f7efe8] md:h-28 md:rounded-[1.2rem]"
                  imageClassName="p-2"
                />
                <div>
                  <p className="font-medium text-boutique-maroon">{item.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.26em] text-boutique-gold">
                    {item.fabric} · {item.category}
                  </p>
                  <p className="mt-2 text-sm text-boutique-ink/65">Quantity: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-boutique-maroon">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button type="button" onClick={goToNextStep} className="gold-button">
              Proceed to Shipping Details
            </button>
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="rounded-[1.6rem] bg-white p-4 shadow-soft md:rounded-[2rem] md:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-boutique-maroon text-white">
              <MapPinHouse size={18} />
            </span>
            <div>
              <h3 className="mt-1 font-display text-3xl text-boutique-maroon">Shipping details</h3>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-boutique-background p-4 text-sm text-boutique-ink/65">
            Enter the delivery address here first. Once this is done, we will move to payment.
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 md:gap-4">
            {[
              ['fullName', 'Full Name'],
              ['phone', 'Phone'],
              ['addressLine1', 'Address Line 1'],
              ['addressLine2', 'Address Line 2'],
              ['city', 'City'],
              ['state', 'State'],
              ['postalCode', 'Postal Code'],
              ['country', 'Country']
            ].map(([key, label]) => (
              <label key={key} className={`block ${key.includes('addressLine') ? 'md:col-span-2' : ''}`}>
                <span className="mb-2 block text-sm text-boutique-ink/68">{label}</span>
                <input
                  value={form[key]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  className="w-full rounded-2xl bg-boutique-background px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                  required={key !== 'addressLine2'}
                />
              </label>
            ))}
          </div>

          <label className="mt-5 inline-flex items-center gap-3 text-sm text-boutique-ink/72">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={(event) => setSaveAddress(event.target.checked)}
              className="h-4 w-4 accent-[#6B0F1A]"
            />
            Save this delivery address to my account
          </label>

          <div className="mt-8 flex flex-wrap justify-between gap-4">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="rounded-full bg-boutique-background px-6 py-3 text-sm text-boutique-maroon transition hover:bg-boutique-gold/25"
            >
              Back to Products
            </button>
            <button type="button" onClick={goToNextStep} className="gold-button">
              Proceed to Payment
            </button>
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="rounded-[1.6rem] bg-white p-4 shadow-soft md:rounded-[2rem] md:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-boutique-maroon text-white">
              <CreditCard size={18} />
            </span>
            <div>
              <h3 className="mt-1 font-display text-3xl text-boutique-maroon">Payment method</h3>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 md:gap-4">
            {paymentMethods.map((method) => {
              const Icon = method.icon;

              return (
                <label
                  key={method.value}
                  className={`cursor-pointer rounded-[1.5rem] border px-5 py-4 transition ${
                    form.paymentMethod === method.value
                      ? 'border-boutique-gold bg-boutique-maroon text-white shadow-soft'
                      : 'border-transparent bg-boutique-background text-boutique-maroon hover:border-boutique-gold/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={form.paymentMethod === method.value}
                    onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full ${
                        form.paymentMethod === method.value ? 'bg-white/12 text-boutique-gold' : 'bg-white text-boutique-maroon'
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p
                        className={`mt-1 text-sm ${
                          form.paymentMethod === method.value ? 'text-white/72' : 'text-boutique-ink/65'
                        }`}
                      >
                        {method.description}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {form.paymentMethod === 'UPI' ? (
            <div className="mt-6 rounded-[1.5rem] bg-boutique-background p-4 md:p-5">
              <label className="block">
                <span className="mb-2 block text-sm text-boutique-ink/68">UPI ID</span>
                <input
                  value={form.upiId}
                  onChange={(event) => setForm((current) => ({ ...current, upiId: event.target.value }))}
                  placeholder="name@bank"
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                />
              </label>
            </div>
          ) : null}

          {form.paymentMethod === 'Net Banking' ? (
            <div className="mt-6 rounded-[1.5rem] bg-boutique-background p-4 md:p-5">
              <label className="block">
                <span className="mb-2 block text-sm text-boutique-ink/68">Account Number</span>
                <input
                  value={form.accountNumber}
                  onChange={(event) => setForm((current) => ({ ...current, accountNumber: event.target.value }))}
                  placeholder="Enter account number"
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                />
              </label>
            </div>
          ) : null}

          {form.paymentMethod === 'Credit Card' || form.paymentMethod === 'Debit Card' ? (
            <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-boutique-background p-4 md:grid-cols-2 md:gap-4 md:p-5">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-boutique-ink/68">{form.paymentMethod} Number</span>
                <input
                  value={form.cardNumber}
                  onChange={(event) => setForm((current) => ({ ...current, cardNumber: event.target.value }))}
                  placeholder="Enter card number"
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-boutique-ink/68">Card Holder Name</span>
                <input
                  value={form.cardHolderName}
                  onChange={(event) => setForm((current) => ({ ...current, cardHolderName: event.target.value }))}
                  placeholder="Name on card"
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-boutique-ink/68">Expiry Date</span>
                <input
                  value={form.expiryDate}
                  onChange={(event) => setForm((current) => ({ ...current, expiryDate: event.target.value }))}
                  placeholder="MM/YY"
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-boutique-ink/68">CVV</span>
                <input
                  value={form.cvv}
                  onChange={(event) => setForm((current) => ({ ...current, cvv: event.target.value }))}
                  placeholder="CVV"
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                />
              </label>
            </div>
          ) : null}

          {form.paymentMethod === 'Cash on Delivery' ? (
            <div className="mt-6 rounded-[1.5rem] bg-boutique-background p-4 text-sm text-boutique-ink/65 md:p-5">
              No payment details are needed for Cash on Delivery.
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-between gap-4">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="rounded-full bg-boutique-background px-6 py-3 text-sm text-boutique-maroon transition hover:bg-boutique-gold/25"
            >
              Back to Shipping
            </button>
            <button type="button" onClick={goToNextStep} className="gold-button">
              Proceed to Place Order
            </button>
          </div>
        </div>
      );
    }

    return (
        <div className="rounded-[1.6rem] bg-white p-4 shadow-soft md:rounded-[2rem] md:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-boutique-maroon text-white">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <h3 className="mt-1 font-display text-3xl text-boutique-maroon">Review and place order</h3>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[1.5rem] bg-boutique-background p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Shipping Address</p>
            <p className="mt-3 text-sm leading-7 text-boutique-maroon">
              {[form.fullName, form.phone, form.addressLine1, form.addressLine2, form.city, form.state, form.postalCode, form.country]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-boutique-background p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Payment Method</p>
            <p className="mt-3 text-sm font-medium text-boutique-maroon">{form.paymentMethod}</p>
            <p className="mt-2 text-sm text-boutique-ink/65">
              Complete the order using the payment option you selected in the previous step.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-boutique-background p-5">
          <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Order Total</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-boutique-maroon">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-4">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="rounded-full bg-boutique-background px-6 py-3 text-sm text-boutique-maroon transition hover:bg-boutique-gold/25"
          >
            Back to Payment
          </button>
          <button type="submit" disabled={submitting} className="gold-button">
            Place Order
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
      <BackButton fallbackTo="/collections" label="Back" />
      <div className="flex flex-wrap items-end justify-between gap-4 md:gap-6">
        <SectionHeading
          eyebrow="Checkout"
          title="Boutique checkout"
          description="Move through products, shipping, payment, and the final order placement screen."
        />
        <div className="rounded-full bg-white px-5 py-3 text-sm text-boutique-maroon shadow-soft">
          {mode === 'buy-now' ? 'Buy Now Checkout' : 'Cart Checkout'}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr),360px] xl:gap-8">
        <div className="min-w-0">
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2 sm:pb-0">
            {checkoutSteps.map((step) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div
                  key={step.id}
                  className={`min-w-[160px] shrink-0 rounded-[1.4rem] px-4 py-4 transition ${
                    isActive
                      ? 'bg-boutique-maroon text-white shadow-soft'
                      : isCompleted
                        ? 'bg-boutique-gold/20 text-boutique-maroon'
                        : 'bg-white text-boutique-ink/55 shadow-soft'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{step.title}</p>
                    </div>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                        isActive
                          ? 'bg-white/12 text-white'
                          : isCompleted
                            ? 'bg-boutique-maroon text-white'
                            : 'bg-boutique-background text-boutique-maroon'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={15} /> : step.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          </form>
        </div>

        <aside className="h-fit rounded-[1.7rem] bg-white p-4 shadow-soft md:rounded-[2rem] md:p-6 xl:sticky xl:top-28">
          <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Quick Summary</p>
          <div className="mt-5 space-y-5">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between gap-4 text-sm text-boutique-ink/68">
                <div>
                  <p className="font-medium text-boutique-maroon">{item.name}</p>
                  <p className="mt-1">Qty {item.quantity}</p>
                </div>
                <p>{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3 border-t border-boutique-background pt-6 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-boutique-maroon">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-boutique-maroon/6 p-4 text-sm text-boutique-ink/72">
            Current step: <span className="font-medium text-boutique-maroon">{checkoutSteps[currentStep - 1].title}</span>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CheckoutPage;

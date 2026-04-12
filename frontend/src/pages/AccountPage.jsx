import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, LogOut, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import BackButton from '../components/shared/BackButton';
import SectionHeading from '../components/shared/SectionHeading';
import { useAuth } from '../context/AuthContext';

const createProfileForm = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  address: {
    fullName: user?.address?.fullName || user?.name || '',
    addressLine1: user?.address?.addressLine1 || '',
    addressLine2: user?.address?.addressLine2 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'India'
  }
});

const formatAddressPreview = (address) =>
  [
    address?.fullName,
    address?.addressLine1,
    address?.addressLine2,
    address?.city,
    address?.state,
    address?.postalCode,
    address?.country
  ]
    .filter(Boolean)
    .join(', ');

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [form, setForm] = useState(() => createProfileForm(user));
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    setForm(createProfileForm(user));
  }, [user]);

  const addressPreview = useMemo(
    () => formatAddressPreview(form.address) || 'No delivery address added yet.',
    [form.address]
  );

  const handleFieldChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleAddressChange = (key, value) => {
    setForm((current) => ({
      ...current,
      address: {
        ...current.address,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        address: form.address
      });
      setStatus({ type: 'success', message: 'Your account details were updated successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <BackButton fallbackTo="/" label="Back" />
      <SectionHeading
        eyebrow="My Account"
        title="Your Raes Boutique profile"
        description="Edit your personal details, keep your delivery address ready, and move through orders with ease."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.92fr,1.08fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-boutique-maroon p-8 text-white shadow-luxe">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-boutique-gold">
                <UserRound size={28} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Account</p>
                <h2 className="mt-2 font-display text-4xl">{user?.name || 'Boutique Member'}</h2>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-white/10 p-3 text-boutique-gold">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Email</p>
                  <p className="mt-2 text-sm text-white/78">{user?.email || 'Not available'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-white/10 p-3 text-boutique-gold">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Phone</p>
                  <p className="mt-2 text-sm text-white/78">{user?.phone || 'Not added yet'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-white/10 p-3 text-boutique-gold">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Saved Delivery Address</p>
                  <p className="mt-2 text-sm leading-6 text-white/78">{addressPreview}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-soft">
            <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Quick Access</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link to="/orders" className="rounded-[1.5rem] bg-boutique-background p-5 transition hover:bg-boutique-gold/18">
                <p className="font-medium text-boutique-maroon">My Orders</p>
                <p className="mt-2 text-sm text-boutique-ink/62">Track current and past boutique orders.</p>
              </Link>
              <Link to="/wishlist" className="rounded-[1.5rem] bg-boutique-background p-5 transition hover:bg-boutique-gold/18">
                <p className="font-medium text-boutique-maroon">Wishlist</p>
                <p className="mt-2 text-sm text-boutique-ink/62">Return to the pieces you saved.</p>
              </Link>
              <Link to="/collections" className="rounded-[1.5rem] bg-boutique-background p-5 transition hover:bg-boutique-gold/18">
                <p className="font-medium text-boutique-maroon">Collections</p>
                <p className="mt-2 text-sm text-boutique-ink/62">Continue exploring the boutique edit.</p>
              </Link>
              <Link to="/contact" className="rounded-[1.5rem] bg-boutique-background p-5 transition hover:bg-boutique-gold/18">
                <p className="font-medium text-boutique-maroon">Contact Boutique</p>
                <p className="mt-2 text-sm text-boutique-ink/62">Reach the store for support and appointments.</p>
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-8 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Editable Details</p>
                <h3 className="mt-3 font-display text-3xl text-boutique-maroon">Personal and delivery information</h3>
              </div>
              {status.type === 'success' ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-medium text-green-700">
                  <CheckCircle2 size={14} />
                  Saved
                </span>
              ) : null}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-boutique-ink/68">Name</span>
                <input
                  value={form.name}
                  onChange={(event) => handleFieldChange('name', event.target.value)}
                  className="w-full rounded-2xl bg-boutique-background px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-boutique-ink/68">Phone</span>
                <input
                  value={form.phone}
                  onChange={(event) => handleFieldChange('phone', event.target.value)}
                  className="w-full rounded-2xl bg-boutique-background px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-boutique-ink/68">Email</span>
                <input
                  value={form.email}
                  readOnly
                  className="w-full rounded-2xl bg-[#f3ede9] px-4 py-3 text-sm text-boutique-ink/55 outline-none"
                />
              </label>
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Delivery Address</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm text-boutique-ink/68">Recipient Name</span>
                  <input
                    value={form.address.fullName}
                    onChange={(event) => handleAddressChange('fullName', event.target.value)}
                    className="w-full rounded-2xl bg-boutique-background px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm text-boutique-ink/68">Address Line 1</span>
                  <input
                    value={form.address.addressLine1}
                    onChange={(event) => handleAddressChange('addressLine1', event.target.value)}
                    className="w-full rounded-2xl bg-boutique-background px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm text-boutique-ink/68">Address Line 2</span>
                  <input
                    value={form.address.addressLine2}
                    onChange={(event) => handleAddressChange('addressLine2', event.target.value)}
                    className="w-full rounded-2xl bg-boutique-background px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-boutique-ink/68">City</span>
                  <input
                    value={form.address.city}
                    onChange={(event) => handleAddressChange('city', event.target.value)}
                    className="w-full rounded-2xl bg-boutique-background px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-boutique-ink/68">State</span>
                  <input
                    value={form.address.state}
                    onChange={(event) => handleAddressChange('state', event.target.value)}
                    className="w-full rounded-2xl bg-boutique-background px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-boutique-ink/68">Postal Code</span>
                  <input
                    value={form.address.postalCode}
                    onChange={(event) => handleAddressChange('postalCode', event.target.value)}
                    className="w-full rounded-2xl bg-boutique-background px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-boutique-ink/68">Country</span>
                  <input
                    value={form.address.country}
                    onChange={(event) => handleAddressChange('country', event.target.value)}
                    className="w-full rounded-2xl bg-boutique-background px-4 py-3 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
                  />
                </label>
              </div>
            </div>

            {status.type === 'error' ? <p className="mt-5 text-sm text-red-600">{status.message}</p> : null}
            {status.type === 'success' ? <p className="mt-5 text-sm text-green-700">{status.message}</p> : null}

            <button type="submit" disabled={isLoading} className="gold-button mt-8">
              {isLoading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>

          <div className="rounded-[2rem] bg-white p-8 shadow-soft">
            <p className="text-xs uppercase tracking-[0.32em] text-boutique-gold">Session</p>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-boutique-maroon px-6 py-3 text-sm text-white transition hover:bg-boutique-gold hover:text-boutique-maroon"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountPage;

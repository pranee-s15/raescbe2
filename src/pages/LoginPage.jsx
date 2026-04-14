import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IS_FRONTEND_ONLY } from '../api/client';
import SectionHeading from '../components/shared/SectionHeading';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, isAdmin, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [demoOpening, setDemoOpening] = useState(false);

  // 🔥 Redirect if already logged in
  useEffect(() => {
    if (user?.role === 'admin' || isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate, user]);

  // 🔥 Handle login submit (CORRECT VERSION)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const userData = await login(form);

      navigate(
        userData?.role === 'admin'
          ? '/admin'
          : location.state?.redirect || '/collections'
      );

    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openAdminDashboard = async () => {
    setError('');
    setDemoOpening(true);

    try {
      await login({
        email: 'admin@raesboutique.com',
        password: 'Admin@123'
      });
      navigate('/admin');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setDemoOpening(false);
    }
  };

  // 🔥 Demo admin autofill
  const useDemoAdmin = () => {
    setError('');
    setForm({
      email: 'admin@raesboutique.com',
      password: 'Admin@123',
    });
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
      <div className="relative grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute right-0 top-0 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-boutique-maroon shadow-soft transition hover:bg-boutique-gold"
          aria-label="Close login page"
        >
          <X size={18} />
        </button>

        {/* LEFT SIDE */}
        <div className="rounded-[1.6rem] bg-boutique-maroon p-5 text-white shadow-luxe md:rounded-[2rem] md:p-8">
          <p className="text-xs uppercase tracking-[0.42em] text-boutique-gold">
            Member Login
          </p>

          <h1 className="mt-4 font-display text-[2.1rem] leading-tight md:mt-6 md:text-5xl">
            Return to your curated boutique space.
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-white/75">
            Sign in to manage wishlist selections, complete checkout, and review recent orders.
          </p>

          <div className="mt-6 rounded-[1.35rem] border border-white/12 bg-white/8 p-4 md:mt-8 md:rounded-[1.5rem] md:p-5">
            <p className="text-xs uppercase tracking-[0.34em] text-boutique-gold">
              Demo Admin Access
            </p>

            <p className="mt-4 text-sm text-white/78">
              {IS_FRONTEND_ONLY
                ? 'Frontend-only mode is active. User login and demo admin login both work locally in this browser.'
                : 'Use these credentials on this same login page to open the admin dashboard.'}
            </p>

            <p className="mt-4 text-sm text-white/92">
              Email: <span className="font-medium text-boutique-gold">admin@raesboutique.com</span>
            </p>

            <p className="mt-1 text-sm text-white/92">
              Password: <span className="font-medium text-boutique-gold">Admin@123</span>
            </p>

            <button
              type="button"
              onClick={useDemoAdmin}
              className="mt-5 inline-flex rounded-full border border-boutique-gold/50 px-5 py-2 text-sm font-medium text-boutique-gold transition hover:bg-boutique-gold hover:text-boutique-maroon"
            >
              Use Demo Admin
            </button>
            <button
              type="button"
              onClick={openAdminDashboard}
              className="mt-3 inline-flex rounded-full bg-boutique-gold px-5 py-2 text-sm font-medium text-boutique-maroon transition hover:bg-white"
            >
              {demoOpening ? 'Opening Dashboard...' : 'Open Admin Dashboard'}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <form onSubmit={handleSubmit} className="rounded-[1.6rem] bg-white p-5 shadow-soft md:rounded-[2rem] md:p-8">
          <SectionHeading
            title="Login"
            description={IS_FRONTEND_ONLY ? 'Frontend-only demo access is active in this browser.' : 'Access your Raes Boutique account.'}
          />

          <div className="mt-8 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              className="w-full rounded-2xl bg-boutique-background px-4 py-3 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              className="w-full rounded-2xl bg-boutique-background px-4 py-3 outline-none"
              required
            />
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || demoOpening}
            className="gold-button mt-8 w-full justify-center"
          >
            {submitting ? 'Signing In...' : 'Login'}
          </button>

          <p className="mt-5 text-sm text-boutique-ink/65">
            New here?{' '}
            <Link
              to="/signup"
              className="text-boutique-maroon underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </form>

      </div>
    </section>
  );
};

export default LoginPage;

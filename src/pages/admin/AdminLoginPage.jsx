import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoMark from '../../components/shared/LogoMark';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, logout, isLoading } = useAuth();
  const [form, setForm] = useState({
    email: 'admin@raesboutique.com',
    password: 'Admin@123'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const user = await login(form);

      if (user.role !== 'admin') {
        logout();
        throw new Error('This account does not have admin access.');
      }

      navigate('/admin');
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-boutique-background px-4 py-8 md:py-12">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="rounded-[1.6rem] bg-boutique-maroon p-5 text-white shadow-luxe md:rounded-[2rem] md:p-8">
          <LogoMark className="h-16 w-16" />
          <p className="mt-8 text-xs uppercase tracking-[0.42em] text-boutique-gold">Hidden Admin Access</p>
          <h1 className="mt-4 font-display text-[2.1rem] leading-tight md:mt-6 md:text-5xl">Control the boutique experience with precision.</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/74">
            Manage products, monitor revenue, review orders, and update delivery statuses from the secure dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[1.6rem] bg-white p-5 shadow-soft md:rounded-[2rem] md:p-8">
          <p className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Admin Login</p>
          <h2 className="mt-4 font-display text-4xl text-boutique-maroon">Sign in to dashboard</h2>

          <div className="mt-8 space-y-4">
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-2xl bg-boutique-background px-4 py-3 outline-none"
              required
            />
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-2xl bg-boutique-background px-4 py-3 outline-none"
              required
            />
          </div>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          <button type="submit" disabled={isLoading} className="gold-button mt-8 w-full justify-center">
            {isLoading ? 'Signing In...' : 'Open Dashboard'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLoginPage;

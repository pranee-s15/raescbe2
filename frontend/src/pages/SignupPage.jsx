import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeading from '../components/shared/SectionHeading';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await signup(form);
      navigate('/collections');
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <SectionHeading
            eyebrow="Create Account"
            title="Join the Raes Boutique community"
            description="Save your wishlist, complete checkout, and explore boutique recommendations."
          />
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] bg-boutique-maroon p-8 text-white shadow-luxe">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-2xl bg-white/10 px-4 py-3 outline-none placeholder:text-white/45"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-2xl bg-white/10 px-4 py-3 outline-none placeholder:text-white/45"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              className="w-full rounded-2xl bg-white/10 px-4 py-3 outline-none placeholder:text-white/45"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-2xl bg-white/10 px-4 py-3 outline-none placeholder:text-white/45"
              required
            />
          </div>
          {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
          <button type="submit" disabled={isLoading} className="mt-8 w-full rounded-full bg-boutique-gold px-6 py-3 text-sm font-medium text-boutique-maroon transition hover:bg-white">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
          <p className="mt-5 text-sm text-white/72">
            Already have an account?{' '}
            <Link to="/login" className="text-boutique-gold underline underline-offset-4">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignupPage;

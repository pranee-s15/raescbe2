import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeading from '../components/shared/SectionHeading';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password must match.');
      return;
    }

    setSubmitting(true);

    try {
      await signup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      navigate('/collections');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="rounded-[1.6rem] bg-white p-5 shadow-soft md:rounded-[2rem] md:p-8">
          <SectionHeading
            eyebrow="Create Account"
            title="Join the Raes Boutique community"
            description="Save your wishlist, complete checkout, and explore boutique recommendations."
          />
        </div>

        <form onSubmit={handleSubmit} className="rounded-[1.6rem] bg-boutique-maroon p-5 text-white shadow-luxe md:rounded-[2rem] md:p-8">
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl bg-white/10 px-4 py-3 pr-12 outline-none placeholder:text-white/45"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 transition hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                className="w-full rounded-2xl bg-white/10 px-4 py-3 pr-12 outline-none placeholder:text-white/45"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 transition hover:text-white"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
          <button type="submit" disabled={submitting} className="mt-8 w-full rounded-full bg-boutique-gold px-6 py-3 text-sm font-medium text-boutique-maroon transition hover:bg-white">
            {submitting ? 'Creating Account...' : 'Sign Up'}
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

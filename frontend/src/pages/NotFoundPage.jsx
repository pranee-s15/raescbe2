import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <section className="flex min-h-screen items-center justify-center bg-boutique-background px-4">
    <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft">
      <p className="text-xs uppercase tracking-[0.36em] text-boutique-gold">404</p>
      <h1 className="mt-5 font-display text-5xl text-boutique-maroon">Page not found</h1>
      <Link to="/" className="gold-button mt-6 inline-flex">
        Back to Home
      </Link>
    </div>
  </section>
);

export default NotFoundPage;

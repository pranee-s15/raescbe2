import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Banner from './Banner';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-boutique-background text-boutique-ink">
      <Banner />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

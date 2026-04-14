import { Heart, Menu, PackageCheck, Search, ShoppingBag, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import LogoMark from '../shared/LogoMark';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/collections' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' }
];

const Navbar = () => {
  const { user, wishlistIds } = useAuth();
  const { cartCount } = useShop();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(`/collections?search=${encodeURIComponent(searchValue)}`);
    setOpen(false);
  };

  const openLoginDestination = async () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/account');
      setOpen(false);
      return;
    }

    navigate('/login');
    setOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `transition hover:text-boutique-gold ${isActive ? 'text-boutique-gold' : 'text-current'}`;

  return (
    <nav
      className={`sticky z-40 border-b border-white/10 transition-all duration-500 ${
        scrolled
          ? 'top-9 bg-boutique-background/98 shadow-soft backdrop-blur-xl'
          : 'top-9 bg-boutique-background/92 backdrop-blur-lg'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 text-boutique-maroon md:gap-4 md:px-6 md:py-4 lg:px-8">
        <Link to="/" className="min-w-0 flex-1 lg:flex-none">
          <LogoMark
            className="h-12 w-12 md:h-16 md:w-16"
            withText
            titleClassName="text-boutique-gold text-[1.35rem] md:text-[2rem]"
            subtitleClassName="text-boutique-maroon text-[1rem] md:text-[1.45rem]"
          />
        </Link>

        <div className="hidden items-center gap-10 text-sm font-medium lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <form
            onSubmit={submitSearch}
            className={`flex h-11 items-center overflow-hidden rounded-full bg-white shadow-soft transition-all duration-500 ${
              searchOpen ? 'w-64 px-3' : 'w-11 justify-center px-0'
            }`}
          >
            <button
              type="button"
              onClick={() => setSearchOpen((current) => !current)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-boutique-maroon"
              aria-label="Toggle search"
            >
              <Search size={17} strokeWidth={2.1} />
            </button>
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search collections"
              className={`w-full bg-transparent text-sm text-boutique-ink outline-none transition ${
                searchOpen ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </form>

          <Link to="/wishlist" className="relative rounded-full bg-white p-3 text-boutique-maroon shadow-soft transition hover:bg-boutique-gold">
            <Heart size={18} />
            {wishlistIds.length ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-boutique-maroon px-1 text-[10px] text-white">
                {wishlistIds.length}
              </span>
            ) : null}
          </Link>

          <Link to="/cart" className="relative rounded-full bg-white p-3 text-boutique-maroon shadow-soft transition hover:bg-boutique-gold">
            <ShoppingBag size={18} />
            {cartCount ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-boutique-maroon px-1 text-[10px] text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>

          <Link
            to={user ? '/orders' : '/login'}
            className="rounded-full bg-white p-3 text-boutique-maroon shadow-soft transition hover:bg-boutique-gold"
            aria-label="View orders"
          >
            <PackageCheck size={18} />
          </Link>

          <button
            type="button"
            onClick={openLoginDestination}
            className="rounded-full bg-white p-3 text-boutique-maroon shadow-soft transition hover:bg-boutique-gold"
            aria-label={user?.role === 'admin' ? 'Open admin dashboard' : user ? 'Open account page' : 'Login'}
          >
            <User size={18} />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <Link
            to="/wishlist"
            className="relative rounded-full bg-white p-3 text-boutique-maroon shadow-soft"
            aria-label="Open wishlist"
          >
            <Heart size={17} />
            {wishlistIds.length ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-boutique-maroon px-1 text-[10px] text-white">
                {wishlistIds.length}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={openLoginDestination}
            className="rounded-full bg-white p-3 text-boutique-maroon shadow-soft"
            aria-label={user?.role === 'admin' ? 'Open admin dashboard' : user ? 'Open account page' : 'Login'}
          >
            <User size={17} />
          </button>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="rounded-full bg-white p-3 text-boutique-maroon shadow-soft"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-boutique-gold/15 bg-boutique-background px-4 pb-6 pt-4 lg:hidden">
          <form onSubmit={submitSearch} className="mb-4 flex rounded-full bg-white px-4 py-3 shadow-soft">
            <Search size={16} className="mr-3 text-boutique-maroon" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search collections"
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
          <div className="flex flex-col gap-4 text-sm text-boutique-maroon">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/wishlist" onClick={() => setOpen(false)}>
              Wishlist ({wishlistIds.length})
            </Link>
            <Link to="/cart" onClick={() => setOpen(false)}>
              Cart ({cartCount})
            </Link>
            <Link to={user ? '/orders' : '/login'} onClick={() => setOpen(false)}>
              Orders
            </Link>
            <button type="button" onClick={openLoginDestination} className="text-left">
              {user ? (user.role === 'admin' ? 'Admin Dashboard' : 'My Account') : 'Login'}
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;

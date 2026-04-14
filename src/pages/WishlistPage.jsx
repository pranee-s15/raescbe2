import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import BackButton from '../components/shared/BackButton';
import ProductCard from '../components/shared/ProductCard';
import SectionHeading from '../components/shared/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

const WishlistPage = () => {
  const { wishlistIds, toggleWishlist } = useAuth();
  const { addToCart } = useShop();
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    apiRequest('/products').then(setAllProducts).catch(() => setAllProducts([]));
  }, []);

  const wishlistedProducts = useMemo(
    () => allProducts.filter((product) => wishlistIds.includes(product._id)),
    [allProducts, wishlistIds]
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <BackButton fallbackTo="/account" label="Back" />
      <SectionHeading
        eyebrow="Wishlist"
        title="Saved boutique favorites"
        description="A focused edit of the pieces you want to revisit."
      />

      {wishlistedProducts.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {wishlistedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              isWishlisted
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[2rem] bg-white p-10 text-center shadow-soft">
          <h3 className="font-display text-4xl text-boutique-maroon">No wishlist items yet</h3>
          <p className="mt-4 text-sm text-boutique-ink/65">Save your favorite pieces as you browse the collections.</p>
          <Link to="/collections" className="gold-button mt-6 inline-flex">
            Start Exploring
          </Link>
        </div>
      )}
    </section>
  );
};

export default WishlistPage;

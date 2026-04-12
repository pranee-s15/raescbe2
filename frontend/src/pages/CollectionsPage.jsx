import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../api/client';
import ProductCard from '../components/shared/ProductCard';
import SectionHeading from '../components/shared/SectionHeading';
import { categories, fabrics, priceRanges } from '../data/site';
import { applyProductFilters, sampleProducts } from '../data/sampleProducts';

const colorOptions = ['Maroon', 'Gold', 'White', 'Red', 'Pink', 'Beige'];

const CollectionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      color: searchParams.get('color') || '',
      fabric: searchParams.get('fabric') || '',
      category: searchParams.get('category') || '',
      sort: searchParams.get('sort') || 'latest',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || ''
    }),
    [searchParams]
  );

  useEffect(() => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query.set(key, value);
      }
    });

    setLoading(true);
    apiRequest(`/products?${query.toString()}`)
      .then((data) => setProducts(data))
      .catch(() => setProducts(applyProductFilters(sampleProducts, filters)))
      .finally(() => setLoading(false));
  }, [filters]);

  const updateFilters = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const activePrice = priceRanges.find(
    (range) => String(range.min) === filters.minPrice && String(range.max) === filters.maxPrice
  );

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-16 md:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Collections"
          title="Luxury boutique collections"
          description="Filter by fabric, category, price, and tone without interrupting the browsing flow."
        />
        <div className="rounded-full bg-white px-5 py-3 text-sm text-boutique-ink/65 shadow-soft">
          {products.length} products
        </div>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[250px,1fr]">
        <aside className="h-fit self-start space-y-5 rounded-[1.6rem] bg-white p-5 shadow-soft">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Search</p>
            <input
              value={filters.search}
              onChange={(event) => updateFilters({ search: event.target.value })}
              placeholder="Find a boutique style"
              className="mt-3 w-full rounded-xl bg-boutique-background px-3.5 py-2.5 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
            />
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Sort</span>
            <select
              value={filters.sort}
              onChange={(event) => updateFilters({ sort: event.target.value })}
              className="mt-3 w-full rounded-xl bg-boutique-background px-3.5 py-2.5 text-sm outline-none"
            >
              <option value="latest">New to Old</option>
              <option value="oldest">Old to New</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Category</span>
            <select
              value={filters.category}
              onChange={(event) => updateFilters({ category: event.target.value })}
              className="mt-3 w-full rounded-xl bg-boutique-background px-3.5 py-2.5 text-sm outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.title} value={category.title}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Fabric</span>
            <select
              value={filters.fabric}
              onChange={(event) => updateFilters({ fabric: event.target.value })}
              className="mt-3 w-full rounded-xl bg-boutique-background px-3.5 py-2.5 text-sm outline-none"
            >
              <option value="">All Fabrics</option>
              {fabrics.map((fabric) => (
                <option key={fabric} value={fabric}>
                  {fabric}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Color</span>
            <select
              value={filters.color}
              onChange={(event) => updateFilters({ color: event.target.value })}
              className="mt-3 w-full rounded-xl bg-boutique-background px-3.5 py-2.5 text-sm outline-none"
            >
              <option value="">All Colors</option>
              {colorOptions.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Price</span>
            <div className="mt-3 flex flex-col gap-3">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  type="button"
                  onClick={() =>
                    updateFilters({
                      minPrice: String(range.min),
                      maxPrice: String(range.max)
                    })
                  }
                  className={`rounded-xl px-3.5 py-2.5 text-left text-sm transition ${
                    activePrice?.label === range.label
                      ? 'bg-boutique-maroon text-white'
                      : 'bg-boutique-background text-boutique-ink/70 hover:bg-boutique-gold/20'
                  }`}
                >
                  {range.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSearchParams(new URLSearchParams())}
                className="rounded-xl bg-boutique-background px-3.5 py-2.5 text-left text-sm text-boutique-maroon"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[290px] animate-pulse rounded-[1.4rem] bg-white shadow-soft" />
              ))}
            </div>
          ) : products.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft">
              <h3 className="font-display text-4xl text-boutique-maroon">No products matched this edit</h3>
              <p className="mt-4 text-sm text-boutique-ink/65">Try switching filters to discover more pieces.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CollectionsPage;

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
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

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

  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  useEffect(() => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query.set(key, value);
      }
    });

    setProducts(applyProductFilters(sampleProducts, filters));
    setLoading(true);
    apiRequest(`/products?${query.toString()}`)
      .then((data) =>
        setProducts(
          Array.isArray(data) && data.length
            ? data
            : applyProductFilters(sampleProducts, filters)
        )
      )
      .catch(() => setProducts(applyProductFilters(sampleProducts, filters)))
      .finally(() => setLoading(false));
  }, [filters]);

  const applyFilters = (nextFilters = draftFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const updateDraftFilters = (next) => {
    setDraftFilters((current) => ({
      ...current,
      ...next
    }));
  };

  const resetFilters = () => {
    const clearedFilters = {
      search: '',
      color: '',
      fabric: '',
      category: '',
      sort: 'latest',
      minPrice: '',
      maxPrice: ''
    };

    setDraftFilters(clearedFilters);
    setSearchParams(new URLSearchParams());
  };

  const activePrice = priceRanges.find(
    (range) => String(range.min) === draftFilters.minPrice && String(range.max) === draftFilters.maxPrice
  );
  const showLoadingSkeleton = loading && !products.length;

  return (
    <section className="mx-auto max-w-7xl overflow-x-hidden px-4 pb-16 pt-16 md:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 md:gap-6">
        <SectionHeading
          eyebrow="Collections"
          title="Luxury boutique collections"
          description="Filter by fabric, category, price, and tone without interrupting the browsing flow."
        />
        <div className="rounded-full bg-white px-5 py-3 text-sm text-boutique-ink/65 shadow-soft">
          {products.length} products
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 items-start gap-4 xl:grid-cols-[250px,minmax(0,1fr)] xl:gap-6">
        <aside className="sticky top-28 z-20 h-fit self-start rounded-[1.2rem] bg-white p-2.5 shadow-soft md:rounded-[1.6rem] md:p-5">
          <div className="flex items-center justify-between gap-3 xl:hidden">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-boutique-gold">Filters</p>
              <p className="mt-1 text-xs text-boutique-ink/60">Search, sort, color, fabric and price</p>
            </div>
            <button
              type="button"
              onClick={() => setFilterOpen((current) => !current)}
              className="rounded-full bg-boutique-background px-4 py-2 text-xs font-medium text-boutique-maroon"
            >
              {filterOpen ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className={`${filterOpen ? 'mt-3 grid' : 'hidden'} gap-2.5 md:grid-cols-2 xl:mt-0 xl:grid xl:grid-cols-1 xl:gap-5`}>
          <div className="md:col-span-2 xl:col-span-1">
            <p className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Search</p>
            <input
              value={draftFilters.search}
              onChange={(event) => setDraftFilters((current) => ({ ...current, search: event.target.value }))}
              placeholder="Find a boutique style"
              className="mt-2 w-full rounded-xl bg-boutique-background px-3 py-2.5 text-sm outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
            />
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Sort</span>
            <select
              value={draftFilters.sort}
              onChange={(event) => updateDraftFilters({ sort: event.target.value })}
              className="mt-2 w-full rounded-xl bg-boutique-background px-3 py-2.5 text-sm outline-none"
            >
              <option value="latest">New to Old</option>
              <option value="oldest">Old to New</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Category</span>
            <select
              value={draftFilters.category}
              onChange={(event) => updateDraftFilters({ category: event.target.value })}
              className="mt-2 w-full rounded-xl bg-boutique-background px-3 py-2.5 text-sm outline-none"
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
              value={draftFilters.fabric}
              onChange={(event) => updateDraftFilters({ fabric: event.target.value })}
              className="mt-2 w-full rounded-xl bg-boutique-background px-3 py-2.5 text-sm outline-none"
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
              value={draftFilters.color}
              onChange={(event) => updateDraftFilters({ color: event.target.value })}
              className="mt-2 w-full rounded-xl bg-boutique-background px-3 py-2.5 text-sm outline-none"
            >
              <option value="">All Colors</option>
              {colorOptions.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2 xl:col-span-1">
            <span className="text-xs uppercase tracking-[0.36em] text-boutique-gold">Price</span>
            <div className="mt-2 grid grid-cols-2 gap-2 xl:grid-cols-1 xl:gap-3">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  type="button"
                  onClick={() =>
                    updateDraftFilters({
                      minPrice: String(range.min),
                      maxPrice: String(range.max)
                    })
                  }
                  className={`rounded-xl px-3 py-2.5 text-left text-xs transition md:text-sm ${
                    activePrice?.label === range.label
                      ? 'bg-boutique-maroon text-white'
                      : 'bg-boutique-background text-boutique-ink/70 hover:bg-boutique-gold/20'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 xl:grid-cols-1">
            <button
              type="button"
              onClick={() => applyFilters()}
              className="rounded-xl bg-boutique-maroon px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#580c16]"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl bg-boutique-background px-3 py-2.5 text-sm text-boutique-maroon transition hover:bg-boutique-gold/20"
            >
              Reset
            </button>
          </div>
          </div>
        </aside>

        <div className="min-w-0">
          {showLoadingSkeleton ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[290px] animate-pulse rounded-[1.4rem] bg-white shadow-soft" />
              ))}
            </div>
          ) : products.length ? (
            <>
              {loading ? (
                <div className="mb-3 rounded-full bg-white px-4 py-2 text-xs text-boutique-ink/55 shadow-soft md:mb-4 md:inline-flex">
                  Refreshing collection...
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            </>
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

import { useEffect, useState } from 'react';

const initialState = {
  name: '',
  price: '',
  description: '',
  fabric: 'Silk',
  category: 'Sarees',
  color: 'Maroon',
  badge: '',
  stock: '',
  featured: false
};

const AdminProductForm = ({ product, onSubmit, onCancel, isSaving }) => {
  const [form, setForm] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        fabric: product.fabric || 'Silk',
        category: product.category || 'Sarees',
        color: product.color || 'Maroon',
        badge: product.badge || '',
        stock: product.stock || '',
        featured: Boolean(product.featured)
      });
    } else {
      setForm(initialState);
      setImageFile(null);
    }
  }, [product]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (imageFile) {
      payload.append('image', imageFile);
    }
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-boutique-gold/10 bg-white p-6 shadow-soft">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-boutique-gold">Product Management</p>
        <h3 className="mt-2 font-section text-[1.75rem] leading-tight tracking-[-0.02em] text-boutique-maroon md:text-[1.95rem]">
          {product ? 'Edit boutique product' : 'Add boutique product'}
        </h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Price', name: 'price', type: 'number' },
          { label: 'Fabric', name: 'fabric', type: 'text' },
          { label: 'Category', name: 'category', type: 'text' },
          { label: 'Color', name: 'color', type: 'text' },
          { label: 'Badge', name: 'badge', type: 'text' },
          { label: 'Stock', name: 'stock', type: 'number' }
        ].map((field) => (
          <label key={field.name} className="block text-sm">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-boutique-ink/60">{field.label}</span>
            <input
              name={field.name}
              type={field.type}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full rounded-2xl bg-boutique-background px-4 py-3 outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
              required={field.name !== 'badge'}
            />
          </label>
        ))}
      </div>

      <label className="block text-sm">
        <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-boutique-ink/60">Description</span>
        <textarea
          name="description"
          rows="4"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-2xl bg-boutique-background px-4 py-3 outline-none ring-1 ring-transparent transition focus:ring-boutique-gold"
          required
        />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-3 text-sm text-boutique-maroon">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          Featured product
        </label>
        <label className="text-sm">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-boutique-ink/60">Image upload placeholder</span>
          <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-boutique-maroon px-6 py-3 text-sm text-white transition hover:bg-boutique-gold hover:text-boutique-maroon disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </button>
        {product ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-boutique-background px-6 py-3 text-sm text-boutique-maroon"
          >
            Cancel Edit
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default AdminProductForm;

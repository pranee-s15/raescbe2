import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/client';
import AdminCharts from '../../components/admin/AdminCharts';
import AdminOrdersTable from '../../components/admin/AdminOrdersTable';
import AdminProductForm from '../../components/admin/AdminProductForm';
import LogoMark from '../../components/shared/LogoMark';
import { useAuth } from '../../context/AuthContext';

const tabs = ['Overview', 'Products', 'Orders', 'Analytics'];
const demoProducts = [
  {
    _id: 'demo-product-1',
    name: 'Temple Gold Kanchipuram Saree',
    price: 1890,
    description: 'Regal silk drape with refined zari borders.',
    category: 'Sarees'
  },
  {
    _id: 'demo-product-2',
    name: 'Pearl Chiffon Salwar Edit',
    price: 1990,
    description: 'Flowing chiffon set with polished boutique finishing.',
    category: 'Salwars'
  },
  {
    _id: 'demo-product-3',
    name: 'Heritage Banarasi Chudi Material',
    price: 2590,
    description: 'Celebration-ready Banarasi material with woven richness.',
    category: 'Chudi Materials'
  }
];

const demoUsers = [
  {
    _id: 'demo-user-1',
    name: 'Raes Admin',
    email: 'admin@raesboutique.com',
    createdAt: '2026-04-10T10:30:00.000Z'
  },
  {
    _id: 'demo-user-2',
    name: 'Ahalya Raman',
    email: 'ahalya@example.com',
    createdAt: '2026-04-11T09:15:00.000Z'
  }
];

const demoOrders = [
  {
    _id: 'demo-order-1',
    user: { name: 'Ahalya Raman', email: 'ahalya@example.com' },
    status: 'Ordered',
    totalAmount: 14999,
    createdAt: '2026-04-12T10:15:00.000Z'
  },
  {
    _id: 'demo-order-2',
    user: { name: 'Meera S', email: 'meera@example.com' },
    status: 'Delivered',
    totalAmount: 3500,
    createdAt: '2026-04-12T13:40:00.000Z'
  },
  {
    _id: 'demo-order-3',
    user: { name: 'Lavanya K', email: 'lavanya@example.com' },
    status: 'Shipped',
    totalAmount: 32400,
    createdAt: '2026-04-11T16:05:00.000Z'
  }
];

const demoStats = {
  totals: {
    users: 24,
    orders: 18,
    products: 9,
    revenue: 186500,
    todayRevenue: 18500,
    yesterdayRevenue: 32400
  },
  recentOrders: demoOrders
};

const demoAnalytics = {
  monthlyRevenue: [
    { _id: { month: 1 }, revenue: 42000, orders: 4 },
    { _id: { month: 2 }, revenue: 51500, orders: 5 },
    { _id: { month: 3 }, revenue: 93000, orders: 9 }
  ],
  topProducts: [
    { _id: 'Temple Gold Kanchipuram Saree', quantitySold: 7, revenue: 104993 },
    { _id: 'Pearl Chiffon Salwar Edit', quantitySold: 5, revenue: 27495 }
  ],
  dailyRevenue: {
    today: {
      revenue: 18500,
      orders: 2
    },
    yesterday: {
      revenue: 32400,
      orders: 3
    }
  }
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { token, user, logout, demoUsers: authDemoUsers } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const isDemoMode = user?.isDemoMode;

  const loadDemoDashboard = () => {
    const mergedDemoUsers = [
      ...authDemoUsers,
      ...demoUsers.filter((demoUser) => !authDemoUsers.some((user) => user.email === demoUser.email))
    ].sort((first, second) => new Date(second.createdAt || 0).getTime() - new Date(first.createdAt || 0).getTime());

    setStats({
      ...demoStats,
      totals: {
        ...demoStats.totals,
        users: mergedDemoUsers.length
      }
    });
    setAnalytics(demoAnalytics);
    setProducts(demoProducts);
    setOrders(demoOrders);
    setUsers(mergedDemoUsers);
  };

  const fetchDashboardData = async () => {
    if (isDemoMode) {
      loadDemoDashboard();
      return;
    }

    const [statsData, analyticsData, productsData, ordersData, usersData] = await Promise.all([
      apiRequest('/admin/dashboard', { token }),
      apiRequest('/admin/analytics', { token }),
      apiRequest('/admin/products', { token }),
      apiRequest('/admin/orders', { token }),
      apiRequest('/admin/users', { token })
    ]);

    setStats(statsData);
    setAnalytics(analyticsData);
    setProducts(productsData);
    setOrders(ordersData);
    setUsers(usersData);
  };

  useEffect(() => {
    fetchDashboardData().catch(() => {
      if (isDemoMode) {
        loadDemoDashboard();
        return;
      }

      logout();
      navigate('/admin-login');
    });
  }, [isDemoMode, authDemoUsers]);

  const sortedUsers = useMemo(() => users.slice(0, 6), [users]);

  const handleProductSubmit = async (payload) => {
    if (isDemoMode) {
      return;
    }

    setIsSaving(true);

    try {
      if (editingProduct) {
        await apiRequest(`/admin/products/${editingProduct._id}`, {
          method: 'PUT',
          token,
          body: payload
        });
      } else {
        await apiRequest('/admin/products', {
          method: 'POST',
          token,
          body: payload
        });
      }

      setEditingProduct(null);
      await fetchDashboardData();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (isDemoMode) {
      return;
    }

    await apiRequest(`/admin/products/${productId}`, {
      method: 'DELETE',
      token
    });
    await fetchDashboardData();
  };

  const handleBulkUpload = async () => {
    if (!bulkFile || isDemoMode) {
      return;
    }

    const payload = new FormData();
    payload.append('file', bulkFile);

    await apiRequest('/admin/products/bulk-upload', {
      method: 'POST',
      token,
      body: payload
    });

    setBulkFile(null);
    await fetchDashboardData();
  };

  const handleStatusChange = async (orderId, status) => {
    if (isDemoMode) {
      return;
    }

    await apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      token,
      body: { status }
    });
    await fetchDashboardData();
  };

  return (
    <section className="min-h-screen bg-boutique-background px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[1.6rem] bg-[linear-gradient(135deg,#6B0F1A,#4a0912_62%,#2b050b)] p-4 text-white shadow-luxe md:gap-6 md:rounded-[2rem] md:p-8">
          <div>
            <div className="flex items-center gap-4">
              <LogoMark className="h-16 w-16" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-boutique-gold">Admin Dashboard</p>
                <h1 className="mt-2 font-section text-[1.55rem] leading-tight tracking-[-0.02em] text-white md:text-[2.55rem]">
                  Raes Boutique Control Center
                </h1>
                {isDemoMode ? <p className="mt-2 text-sm text-white/72">Demo admin mode is active.</p> : null}
              </div>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-full px-5 py-3 text-sm transition ${
                  activeTab === tab
                    ? 'bg-boutique-gold text-boutique-maroon shadow-[0_10px_26px_rgba(212,175,55,0.22)]'
                    : 'bg-white/10 text-white hover:bg-white/18'
                }`}
              >
                {tab}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="shrink-0 rounded-full bg-white px-5 py-3 text-sm font-medium text-boutique-maroon transition hover:bg-boutique-gold"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {activeTab === 'Overview' ? (
            <>
              <AdminCharts stats={stats} analytics={analytics} orders={orders} />
              <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
                <div className="rounded-[2rem] border border-boutique-gold/10 bg-white p-6 shadow-soft">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-boutique-gold">Recent Orders</p>
                  <div className="mt-6 space-y-4">
                    {(stats?.recentOrders || []).map((order) => (
                      <div key={order._id} className="rounded-[1.45rem] bg-boutique-background p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-medium text-boutique-maroon">{order.user?.name || 'Customer'}</p>
                            <p className="text-xs text-boutique-ink/55">{order.status}</p>
                          </div>
                          <p className="text-sm text-boutique-ink/65">Rs. {Math.round(order.totalAmount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-boutique-gold/10 bg-white p-6 shadow-soft">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-boutique-gold">Newest Users</p>
                  <div className="mt-6 space-y-4">
                    {sortedUsers.map((user) => (
                      <div key={user._id} className="rounded-[1.45rem] bg-boutique-background p-4">
                        <p className="font-medium text-boutique-maroon">{user.name}</p>
                        <p className="text-xs text-boutique-ink/55">{user.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {activeTab === 'Products' ? (
            <div className="space-y-8">
              <AdminProductForm
                product={editingProduct}
                onSubmit={handleProductSubmit}
                onCancel={() => setEditingProduct(null)}
                isSaving={isSaving}
              />

              <div className="rounded-[2rem] border border-boutique-gold/10 bg-white p-6 shadow-soft">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-boutique-gold">Bulk Upload</p>
                    <p className="mt-2 text-sm text-boutique-ink/65">Upload a CSV with product rows.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <input type="file" accept=".csv" onChange={(event) => setBulkFile(event.target.files?.[0] || null)} />
                    <button type="button" onClick={handleBulkUpload} className="gold-button">
                      Upload CSV
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <div key={product._id} className="rounded-[2rem] border border-boutique-gold/10 bg-white p-5 shadow-soft">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-boutique-gold">{product.category}</p>
                    <h3 className="mt-3 font-section text-[1.3rem] leading-tight tracking-[-0.02em] text-boutique-maroon">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-boutique-maroon/85">Rs. {product.price}</p>
                    <p className="mt-4 text-sm leading-7 text-boutique-ink/65">{product.description}</p>
                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(product)}
                        className="rounded-full bg-boutique-background px-5 py-3 text-sm text-boutique-maroon"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="rounded-full bg-boutique-maroon px-5 py-3 text-sm text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeTab === 'Orders' ? <AdminOrdersTable orders={orders} onChangeStatus={handleStatusChange} /> : null}

          {activeTab === 'Analytics' ? <AdminCharts stats={stats} analytics={analytics} orders={orders} /> : null}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;

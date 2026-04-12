import { useMemo, useState } from 'react';
import StatCard from '../shared/StatCard';

const monthLabel = (month) =>
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1] || 'NA';

const formatDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const hourLabel = (hour) => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour} ${suffix}`;
};

const AdminCharts = ({ stats, analytics, orders = [] }) => {
  const monthlyItems = analytics?.monthlyRevenue || [];
  const maxRevenue = Math.max(...monthlyItems.map((item) => item.revenue), 1);
  const [selectedDate, setSelectedDate] = useState('');

  const { selectedRevenue, selectedOrders, hourlyItems, busiestHour } = useMemo(() => {
    const baseHourlyItems = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      revenue: 0,
      orders: 0
    }));

    const matchingOrders = orders.filter((order) => {
      if (!selectedDate) {
        return false;
      }

      if (!order?.createdAt) {
        return false;
      }

      const createdAt = new Date(order.createdAt);
      return !Number.isNaN(createdAt.getTime()) && formatDateInputValue(createdAt) === selectedDate;
    });

    matchingOrders.forEach((order) => {
      const createdAt = new Date(order.createdAt);
      const hour = createdAt.getHours();
      baseHourlyItems[hour].revenue += Number(order.totalAmount || 0);
      baseHourlyItems[hour].orders += 1;
    });

    const selectedRevenueValue = matchingOrders.reduce((total, order) => total + Number(order.totalAmount || 0), 0);
    const busiestHourItem = [...baseHourlyItems].sort((first, second) => second.revenue - first.revenue)[0];

    return {
      selectedRevenue: selectedRevenueValue,
      selectedOrders: matchingOrders.length,
      hourlyItems: baseHourlyItems,
      busiestHour: busiestHourItem?.revenue ? busiestHourItem : null
    };
  }, [orders, selectedDate]);

  const hourlyMaxRevenue = Math.max(...hourlyItems.map((item) => item.revenue), 1);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={stats?.totals?.users || 0} />
        <StatCard label="Orders" value={stats?.totals?.orders || 0} />
        <StatCard label="Products" value={stats?.totals?.products || 0} />
        <StatCard label="Revenue" value={`Rs. ${Math.round(stats?.totals?.revenue || 0)}`} accent />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <div className="rounded-[2rem] border border-boutique-gold/10 bg-white p-6 shadow-soft">
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-boutique-gold">Sales Charts</p>
            <h3 className="mt-2 font-section text-[1.9rem] leading-tight tracking-[-0.02em] text-boutique-maroon">
              Monthly revenue
            </h3>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {monthlyItems.map((item) => (
              <div key={item._id.month} className="flex flex-col items-center gap-3">
                <div className="flex h-56 w-full items-end">
                  <div
                    className="w-full rounded-t-[1rem] bg-gradient-to-t from-boutique-maroon to-boutique-gold"
                    style={{ height: `${Math.max((item.revenue / maxRevenue) * 100, 8)}%` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-boutique-maroon">{monthLabel(item._id.month)}</p>
                  <p className="text-[11px] text-boutique-ink/55">Rs. {Math.round(item.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-boutique-gold/10 bg-white p-6 shadow-soft">
          <p className="text-[10px] uppercase tracking-[0.3em] text-boutique-gold">Top Products</p>
          <h3 className="mt-2 font-section text-[1.9rem] leading-tight tracking-[-0.02em] text-boutique-maroon">
            Best performers
          </h3>
          <div className="mt-6 space-y-4">
            {(analytics?.topProducts || []).map((item, index) => (
              <div key={item._id} className="rounded-[1.45rem] bg-boutique-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-boutique-gold">#{index + 1}</p>
                    <h4 className="mt-2 font-section text-[1.25rem] leading-snug tracking-[-0.02em] text-boutique-maroon">
                      {item._id}
                    </h4>
                  </div>
                  <div className="text-right text-sm text-boutique-ink/65">
                    <p>{item.quantitySold} sold</p>
                    <p>Rs. {Math.round(item.revenue)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-boutique-gold/10 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-boutique-gold">Daily Revenue</p>
            <h3 className="mt-2 font-section text-[1.9rem] leading-tight tracking-[-0.02em] text-boutique-maroon">
              Revenue by date
            </h3>
            <p className="mt-2 text-sm text-boutique-ink/60">
              Pick a date to open that day&apos;s hourly revenue.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-boutique-gold">Choose date</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-xl border border-boutique-gold/12 bg-boutique-background px-3.5 py-2.5 text-sm text-boutique-maroon outline-none transition focus:border-boutique-gold"
            />
          </label>
        </div>

        {selectedDate ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.45rem] bg-boutique-background p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-boutique-gold">Selected Date Revenue</p>
                <p className="mt-3 font-section text-[1.65rem] leading-none tracking-[-0.03em] text-boutique-maroon [font-variant-numeric:tabular-nums]">
                  Rs. {Math.round(selectedRevenue)}
                </p>
              </div>
              <div className="rounded-[1.45rem] bg-boutique-background p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-boutique-gold">Orders Count</p>
                <p className="mt-3 font-section text-[1.65rem] leading-none tracking-[-0.03em] text-boutique-maroon [font-variant-numeric:tabular-nums]">
                  {selectedOrders}
                </p>
              </div>
              <div className="rounded-[1.45rem] bg-boutique-background p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-boutique-gold">Peak Hour</p>
                <p className="mt-3 font-section text-[1.4rem] leading-none tracking-[-0.03em] text-boutique-maroon">
                  {busiestHour ? hourLabel(busiestHour.hour) : 'No orders'}
                </p>
                <p className="mt-2 text-sm text-boutique-ink/58">
                  {busiestHour ? `Rs. ${Math.round(busiestHour.revenue)}` : 'No sales on this date'}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {hourlyItems.map((item) => (
                <div key={item.hour} className="rounded-[1.25rem] bg-boutique-background px-3 py-4">
                  <div className="flex h-24 items-end">
                    <div
                      className="w-full rounded-t-[0.8rem] bg-gradient-to-t from-boutique-maroon to-boutique-gold"
                      style={{ height: `${Math.max((item.revenue / hourlyMaxRevenue) * 100, item.revenue ? 14 : 6)}%` }}
                    />
                  </div>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-boutique-maroon">
                    {hourLabel(item.hour)}
                  </p>
                  <p className="mt-2 text-sm text-boutique-ink/65">Rs. {Math.round(item.revenue)}</p>
                  <p className="text-xs text-boutique-ink/50">{item.orders} orders</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-[1.5rem] bg-boutique-background px-5 py-8 text-center">
            <p className="text-sm text-boutique-ink/60">Select a date to view hourly analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCharts;

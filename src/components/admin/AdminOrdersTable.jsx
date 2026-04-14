const statuses = ['Ordered', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled'];

const AdminOrdersTable = ({ orders = [], onChangeStatus }) => (
  <div className="overflow-hidden rounded-[2rem] border border-boutique-gold/10 bg-white shadow-soft">
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-boutique-background text-boutique-maroon">
          <tr>
            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.24em]">Customer</th>
            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.24em]">Items</th>
            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.24em]">Amount</th>
            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.24em]">Payment</th>
            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.24em]">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length ? (
            orders.map((order) => {
              const itemCount = Array.isArray(order.items) ? order.items.length : 0;

              return (
                <tr key={order._id} className="border-t border-boutique-background/90">
                  <td className="px-6 py-4">
                    <p className="font-medium text-boutique-maroon">{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-boutique-ink/55">{order.user?.email || 'No email available'}</p>
                  </td>
                  <td className="px-6 py-4 text-boutique-ink/70">{itemCount} items</td>
                  <td className="px-6 py-4 text-boutique-ink/70">Rs. {order.totalAmount ?? 0}</td>
                  <td className="px-6 py-4 text-boutique-ink/70">{order.paymentMethod || 'Not set'}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status || 'Ordered'}
                      onChange={(event) => onChangeStatus(order._id, event.target.value)}
                      className="rounded-full border border-boutique-gold/10 bg-boutique-background px-4 py-2 text-sm text-boutique-maroon outline-none transition focus:border-boutique-gold"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-boutique-ink/60">
                No orders yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminOrdersTable;

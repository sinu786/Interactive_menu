import { useAppStore } from '../../state/store';
import { restaurantConfig } from '../../data/restaurant.config';

export function PaymentsPanel() {
  const orders = useAppStore((s) => s.orders);

  const completedOrders = orders.filter(o => o.status === 'delivered');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingPayments = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const pendingTotal = pendingPayments.reduce((sum, o) => sum + o.total, 0);

  // Simulated payment methods
  const paymentMethods = [
    { method: 'Card (Visa/MC)', amount: totalRevenue * 0.65, percentage: 65, icon: '💳' },
    { method: 'Apple Pay', amount: totalRevenue * 0.20, percentage: 20, icon: '🍎' },
    { method: 'Google Pay', amount: totalRevenue * 0.10, percentage: 10, icon: '📱' },
    { method: 'Cash', amount: totalRevenue * 0.05, percentage: 5, icon: '💵' },
  ];

  // Simulated recent transactions
  const recentTransactions = completedOrders.slice(0, 10).map((order, i) => ({
    id: `TXN-${1000 + i}`,
    orderId: order.id,
    amount: order.total,
    method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)].method,
    status: 'completed' as const,
    time: order.createdAt
  }));

  return (
    <div className="space-y-6">
      {/* Payment Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <span className="text-sm text-stone-500">Total Collected</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">
            {restaurantConfig.currencySymbol}{totalRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 mt-1">{completedOrders.length} transactions</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <span className="text-sm text-stone-500">Pending</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">
            {restaurantConfig.currencySymbol}{pendingTotal.toFixed(2)}
          </p>
          <p className="text-sm text-yellow-600 mt-1">{pendingPayments.length} orders</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <span className="text-sm text-stone-500">Avg. Transaction</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">
            {restaurantConfig.currencySymbol}{(completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0).toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 mt-1">Per order</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span className="text-sm text-stone-500">Success Rate</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">99.2%</p>
          <p className="text-sm text-purple-600 mt-1">Payment success</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-stone-900 mb-6">Payment Methods</h3>
          <div className="space-y-4">
            {paymentMethods.map((pm) => (
              <div key={pm.method} className="flex items-center gap-4">
                <span className="text-2xl">{pm.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-stone-900">{pm.method}</span>
                    <span className="text-sm text-stone-500">{pm.percentage}%</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stone-800 rounded-full"
                      style={{ width: `${pm.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-stone-900 w-24 text-right">
                  {restaurantConfig.currencySymbol}{pm.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Schedule */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-stone-900 mb-6">Payout Schedule</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-700">Next Payout</span>
                <span className="text-sm font-medium text-green-700">Tomorrow</span>
              </div>
              <p className="text-2xl font-bold text-green-800">
                {restaurantConfig.currencySymbol}{(totalRevenue * 0.35).toFixed(2)}
              </p>
            </div>
            
            <div className="p-4 bg-stone-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-600">Last Payout</span>
                <span className="text-sm text-stone-500">Jan 5, 2026</span>
              </div>
              <p className="text-xl font-bold text-stone-900">
                {restaurantConfig.currencySymbol}{(totalRevenue * 0.65).toFixed(2)}
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-600">This Month</span>
                <span className="text-sm text-stone-500">January 2026</span>
              </div>
              <p className="text-xl font-bold text-stone-900">
                {restaurantConfig.currencySymbol}{totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="font-bold text-stone-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Transaction ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Order</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Method</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-stone-900">{txn.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-stone-600">{txn.orderId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-stone-900">{txn.method}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-stone-900">
                      {restaurantConfig.currencySymbol}{txn.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-stone-500">
                      {new Date(txn.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


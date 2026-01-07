import { useAppStore } from '../../state/store';
import { menuItems } from '../../data/menu';
import { restaurantConfig } from '../../data/restaurant.config';

export function AnalyticsPanel() {
  const orders = useAppStore((s) => s.orders);

  // Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const conversionRate = orders.length > 0 ? (completedOrders / orders.length) * 100 : 0;

  // Most ordered items
  const itemCounts: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      itemCounts[item.item.id] = (itemCounts[item.item.id] || 0) + item.quantity;
    });
  });

  const topItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({
      item: menuItems.find(m => m.id === id)!,
      count
    }))
    .filter(i => i.item);

  // Revenue by day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const revenueByDay = last7Days.map(date => {
    const dayOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.toDateString() === date.toDateString();
    });
    return {
      date,
      revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length
    };
  });

  const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue), 100);

  // Category breakdown
  const categoryRevenue: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.item.category;
      categoryRevenue[category] = (categoryRevenue[category] || 0) + (item.item.price * item.quantity);
    });
  });

  const totalCategoryRevenue = Object.values(categoryRevenue).reduce((a, b) => a + b, 0);
  const categoryData = Object.entries(categoryRevenue)
    .sort((a, b) => b[1] - a[1])
    .map(([category, revenue]) => ({
      category,
      revenue,
      percentage: totalCategoryRevenue > 0 ? (revenue / totalCategoryRevenue) * 100 : 0
    }));

  const categoryColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];

  // Weekly comparison
  const thisWeekRevenue = revenueByDay.reduce((sum, d) => sum + d.revenue, 0);
  const lastWeekRevenue = thisWeekRevenue * 0.87; // Simulated 13% growth
  const revenueGrowth = ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <span className="text-sm text-stone-500">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">
            {restaurantConfig.currencySymbol}{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
            +{revenueGrowth.toFixed(1)}% from last week
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <path d="M1 10h22"/>
              </svg>
            </div>
            <span className="text-sm text-stone-500">Avg Order Value</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">
            {restaurantConfig.currencySymbol}{avgOrderValue.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
            +8.2% from last week
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
              </svg>
            </div>
            <span className="text-sm text-stone-500">Total Orders</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{orders.length}</p>
          <p className="text-sm text-purple-600 mt-1">{completedOrders} completed</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span className="text-sm text-stone-500">Completion Rate</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{conversionRate.toFixed(1)}%</p>
          <p className="text-sm text-orange-600 mt-1">Last 7 days</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-stone-900">Revenue (Last 7 Days)</h3>
            <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
              +{revenueGrowth.toFixed(0)}%
            </span>
          </div>
          <div className="space-y-3">
            {revenueByDay.map((day, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm text-stone-500 w-12">
                  {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <div className="flex-1 h-8 bg-stone-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-stone-800 to-stone-600 rounded-lg transition-all duration-500"
                    style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-stone-900 w-20 text-right">
                  {restaurantConfig.currencySymbol}{day.revenue.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between text-sm">
            <span className="text-stone-500">This week total</span>
            <span className="font-bold text-stone-900">
              {restaurantConfig.currencySymbol}{thisWeekRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-stone-900 mb-6">Sales by Category</h3>
          
          {/* Pie chart visualization */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {categoryData.reduce((acc, cat, i) => {
                  const startAngle = acc.offset;
                  acc.elements.push(
                    <circle
                      key={cat.category}
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="transparent"
                      stroke={categoryColors[i % categoryColors.length].replace('bg-', '')}
                      strokeWidth="3"
                      strokeDasharray={`${(cat.percentage / 100) * 100} ${100 - (cat.percentage / 100) * 100}`}
                      strokeDashoffset={-startAngle}
                      className={categoryColors[i % categoryColors.length].replace('bg-', 'stroke-')}
                    />
                  );
                  acc.offset += (cat.percentage / 100) * 100;
                  return acc;
                }, { elements: [] as JSX.Element[], offset: 0 }).elements}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-bold text-stone-900">{categoryData.length}</p>
                  <p className="text-xs text-stone-500">Categories</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              {categoryData.map((cat, i) => (
                <div key={cat.category} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${categoryColors[i % categoryColors.length]}`} />
                  <span className="text-sm text-stone-600 flex-1">{cat.category}</span>
                  <span className="text-sm font-medium text-stone-900">{cat.percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Items */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-bold text-stone-900 mb-6">Top Selling Items</h3>
        <div className="grid md:grid-cols-5 gap-4">
          {topItems.map((entry, i) => (
            <div key={entry.item.id} className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-stone-400' : i === 2 ? 'bg-amber-600' : 'bg-stone-900'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900 truncate">{entry.item.name}</p>
                <p className="text-sm text-stone-500">{entry.count} sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3D & AR Engagement */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">3D & AR Engagement</h3>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">This week</span>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-3xl font-bold">2,847</p>
            <p className="text-stone-300 text-sm">3D Model Views</p>
            <p className="text-green-400 text-xs mt-1">↑ 23% vs last week</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-stone-300 text-sm">AR Sessions</p>
            <p className="text-green-400 text-xs mt-1">↑ 18% vs last week</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-3xl font-bold">43%</p>
            <p className="text-stone-300 text-sm">AR → Order Rate</p>
            <p className="text-green-400 text-xs mt-1">↑ 5% vs last week</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-3xl font-bold">2:34</p>
            <p className="text-stone-300 text-sm">Avg. Session Time</p>
            <p className="text-green-400 text-xs mt-1">↑ 12% vs last week</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-stone-300 mb-3">Most viewed in AR</p>
          <div className="flex gap-3 flex-wrap">
            {topItems.slice(0, 3).map((entry) => (
              <span key={entry.item.id} className="px-3 py-1.5 bg-white/10 rounded-full text-sm">
                {entry.item.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <span className="font-medium text-stone-900">Peak Hours</span>
          </div>
          <p className="text-2xl font-bold text-stone-900 mb-1">12PM - 2PM</p>
          <p className="text-sm text-stone-500">& 6PM - 8PM</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span className="font-medium text-stone-900">Customer Satisfaction</span>
          </div>
          <p className="text-2xl font-bold text-stone-900 mb-1">4.7 / 5.0</p>
          <p className="text-sm text-stone-500">Based on {orders.filter(o => o.rating).length} reviews</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <span className="font-medium text-stone-900">Repeat Customers</span>
          </div>
          <p className="text-2xl font-bold text-stone-900 mb-1">38%</p>
          <p className="text-sm text-stone-500">Of total customers</p>
        </div>
      </div>
    </div>
  );
}

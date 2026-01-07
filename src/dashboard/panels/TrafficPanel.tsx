export function TrafficPanel() {
  // Simulated traffic data
  const hourlyData = [
    { hour: '9AM', visitors: 23 },
    { hour: '10AM', visitors: 45 },
    { hour: '11AM', visitors: 78 },
    { hour: '12PM', visitors: 156 },
    { hour: '1PM', visitors: 189 },
    { hour: '2PM', visitors: 134 },
    { hour: '3PM', visitors: 67 },
    { hour: '4PM', visitors: 45 },
    { hour: '5PM', visitors: 89 },
    { hour: '6PM', visitors: 167 },
    { hour: '7PM', visitors: 234 },
    { hour: '8PM', visitors: 198 },
    { hour: '9PM', visitors: 145 },
    { hour: '10PM', visitors: 67 },
  ];

  const maxVisitors = Math.max(...hourlyData.map(d => d.visitors));

  const deviceData = [
    { device: 'iPhone', count: 456, percentage: 48 },
    { device: 'Android', count: 342, percentage: 36 },
    { device: 'iPad', count: 95, percentage: 10 },
    { device: 'Other', count: 57, percentage: 6 },
  ];

  const sourceData = [
    { source: 'QR Code Scan', count: 634, percentage: 67 },
    { source: 'Direct Link', count: 189, percentage: 20 },
    { source: 'Social Media', count: 95, percentage: 10 },
    { source: 'Other', count: 32, percentage: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Live Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-stone-500">Active Now</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">47</p>
          <p className="text-sm text-green-600 mt-1">+12 in last 5 min</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            <span className="text-sm text-stone-500">Today's Visitors</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">950</p>
          <p className="text-sm text-blue-600 mt-1">+18% vs yesterday</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            <span className="text-sm text-stone-500">QR Scans</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">634</p>
          <p className="text-sm text-purple-600 mt-1">67% of traffic</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="text-sm text-stone-500">Avg. Session</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">3:24</p>
          <p className="text-sm text-orange-600 mt-1">minutes</p>
        </div>
      </div>

      {/* Hourly Traffic Chart */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-bold text-stone-900 mb-6">Visitors Today</h3>
        <div className="flex items-end gap-2 h-48">
          {hourlyData.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-stone-100 rounded-t-lg overflow-hidden" style={{ height: '100%' }}>
                <div
                  className="w-full bg-gradient-to-t from-stone-800 to-stone-600 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(data.visitors / maxVisitors) * 100}%`, marginTop: 'auto' }}
                />
              </div>
              <span className="text-xs text-stone-500 -rotate-45 origin-center">{data.hour}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-sm text-stone-500">
          <span>Peak: 7PM (234 visitors)</span>
          <span>Total: 1,637 visitors</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-stone-900 mb-6">Device Breakdown</h3>
          <div className="space-y-4">
            {deviceData.map((device) => (
              <div key={device.device}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-stone-600">{device.device}</span>
                  <span className="text-sm font-medium text-stone-900">{device.count}</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-stone-800 rounded-full transition-all duration-500"
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-stone-900 mb-6">Traffic Sources</h3>
          <div className="space-y-4">
            {sourceData.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-stone-600">{source.source}</span>
                  <span className="text-sm font-medium text-stone-900">{source.percentage}%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Engagement */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-bold text-stone-900 mb-6">Feature Engagement</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-stone-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-stone-900">87%</p>
            <p className="text-sm text-stone-500">Viewed 3D Models</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-stone-900">43%</p>
            <p className="text-sm text-stone-500">Used AR Feature</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-stone-900">56%</p>
            <p className="text-sm text-stone-500">Filtered Menu</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-stone-900">34%</p>
            <p className="text-sm text-stone-500">Shared Items</p>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-bold text-stone-900 mb-4">Live Activity</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {[
            { action: 'Viewed 3D model', item: 'Lobster with Fries', time: 'Just now', icon: '👁️' },
            { action: 'Used AR preview', item: 'Pizza Ballerina', time: '30s ago', icon: '📱' },
            { action: 'Added to cart', item: 'BBQ Ribs', time: '1m ago', icon: '🛒' },
            { action: 'Placed order', item: '3 items', time: '2m ago', icon: '✅' },
            { action: 'Scanned QR code', item: 'Table 12', time: '3m ago', icon: '📷' },
            { action: 'Viewed 3D model', item: 'Sushi Boat', time: '4m ago', icon: '👁️' },
            { action: 'Shared item', item: 'Classic Burger', time: '5m ago', icon: '📤' },
            { action: 'Used AR preview', item: 'Club Sandwich', time: '6m ago', icon: '📱' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
              <span className="text-xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-stone-900">
                  <span className="font-medium">{activity.action}</span>
                  <span className="text-stone-500"> • {activity.item}</span>
                </p>
              </div>
              <span className="text-xs text-stone-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


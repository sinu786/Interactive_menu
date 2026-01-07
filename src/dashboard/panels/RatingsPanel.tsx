import { useAppStore } from '../../state/store';
import { menuItems } from '../../data/menu';

export function RatingsPanel() {
  const orders = useAppStore((s) => s.orders);
  
  const ratedOrders = orders.filter(o => o.rating);
  const avgRating = ratedOrders.length > 0 
    ? ratedOrders.reduce((sum, o) => sum + (o.rating || 0), 0) / ratedOrders.length 
    : 0;

  // Rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: ratedOrders.filter(o => o.rating === rating).length,
    percentage: ratedOrders.length > 0 
      ? (ratedOrders.filter(o => o.rating === rating).length / ratedOrders.length) * 100 
      : 0
  }));

  // Reviews with feedback
  const reviews = ratedOrders.filter(o => o.feedback).slice(0, 10);

  // Item ratings (simulated)
  const itemRatings = menuItems.map(item => ({
    item,
    rating: 3.5 + Math.random() * 1.5,
    count: Math.floor(Math.random() * 50) + 10
  })).sort((a, b) => b.rating - a.rating);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <span className="text-sm text-stone-500">Average Rating</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{avgRating.toFixed(1)}</p>
          <div className="flex gap-0.5 mt-2">
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= Math.round(avgRating) ? '#eab308' : '#e7e5e4'} stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <span className="text-sm text-stone-500">Total Reviews</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{ratedOrders.length}</p>
          <p className="text-sm text-blue-600 mt-1">{reviews.length} with comments</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
              </svg>
            </div>
            <span className="text-sm text-stone-500">Positive</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">
            {ratedOrders.filter(o => (o.rating || 0) >= 4).length}
          </p>
          <p className="text-sm text-green-600 mt-1">4-5 stars</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span className="text-sm text-stone-500">Response Rate</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">92%</p>
          <p className="text-sm text-purple-600 mt-1">Replied reviews</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-stone-900 mb-6">Rating Distribution</h3>
          <div className="space-y-3">
            {ratingDist.map((rd) => (
              <div key={rd.rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-stone-900">{rd.rating}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#eab308" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div className="flex-1 h-4 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      rd.rating >= 4 ? 'bg-green-500' : rd.rating === 3 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${rd.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-stone-500 w-16 text-right">{rd.count} ({rd.percentage.toFixed(0)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated Items */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-stone-900 mb-6">Top Rated Items</h3>
          <div className="space-y-3">
            {itemRatings.slice(0, 5).map((ir, i) => (
              <div key={ir.item.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900 truncate">{ir.item.name}</p>
                  <p className="text-xs text-stone-500">{ir.count} reviews</p>
                </div>
                <div className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#eab308" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span className="font-bold text-stone-900">{ir.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="font-bold text-stone-900 mb-6">Recent Reviews</h3>
        <div className="space-y-4">
          {reviews.length > 0 ? reviews.map((review) => (
            <div key={review.id} className="p-4 bg-stone-50 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-stone-900">{review.customerName || 'Anonymous'}</p>
                  <p className="text-xs text-stone-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= (review.rating || 0) ? '#eab308' : '#e7e5e4'} stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-stone-600">"{review.feedback}"</p>
              <div className="mt-3 flex gap-2">
                {review.items.slice(0, 3).map((item, i) => (
                  <span key={i} className="px-2 py-1 bg-white text-xs text-stone-600 rounded">
                    {item.item.name}
                  </span>
                ))}
              </div>
            </div>
          )) : (
            <div className="text-center py-8">
              <p className="text-stone-500">No reviews with comments yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-700 rounded-2xl p-6 text-white">
        <h3 className="font-bold mb-4">Review Highlights</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-3xl font-bold">Food Quality</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-stone-600 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: '94%' }} />
              </div>
              <span className="text-sm">94%</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold">AR Experience</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-stone-600 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: '89%' }} />
              </div>
              <span className="text-sm">89%</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold">Service</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-stone-600 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: '91%' }} />
              </div>
              <span className="text-sm">91%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


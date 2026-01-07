import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, Order, OrderStatus } from '../../state/store';
import { restaurantConfig } from '../../data/restaurant.config';

const statusColors: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed' },
  preparing: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Preparing' },
  ready: { bg: 'bg-green-100', text: 'text-green-700', label: 'Ready' },
  delivered: { bg: 'bg-stone-100', text: 'text-stone-600', label: 'Delivered' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
};

const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];

export function OrdersPanel() {
  const orders = useAppStore((s) => s.orders);
  const updateOrderStatus = useAppStore((s) => s.updateOrderStatus);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  const advanceStatus = (order: Order) => {
    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex < statusFlow.length - 1) {
      updateOrderStatus(order.id, statusFlow[currentIndex + 1]);
    }
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {(['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`p-4 rounded-xl transition-all ${
              filter === status 
                ? 'bg-stone-900 text-white' 
                : 'bg-white text-stone-900 hover:bg-stone-50'
            }`}
          >
            <p className="text-2xl font-bold">{orderCounts[status]}</p>
            <p className={`text-sm capitalize ${filter === status ? 'text-stone-300' : 'text-stone-500'}`}>
              {status === 'all' ? 'Total' : status}
            </p>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Items</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-stone-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-stone-900">{order.id}</p>
                      <p className="text-sm text-stone-500">Table {order.tableNumber}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-stone-900">{order.customerName || 'Guest'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-stone-900">{order.items.reduce((sum, i) => sum + i.quantity, 0)} items</p>
                    <p className="text-sm text-stone-500 truncate max-w-[150px]">
                      {order.items.map(i => i.item.name).join(', ')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-stone-900">
                      {restaurantConfig.currencySymbol}{order.total.toFixed(2)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status].bg} ${statusColors[order.status].text}`}>
                      {statusColors[order.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-stone-900">{formatTime(order.createdAt)}</p>
                    <p className="text-sm text-stone-500">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          advanceStatus(order);
                        }}
                        className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
                      >
                        {order.status === 'ready' ? 'Complete' : 'Advance'}
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-stone-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <motion.div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-stone-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-stone-900">{selectedOrder.id}</h3>
                  <p className="text-stone-500">Table {selectedOrder.tableNumber} • {selectedOrder.customerName || 'Guest'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status].bg} ${statusColors[selectedOrder.status].text}`}>
                  {statusColors[selectedOrder.status].label}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h4 className="font-semibold text-stone-900">Items</h4>
              {selectedOrder.items.map((cartItem, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-stone-900">{cartItem.item.name}</p>
                    <p className="text-sm text-stone-500">Qty: {cartItem.quantity}</p>
                  </div>
                  <p className="font-medium text-stone-900">
                    {restaurantConfig.currencySymbol}{(cartItem.item.price * cartItem.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="pt-4 border-t border-stone-200">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{restaurantConfig.currencySymbol}{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.rating && (
                <div className="pt-4 border-t border-stone-200">
                  <p className="text-sm text-stone-500 mb-1">Customer Rating</p>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={i <= selectedOrder.rating! ? '#fbbf24' : 'none'} stroke="#fbbf24" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  {selectedOrder.feedback && (
                    <p className="mt-2 text-stone-600 italic">"{selectedOrder.feedback}"</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-stone-100 flex gap-3">
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <button
                  onClick={() => {
                    advanceStatus(selectedOrder);
                    setSelectedOrder({ ...selectedOrder, status: statusFlow[statusFlow.indexOf(selectedOrder.status) + 1] });
                  }}
                  className="flex-1 bg-stone-900 text-white py-3 rounded-xl font-semibold hover:bg-stone-800"
                >
                  {selectedOrder.status === 'ready' ? 'Mark Delivered' : 'Advance Status'}
                </button>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-3 bg-stone-100 text-stone-900 rounded-xl font-semibold hover:bg-stone-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}


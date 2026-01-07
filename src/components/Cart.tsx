import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/store';
import { restaurantConfig } from '../data/restaurant.config';

export function CartButton() {
  const cartCount = useAppStore((s) => s.cartCount());
  const [isOpen, setIsOpen] = useState(false);

  if (cartCount === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-stone-900 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-stone-800 active:scale-95 transition-all"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
        </svg>
        
        {/* Badge */}
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      </motion.button>

      {/* Cart Sheet */}
      <AnimatePresence>
        {isOpen && <CartSheet onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function CartSheet({ onClose }: { onClose: () => void }) {
  const cart = useAppStore((s) => s.cart);
  const cartTotal = useAppStore((s) => s.cartTotal());
  const updateCartQuantity = useAppStore((s) => s.updateCartQuantity);
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const clearCart = useAppStore((s) => s.clearCart);
  const addOrder = useAppStore((s) => s.addOrder);
  
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!tableNumber) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orderId = addOrder({
      items: cart,
      total: cartTotal,
      status: 'pending',
      tableNumber: parseInt(tableNumber),
      customerName: customerName || undefined,
    });
    
    setOrderPlaced(orderId);
    clearCart();
    setIsSubmitting(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Sheet */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-stone-300" />
        </div>

        {/* Header */}
        <div className="px-5 pb-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">Your Order</h2>
          {cart.length > 0 && !orderPlaced && (
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {orderPlaced ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Order Placed!</h3>
              <p className="text-stone-500 mb-4">Order #{orderPlaced}</p>
              <p className="text-sm text-stone-400">Your order has been sent to the kitchen</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-1">Cart is empty</h3>
              <p className="text-sm text-stone-500">Add some delicious items!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items */}
              {cart.map((cartItem) => (
                <div key={cartItem.item.id} className="flex gap-4 bg-stone-50 rounded-xl p-3">
                  <div className="w-16 h-16 bg-stone-200 rounded-lg flex items-center justify-center text-2xl">
                    🍽️
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-stone-900 truncate">{cartItem.item.name}</h4>
                    <p className="text-sm text-stone-500">
                      {restaurantConfig.currencySymbol}{cartItem.item.price.toFixed(2)} each
                    </p>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateCartQuantity(cartItem.item.id, cartItem.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14"/>
                        </svg>
                      </button>
                      <span className="font-semibold text-stone-900 w-6 text-center">{cartItem.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(cartItem.item.id, cartItem.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(cartItem.item.id)}
                      className="text-stone-400 hover:text-red-500"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                    <p className="font-bold text-stone-900">
                      {restaurantConfig.currencySymbol}{(cartItem.item.price * cartItem.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Order Details */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Table Number *</label>
                  <input
                    type="number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Enter table number"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-stone-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Your Name (optional)</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="For order pickup"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-stone-400 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!orderPlaced && cart.length > 0 && (
          <div className="p-5 border-t border-stone-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-stone-600">Total</span>
              <span className="text-2xl font-bold text-stone-900">
                {restaurantConfig.currencySymbol}{cartTotal.toFixed(2)}
              </span>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || !tableNumber}
              className="w-full bg-stone-900 text-white py-4 rounded-xl font-semibold hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                  Place Order
                </>
              )}
            </button>
          </div>
        )}

        {orderPlaced && (
          <div className="p-5 border-t border-stone-100">
            <button
              onClick={onClose}
              className="w-full bg-stone-900 text-white py-4 rounded-xl font-semibold"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}


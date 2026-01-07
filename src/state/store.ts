import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem, menuItems } from '../data/menu';

// Cart item with quantity
export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

// Order status
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

// Order
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  tableNumber?: number;
  customerName?: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  rating?: number;
  feedback?: string;
}

// App mode - simple toggle instead of auth
export type AppMode = 'customer' | 'owner';

// View modes
export type ViewMode = 'menu' | '3d' | 'ar';

// App state interface
interface AppState {
  // Mode (simple toggle)
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  
  // View
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  
  // Menu
  selectedItem: MenuItem | null;
  selectedItemIndex: number;
  setSelectedItem: (item: MenuItem | null) => void;
  setSelectedItemIndex: (index: number) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
  
  // Orders (demo data)
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  rateOrder: (orderId: string, rating: number, feedback?: string) => void;
  
  // Detail drawer
  showDetail: boolean;
  toggleDetail: () => void;
  
  // Search & filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
}

// Generate realistic demo orders
const generateDemoOrders = (): Order[] => {
  const statuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
  const names = [
    'James W.', 'Sarah M.', 'Michael R.', 'Emma S.', 'David L.', 
    'Lisa K.', 'Thomas H.', 'Anna P.', 'Robert J.', 'Jennifer B.',
    'Christopher D.', 'Amanda F.', 'Daniel G.', 'Michelle H.', 'Andrew K.',
    'Stephanie L.', 'Joshua M.', 'Nicole N.', 'Matthew P.', 'Ashley R.'
  ];
  
  const feedbacks = [
    'Absolutely amazing! The 3D preview was spot on.',
    'Food was exactly as shown in AR. Love this app!',
    'Great experience, will definitely come back.',
    'The lobster was incredible, perfectly cooked.',
    'Best burger I\'ve had in years!',
    'AR feature helped me pick the right portion size.',
    'Quick service and delicious food.',
    'The pizza was authentic Italian style. Loved it!',
    'Sushi was fresh and beautifully presented.',
    'My kids loved seeing the food in AR before ordering!'
  ];
  
  const orders: Order[] = [];
  
  // Generate 50 orders over the past week
  for (let i = 0; i < 50; i++) {
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const selectedItems: CartItem[] = [];
    let total = 0;
    
    // Select random items
    const shuffled = [...menuItems].sort(() => Math.random() - 0.5);
    for (let j = 0; j < itemCount; j++) {
      const randomItem = shuffled[j % shuffled.length];
      const qty = Math.floor(Math.random() * 3) + 1;
      selectedItems.push({ item: randomItem, quantity: qty });
      total += randomItem.price * qty;
    }
    
    // Distribute orders across past 7 days with more recent bias
    const hoursAgo = Math.floor(Math.pow(Math.random(), 0.7) * 168); // 7 days
    const createdAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    
    // More delivered orders for older ones, more pending for recent
    let status: OrderStatus;
    if (hoursAgo > 24) {
      status = 'delivered';
    } else if (hoursAgo > 6) {
      status = statuses[Math.floor(Math.random() * 4) + 1]; // confirmed to delivered
    } else {
      status = statuses[Math.floor(Math.random() * 3)]; // pending to preparing
    }
    
    // Rating for delivered orders
    const hasRating = status === 'delivered' && Math.random() > 0.2;
    const rating = hasRating ? Math.floor(Math.random() * 2) + 4 : undefined; // 4-5 stars mostly
    const hasFeedback = hasRating && Math.random() > 0.5;
    
    orders.push({
      id: `ORD-${String(1000 + i).padStart(4, '0')}`,
      items: selectedItems,
      total,
      status,
      tableNumber: Math.floor(Math.random() * 25) + 1,
      customerName: names[Math.floor(Math.random() * names.length)],
      createdAt,
      updatedAt: createdAt,
      rating,
      feedback: hasFeedback ? feedbacks[Math.floor(Math.random() * feedbacks.length)] : undefined
    });
  }
  
  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Mode
      appMode: 'customer',
      setAppMode: (mode) => set({ appMode: mode }),
      
      // View
      viewMode: 'menu',
      setViewMode: (mode) => set({ viewMode: mode }),
      showWelcome: true,
      setShowWelcome: (show) => set({ showWelcome: show }),
      
      // Menu
      selectedItem: null,
      selectedItemIndex: 0,
      setSelectedItem: (item) => set({ selectedItem: item }),
      setSelectedItemIndex: (index) => set({ selectedItemIndex: index, selectedItem: menuItems[index] }),
      
      // Cart
      cart: [],
      addToCart: (item, quantity = 1, notes) => {
        const cart = get().cart;
        const existing = cart.find(c => c.item.id === item.id);
        
        if (existing) {
          set({
            cart: cart.map(c => 
              c.item.id === item.id 
                ? { ...c, quantity: c.quantity + quantity, notes: notes || c.notes }
                : c
            )
          });
        } else {
          set({ cart: [...cart, { item, quantity, notes }] });
        }
      },
      removeFromCart: (itemId) => {
        set({ cart: get().cart.filter(c => c.item.id !== itemId) });
      },
      updateCartQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
        } else {
          set({
            cart: get().cart.map(c => 
              c.item.id === itemId ? { ...c, quantity } : c
            )
          });
        }
      },
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0),
      cartCount: () => get().cart.reduce((sum, c) => sum + c.quantity, 0),
      
      // Orders
      orders: generateDemoOrders(),
      addOrder: (orderData) => {
        const id = `ORD-${Date.now()}`;
        const now = new Date();
        const newOrder: Order = {
          ...orderData,
          id,
          createdAt: now,
          updatedAt: now
        };
        set({ orders: [newOrder, ...get().orders] });
        return id;
      },
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map(o => 
            o.id === orderId ? { ...o, status, updatedAt: new Date() } : o
          )
        });
      },
      rateOrder: (orderId, rating, feedback) => {
        set({
          orders: get().orders.map(o => 
            o.id === orderId ? { ...o, rating, feedback, updatedAt: new Date() } : o
          )
        });
      },
      
      // Detail drawer
      showDetail: false,
      toggleDetail: () => set({ showDetail: !get().showDetail }),
      
      // Search & filters
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      activeFilters: [],
      toggleFilter: (filter) => {
        const filters = get().activeFilters;
        if (filters.includes(filter)) {
          set({ activeFilters: filters.filter(f => f !== filter) });
        } else {
          set({ activeFilters: [...filters, filter] });
        }
      },
      clearFilters: () => set({ activeFilters: [], searchQuery: '' }),
    }),
    {
      name: 'ar-menu-storage',
      partialize: (state) => ({ 
        cart: state.cart,
        showWelcome: state.showWelcome,
        appMode: state.appMode
      })
    }
  )
);

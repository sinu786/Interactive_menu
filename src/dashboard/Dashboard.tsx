import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/store';
import { restaurantConfig } from '../data/restaurant.config';
import { OrdersPanel } from './panels/OrdersPanel';
import { AnalyticsPanel } from './panels/AnalyticsPanel';
import { TrafficPanel } from './panels/TrafficPanel';
import { PaymentsPanel } from './panels/PaymentsPanel';
import { RatingsPanel } from './panels/RatingsPanel';
import { MenuPreviewPanel } from './panels/MenuPreviewPanel';

type PanelType = 'orders' | 'analytics' | 'traffic' | 'payments' | 'ratings' | 'menu';

const navItems: { id: PanelType; label: string; icon: JSX.Element }[] = [
  {
    id: 'orders',
    label: 'Orders',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        <path d="M9 14l2 2 4-4"/>
      </svg>
    )
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    )
  },
  {
    id: 'traffic',
    label: 'Traffic',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    )
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <path d="M1 10h22"/>
      </svg>
    )
  },
  {
    id: 'ratings',
    label: 'Ratings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    )
  },
  {
    id: 'menu',
    label: 'Menu',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    )
  }
];

export function Dashboard() {
  const [activePanel, setActivePanel] = useState<PanelType>('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const setAppMode = useAppStore((s) => s.setAppMode);
  const orders = useAppStore((s) => s.orders);

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;

  const renderPanel = () => {
    switch (activePanel) {
      case 'orders':
        return <OrdersPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'traffic':
        return <TrafficPanel />;
      case 'payments':
        return <PaymentsPanel />;
      case 'ratings':
        return <RatingsPanel />;
      case 'menu':
        return <MenuPreviewPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-100 flex">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-stone-900 text-white flex flex-col transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="text-xl">🍽️</span>
            </div>
            <div>
              <h1 className="font-bold text-white">{restaurantConfig.name}</h1>
              <p className="text-xs text-stone-400">Owner Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePanel(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activePanel === item.id
                  ? 'bg-white text-stone-900'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {item.id === 'orders' && pendingOrders > 0 && (
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                  activePanel === item.id ? 'bg-red-500 text-white' : 'bg-red-500/20 text-red-400'
                }`}>
                  {pendingOrders}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Mode Switcher */}
        <div className="p-4 border-t border-stone-800">
          <div className="bg-stone-800 rounded-xl p-3 mb-3">
            <p className="text-xs text-stone-400 mb-1">Demo Mode</p>
            <p className="text-sm text-white font-medium">Owner View</p>
          </div>
          <button
            onClick={() => setAppMode('customer')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-stone-900 font-medium hover:bg-stone-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
            </svg>
            View Customer App
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-200 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center hover:bg-stone-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
            <div>
              <h2 className="text-xl font-bold text-stone-900 capitalize">{activePanel}</h2>
              <p className="text-sm text-stone-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center hover:bg-stone-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              {pendingOrders > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingOrders}
                </span>
              )}
            </button>
            
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </div>
          </div>
        </header>

        {/* Panel content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPanel()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

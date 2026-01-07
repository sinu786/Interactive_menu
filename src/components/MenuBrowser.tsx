import { useState, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuItems, categories, MenuItem } from '../data/menu';
import { restaurantConfig } from '../data/restaurant.config';
import { ItemDetail } from './ItemDetail';
import { ModelThumbnail } from './ModelThumbnail';
import { CartButton } from './Cart';
import { useAppStore } from '../state/store';

// Define popular items (top 3 by simulated popularity)
const POPULAR_ITEMS = ['lobster-fries', 'pizza-ballerina', 'sushi-boat'];
const CHEF_PICKS = ['bbq-ribs', 'steak-sandwich'];

// Dietary filters
const DIETARY_FILTERS = [
  { id: 'veg', label: 'Vegetarian', icon: '🥬' },
  { id: 'spicy', label: 'Spicy', icon: '🌶️' },
  { id: 'under20', label: 'Under $20', icon: '💰' },
  { id: 'lowcal', label: 'Under 700 cal', icon: '🏃' },
];

export function MenuBrowser() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showModeMenu, setShowModeMenu] = useState(false);
  
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const activeFilters = useAppStore((s) => s.activeFilters);
  const toggleFilter = useAppStore((s) => s.toggleFilter);
  const setAppMode = useAppStore((s) => s.setAppMode);

  const allCategories = ['All', ...categories];
  
  // Filter items based on search, category, and dietary filters
  const filteredItems = useMemo(() => {
    let items = menuItems;
    
    // Category filter
    if (selectedCategory !== 'All') {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(query))
      );
    }
    
    // Dietary filters
    if (activeFilters.includes('veg')) {
      items = items.filter(item => item.veg);
    }
    if (activeFilters.includes('spicy')) {
      items = items.filter(item => item.spicyLevel > 0);
    }
    if (activeFilters.includes('under20')) {
      items = items.filter(item => item.price < 20);
    }
    if (activeFilters.includes('lowcal')) {
      items = items.filter(item => item.calories < 700);
    }
    
    return items;
  }, [selectedCategory, searchQuery, activeFilters]);

  // Group items by category for 'All' view
  const groupedItems = useMemo(() => {
    if (selectedCategory === 'All' && !searchQuery && activeFilters.length === 0) {
      return categories.reduce((acc, cat) => {
        const catItems = filteredItems.filter(item => item.category === cat);
        if (catItems.length > 0) acc[cat] = catItems;
        return acc;
      }, {} as Record<string, MenuItem[]>);
    }
    return { 'Results': filteredItems };
  }, [selectedCategory, filteredItems, searchQuery, activeFilters]);

  const handleSelectItem = useCallback((item: MenuItem) => {
    setSelectedItem(item);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <>
      <div className="absolute inset-0 bg-stone-50 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-stone-200 px-5 py-4 safe-top flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-stone-900 flex items-center justify-center shadow-lg">
                <span className="text-xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-900">{restaurantConfig.name}</h1>
                <p className="text-xs text-stone-500">{restaurantConfig.tagline}</p>
              </div>
            </div>
            <button
              onClick={() => setShowModeMenu(!showModeMenu)}
              className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors relative"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
            </button>
          </div>

          {/* Mode switcher dropdown */}
          <AnimatePresence>
            {showModeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-4 top-20 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-50 w-64"
              >
                <p className="text-xs text-stone-400 uppercase tracking-wider mb-3">Demo Mode</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-stone-100 rounded-lg">
                    <span className="text-lg">🍽️</span>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">Customer View</p>
                      <p className="text-xs text-stone-500">Currently viewing</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowModeMenu(false);
                      setAppMode('owner');
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    <span className="text-lg">📊</span>
                    <div className="text-left">
                      <p className="font-medium text-sm">Owner Dashboard</p>
                      <p className="text-xs text-stone-300">View analytics & orders</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Bar */}
          <div className="relative mb-3">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" 
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients..."
              className="w-full pl-12 pr-4 py-3 bg-stone-100 rounded-xl text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          {/* Dietary Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide mb-3">
            {DIETARY_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeFilters.includes(filter.id)
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
            {allCategories.map((category) => {
              const count = category === 'All' 
                ? menuItems.length 
                : menuItems.filter(i => i.category === category).length;
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 active:bg-stone-200'
                  }`}
                >
                  {category}
                  <span className={`ml-1.5 ${selectedCategory === category ? 'opacity-70' : 'opacity-50'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          <div className="p-4 space-y-6 pb-28">
            {/* Results count */}
            {(searchQuery || activeFilters.length > 0) && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-stone-500">
                  {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
                </p>
                {(searchQuery || activeFilters.length > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      activeFilters.forEach(f => toggleFilter(f));
                    }}
                    className="text-sm text-stone-500 hover:text-stone-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}

            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                </div>
                <p className="text-stone-500 font-medium">No dishes found</p>
                <p className="text-sm text-stone-400 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <section key={category}>
                  {category !== 'Results' && (
                    <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 px-1">
                      {category}
                    </h2>
                  )}
                  
                  <div className="space-y-2">
                    {items.map((item) => (
                      <MenuItemCard 
                        key={item.id} 
                        item={item} 
                        onClick={handleSelectItem}
                        isPopular={POPULAR_ITEMS.includes(item.id)}
                        isChefPick={CHEF_PICKS.includes(item.id)}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-stone-900/80 backdrop-blur text-white text-xs px-4 py-2 rounded-full flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Tap any item for 3D view & AR
          </div>
        </div>

        {/* Cart Button */}
        <CartButton />
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetail 
            item={selectedItem} 
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Memoized card component for better performance
const MenuItemCard = memo(function MenuItemCard({ 
  item, 
  onClick,
  isPopular,
  isChefPick
}: { 
  item: MenuItem; 
  onClick: (item: MenuItem) => void;
  isPopular?: boolean;
  isChefPick?: boolean;
}) {
  const [showShare, setShowShare] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareData = {
      title: item.name,
      text: `Check out ${item.name} at ${restaurantConfig.name}!`,
      url: `${window.location.origin}?item=${item.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareData.url);
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => onClick(item)}
        className="w-full bg-white rounded-2xl p-4 flex gap-4 text-left shadow-sm border border-stone-100 active:scale-[0.98] active:bg-stone-50 transition-transform"
      >
        {/* 3D Thumbnail - lazy loaded */}
        <div className="relative">
          <ModelThumbnail src={item.model.url} alt={item.name} />
          
          {/* Badges */}
          {isPopular && (
            <span className="absolute -top-1 -left-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              🔥 Popular
            </span>
          )}
          {isChefPick && !isPopular && (
            <span className="absolute -top-1 -left-1 bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              ⭐ Chef's Pick
            </span>
          )}
        </div>

        {/* Item Info */}
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-semibold text-stone-900 truncate">{item.name}</h3>
              <div className={`flex-shrink-0 scale-90 ${item.veg ? 'badge-veg' : 'badge-nonveg'}`} />
            </div>
            <p className="font-bold text-stone-900 flex-shrink-0">
              {restaurantConfig.currencySymbol}{item.price.toFixed(0)}
            </p>
          </div>
          
          <p className="text-sm text-stone-500 line-clamp-2 mb-2">
            {item.description}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
              {item.calories} cal
            </span>
            {item.spicyLevel > 0 && (
              <span className="text-xs">
                {'🌶️'.repeat(item.spicyLevel)}
              </span>
            )}
            {item.allergens.length > 0 && (
              <span className="text-xs text-amber-600">
                ⚠️ {item.allergens.length}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <div className="flex items-center flex-shrink-0 text-stone-300 self-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </button>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="absolute top-3 right-12 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors z-10"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#78716c" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
        </svg>
      </button>

      {/* Share confirmation toast */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-3 right-3 bg-stone-900 text-white text-xs px-3 py-1.5 rounded-lg z-20"
          >
            Link copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

import { motion } from 'framer-motion';
import { useAppStore } from '../state/store';
import { menuItems } from '../data/menu';
import { restaurantConfig } from '../data/restaurant.config';

interface MenuCarouselProps {
  darkMode?: boolean;
}

export function MenuCarousel({ darkMode = false }: MenuCarouselProps) {
  const selectedIndex = useAppStore((s) => s.selectedItemIndex);
  const selectedItem = useAppStore((s) => s.selectedItem);
  const toggleDetail = useAppStore((s) => s.toggleDetail);

  const bgClass = darkMode 
    ? 'bg-black/70 backdrop-blur-xl border-t border-white/10' 
    : 'bg-white border-t border-gray-100';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const subTextClass = darkMode ? 'text-white/60' : 'text-gray-500';

  return (
    <motion.div 
      className={`absolute bottom-0 left-0 right-0 z-20 safe-bottom ${bgClass}`}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {/* Item info - tap to see details */}
      <button
        onClick={toggleDetail}
        className="w-full text-left px-5 py-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className={`text-lg font-bold ${textClass} truncate`}>
                {selectedItem.name}
              </h2>
              <div className={`flex-shrink-0 ${selectedItem.veg ? 'badge-veg' : 'badge-nonveg'}`} />
            </div>
            <p className={`text-sm ${subTextClass} line-clamp-1`}>
              {selectedItem.description}
            </p>
          </div>
          <div className="text-right ml-4 flex-shrink-0">
            <p className={`text-lg font-bold ${textClass}`}>
              {restaurantConfig.currencySymbol}{selectedItem.price.toFixed(2)}
            </p>
            <p className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
              {selectedItem.calories} cal
            </p>
          </div>
        </div>

        {/* Quick info tags */}
        <div className="flex items-center gap-2 mt-3">
          <span className={`px-3 py-1 text-xs rounded-full ${
            darkMode ? 'bg-white/10 text-white/70' : 'bg-gray-100 text-gray-600'
          }`}>
            {selectedItem.category}
          </span>
          
          {selectedItem.spicyLevel > 0 && (
            <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
              darkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-50 text-orange-600'
            }`}>
              🌶️ {['', 'Mild', 'Medium', 'Hot'][selectedItem.spicyLevel]}
            </span>
          )}

          <span className={`ml-auto text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
            Tap for details
          </span>
        </div>
      </button>
    </motion.div>
  );
}

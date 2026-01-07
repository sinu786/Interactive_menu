import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/store';
import { restaurantConfig } from '../data/restaurant.config';

export function DetailDrawer() {
  const isOpen = useAppStore((s) => s.isDetailOpen);
  const setDetailOpen = useAppStore((s) => s.setDetailOpen);
  const selectedItem = useAppStore((s) => s.selectedItem);

  const spiceLevels = ['Mild', 'Medium', 'Hot', 'Extra Hot'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetailOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] max-h-[90vh] overflow-hidden shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Content */}
            <div className="px-6 pb-8 overflow-y-auto max-h-[calc(90vh-40px)] safe-bottom">
              {/* Header */}
              <div className="flex items-start justify-between py-4 sticky top-0 bg-white">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedItem.name}
                    </h2>
                    <div className={`scale-110 ${selectedItem.veg ? 'badge-veg' : 'badge-nonveg'}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {restaurantConfig.currencySymbol}{selectedItem.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => setDetailOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors -mt-1"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {selectedItem.description}
              </p>

              {/* Quick info cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {/* Calories */}
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{selectedItem.calories}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Calories</div>
                </div>
                
                {/* Spice Level */}
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <div className="flex justify-center gap-1 mb-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full ${
                          i < selectedItem.spicyLevel 
                            ? selectedItem.spicyLevel === 1 ? 'bg-yellow-400'
                              : selectedItem.spicyLevel === 2 ? 'bg-orange-400'
                              : 'bg-red-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedItem.spicyLevel === 0 ? 'No spice' : spiceLevels[selectedItem.spicyLevel - 1]}
                  </div>
                </div>
                
                {/* Category */}
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <div className="text-sm font-semibold text-gray-900 truncate">{selectedItem.category}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Category</div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.ingredients.map((ingredient, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              {selectedItem.allergens.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                      <path d="M12 9v4M12 17h.01"/>
                    </svg>
                    Allergens
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.allergens.map((allergen, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-full border border-red-100"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Spacer for safe area */}
              <div className="h-4" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

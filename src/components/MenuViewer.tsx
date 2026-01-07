import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/store';
import { menuItems } from '../data/menu';
import { restaurantConfig } from '../data/restaurant.config';
import { getUSDZPath } from '../utils/modelUtils';
import '../types/model-viewer.d.ts';

export function MenuViewer() {
  const selectedItem = useAppStore((s) => s.selectedItem);
  const selectedIndex = useAppStore((s) => s.selectedItemIndex);
  const setSelectedIndex = useAppStore((s) => s.setSelectedItemIndex);
  
  const modelViewerRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showIngredients, setShowIngredients] = useState(false);

  // Handle model load events
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    setIsLoading(true);

    const handleLoad = () => {
      setIsLoading(false);
      (modelViewer as any).cameraOrbit = 'auto auto auto';
    };
    const handleError = () => setIsLoading(false);

    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);

    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
    };
  }, [selectedItem.id]);

  // Navigate items
  const nextItem = useCallback(() => {
    setSelectedIndex((selectedIndex + 1) % menuItems.length);
    setShowIngredients(false);
  }, [selectedIndex, setSelectedIndex]);

  const prevItem = useCallback(() => {
    setSelectedIndex(selectedIndex === 0 ? menuItems.length - 1 : selectedIndex - 1);
    setShowIngredients(false);
  }, [selectedIndex, setSelectedIndex]);

  // Swipe handling
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) nextItem();
      else prevItem();
    }
  };

  const spiceLevels = ['', 'Mild', 'Medium', 'Hot', 'Extra Hot'];

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-stone-50 to-stone-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200/50 px-5 py-3 flex items-center justify-between safe-top z-20">
        <div className="flex items-center gap-3">
          {restaurantConfig.logo && (
            <img src={restaurantConfig.logo} alt="" className="h-8 w-8 rounded-lg" />
          )}
          <div>
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">{restaurantConfig.name}</h1>
            <p className="text-xs text-stone-500">{restaurantConfig.tagline}</p>
          </div>
        </div>
        
        {/* Item counter */}
        <div className="bg-stone-100 px-3 py-1.5 rounded-full">
          <span className="text-sm font-semibold text-stone-700">{selectedIndex + 1}</span>
          <span className="text-sm text-stone-400"> / {menuItems.length}</span>
        </div>
      </header>

      {/* 3D Model Viewer */}
      <div 
        className="flex-1 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-stone-50 z-30"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <div className="spinner mx-auto mb-3" />
                <p className="text-sm text-stone-400">Loading {selectedItem.name}...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Model Viewer */}
        <model-viewer
          ref={modelViewerRef}
          key={selectedItem.id}
          src={selectedItem.model.url}
          ios-src={selectedItem.model.iosUrl || getUSDZPath(selectedItem.model.url)}
          alt={selectedItem.name}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          camera-controls
          touch-action="pan-y"
          auto-rotate
          rotation-per-second="20deg"
          interaction-prompt="none"
          shadow-intensity="1"
          shadow-softness="1"
          exposure="1"
          camera-orbit="0deg 75deg auto"
          min-camera-orbit="auto 0deg auto"
          max-camera-orbit="auto 180deg auto"
          field-of-view="30deg"
          loading="eager"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            '--poster-color': 'transparent',
            '--progress-bar-color': restaurantConfig.accentColor,
          } as React.CSSProperties}
        >
          {/* AR Button - styled */}
          <button
            slot="ar-button"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 shadow-2xl hover:bg-stone-800 active:scale-95 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="M12 18a6 6 0 100-12 6 6 0 000 12z"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
            View in AR
          </button>
        </model-viewer>

        {/* Navigation arrows */}
        <button
          onClick={prevItem}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white active:scale-95 transition-all z-20 border border-stone-200/50"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <button
          onClick={nextItem}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white active:scale-95 transition-all z-20 border border-stone-200/50"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Page dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {menuItems.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedIndex(i);
                setShowIngredients(false);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex 
                  ? 'bg-stone-800 w-6' 
                  : 'bg-stone-300 w-2 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>

        {/* Gesture hint */}
        <motion.div 
          className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="text-xs text-stone-400 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
            Drag to rotate • Pinch to zoom
          </div>
        </motion.div>
      </div>

      {/* Item Details Panel */}
      <motion.div 
        className="bg-white border-t border-stone-200 safe-bottom z-30"
        initial={false}
        animate={{ height: showIngredients ? 'auto' : 'auto' }}
      >
        {/* Main info - always visible */}
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-start justify-between gap-4">
            {/* Left: Name & description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-stone-900 truncate">{selectedItem.name}</h2>
                <div className={`flex-shrink-0 ${selectedItem.veg ? 'badge-veg' : 'badge-nonveg'}`} />
              </div>
              <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">{selectedItem.description}</p>
            </div>
            
            {/* Right: Price */}
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold text-stone-900">
                {restaurantConfig.currencySymbol}{selectedItem.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Quick info chips */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              {selectedItem.calories} cal
            </span>
            
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-full">
              {selectedItem.category}
            </span>
            
            {selectedItem.spicyLevel > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
                {'🌶️'.repeat(selectedItem.spicyLevel)} {spiceLevels[selectedItem.spicyLevel]}
              </span>
            )}

            {selectedItem.allergens.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <path d="M12 9v4M12 17h.01"/>
                </svg>
                {selectedItem.allergens.length} allergen{selectedItem.allergens.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Expandable ingredients section */}
        <button
          onClick={() => setShowIngredients(!showIngredients)}
          className="w-full px-5 py-3 flex items-center justify-between border-t border-stone-100 hover:bg-stone-50 transition-colors"
        >
          <span className="text-sm font-medium text-stone-700">
            {showIngredients ? 'Hide details' : 'View ingredients & allergens'}
          </span>
          <motion.svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            animate={{ rotate: showIngredients ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M6 9l6 6 6-6"/>
          </motion.svg>
        </button>

        {/* Expanded details */}
        <AnimatePresence>
          {showIngredients && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-2 space-y-4">
                {/* Ingredients */}
                <div>
                  <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Ingredients</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.ingredients.map((ingredient, i) => (
                      <span key={i} className="px-2.5 py-1 bg-stone-100 text-stone-700 text-sm rounded-lg">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Allergens */}
                {selectedItem.allergens.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        <path d="M12 9v4M12 17h.01"/>
                      </svg>
                      Allergens
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.allergens.map((allergen, i) => (
                        <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}



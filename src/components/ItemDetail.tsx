import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '../data/menu';
import { restaurantConfig } from '../data/restaurant.config';
import { getUSDZPath } from '../utils/modelUtils';
import { useAppStore } from '../state/store';
import '../types/model-viewer.d.ts';

interface ItemDetailProps {
  item: MenuItem;
  onClose: () => void;
}

export function ItemDetail({ item, onClose }: ItemDetailProps) {
  const modelViewerRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const addToCart = useAppStore((s) => s.addToCart);

  // Delay model loading slightly for smoother animation
  useEffect(() => {
    const timer = setTimeout(() => setShowModel(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const handleLoad = () => setIsLoading(false);
    const handleError = () => setIsLoading(false);

    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);

    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
    };
  }, [item.id, showModel]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const spiceLevels = ['', 'Mild', 'Medium', 'Hot', 'Extra Hot'];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-stone-50 overflow-hidden"
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-stone-50 via-stone-50/90 to-transparent px-4 py-3 safe-top">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-stone-50 active:scale-95 transition-all border border-stone-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <h1 className="text-sm font-semibold text-stone-600">{item.category}</h1>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* 3D Model Viewer - Top half */}
      <div className="h-[45vh] relative bg-gradient-to-b from-stone-100 to-stone-50">
        {(isLoading || !showModel) && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-stone-400">Loading 3D model...</p>
            </div>
          </div>
        )}

        {showModel && (
          <model-viewer
          ref={modelViewerRef}
          key={item.id}
          src={item.model.url}
          ios-src={item.model.iosUrl || getUSDZPath(item.model.url)}
          alt={item.name}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          camera-controls
          touch-action="pan-y"
          auto-rotate
          rotation-per-second="20deg"
          interaction-prompt="none"
          shadow-intensity="1.2"
          shadow-softness="0.8"
          exposure="1.05"
          camera-orbit="0deg 65deg auto"
          min-camera-orbit="auto 30deg auto"
          max-camera-orbit="auto 90deg auto"
          field-of-view="32deg"
          interpolation-decay="100"
          orbit-sensitivity="1"
          loading="eager"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.4s ease-out',
          } as React.CSSProperties}
        >
          {/* AR Button */}
          <button
            slot="ar-button"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-xl hover:bg-stone-800 active:scale-95 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="M12 18a6 6 0 100-12 6 6 0 000 12z"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
            View in AR
          </button>
        </model-viewer>

        )}

        {/* Gesture hint */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-xs text-stone-400 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full pointer-events-none">
          Drag to rotate • Pinch to zoom
        </div>
      </div>

      {/* Details Panel - Bottom half */}
      <div className="h-[55vh] bg-white rounded-t-3xl -mt-4 relative overflow-hidden">
        {/* Drag indicator */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-stone-200" />
        </div>

        <div className="overflow-y-auto h-[calc(100%-2rem)] px-5 pb-10">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-stone-900">{item.name}</h2>
                <div className={`scale-110 ${item.veg ? 'badge-veg' : 'badge-nonveg'}`} />
              </div>
              <p className="text-stone-500">{item.category}</p>
            </div>
            <p className="text-2xl font-bold text-stone-900">
              {restaurantConfig.currencySymbol}{item.price.toFixed(2)}
            </p>
          </div>

          {/* Description */}
          <p className="text-stone-600 leading-relaxed mb-5">
            {item.description}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-stone-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-stone-900">{item.calories}</p>
              <p className="text-xs text-stone-500">Calories</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-3 text-center">
              <div className="flex justify-center gap-0.5 mb-1">
                {[1,2,3,4].map(i => (
                  <div 
                    key={i} 
                    className={`w-2.5 h-2.5 rounded-full ${
                      i <= item.spicyLevel 
                        ? item.spicyLevel === 1 ? 'bg-yellow-400'
                          : item.spicyLevel === 2 ? 'bg-orange-400'
                          : 'bg-red-500'
                        : 'bg-stone-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-stone-500">
                {item.spicyLevel === 0 ? 'Not spicy' : spiceLevels[item.spicyLevel]}
              </p>
            </div>
            <div className="bg-stone-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-stone-900">{item.ingredients.length}</p>
              <p className="text-xs text-stone-500">Ingredients</p>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
              Ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.ingredients.map((ingredient, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 bg-stone-100 text-stone-700 text-sm rounded-full"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {/* Allergens */}
          {item.allergens.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <path d="M12 9v4M12 17h.01"/>
                </svg>
                Allergen Information
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.allergens.map((allergen, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-full border border-red-100"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to Order Section */}
          <div className="sticky bottom-0 bg-white pt-4 pb-6 -mx-5 px-5 border-t border-stone-100 mt-auto">
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center bg-stone-100 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-stone-600 hover:text-stone-900"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"/>
                  </svg>
                </button>
                <span className="w-8 text-center font-semibold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-stone-600 hover:text-stone-900"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>
              </div>

              {/* Add to Order Button */}
              <button
                onClick={() => {
                  addToCart(item, quantity);
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }}
                className="flex-1 bg-stone-900 text-white py-3.5 rounded-xl font-semibold hover:bg-stone-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {addedToCart ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Added!
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                    </svg>
                    Add to Order • {restaurantConfig.currencySymbol}{(item.price * quantity).toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Added to cart confirmation */}
      <AnimatePresence>
        {addedToCart && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full font-medium shadow-xl flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Added to your order!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


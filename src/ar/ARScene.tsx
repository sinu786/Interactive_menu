import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../state/store';
import { menuItems } from '../data/menu';
import { restaurantConfig } from '../data/restaurant.config';
import { getUSDZPath, checkFileExists } from '../utils/modelUtils';
import '../types/model-viewer.d.ts';

export function ARScene() {
  const selectedItem = useAppStore((s) => s.selectedItem);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const selectedIndex = useAppStore((s) => s.selectedItemIndex);
  const setSelectedIndex = useAppStore((s) => s.setSelectedItemIndex);
  const toggleDetail = useAppStore((s) => s.toggleDetail);
  
  const modelViewerRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUSDZ, setHasUSDZ] = useState(false);
  const [, setArStatus] = useState<'none' | 'presenting' | 'failed'>('none');

  // Check for USDZ availability
  useEffect(() => {
    const usdzPath = selectedItem.model.iosUrl || getUSDZPath(selectedItem.model.url);
    checkFileExists(usdzPath).then(setHasUSDZ);
  }, [selectedItem]);

  // Handle model load events
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    setIsLoading(true);

    const handleLoad = () => setIsLoading(false);
    const handleError = () => setIsLoading(false);
    const handleARStatus = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setArStatus(detail.status === 'session-started' ? 'presenting' : 'none');
    };

    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);
    modelViewer.addEventListener('ar-status', handleARStatus);

    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
      modelViewer.removeEventListener('ar-status', handleARStatus);
    };
  }, [selectedItem.id]);

  // Navigate items
  const nextItem = useCallback(() => {
    setSelectedIndex((selectedIndex + 1) % menuItems.length);
  }, [selectedIndex, setSelectedIndex]);

  const prevItem = useCallback(() => {
    setSelectedIndex(selectedIndex === 0 ? menuItems.length - 1 : selectedIndex - 1);
  }, [selectedIndex, setSelectedIndex]);

  return (
    <div className="absolute inset-0 bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between safe-top z-20">
        <button
          onClick={() => setViewMode('3d')}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900">{restaurantConfig.name}</p>
          <p className="text-xs text-gray-400">AR Quick Look</p>
        </div>

        <button
          onClick={toggleDetail}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
        </button>
      </header>

      {/* Model Viewer - Main AR Preview */}
      <div className="flex-1 relative bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
        {/* Loading state */}
        {isLoading && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-white z-30"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="spinner mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading model...</p>
            </div>
          </motion.div>
        )}

        {/* The model-viewer component - this IS the camera/AR panel */}
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
          rotation-per-second="30deg"
          interaction-prompt="none"
          shadow-intensity="1.2"
          shadow-softness="0.8"
          exposure="1.05"
          camera-orbit="0deg 65deg auto"
          min-camera-orbit="auto 30deg auto"
          max-camera-orbit="auto 90deg auto"
          interpolation-decay="100"
          orbit-sensitivity="1"
          loading="eager"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            '--poster-color': 'transparent',
            '--progress-bar-color': '#111111',
          } as React.CSSProperties}
        >
          {/* Custom AR Button - appears at bottom of model viewer */}
          <button
            slot="ar-button"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2.5 shadow-2xl hover:bg-gray-800 active:scale-95 transition-all"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="12" cy="12" r="3"/>
              <path d="M3 9h2M19 9h2M3 15h2M19 15h2"/>
            </svg>
            View in Your Space
          </button>

          {/* Progress bar slot */}
          <div slot="progress-bar" className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div className="h-full bg-black transition-all" style={{ width: '100%' }} />
          </div>
        </model-viewer>

        {/* Item navigation arrows */}
        <button
          onClick={prevItem}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all z-20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <button
          onClick={nextItem}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all z-20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Page indicator dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {menuItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex 
                  ? 'bg-black w-5' 
                  : 'bg-black/20 w-2 hover:bg-black/40'
              }`}
            />
          ))}
        </div>

        {/* Gesture hint */}
        <motion.div 
          className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            <span>Drag to rotate</span>
            <span className="text-gray-300">•</span>
            <span>Pinch to zoom</span>
          </div>
        </motion.div>

        {/* iOS Quick Look availability hint */}
        {!hasUSDZ && /iPhone|iPad|iPod/.test(navigator.userAgent) && (
          <motion.div 
            className="absolute top-14 left-1/2 -translate-x-1/2 z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
              <span>USDZ file missing - AR unavailable</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Item Details Footer */}
      <footer className="bg-white border-t border-gray-100 px-5 py-4 safe-bottom">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900 truncate">{selectedItem.name}</h2>
              <div className={`flex-shrink-0 ${selectedItem.veg ? 'badge-veg' : 'badge-nonveg'}`} />
            </div>
            <p className="text-sm text-gray-500 line-clamp-1">{selectedItem.description}</p>
          </div>
          <div className="text-right ml-4 flex-shrink-0">
            <p className="text-lg font-bold text-gray-900">
              {restaurantConfig.currencySymbol}{selectedItem.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">{selectedItem.calories} cal</p>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mt-3">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {selectedItem.category}
          </span>
          {selectedItem.spicyLevel > 0 && (
            <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs rounded-full flex items-center gap-1">
              🌶️ {['Mild', 'Medium', 'Hot', 'Extra Hot'][selectedItem.spicyLevel]}
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}

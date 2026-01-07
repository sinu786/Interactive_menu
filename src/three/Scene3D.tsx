import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../state/store';
import { menuItems } from '../data/menu';
import { getUSDZPath } from '../utils/modelUtils';
import '../types/model-viewer.d.ts';

export function Scene3D() {
  const selectedIndex = useAppStore((s) => s.selectedItemIndex);
  const setSelectedIndex = useAppStore((s) => s.setSelectedItemIndex);
  
  // Get current item from menu items array (always valid)
  const currentItem = menuItems[selectedIndex] || menuItems[0];
  
  const modelViewerRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle model load events
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    setIsLoading(true);

    const handleLoad = () => {
      setIsLoading(false);
      // Reset camera to default position when model changes
      (modelViewer as any).cameraOrbit = 'auto auto auto';
      (modelViewer as any).fieldOfView = 'auto';
    };
    
    const handleError = () => setIsLoading(false);

    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);

    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
    };
  }, [currentItem.id]);

  // Navigate items
  const nextItem = useCallback(() => {
    setSelectedIndex((selectedIndex + 1) % menuItems.length);
  }, [selectedIndex, setSelectedIndex]);

  const prevItem = useCallback(() => {
    setSelectedIndex(selectedIndex === 0 ? menuItems.length - 1 : selectedIndex - 1);
  }, [selectedIndex, setSelectedIndex]);

  // Handle swipe gestures
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextItem();
      else prevItem();
    }
  };

  return (
    <div className="absolute inset-0 bg-white flex flex-col">
      {/* Model Viewer Container */}
      <div 
        className="flex-1 relative bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading state */}
        {isLoading && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-white z-30"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="spinner mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading model...</p>
            </div>
          </motion.div>
        )}

        {/* Model Viewer - same as Quick Look style */}
        <model-viewer
          ref={modelViewerRef}
          key={currentItem.id}
          src={currentItem.model.url}
          ios-src={currentItem.model.iosUrl || getUSDZPath(currentItem.model.url)}
          alt={currentItem.name}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          camera-controls
          touch-action="pan-y"
          auto-rotate
          rotation-per-second="20deg"
          interaction-prompt="auto"
          interaction-prompt-style="basic"
          shadow-intensity="1.2"
          shadow-softness="0.8"
          exposure="1.05"
          camera-orbit="0deg 65deg auto"
          min-camera-orbit="auto 30deg auto"
          max-camera-orbit="auto 90deg auto"
          field-of-view="30deg"
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
        />

        {/* Navigation arrows */}
        <button
          onClick={prevItem}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white active:scale-95 transition-all z-20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <button
          onClick={nextItem}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white active:scale-95 transition-all z-20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
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

        {/* Gesture hint - fades after interaction */}
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 8l4 4-4 4"/>
              <path d="M3 12h18"/>
            </svg>
            <span>Drag to rotate</span>
            <span className="text-gray-300">•</span>
            <span>Pinch to zoom</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

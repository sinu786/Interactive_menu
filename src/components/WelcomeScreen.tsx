import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { restaurantConfig } from '../data/restaurant.config';
import { menuItems } from '../data/menu';
import { useAppStore } from '../state/store';

export function WelcomeScreen() {
  const setShowWelcome = useAppStore((s) => s.setShowWelcome);
  
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [canSkip, setCanSkip] = useState(false);
  const abortController = useRef<AbortController | null>(null);

  const totalModels = menuItems.length;
  const categories = [...new Set(menuItems.map(item => item.category))];

  // Preload all 3D models in parallel batches
  useEffect(() => {
    let isMounted = true;
    abortController.current = new AbortController();
    
    const preloadModels = async () => {
      const modelUrls = menuItems.map(item => item.model.url);
      let loaded = 0;

      // Allow skip after 2 seconds
      setTimeout(() => {
        if (isMounted) setCanSkip(true);
      }, 2000);

      // Load ALL models in parallel (not sequentially)
      const loadPromises = modelUrls.map(async (url) => {
        try {
          const response = await fetch(url, { 
            signal: abortController.current?.signal,
            // Use cache
            cache: 'force-cache'
          });
          if (response.ok) {
            // Just check headers, don't wait for full body
            // The browser will cache it
            loaded++;
            if (isMounted) {
              setLoadingProgress((loaded / totalModels) * 100);
            }
          }
          return true;
        } catch {
          loaded++;
          if (isMounted) {
            setLoadingProgress((loaded / totalModels) * 100);
          }
          return false;
        }
      });

      // Wait for all to complete
      await Promise.all(loadPromises);
      
      if (isMounted) {
        setLoadingProgress(100);
        // Short delay to show completion
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsLoading(false);
      }
    };

    preloadModels();

    return () => {
      isMounted = false;
      abortController.current?.abort();
    };
  }, [totalModels]);

  const handleEnter = () => {
    abortController.current?.abort();
    setShowWelcome(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white flex flex-col"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-stone-100 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-stone-100 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6 relative"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center shadow-2xl">
            <span className="text-5xl">🍽️</span>
          </div>
          
          {/* Loading spinner around logo */}
          {isLoading && (
            <svg 
              className="absolute -inset-2 w-28 h-28"
              style={{ animation: 'spin 2s linear infinite' }}
            >
              <circle
                cx="56"
                cy="56"
                r="52"
                fill="none"
                stroke="#e7e5e4"
                strokeWidth="4"
              />
              <circle
                cx="56"
                cy="56"
                r="52"
                fill="none"
                stroke="#292524"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${loadingProgress * 3.27} 327`}
                transform="rotate(-90 56 56)"
                style={{ transition: 'stroke-dasharray 0.3s ease' }}
              />
            </svg>
          )}
        </motion.div>

        {/* Restaurant name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-stone-900 text-center mb-2"
        >
          {restaurantConfig.name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-stone-500 text-center text-lg mb-8"
        >
          {restaurantConfig.tagline}
        </motion.p>

        {/* Loading/Ready State */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xs flex flex-col items-center"
            >
              {/* Progress bar */}
              <div className="w-full mb-4">
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-stone-800 rounded-full"
                    style={{ width: `${loadingProgress}%`, transition: 'width 0.3s ease' }}
                  />
                </div>
                <p className="text-xs text-stone-400 text-center mt-2">
                  Loading 3D experiences... {Math.round(loadingProgress)}%
                </p>
              </div>

              {/* Skip button - appears after 2 seconds */}
              <AnimatePresence>
                {canSkip && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={handleEnter}
                    className="mt-4 text-sm text-stone-500 hover:text-stone-700 underline underline-offset-2"
                  >
                    Skip loading →
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="loaded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              {/* Stats */}
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-900">{menuItems.length}</p>
                  <p className="text-xs text-stone-500">Dishes</p>
                </div>
                <div className="w-px h-10 bg-stone-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-900">{categories.length}</p>
                  <p className="text-xs text-stone-500">Categories</p>
                </div>
                <div className="w-px h-10 bg-stone-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-stone-900">3D</p>
                  <p className="text-xs text-stone-500">+ AR</p>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={handleEnter}
                className="bg-stone-900 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-xl hover:bg-stone-800 active:scale-95 transition-all flex items-center gap-3"
              >
                <span>Explore Menu</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom hint */}
      <div className="pb-10 text-center">
        <p className="text-xs text-stone-400">
          Tap any dish to view in 3D • Use AR to see it on your table
        </p>
      </div>
    </motion.div>
  );
}

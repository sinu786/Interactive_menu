import { motion } from 'framer-motion';
import { useAppStore } from '../state/store';
import { restaurantConfig } from '../data/restaurant.config';

export function Landing() {
  const setViewMode = useAppStore((s) => s.setViewMode);
  const setShowHowItWorks = useAppStore((s) => s.setShowHowItWorks);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 bg-white">
      {/* Content */}
      <motion.div
        className="flex flex-col items-center text-center max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center">
            <span className="text-white text-2xl font-bold font-display">M</span>
          </div>
        </motion.div>

        {/* Restaurant name */}
        <motion.h1
          className="font-display text-3xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {restaurantConfig.name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-base text-gray-500 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {restaurantConfig.tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col gap-3 w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={() => setViewMode('3d')}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3L2 7.5V16.5L12 21L22 16.5V7.5L12 3Z"/>
              <path d="M12 12L22 7.5"/>
              <path d="M12 12V21"/>
              <path d="M12 12L2 7.5"/>
            </svg>
            View Menu in 3D
          </button>

          <button
            onClick={() => setViewMode('ar')}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            View in AR
          </button>
        </motion.div>

        {/* How it works link */}
        <motion.button
          className="mt-8 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowHowItWorks(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          How it works
        </motion.button>
      </motion.div>
    </div>
  );
}

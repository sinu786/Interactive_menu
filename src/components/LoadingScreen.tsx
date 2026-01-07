import { motion } from 'framer-motion';
import { restaurantConfig } from '../data/restaurant.config';

export function LoadingScreen() {
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-stone-100 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        {/* Logo or icon */}
        <motion.div
          className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-stone-900 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </motion.div>
        
        <h1 className="text-xl font-bold text-stone-900 mb-2">{restaurantConfig.name}</h1>
        <p className="text-sm text-stone-500 mb-6">Loading menu...</p>
        
        {/* Loading spinner */}
        <div className="spinner mx-auto" />
      </div>
    </motion.div>
  );
}

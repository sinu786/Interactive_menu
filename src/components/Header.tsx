import { motion } from 'framer-motion';
import { useAppStore } from '../state/store';
import { restaurantConfig } from '../data/restaurant.config';

interface HeaderProps {
  showARStatus?: boolean;
  darkMode?: boolean;
}

export function Header({ darkMode = false }: HeaderProps) {
  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);

  const bgClass = darkMode 
    ? 'bg-black/70 backdrop-blur-xl border-b border-white/10' 
    : 'bg-white/95 backdrop-blur-xl border-b border-gray-100';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const buttonClass = darkMode 
    ? 'bg-white/10 hover:bg-white/20 text-white' 
    : 'bg-gray-100 hover:bg-gray-200 text-gray-700';

  return (
    <motion.header
      className={`absolute top-0 left-0 right-0 z-30 safe-top ${bgClass}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Back button */}
        <button
          onClick={() => setViewMode('landing')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${buttonClass}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5"/>
            <path d="M12 19l-7-7 7-7"/>
          </svg>
        </button>

        {/* Center - Restaurant name */}
        <div className="flex flex-col items-center">
          <span className={`text-sm font-semibold ${textClass}`}>{restaurantConfig.name}</span>
          <span className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-400'}`}>
            {viewMode === '3d' ? '3D Menu' : 'AR View'}
          </span>
        </div>

        {/* Mode toggle */}
        <button
          onClick={() => setViewMode(viewMode === '3d' ? 'ar' : '3d')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${buttonClass}`}
          title={viewMode === '3d' ? 'Switch to AR' : 'Switch to 3D'}
        >
          {viewMode === '3d' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="12" cy="12" r="3"/>
              <path d="M3 9h2M19 9h2"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3L2 7.5V16.5L12 21L22 16.5V7.5L12 3Z"/>
              <path d="M12 12L22 7.5"/>
              <path d="M12 12V21"/>
              <path d="M12 12L2 7.5"/>
            </svg>
          )}
        </button>
      </div>
    </motion.header>
  );
}

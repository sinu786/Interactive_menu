import { motion } from 'framer-motion';
import { useAppStore } from '../state/store';

export function ARControls() {
  const arModelScale = useAppStore((s) => s.arModelScale);
  const setARModelScale = useAppStore((s) => s.setARModelScale);
  const resetARPlacement = useAppStore((s) => s.resetARPlacement);
  const arStatus = useAppStore((s) => s.arStatus);

  return (
    <motion.div
      className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Scale slider */}
      <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-3 flex flex-col items-center gap-2">
        <span className="text-xs text-white/70">Scale</span>
        
        {/* Vertical slider */}
        <div className="relative h-28 w-8 flex items-center justify-center">
          <div className="absolute h-full w-1 rounded-full bg-white/20" />
          <input
            type="range"
            min="0.3"
            max="2"
            step="0.1"
            value={arModelScale}
            onChange={(e) => setARModelScale(parseFloat(e.target.value))}
            className="absolute h-28 w-8 appearance-none bg-transparent cursor-pointer"
            style={{
              writingMode: 'vertical-lr',
              direction: 'rtl',
            }}
          />
        </div>
        
        <span className="text-xs text-white font-mono">
          {arModelScale.toFixed(1)}x
        </span>
      </div>

      {/* Reset button */}
      <button
        onClick={resetARPlacement}
        disabled={arStatus === 'searching'}
        className="bg-black/60 backdrop-blur-lg rounded-2xl p-3 flex flex-col items-center gap-1 hover:bg-black/70 transition-colors disabled:opacity-50 text-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
        <span className="text-xs text-white/70">Reset</span>
      </button>
    </motion.div>
  );
}

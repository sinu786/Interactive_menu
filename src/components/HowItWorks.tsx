import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/store';

const steps = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <path d="M12 18h.01"/>
      </svg>
    ),
    title: 'Scan QR Code',
    description: 'Point your camera at the QR code on your table.'
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L2 7.5V16.5L12 21L22 16.5V7.5L12 3Z"/>
        <path d="M12 12L22 7.5"/>
        <path d="M12 12V21"/>
        <path d="M12 12L2 7.5"/>
      </svg>
    ),
    title: 'Browse in 3D',
    description: 'Explore dishes as detailed 3D models.'
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: 'View in AR',
    description: 'Place dishes on your table in augmented reality.'
  }
];

export function HowItWorks() {
  const showHowItWorks = useAppStore((s) => s.showHowItWorks);
  const setShowHowItWorks = useAppStore((s) => s.setShowHowItWorks);

  return (
    <AnimatePresence>
      {showHowItWorks && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 z-50 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHowItWorks(false)}
          />

          {/* Modal */}
          <motion.div
            className="absolute inset-4 z-50 m-auto max-w-sm bg-white rounded-3xl overflow-hidden flex flex-col"
            style={{ height: 'fit-content', maxHeight: '80vh' }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-display text-xl font-bold text-gray-900">How It Works</h2>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18"/>
                  <path d="M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Steps */}
            <div className="p-5 space-y-5">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-0.5">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100">
              <button
                onClick={() => setShowHowItWorks(false)}
                className="w-full btn-primary"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MenuBrowser } from './components/MenuBrowser';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { Dashboard } from './dashboard/Dashboard';
import { useAppStore } from './state/store';

function App() {
  const showWelcome = useAppStore((s) => s.showWelcome);
  const appMode = useAppStore((s) => s.appMode);

  // Owner mode - show dashboard
  if (appMode === 'owner') {
    return <Dashboard />;
  }

  // Customer mode - show menu
  return (
    <div className="w-full h-full relative overflow-hidden bg-stone-50 fixed inset-0">
      <Suspense fallback={<LoadingScreen />}>
        <MenuBrowser />
      </Suspense>

      {/* Welcome Screen Overlay */}
      <AnimatePresence>
        {showWelcome && <WelcomeScreen />}
      </AnimatePresence>
    </div>
  );
}

export default App;

import { useEffect, useRef, useState, memo } from 'react';
import '../types/model-viewer.d.ts';

interface ModelThumbnailProps {
  src: string;
  alt: string;
}

export const ModelThumbnail = memo(function ModelThumbnail({ src, alt }: ModelThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Intersection Observer - only load when visible
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing once visible
          }
        });
      },
      { 
        rootMargin: '100px', // Start loading slightly before visible
        threshold: 0 
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Handle model load
  useEffect(() => {
    if (!isVisible) return;
    
    const model = modelRef.current;
    if (!model) return;

    const handleLoad = () => setIsLoaded(true);
    model.addEventListener('load', handleLoad);
    
    return () => model.removeEventListener('load', handleLoad);
  }, [isVisible]);

  return (
    <div 
      ref={containerRef}
      className="w-20 h-20 rounded-xl bg-gradient-to-br from-stone-100 to-stone-200 flex-shrink-0 relative overflow-hidden"
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-500 rounded-full animate-spin" />
        </div>
      )}

      {/* 3D Model - only render when in viewport */}
      {isVisible && (
        <model-viewer
          ref={modelRef}
          src={src}
          alt={alt}
          camera-orbit="25deg 65deg auto"
          min-camera-orbit="auto 30deg auto"
          max-camera-orbit="auto 90deg auto"
          field-of-view="38deg"
          auto-rotate
          rotation-per-second="30deg"
          interaction-prompt="none"
          shadow-intensity="0.5"
          shadow-softness="0.8"
          exposure="1.05"
          interpolation-decay="100"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            pointerEvents: 'none',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
          } as React.CSSProperties}
        />
      )}

      {/* 3D badge */}
      <div className="absolute bottom-1 right-1 bg-stone-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        3D
      </div>
    </div>
  );
});



import { useRef, useCallback } from 'react';

interface GestureState {
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  startDistance: number | null;
  startAngle: number | null;
  isDragging: boolean;
  isPinching: boolean;
}

interface GestureHandlers {
  onDragStart?: (x: number, y: number) => void;
  onDrag?: (deltaX: number, deltaY: number, x: number, y: number) => void;
  onDragEnd?: () => void;
  onPinchStart?: (distance: number) => void;
  onPinch?: (scale: number, rotation: number) => void;
  onPinchEnd?: () => void;
  onTap?: (x: number, y: number) => void;
}

export function useGestures(handlers: GestureHandlers) {
  const state = useRef<GestureState>({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    startDistance: null,
    startAngle: null,
    isDragging: false,
    isPinching: false
  });

  const getTouchDistance = (touches: TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchAngle = (touches: TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.atan2(dy, dx);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      state.current.startX = e.touches[0].clientX;
      state.current.startY = e.touches[0].clientY;
      state.current.lastX = e.touches[0].clientX;
      state.current.lastY = e.touches[0].clientY;
      state.current.isDragging = true;
      handlers.onDragStart?.(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      state.current.isDragging = false;
      state.current.isPinching = true;
      state.current.startDistance = getTouchDistance(e.touches);
      state.current.startAngle = getTouchAngle(e.touches);
      handlers.onPinchStart?.(state.current.startDistance);
    }
  }, [handlers]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (state.current.isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - state.current.lastX;
      const deltaY = e.touches[0].clientY - state.current.lastY;
      state.current.lastX = e.touches[0].clientX;
      state.current.lastY = e.touches[0].clientY;
      handlers.onDrag?.(deltaX, deltaY, e.touches[0].clientX, e.touches[0].clientY);
    } else if (state.current.isPinching && e.touches.length === 2) {
      const currentDistance = getTouchDistance(e.touches);
      const currentAngle = getTouchAngle(e.touches);
      
      const scale = state.current.startDistance 
        ? currentDistance / state.current.startDistance 
        : 1;
      const rotation = state.current.startAngle 
        ? currentAngle - state.current.startAngle 
        : 0;
      
      handlers.onPinch?.(scale, rotation);
    }
  }, [handlers]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (state.current.isDragging) {
      // Check if it was a tap (minimal movement)
      const dx = state.current.lastX - state.current.startX;
      const dy = state.current.lastY - state.current.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 10) {
        handlers.onTap?.(state.current.startX, state.current.startY);
      }
      
      handlers.onDragEnd?.();
      state.current.isDragging = false;
    }
    
    if (state.current.isPinching && e.touches.length < 2) {
      handlers.onPinchEnd?.();
      state.current.isPinching = false;
      state.current.startDistance = null;
      state.current.startAngle = null;
    }
  }, [handlers]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
}



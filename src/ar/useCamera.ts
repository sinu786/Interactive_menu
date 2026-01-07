import { useState, useEffect, useCallback, useRef } from 'react';

interface CameraState {
  stream: MediaStream | null;
  error: string | null;
  isLoading: boolean;
  isSupported: boolean;
}

function isSecureContext(): boolean {
  return window.isSecureContext || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
}

function isCameraAPIAvailable(): boolean {
  return typeof navigator !== 'undefined' && 
         'mediaDevices' in navigator && 
         typeof navigator.mediaDevices?.getUserMedia === 'function';
}

export function useCamera() {
  const [state, setState] = useState<CameraState>({
    stream: null,
    error: null,
    isLoading: false,
    isSupported: false
  });
  
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const supported = isCameraAPIAvailable() && isSecureContext();
    setState(prev => ({ ...prev, isSupported: supported }));
  }, []);

  const startCamera = useCallback(async () => {
    // Already have stream
    if (streamRef.current) {
      return streamRef.current;
    }

    if (!isSecureContext()) {
      setState({
        stream: null,
        error: 'Camera requires HTTPS',
        isLoading: false,
        isSupported: false
      });
      return null;
    }

    if (!isCameraAPIAvailable()) {
      setState({
        stream: null,
        error: 'Camera not available',
        isLoading: false,
        isSupported: false
      });
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      setState({
        stream,
        error: null,
        isLoading: false,
        isSupported: true
      });

      return stream;
    } catch (err) {
      let errorMessage = 'Camera access failed';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera in use by another app';
        }
      }
      
      setState({
        stream: null,
        error: errorMessage,
        isLoading: false,
        isSupported: true
      });
      return null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setState(prev => ({
      ...prev,
      stream: null,
      isLoading: false
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    ...state,
    startCamera,
    stopCamera,
    isSecureContext: isSecureContext()
  };
}

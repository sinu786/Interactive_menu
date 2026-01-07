import { useRef, useEffect, memo } from 'react';

interface CameraFeedProps {
  stream: MediaStream | null;
}

export const CameraFeed = memo(function CameraFeed({ stream }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (stream) {
      video.srcObject = stream;
      video.play().catch(() => {});
    } else {
      video.srcObject = null;
    }

    return () => {
      if (video) {
        video.srcObject = null;
      }
    };
  }, [stream]);

  if (!stream) {
    return (
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-3" style={{ borderTopColor: 'white' }} />
          <p className="text-white/60 text-sm">Starting camera...</p>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      playsInline
      muted
      style={{ transform: 'scaleX(1)' }}
    />
  );
});

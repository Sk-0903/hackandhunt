import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface VideoEntranceProps {
  onComplete: () => void;
  duration?: number; // Duration in seconds (3.0s to 3.6s)
}

export default function VideoEntrance({
  onComplete,
  duration = 3.6,
}: VideoEntranceProps) {
  const [exiting, setExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);
  const reduced = useReducedMotion();

  const handleFinish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setExiting(true);
    // Smooth dissolve timing
    setTimeout(() => {
      onComplete();
    }, 650);
  }, [onComplete]);

  // If user prefers reduced motion, skip instantly
  useEffect(() => {
    if (reduced) {
      onComplete();
    }
  }, [reduced, onComplete]);

  // Allow click or key to seamlessly dissolve into website
  useEffect(() => {
    const handleKey = () => handleFinish();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleFinish]);

  // Monitor video playback time
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime >= duration) {
      handleFinish();
    }
  };

  // Fallback timer in case autoplay is delayed
  useEffect(() => {
    const fallback = setTimeout(() => {
      handleFinish();
    }, (duration + 1.2) * 1000);
    return () => clearTimeout(fallback);
  }, [duration, handleFinish]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="video-entrance"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#050806] flex items-center justify-center overflow-hidden cursor-pointer select-none"
          onClick={handleFinish}
          aria-label="Hack & Hunt Entrance — click anywhere to enter"
        >
          {/* Ambient radial green aura behind the video */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(0, 230, 118, 0.08) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* Full-bleed Seamless Video Container */}
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            <video
              ref={videoRef}
              src="/videos/hackhunt.mp4"
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleFinish}
              onError={handleFinish}
              className="w-full h-full object-contain pointer-events-none"
              style={{
                background: '#050806',
              }}
            />
          </div>

          {/* Subtle minimal skip indicator in bottom right */}
          <div className="absolute bottom-6 right-8 z-10 pointer-events-none">
            <span className="label-mono text-[9px] tracking-widest opacity-35 hover:opacity-80 transition-opacity">
              CLICK ANYWHERE TO SKIP
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

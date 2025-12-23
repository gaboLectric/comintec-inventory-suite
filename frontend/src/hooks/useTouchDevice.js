import { useState, useEffect } from 'react';

/**
 * useTouchDevice Hook
 * 
 * A custom hook for detecting touch-capable devices.
 * Uses multiple detection methods for better accuracy.
 * 
 * @returns {boolean} - Whether the device supports touch
 */
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectTouch = () => {
      try {
        // Primary touch detection methods
        const hasTouch = (
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          // @ts-ignore - Legacy IE support
          navigator.msMaxTouchPoints > 0 ||
          // Check for touch events support
          'TouchEvent' in window
        );

        // If we have clear touch support, use that
        if (hasTouch) {
          setIsTouchDevice(true);
          return;
        }

        // Fallback: if no touch detected and viewport is small, likely mobile/touch
        const isSmallViewport = window.innerWidth < 768;
        setIsTouchDevice(isSmallViewport);
      } catch (error) {
        // Fallback: assume touch if viewport is small
        setIsTouchDevice(window.innerWidth < 768);
      }
    };

    // Initial detection
    detectTouch();

    // Re-detect on resize (for devices that can switch modes)
    window.addEventListener('resize', detectTouch);

    return () => {
      window.removeEventListener('resize', detectTouch);
    };
  }, []);

  return isTouchDevice;
}
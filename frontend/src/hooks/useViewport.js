import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

/**
 * useViewport Hook
 * 
 * A custom hook for detecting viewport size changes with debounced updates.
 * Provides current viewport dimensions, orientation info, and handles SSR safely.
 * 
 * @returns {Object} - Object containing width, height, orientation, and breakpoint info
 */
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    orientation: typeof window !== 'undefined' && window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  });

  // Debounce viewport changes to avoid excessive re-renders during resize
  const debouncedViewport = useDebounce(viewport, 100);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';
      
      setViewport({
        width,
        height,
        orientation
      });
    };

    // Handle orientation change events specifically
    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated after orientation change
      setTimeout(handleResize, 100);
    };

    // Set initial values
    handleResize();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Add breakpoint helpers
  const breakpoints = {
    isMobile: debouncedViewport.width < 768,
    isTablet: debouncedViewport.width >= 768 && debouncedViewport.width < 1024,
    isDesktop: debouncedViewport.width >= 1024,
    isSmallMobile: debouncedViewport.width < 480,
    isLargeMobile: debouncedViewport.width >= 480 && debouncedViewport.width < 768,
    // Orientation helpers
    isLandscape: debouncedViewport.orientation === 'landscape',
    isPortrait: debouncedViewport.orientation === 'portrait',
    // Viewport height helpers
    isShortViewport: debouncedViewport.height < 600,
    isTallViewport: debouncedViewport.height >= 800,
    // Combined mobile + orientation helpers
    isMobileLandscape: debouncedViewport.width < 768 && debouncedViewport.orientation === 'landscape',
    isMobilePortrait: debouncedViewport.width < 768 && debouncedViewport.orientation === 'portrait'
  };

  return {
    ...debouncedViewport,
    ...breakpoints
  };
}
import { useState, useEffect } from 'react';

/**
 * useMediaQuery Hook
 * 
 * A custom hook for detecting viewport changes using matchMedia API.
 * Provides responsive behavior with proper cleanup of event listeners.
 * 
 * @param {string} query - CSS media query string (e.g., '(max-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if matchMedia is supported
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Create event listener function
    const listener = (e) => setMatches(e.matches);

    // Add listener
    media.addEventListener('change', listener);

    // Cleanup function
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}
import { useState, useEffect } from 'react';

/**
 * useKeyboardHeight Hook
 * 
 * A custom hook for detecting virtual keyboard appearance on mobile devices.
 * Monitors viewport height changes to detect when keyboard is shown/hidden.
 * 
 * @returns {Object} - Object containing keyboard state and height
 */
export function useKeyboardHeight() {
  const [keyboardState, setKeyboardState] = useState({
    isVisible: false,
    height: 0,
    initialViewportHeight: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Store initial viewport height
    const initialHeight = window.innerHeight;
    setKeyboardState(prev => ({ ...prev, initialViewportHeight: initialHeight }));

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;
      
      // Consider keyboard visible if viewport height decreased by more than 150px
      // This threshold helps avoid false positives from browser UI changes
      const isKeyboardVisible = heightDifference > 150;
      const keyboardHeight = isKeyboardVisible ? heightDifference : 0;

      setKeyboardState({
        isVisible: isKeyboardVisible,
        height: keyboardHeight,
        initialViewportHeight: initialHeight
      });
    };

    // Handle visual viewport API if available (better for keyboard detection)
    if (window.visualViewport) {
      const handleVisualViewportChange = () => {
        const keyboardHeight = keyboardState.initialViewportHeight - window.visualViewport.height;
        const isKeyboardVisible = keyboardHeight > 150;

        setKeyboardState(prev => ({
          ...prev,
          isVisible: isKeyboardVisible,
          height: isKeyboardVisible ? keyboardHeight : 0
        }));
      };

      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
      
      return () => {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      };
    } else {
      // Fallback to window resize for older browsers
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [keyboardState.initialViewportHeight]);

  return keyboardState;
}
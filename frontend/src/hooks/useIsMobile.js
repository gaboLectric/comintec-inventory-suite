import { useMediaQuery } from './useMediaQuery';

/**
 * useIsMobile Hook
 * 
 * A wrapper around useMediaQuery specifically for detecting mobile viewports.
 * Uses the breakpoint defined in design tokens (768px).
 * 
 * @returns {boolean} - Whether the current viewport is mobile (< 768px)
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}
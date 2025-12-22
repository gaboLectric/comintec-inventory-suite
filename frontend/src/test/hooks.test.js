/**
 * Unit tests for custom hooks
 * Feature: macos-glassmorphism-redesign
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery, useIsMobile } from '../hooks';

describe('useMediaQuery Hook', () => {
  let mockMatchMedia;
  let mockMediaQueryList;

  beforeEach(() => {
    mockMediaQueryList = {
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockMatchMedia = vi.fn(() => mockMediaQueryList);
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial matches value', () => {
    mockMediaQueryList.matches = true;

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    
    expect(result.current).toBe(true);
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 768px)');
  });

  it('should return false when media query does not match', () => {
    mockMediaQueryList.matches = false;

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    
    expect(result.current).toBe(false);
  });

  it('should update when media query match changes', () => {
    mockMediaQueryList.matches = false;
    let changeListener;
    
    mockMediaQueryList.addEventListener.mockImplementation((event, listener) => {
      if (event === 'change') {
        changeListener = listener;
      }
    });

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    
    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      changeListener({ matches: true });
    });

    expect(result.current).toBe(true);
  });

  it('should add and remove event listeners correctly', () => {
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    
    unmount();
    
    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should handle different queries', () => {
    const { result, rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: '(max-width: 768px)' } }
    );
    
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 768px)');

    rerender({ query: '(max-width: 1024px)' });
    
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 1024px)');
  });
});

describe('useIsMobile Hook', () => {
  let mockMatchMedia;
  let mockMediaQueryList;

  beforeEach(() => {
    mockMediaQueryList = {
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    mockMatchMedia = vi.fn(() => mockMediaQueryList);
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false for desktop viewport', () => {
    mockMediaQueryList.matches = false;

    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(false);
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });

  it('should return true for mobile viewport', () => {
    mockMediaQueryList.matches = true;

    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(true);
  });

  it('should update when viewport changes', () => {
    mockMediaQueryList.matches = false;
    let changeListener;
    
    mockMediaQueryList.addEventListener.mockImplementation((event, listener) => {
      if (event === 'change') {
        changeListener = listener;
      }
    });

    const { result } = renderHook(() => useIsMobile());
    
    expect(result.current).toBe(false);

    // Simulate viewport change to mobile
    act(() => {
      changeListener({ matches: true });
    });

    expect(result.current).toBe(true);

    // Simulate viewport change back to desktop
    act(() => {
      changeListener({ matches: false });
    });

    expect(result.current).toBe(false);
  });
});
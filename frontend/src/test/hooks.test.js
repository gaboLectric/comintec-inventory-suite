/**
 * Unit tests for custom hooks
 * Feature: macos-glassmorphism-redesign
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery, useIsMobile, useViewport, useTouchDevice } from '../hooks';

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

describe('useViewport Hook', () => {
  let originalInnerWidth;
  let originalInnerHeight;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    // Mock addEventListener and removeEventListener
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
    vi.restoreAllMocks();
  });

  it('should return initial viewport dimensions', () => {
    const { result } = renderHook(() => useViewport());
    
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it('should identify desktop viewport correctly', () => {
    window.innerWidth = 1200;
    
    const { result } = renderHook(() => useViewport());
    
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
  });

  it('should identify mobile viewport correctly', () => {
    window.innerWidth = 375;
    
    const { result } = renderHook(() => useViewport());
    
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isSmallMobile).toBe(true);
  });

  it('should identify tablet viewport correctly', () => {
    window.innerWidth = 800;
    
    const { result } = renderHook(() => useViewport());
    
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should add resize event listener', () => {
    renderHook(() => useViewport());
    
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should remove resize event listener on unmount', () => {
    const { unmount } = renderHook(() => useViewport());
    
    unmount();
    
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});

describe('useTouchDevice Hook', () => {
  let originalTouchStart;
  let originalMaxTouchPoints;
  let originalInnerWidth;

  beforeEach(() => {
    originalTouchStart = window.ontouchstart;
    originalMaxTouchPoints = navigator.maxTouchPoints;
    originalInnerWidth = window.innerWidth;

    // Mock addEventListener and removeEventListener
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  afterEach(() => {
    window.ontouchstart = originalTouchStart;
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: originalMaxTouchPoints,
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  it('should detect touch device via ontouchstart', () => {
    window.ontouchstart = null; // Touch supported
    
    const { result } = renderHook(() => useTouchDevice());
    
    expect(result.current).toBe(true);
  });

  it('should detect touch device via maxTouchPoints', () => {
    delete window.ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 1,
    });
    
    const { result } = renderHook(() => useTouchDevice());
    
    expect(result.current).toBe(true);
  });

  it('should detect non-touch device', () => {
    delete window.ontouchstart;
    delete window.TouchEvent;
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    const { result } = renderHook(() => useTouchDevice());
    
    expect(result.current).toBe(false);
  });

  it('should fallback to viewport size detection', () => {
    delete window.ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // Small viewport
    });
    
    const { result } = renderHook(() => useTouchDevice());
    
    expect(result.current).toBe(true);
  });

  it('should add resize event listener', () => {
    renderHook(() => useTouchDevice());
    
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should remove resize event listener on unmount', () => {
    const { unmount } = renderHook(() => useTouchDevice());
    
    unmount();
    
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
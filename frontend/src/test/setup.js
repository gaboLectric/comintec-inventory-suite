import '@testing-library/jest-dom';
import '../app.css'; // Import CSS to make CSS variables available in tests

// Mock matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Setup DOM for CSS custom properties access
beforeEach(() => {
  // Ensure CSS custom properties are available
  document.documentElement.style.setProperty('--space-0', '0px');
  document.documentElement.style.setProperty('--space-1', '4px');
  document.documentElement.style.setProperty('--space-2', '8px');
  document.documentElement.style.setProperty('--space-3', '12px');
  document.documentElement.style.setProperty('--space-4', '16px');
  document.documentElement.style.setProperty('--space-5', '20px');
  document.documentElement.style.setProperty('--space-6', '24px');
  document.documentElement.style.setProperty('--space-7', '28px');
  document.documentElement.style.setProperty('--space-8', '32px');
});
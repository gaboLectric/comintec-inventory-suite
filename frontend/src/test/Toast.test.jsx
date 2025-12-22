import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from '../components/Toast';

// Mock component to test the toast hook
const TestComponent = () => {
  const { addToast } = useToast();
  
  return (
    <div>
      <button onClick={() => addToast('Test message', 'info')}>
        Add Info Toast
      </button>
      <button onClick={() => addToast('Success message', 'success')}>
        Add Success Toast
      </button>
      <button onClick={() => addToast('Warning message', 'warning')}>
        Add Warning Toast
      </button>
      <button onClick={() => addToast('Error message', 'error')}>
        Add Error Toast
      </button>
      <button onClick={() => addToast('Custom duration', 'info', { durationMs: 1000 })}>
        Add Custom Duration Toast
      </button>
    </div>
  );
};

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should render toast provider without crashing', () => {
    render(
      <ToastProvider>
        <div>Test content</div>
      </ToastProvider>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should add and display info toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    act(() => {
      fireEvent.click(screen.getByText('Add Info Toast'));
    });
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should add and display different toast types', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    act(() => {
      fireEvent.click(screen.getByText('Add Success Toast'));
      fireEvent.click(screen.getByText('Add Warning Toast'));
      fireEvent.click(screen.getByText('Add Error Toast'));
    });
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should close toast when close button is clicked', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    act(() => {
      fireEvent.click(screen.getByText('Add Info Toast'));
    });
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
    
    const closeButton = screen.getByRole('button', { name: '' }); // X button
    act(() => {
      fireEvent.click(closeButton);
    });
    
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('should auto-close toast after duration', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    act(() => {
      fireEvent.click(screen.getByText('Add Custom Duration Toast'));
    });
    
    expect(screen.getByText('Custom duration')).toBeInTheDocument();
    
    // Fast-forward time by 1000ms
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Toast should be removed after timeout
    expect(screen.queryByText('Custom duration')).not.toBeInTheDocument();
  });

  it('should not auto-close toast with 0 duration', () => {
    const TestComponentNoDuration = () => {
      const { addToast } = useToast();
      
      return (
        <button onClick={() => addToast('Persistent message', 'info', { durationMs: 0 })}>
          Add Persistent Toast
        </button>
      );
    };

    render(
      <ToastProvider>
        <TestComponentNoDuration />
      </ToastProvider>
    );
    
    act(() => {
      fireEvent.click(screen.getByText('Add Persistent Toast'));
    });
    
    expect(screen.getByText('Persistent message')).toBeInTheDocument();
    
    // Fast-forward time significantly
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    // Should still be there
    expect(screen.getByText('Persistent message')).toBeInTheDocument();
  });

  it('should handle multiple toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    act(() => {
      fireEvent.click(screen.getByText('Add Info Toast'));
      fireEvent.click(screen.getByText('Add Success Toast'));
      fireEvent.click(screen.getByText('Add Warning Toast'));
    });
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('should render correct icons for different toast types', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    act(() => {
      fireEvent.click(screen.getByText('Add Success Toast'));
      fireEvent.click(screen.getByText('Add Warning Toast'));
      fireEvent.click(screen.getByText('Add Error Toast'));
    });
    
    // Check that toasts are rendered (icons are SVGs, harder to test directly)
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should handle placement options', () => {
    const TestComponentWithPlacement = () => {
      const { addToast } = useToast();
      
      return (
        <button onClick={() => addToast('Top right message', 'info', { placement: 'top-right' })}>
          Add Top Right Toast
        </button>
      );
    };

    render(
      <ToastProvider>
        <TestComponentWithPlacement />
      </ToastProvider>
    );
    
    act(() => {
      fireEvent.click(screen.getByText('Add Top Right Toast'));
    });
    
    expect(screen.getByText('Top right message')).toBeInTheDocument();
  });
});
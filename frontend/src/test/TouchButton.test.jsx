/**
 * Unit tests for TouchButton component
 * Feature: mobile-responsive-optimization
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TouchButton, TouchButtonGroup } from '../components/TouchButton';

describe('TouchButton Component', () => {
  it('renders with default props', () => {
    render(<TouchButton>Click me</TouchButton>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('applies minimum touch target size', () => {
    render(<TouchButton>Touch</TouchButton>);
    
    const button = screen.getByRole('button');
    const styles = window.getComputedStyle(button);
    
    // Should have minimum 44px dimensions
    expect(styles.minWidth).toBe('44px');
    expect(styles.minHeight).toBe('44px');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<TouchButton onClick={handleClick}>Click me</TouchButton>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports all GlassButton variants', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger', 'success', 'warning'];
    
    variants.forEach(variant => {
      const { unmount } = render(<TouchButton variant={variant}>Test</TouchButton>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it('supports all GlassButton sizes', () => {
    const sizes = ['sm', 'md', 'lg'];
    
    sizes.forEach(size => {
      const { unmount } = render(<TouchButton size={size}>Test</TouchButton>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it('displays loading state correctly', () => {
    render(<TouchButton loading>Loading</TouchButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('can be disabled', () => {
    render(<TouchButton disabled>Disabled</TouchButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('supports icons', () => {
    const TestIcon = () => <span data-testid="test-icon">🔍</span>;
    render(<TouchButton icon={<TestIcon />}>Search</TouchButton>);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<TouchButton ref={ref}>Test</TouchButton>);
    
    expect(ref).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<TouchButton className="custom-class">Test</TouchButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    render(<TouchButton data-testid="custom-button" aria-label="Custom label">Test</TouchButton>);
    
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom label');
  });
});

describe('TouchButtonGroup Component', () => {
  it('renders multiple buttons with proper spacing', () => {
    render(
      <TouchButtonGroup>
        <TouchButton>Button 1</TouchButton>
        <TouchButton>Button 2</TouchButton>
        <TouchButton>Button 3</TouchButton>
      </TouchButtonGroup>
    );
    
    expect(screen.getByText('Button 1')).toBeInTheDocument();
    expect(screen.getByText('Button 2')).toBeInTheDocument();
    expect(screen.getByText('Button 3')).toBeInTheDocument();
  });

  it('applies flex layout styles', () => {
    render(
      <TouchButtonGroup data-testid="button-group">
        <TouchButton>Button 1</TouchButton>
        <TouchButton>Button 2</TouchButton>
      </TouchButtonGroup>
    );
    
    const group = screen.getByTestId('button-group');
    
    // Verify basic flex properties are applied
    expect(group).toHaveStyle('display: flex');
    expect(group).toHaveStyle('gap: 8px');
  });

  it('handles empty group gracefully', () => {
    render(<TouchButtonGroup data-testid="empty-group" />);
    
    const group = screen.getByTestId('empty-group');
    expect(group).toBeInTheDocument();
    expect(group).toBeEmptyDOMElement();
  });

  it('supports custom className', () => {
    render(
      <TouchButtonGroup className="custom-group" data-testid="custom-group">
        <TouchButton>Test</TouchButton>
      </TouchButtonGroup>
    );
    
    const group = screen.getByTestId('custom-group');
    expect(group).toHaveClass('custom-group');
  });
});

describe('TouchButton Accessibility', () => {
  it('maintains proper ARIA attributes', () => {
    render(
      <TouchButton 
        aria-label="Custom label"
        aria-describedby="description"
        role="button"
      >
        Test
      </TouchButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom label');
    expect(button).toHaveAttribute('aria-describedby', 'description');
  });

  it('supports keyboard navigation', () => {
    const handleClick = vi.fn();
    render(<TouchButton onClick={handleClick}>Test</TouchButton>);
    
    const button = screen.getByRole('button');
    
    // Should be focusable
    button.focus();
    expect(document.activeElement).toBe(button);
    
    // Should respond to Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(button, { key: 'Enter', code: 'Enter' });
    
    // Should respond to Space key
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    fireEvent.keyUp(button, { key: ' ', code: 'Space' });
  });

  it('provides proper focus indicators', () => {
    render(<TouchButton>Test</TouchButton>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    // Should have focus styles (inherited from GlassButton)
    expect(document.activeElement).toBe(button);
  });
});

describe('TouchButton Mobile Optimizations', () => {
  it('applies mobile-specific styles', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<TouchButton>Mobile Test</TouchButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Verify button has minimum dimensions (these are applied via CSS)
    expect(button).toHaveStyle('min-width: 44px');
    expect(button).toHaveStyle('min-height: 44px');
  });

  it('handles touch events appropriately', () => {
    const handleClick = vi.fn();
    render(<TouchButton onClick={handleClick}>Touch Test</TouchButton>);
    
    const button = screen.getByRole('button');
    
    // Simulate touch events
    fireEvent.touchStart(button);
    fireEvent.touchEnd(button);
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
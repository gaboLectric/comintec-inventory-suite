/**
 * Unit tests for GlassButton component
 * Feature: macos-glassmorphism-redesign
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlassButton } from '../components/GlassButton';

// Mock icon component
const MockIcon = () => <svg data-testid="mock-icon"><path /></svg>;

describe('GlassButton Component', () => {
  it('should render children correctly', () => {
    render(<GlassButton>Click me</GlassButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply default variant and size', () => {
    render(<GlassButton data-testid="glass-button">Default Button</GlassButton>);
    const button = screen.getByTestId('glass-button');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should render with different variants', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger'];
    
    variants.forEach(variant => {
      render(
        <GlassButton variant={variant} data-testid={`button-${variant}`}>
          {variant} Button
        </GlassButton>
      );
      
      const button = screen.getByTestId(`button-${variant}`);
      expect(button).toBeInTheDocument();
    });
  });

  it('should render with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'];
    
    sizes.forEach(size => {
      render(
        <GlassButton size={size} data-testid={`button-${size}`}>
          {size} Button
        </GlassButton>
      );
      
      const button = screen.getByTestId(`button-${size}`);
      expect(button).toBeInTheDocument();
    });
  });

  it('should render with icon', () => {
    render(
      <GlassButton icon={<MockIcon />} data-testid="button-with-icon">
        Button with Icon
      </GlassButton>
    );
    
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('Button with Icon')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    render(
      <GlassButton loading={true} data-testid="loading-button">
        Loading Button
      </GlassButton>
    );
    
    const button = screen.getByTestId('loading-button');
    expect(button).toBeDisabled();
  });

  it('should handle disabled state', () => {
    render(
      <GlassButton disabled={true} data-testid="disabled-button">
        Disabled Button
      </GlassButton>
    );
    
    const button = screen.getByTestId('disabled-button');
    expect(button).toBeDisabled();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    
    render(
      <GlassButton onClick={handleClick} data-testid="clickable-button">
        Clickable Button
      </GlassButton>
    );
    
    const button = screen.getByTestId('clickable-button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not trigger click when disabled', () => {
    const handleClick = vi.fn();
    
    render(
      <GlassButton onClick={handleClick} disabled={true} data-testid="disabled-clickable">
        Disabled Clickable
      </GlassButton>
    );
    
    const button = screen.getByTestId('disabled-clickable');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not trigger click when loading', () => {
    const handleClick = vi.fn();
    
    render(
      <GlassButton onClick={handleClick} loading={true} data-testid="loading-clickable">
        Loading Clickable
      </GlassButton>
    );
    
    const button = screen.getByTestId('loading-clickable');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should forward ref correctly', () => {
    let buttonRef;
    
    render(
      <GlassButton ref={(ref) => { buttonRef = ref; }}>
        Ref Button
      </GlassButton>
    );
    
    expect(buttonRef).toBeTruthy();
    expect(buttonRef.tagName).toBe('BUTTON');
  });

  it('should accept custom className', () => {
    render(
      <GlassButton className="custom-button-class" data-testid="custom-button">
        Custom Button
      </GlassButton>
    );
    
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveClass('custom-button-class');
  });
});
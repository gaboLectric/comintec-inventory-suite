/**
 * Unit tests for GlassInput component
 * Feature: macos-glassmorphism-redesign
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlassInput } from '../components/GlassInput';

// Mock icon component
const MockIcon = () => <svg data-testid="mock-icon"><path /></svg>;

describe('GlassInput Component', () => {
  it('should render input field correctly', () => {
    render(<GlassInput placeholder="Enter text" data-testid="glass-input" />);
    
    const input = screen.getByTestId('glass-input');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  it('should render with label', () => {
    render(
      <GlassInput 
        label="Username" 
        placeholder="Enter username"
        data-testid="input-with-label" 
      />
    );
    
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByTestId('input-with-label')).toBeInTheDocument();
  });

  it('should render with icon', () => {
    render(
      <GlassInput 
        icon={<MockIcon />}
        placeholder="Search..."
        data-testid="input-with-icon"
      />
    );
    
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('input-with-icon')).toBeInTheDocument();
  });

  it('should render with error message', () => {
    render(
      <GlassInput 
        error="This field is required"
        placeholder="Enter value"
        data-testid="input-with-error"
      />
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByTestId('input-with-error')).toBeInTheDocument();
  });

  it('should handle input changes', () => {
    const handleChange = vi.fn();
    
    render(
      <GlassInput 
        onChange={handleChange}
        placeholder="Type here"
        data-testid="changeable-input"
      />
    );
    
    const input = screen.getByTestId('changeable-input');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('test value');
  });

  it('should handle focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <GlassInput 
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Focus me"
        data-testid="focusable-input"
      />
    );
    
    const input = screen.getByTestId('focusable-input');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled state', () => {
    render(
      <GlassInput 
        disabled={true}
        placeholder="Disabled input"
        data-testid="disabled-input"
      />
    );
    
    const input = screen.getByTestId('disabled-input');
    expect(input).toBeDisabled();
  });

  it('should forward ref correctly', () => {
    let inputRef;
    
    render(
      <GlassInput 
        ref={(ref) => { inputRef = ref; }}
        placeholder="Ref input"
      />
    );
    
    expect(inputRef).toBeTruthy();
    expect(inputRef.tagName).toBe('INPUT');
  });

  it('should accept custom className', () => {
    const { container } = render(
      <GlassInput 
        className="custom-input-class"
        placeholder="Custom input"
        data-testid="custom-input"
      />
    );
    
    const inputContainer = container.firstChild;
    expect(inputContainer).toHaveClass('custom-input-class');
  });

  it('should render complete form field with all props', () => {
    render(
      <GlassInput 
        label="Email Address"
        icon={<MockIcon />}
        error="Invalid email format"
        placeholder="Enter your email"
        type="email"
        data-testid="complete-input"
      />
    );
    
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    
    const input = screen.getByTestId('complete-input');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter your email');
  });

  it('should support text input type', () => {
    render(
      <GlassInput 
        type="text"
        placeholder="text input"
        data-testid="input-text"
      />
    );
    
    const input = screen.getByTestId('input-text');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should support email input type', () => {
    render(
      <GlassInput 
        type="email"
        placeholder="email input"
        data-testid="input-email"
      />
    );
    
    const input = screen.getByTestId('input-email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should support password input type', () => {
    render(
      <GlassInput 
        type="password"
        placeholder="password input"
        data-testid="input-password"
      />
    );
    
    const input = screen.getByTestId('input-password');
    expect(input).toHaveAttribute('type', 'password');
  });
});
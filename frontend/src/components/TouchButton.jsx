import styled from '@emotion/styled';
import { forwardRef, memo } from 'react';
import { GlassButton } from './GlassButton';

/**
 * TouchButton Component
 * 
 * A mobile-optimized button component that extends GlassButton with touch-friendly features:
 * - Minimum 44px x 44px touch targets (iOS/Android guidelines)
 * - Proper spacing between buttons (8px minimum)
 * - Enhanced touch feedback and interactions
 * - Optimized for finger navigation
 * - Full accessibility support with ARIA labels and keyboard navigation
 */

const TouchButtonContainer = styled(GlassButton)`
  /* Ensure minimum touch target size of 44px x 44px */
  min-width: 44px;
  min-height: 44px;
  
  /* Enhanced touch feedback */
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0.1);
  touch-action: manipulation;
  
  /* Improved touch responsiveness */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  
  /* Accessibility: Enhanced focus indicators */
  &:focus-visible {
    outline: 3px solid var(--accent-blue);
    outline-offset: 2px;
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.15);
  }
  
  /* Remove default focus outline for mouse users */
  &:focus:not(:focus-visible) {
    outline: none;
  }
  
  /* Enhanced active state for touch */
  &:active:not(:disabled) {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
  
  /* Ensure proper spacing when used in groups */
  &:not(:last-child) {
    margin-right: 8px;
    margin-bottom: 8px;
  }
  
  /* Mobile-specific optimizations */
  @media (max-width: 767px) {
    /* Slightly larger padding for better touch experience */
    padding: var(--space-3) var(--space-4);
    
    /* Ensure minimum font size for readability and prevent zoom on iOS */
    font-size: max(var(--font-size-md), 16px);
    
    /* Enhanced touch feedback on mobile */
    &:hover:not(:disabled) {
      /* Reduce hover effects on touch devices */
      transform: none;
    }
    
    &:active:not(:disabled) {
      transform: scale(0.95);
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    /* Enhanced focus for mobile keyboard navigation */
    &:focus-visible {
      outline: 4px solid var(--accent-blue);
      outline-offset: 3px;
    }
  }
  
  /* Tablet optimizations */
  @media (min-width: 768px) and (max-width: 1023px) {
    min-width: 48px;
    min-height: 48px;
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border: 2px solid currentColor;
    
    &:focus-visible {
      outline: 4px solid currentColor;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

/**
 * TouchButtonGroup - Container for multiple TouchButtons with proper spacing
 */
const TouchButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  
  /* Accessibility: Ensure proper role and labeling */
  role: group;
  
  /* Stack vertically on small mobile screens for better accessibility */
  @media (max-width: 479px) {
    flex-direction: column;
    align-items: stretch;
    
    /* Reset button margins in vertical layout */
    & > * {
      margin-right: 0;
      margin-bottom: 0;
      width: 100%;
    }
  }
  
  /* Horizontal layout on larger screens */
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: flex-start;
  }
`;

/**
 * Generate accessible button label for screen readers and voice control
 */
const generateAccessibleLabel = (children, variant, loading, disabled) => {
  let label = '';
  
  // Add button text
  if (typeof children === 'string') {
    label = children;
  } else if (children) {
    label = 'Botón';
  }
  
  // Add variant context for screen readers
  if (variant === 'danger') {
    label = `${label} (acción destructiva)`;
  } else if (variant === 'primary') {
    label = `${label} (acción principal)`;
  }
  
  // Add state information
  if (loading) {
    label = `${label} - Cargando`;
  } else if (disabled) {
    label = `${label} - Deshabilitado`;
  }
  
  return label.trim();
};

const TouchButton = memo(forwardRef(({ 
  children, 
  variant = 'secondary', 
  size = 'md', 
  icon, 
  loading = false,
  disabled = false,
  className,
  onClick,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  'aria-pressed': ariaPressed,
  role = 'button',
  ...props 
}, ref) => {
  
  // Generate accessible label if not provided
  const accessibleLabel = ariaLabel || generateAccessibleLabel(children, variant, loading, disabled);
  
  const handleClick = (e) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  
  const handleKeyDown = (e) => {
    // Ensure Enter and Space keys work for button activation
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };
  
  return (
    <TouchButtonContainer
      ref={ref}
      variant={variant}
      size={size}
      icon={icon}
      loading={loading}
      disabled={disabled}
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={accessibleLabel}
      aria-describedby={ariaDescribedby}
      aria-pressed={ariaPressed}
      aria-disabled={disabled}
      aria-busy={loading}
      role={role}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </TouchButtonContainer>
  );
}));

TouchButton.displayName = 'TouchButton';

export { TouchButton, TouchButtonGroup };
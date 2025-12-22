import styled from '@emotion/styled';
import { forwardRef, memo } from 'react';

/**
 * GlassCard Component
 * 
 * A reusable card component with glassmorphism effects.
 * Supports different variants (light, medium, strong) and padding options.
 */

const getGlassVariant = (variant) => {
  switch (variant) {
    case 'light':
      return {
        background: 'var(--glass-bg-light)',
        border: '1px solid var(--glass-border)',
        shadow: 'var(--glass-shadow)'
      };
    case 'strong':
      return {
        background: 'var(--glass-bg-strong)',
        border: '1px solid var(--glass-border)',
        shadow: 'var(--glass-shadow-elevated)'
      };
    case 'medium':
    default:
      return {
        background: 'var(--glass-bg-medium)',
        border: '1px solid var(--glass-border)',
        shadow: 'var(--glass-shadow)'
      };
  }
};

const getPadding = (padding) => {
  switch (padding) {
    case 'sm':
      return 'var(--space-3)';
    case 'lg':
      return 'var(--space-6)';
    case 'md':
    default:
      return 'var(--space-4)';
  }
};

const CardContainer = styled.div`
  ${props => {
    const variant = getGlassVariant(props.$variant);
    return `
      background: ${variant.background};
      border: ${variant.border};
      box-shadow: ${variant.shadow};
    `;
  }}
  
  backdrop-filter: blur(var(--glass-blur-medium));
  -webkit-backdrop-filter: blur(var(--glass-blur-medium));
  
  border-radius: 12px;
  padding: ${props => getPadding(props.$padding)};
  
  position: relative;
  overflow: hidden;
  
  transition: all var(--transition-normal);
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(16px)) {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color-strong);
  }
  
  ${props => props.$hover && `
    &:hover {
      border-color: var(--glass-border-hover);
      transform: translateY(-2px);
      box-shadow: var(--glass-shadow-elevated);
    }
  `}
`;

const GlassCard = memo(forwardRef(({ 
  children, 
  variant = 'medium', 
  padding = 'md', 
  hover = false, 
  className,
  ...props 
}, ref) => {
  return (
    <CardContainer
      ref={ref}
      $variant={variant}
      $padding={padding}
      $hover={hover}
      className={className}
      {...props}
    >
      {children}
    </CardContainer>
  );
}));

GlassCard.displayName = 'GlassCard';

export { GlassCard };
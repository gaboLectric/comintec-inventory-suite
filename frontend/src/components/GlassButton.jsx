import styled from '@emotion/styled';
import { forwardRef, memo } from 'react';

/**
 * GlassButton Component
 * 
 * A button component with glassmorphism effects.
 * Supports different variants (primary, secondary, ghost, danger) and sizes (sm, md, lg).
 */

const getButtonVariant = (variant) => {
  switch (variant) {
    case 'primary':
      return {
        background: '#FF6B35', // Naranja vibrante
        color: 'white',
        border: '1px solid #FF6B35',
        hoverBackground: '#E85A2A',
        hoverOpacity: '1'
      };
    case 'secondary':
      return {
        background: '#3B82F6', // Azul sólido
        color: 'white',
        border: '1px solid #3B82F6',
        hoverBackground: '#2563EB',
        hoverOpacity: '1'
      };
    case 'ghost':
      return {
        background: 'transparent',
        color: 'var(--font-color-primary)',
        border: '1px solid var(--glass-border)',
        hoverBackground: 'var(--glass-bg-light)',
        hoverBorder: 'var(--glass-border-hover)'
      };
    case 'danger':
      return {
        background: '#EF4444', // Rojo sólido
        color: 'white',
        border: '1px solid #EF4444',
        hoverBackground: '#DC2626',
        hoverOpacity: '1'
      };
    case 'success':
      return {
        background: '#22C55E', // Verde sólido
        color: 'white',
        border: '1px solid #22C55E',
        hoverBackground: '#16A34A',
        hoverOpacity: '1'
      };
    case 'warning':
      return {
        background: '#F59E0B', // Amarillo/Ámbar sólido
        color: 'white',
        border: '1px solid #F59E0B',
        hoverBackground: '#D97706',
        hoverOpacity: '1'
      };
    default:
      return getButtonVariant('secondary');
  }
};

const getButtonSize = (size) => {
  switch (size) {
    case 'sm':
      return {
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--font-size-sm)',
        height: '32px',
        iconSize: '14px'
      };
    case 'lg':
      return {
        padding: 'var(--space-4) var(--space-6)',
        fontSize: 'var(--font-size-lg)',
        height: '48px',
        iconSize: '20px'
      };
    case 'md':
    default:
      return {
        padding: 'var(--space-3) var(--space-5)',
        fontSize: 'var(--font-size-md)',
        height: '40px',
        iconSize: '16px'
      };
  }
};

const ButtonContainer = styled.button`
  ${props => {
    const variant = getButtonVariant(props.$variant);
    const size = getButtonSize(props.$size);
    
    return `
      background: ${variant.background};
      color: ${variant.color};
      border: ${variant.border};
      padding: ${size.padding};
      font-size: ${size.fontSize};
      height: ${size.height};
    `;
  }}
  
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  
  border-radius: 8px;
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  
  cursor: pointer;
  transition: all var(--transition-fast);
  
  position: relative;
  overflow: hidden;
  
  /* Remove default button styles */
  outline: none;
  text-decoration: none;
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    ${props => {
      const variant = getButtonVariant(props.$variant);
      if (variant.background.includes('var(--glass-bg')) {
        return 'background: var(--bg-tertiary);';
      }
      return '';
    }}
  }
  
  &:hover:not(:disabled) {
    ${props => {
      const variant = getButtonVariant(props.$variant);
      return `
        ${variant.hoverBackground ? `background: ${variant.hoverBackground};` : ''}
        ${variant.hoverBorder ? `border-color: ${variant.hoverBorder};` : ''}
        ${variant.hoverOpacity ? `opacity: ${variant.hoverOpacity};` : ''}
        transform: translateY(-1px);
      `;
    }}
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  ${props => props.$loading && `
    cursor: wait;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: ${props => getButtonSize(props.$size).iconSize};
    height: ${props => getButtonSize(props.$size).iconSize};
  }
`;

const ButtonText = styled.span`
  ${props => props.$loading && `
    opacity: 0;
  `}
`;

const GlassButton = memo(forwardRef(({ 
  children, 
  variant = 'secondary', 
  size = 'md', 
  icon, 
  loading = false,
  disabled = false,
  className,
  ...props 
}, ref) => {
  return (
    <ButtonContainer
      ref={ref}
      $variant={variant}
      $size={size}
      $loading={loading}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {icon && !loading && (
        <IconWrapper $size={size}>
          {icon}
        </IconWrapper>
      )}
      <ButtonText $loading={loading}>
        {children}
      </ButtonText>
    </ButtonContainer>
  );
}));

GlassButton.displayName = 'GlassButton';

export { GlassButton };
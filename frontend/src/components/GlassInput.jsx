import styled from '@emotion/styled';
import { forwardRef } from 'react';

/**
 * GlassInput Component
 * 
 * An input component with glassmorphism effects.
 * Supports label, error message, and icon.
 */

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
`;

const Label = styled.label`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--font-color-primary);
  margin-bottom: var(--space-1);
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputField = styled.input`
  width: 100%;
  padding: var(--space-3) var(--space-4);
  ${props => props.$hasIcon && 'padding-left: var(--space-8);'}
  
  background: var(--glass-bg-medium);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  color: var(--font-color-primary);
  
  transition: all var(--transition-fast);
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color-medium);
  }
  
  &::placeholder {
    color: var(--font-color-light);
  }
  
  &:focus {
    outline: none;
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    background: var(--glass-bg-strong);
  }
  
  &:hover:not(:focus) {
    border-color: var(--glass-border-hover);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--glass-bg-light);
  }
  
  ${props => props.$error && `
    border-color: var(--accent-red);
    
    &:focus {
      border-color: var(--accent-red);
      box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
    }
  `}
`;

const IconWrapper = styled.div`
  position: absolute;
  left: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--font-color-light);
  pointer-events: none;
  z-index: 1;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ErrorMessage = styled.div`
  font-size: var(--font-size-xs);
  color: var(--accent-red);
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-1);
`;

const GlassInput = forwardRef(({ 
  label,
  error,
  icon,
  className,
  ...props 
}, ref) => {
  return (
    <InputContainer className={className}>
      {label && <Label>{label}</Label>}
      <InputWrapper>
        {icon && (
          <IconWrapper>
            {icon}
          </IconWrapper>
        )}
        <InputField
          ref={ref}
          $hasIcon={!!icon}
          $error={!!error}
          {...props}
        />
      </InputWrapper>
      {error && (
        <ErrorMessage>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {error}
        </ErrorMessage>
      )}
    </InputContainer>
  );
});

GlassInput.displayName = 'GlassInput';

export { GlassInput };
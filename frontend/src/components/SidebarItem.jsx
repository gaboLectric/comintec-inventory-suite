import styled from '@emotion/styled';
import { Link, useLocation } from 'react-router-dom';

const StyledLink = styled(Link, {
  shouldForwardProp: (prop) => !['$active'].includes(prop)
})`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  color: var(--font-color-secondary);
  text-decoration: none;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  position: relative;
  border: 1px solid transparent;
  
  /* Mobile: Ensure proper touch targets */
  @media (max-width: 767px) {
    min-height: 44px;
    padding: var(--space-3) var(--space-4);
    font-size: var(--font-size-sm);
  }

  &:hover {
    background: var(--glass-bg-light);
    backdrop-filter: blur(var(--glass-blur-light));
    -webkit-backdrop-filter: blur(var(--glass-blur-light));
    color: var(--font-color-primary);
    border-color: var(--glass-border);
    
    /* Fallback for browsers without backdrop-filter support */
    @supports not (backdrop-filter: blur(10px)) {
      background: var(--bg-tertiary);
    }
  }

  ${props => props.$active && `
    background: var(--glass-bg-medium);
    backdrop-filter: blur(var(--glass-blur-medium));
    -webkit-backdrop-filter: blur(var(--glass-blur-medium));
    color: var(--font-color-primary);
    font-weight: var(--font-weight-semibold);
    border-color: var(--glass-border-hover);
    box-shadow: var(--glass-shadow);

    /* Fallback for browsers without backdrop-filter support */
    @supports not (backdrop-filter: blur(16px)) {
      background: var(--bg-tertiary);
      border-color: var(--border-color-strong);
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--accent-orange);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      box-shadow: 0 0 8px rgba(255, 107, 53, 0.3);
    }
  `}

  svg {
    width: 20px;
    height: 20px;
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }

  &:hover svg {
    transform: scale(1.05);
  }
  
  span {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export function SidebarItem({ icon: Icon, label, to }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <StyledLink to={to} $active={isActive}>
      {Icon && <Icon />}
      <span>{label}</span>
    </StyledLink>
  );
}

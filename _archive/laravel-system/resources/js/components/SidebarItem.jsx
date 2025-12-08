import styled from '@emotion/styled';
import { Link, useLocation } from 'react-router-dom';

const SidebarItemContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  color: var(--font-color-secondary);
  text-decoration: none;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  transition: all var(--anim-duration-fast);
  position: relative;

  &:hover {
    background: var(--bg-tertiary);
    color: var(--font-color-primary);
  }

  ${props => props.$active && `
    background: var(--bg-tertiary);
    color: var(--font-color-primary);
    font-weight: var(--font-weight-semibold);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(135deg, #FFD700 0%, #DAA520 100%);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }
  `}

  svg {
    width: 20px;
    height: 20px;
  }
`;

// Aplicar shouldForwardProp para evitar que $active se pase al DOM
const StyledLink = styled(Link, {
  shouldForwardProp: (prop) => !['$active'].includes(prop)
})`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  color: #a1a09a;
  text-decoration: none;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  transition: all var(--anim-duration-fast);
  position: relative;

  &:hover {
    background: #3e3e3a;
    color: #eeeeec;
  }

  ${props => props.$active && `
    background: #3e3e3a;
    color: #eeeeec;
    font-weight: var(--font-weight-semibold);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }
  `}

  svg {
    width: 20px;
    height: 20px;
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

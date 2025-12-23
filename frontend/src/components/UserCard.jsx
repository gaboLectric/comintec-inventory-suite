import React from 'react';
import styled from '@emotion/styled';
import { MobileCard } from './MobileCard';

/**
 * UserCard Component
 * 
 * Specialized mobile card for user data display.
 * Shows name, email, level, and actions in mobile-optimized layout.
 */

const ActionButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
  /* Minimum touch target size */
  min-width: 44px;
  min-height: 44px;
  
  &:hover:not(:disabled) {
    background: var(--glass-bg-light);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusBadge = styled.span`
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => props.$status === 'active' ? `
    background-color: var(--brand-green-2);
    color: var(--brand-green-9);
  ` : `
    background-color: var(--brand-red-2);
    color: var(--brand-red-9);
  `}
`;

const LevelBadge = styled.span`
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  
  ${props => {
    switch (props.$level) {
      case 1:
        return `
          background-color: var(--brand-purple-2);
          color: var(--brand-purple-9);
        `;
      case 2:
        return `
          background-color: var(--brand-blue-2);
          color: var(--brand-blue-9);
        `;
      default:
        return `
          background-color: var(--glass-bg-medium);
          color: var(--font-color-secondary);
        `;
    }
  }}
`;

export function UserCard({ 
  user, 
  onEdit, 
  onDelete,
  ...props 
}) {
  // Get user level display text
  const getUserLevel = () => {
    if (user.kind === 'admin') return 'Admin (PB)';
    switch (user.user_level) {
      case 1: return 'Admin';
      case 2: return 'Especial';
      default: return 'Usuario';
    }
  };

  // Get user status
  const getUserStatus = () => {
    return user.status === 1 ? 'active' : 'inactive';
  };

  // Check if user can be edited/deleted
  const isSystemAdmin = user.kind === 'admin';

  // Prepare actions
  const actions = (
    <div style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}>
      <ActionButton 
        onClick={(e) => {
          e.stopPropagation();
          if (!isSystemAdmin) onEdit?.(user);
        }}
        disabled={isSystemAdmin}
        title={isSystemAdmin ? 'No editable' : 'Editar'}
        style={{ color: isSystemAdmin ? 'var(--font-color-tertiary)' : '#3B82F6' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </ActionButton>
      
      <ActionButton 
        onClick={(e) => {
          e.stopPropagation();
          if (!isSystemAdmin) onDelete?.(user.id);
        }}
        disabled={isSystemAdmin}
        title={isSystemAdmin ? 'No eliminable' : 'Eliminar'}
        style={{ color: isSystemAdmin ? 'var(--font-color-tertiary)' : '#EF4444' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3,6 5,6 21,6"/>
          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      </ActionButton>
    </div>
  );

  // Prepare footer content with badges
  const footerContent = (
    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
      <LevelBadge $level={user.user_level}>
        {getUserLevel()}
      </LevelBadge>
      <StatusBadge $status={getUserStatus()}>
        {getUserStatus() === 'active' ? 'Activo' : 'Inactivo'}
      </StatusBadge>
    </div>
  );

  return (
    <MobileCard
      item={user}
      titleField="name"
      subtitleField="email"
      actions={actions}
      footerContent={footerContent}
      variant="medium"
      {...props}
    />
  );
}
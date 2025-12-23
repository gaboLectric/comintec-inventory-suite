import React from 'react';
import styled from '@emotion/styled';
import { MobileCard } from './MobileCard';

/**
 * SupplyCard Component
 * 
 * Specialized mobile card for supply data display.
 * Shows name, stock status, quantities, and actions in mobile-optimized layout.
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
  
  &:hover {
    background: var(--glass-bg-light);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const StockStatus = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--font-weight-semibold);
  
  ${props => props.$isLowStock ? `
    color: var(--brand-red-9);
  ` : `
    color: var(--brand-green-9);
  `}
`;

const StockBadge = styled.span`
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => props.$isLowStock ? `
    background-color: var(--brand-red-2);
    color: var(--brand-red-9);
  ` : `
    background-color: var(--brand-green-2);
    color: var(--brand-green-9);
  `}
`;

const QuantityDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  
  ${props => props.$isLowStock && `
    color: var(--brand-red-9);
  `}
`;

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/>
    <path d="m12 17 .01 0"/>
  </svg>
);

export function SupplyCard({ 
  supply, 
  onEdit, 
  onDelete,
  canEdit = false,
  ...props 
}) {
  // Check if stock is low
  const isLowStock = supply.piezas < supply.stock_deseado;

  // Prepare actions (only if user can edit)
  const actions = canEdit ? (
    <div style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}>
      <ActionButton 
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(supply);
        }}
        title="Editar"
        style={{ color: '#FF6B35' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </ActionButton>
      
      <ActionButton 
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(supply.id);
        }}
        title="Eliminar"
        style={{ color: 'var(--brand-red-9)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3,6 5,6 21,6"/>
          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      </ActionButton>
    </div>
  ) : null;

  // Custom quantity display for the card body
  const quantityField = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <span style={{ 
        fontSize: 'var(--font-size-sm)', 
        color: 'var(--font-color-secondary)', 
        fontWeight: 'var(--font-weight-medium)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        Piezas
      </span>
      <QuantityDisplay $isLowStock={isLowStock}>
        {supply.piezas}
        {isLowStock && <AlertIcon />}
      </QuantityDisplay>
    </div>
  );

  // Custom stock desired field
  const stockDesiredField = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <span style={{ 
        fontSize: 'var(--font-size-sm)', 
        color: 'var(--font-color-secondary)', 
        fontWeight: 'var(--font-weight-medium)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        Stock Deseado
      </span>
      <span style={{ 
        fontSize: 'var(--font-size-sm)', 
        color: 'var(--font-color-primary)',
        fontWeight: 'var(--font-weight-medium)'
      }}>
        {supply.stock_deseado}
      </span>
    </div>
  );

  // Footer with status badge
  const footerContent = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <StockBadge $isLowStock={isLowStock}>
        {isLowStock ? 'Bajo Stock' : 'OK'}
      </StockBadge>
      
      {isLowStock && (
        <span style={{ 
          fontSize: 'var(--font-size-xs)', 
          color: 'var(--brand-red-8)',
          fontWeight: 'var(--font-weight-medium)'
        }}>
          Faltan {supply.stock_deseado - supply.piezas} piezas
        </span>
      )}
    </div>
  );

  return (
    <MobileCard
      item={supply}
      titleField="nombre"
      actions={actions}
      footerContent={footerContent}
      variant={isLowStock ? 'light' : 'medium'}
      {...props}
    >
      {/* Custom body content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {quantityField}
        {stockDesiredField}
      </div>
    </MobileCard>
  );
}
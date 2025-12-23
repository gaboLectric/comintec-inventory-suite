import React from 'react';
import styled from '@emotion/styled';
import { MobileCard } from './MobileCard';
import pb from '../services/pocketbase';

/**
 * EquipmentCard Component
 * 
 * Specialized mobile card for equipment data display.
 * Shows image, product name, key details, and actions in mobile-optimized layout.
 */

const StatusBadge = styled.span`
  background-color: var(--brand-blue-2);
  color: var(--brand-blue-9);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
`;

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

export function EquipmentCard({ 
  equipment, 
  onView, 
  onEdit, 
  onQR, 
  onImageClick,
  userLevel,
  ...props 
}) {
  // Get image URL if available
  const getImageUrl = () => {
    const mediaRecord = equipment.expand?.media_id;
    if (mediaRecord && mediaRecord.file) {
      return pb.files.getUrl(mediaRecord, mediaRecord.file, { thumb: '100x100' });
    }
    return null;
  };

  // Prepare actions
  const actions = (
    <div style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}>
      {equipment.vendido && (
        <StatusBadge>
          Vendido
        </StatusBadge>
      )}
      
      {userLevel <= 2 && (
        <ActionButton 
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(equipment);
          }}
          title="Editar"
          style={{ color: '#FF6B35' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </ActionButton>
      )}
      
      <ActionButton 
        onClick={(e) => {
          e.stopPropagation();
          onView?.(equipment);
        }}
        title="Ver detalles"
        style={{ color: 'var(--font-color-secondary)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </ActionButton>
      
      <ActionButton 
        onClick={(e) => {
          e.stopPropagation();
          onQR?.(equipment);
        }}
        title="Ver QR"
        style={{ color: '#FF6B35' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="5" height="5" x="3" y="3" rx="1"/>
          <rect width="5" height="5" x="16" y="3" rx="1"/>
          <rect width="5" height="5" x="3" y="16" rx="1"/>
          <path d="m21 16-3.5-3.5-3.5 3.5"/>
          <path d="m21 21-3.5-3.5-3.5 3.5"/>
        </svg>
      </ActionButton>
    </div>
  );

  // Handle image click
  const handleImageClick = () => {
    const mediaRecord = equipment.expand?.media_id;
    if (mediaRecord && mediaRecord.file) {
      const fullUrl = pb.files.getUrl(mediaRecord, mediaRecord.file);
      onImageClick?.(fullUrl);
    }
  };

  // Prepare image element with lazy loading
  const imageElement = getImageUrl() ? (
    <img 
      src={getImageUrl()} 
      alt="Equipo"
      style={{ cursor: 'pointer' }}
      onClick={(e) => {
        e.stopPropagation();
        handleImageClick();
      }}
      loading="lazy" // Enable lazy loading for performance
      onError={(e) => {
        // Hide broken images gracefully
        e.target.style.display = 'none';
      }}
    />
  ) : null;

  return (
    <MobileCard
      item={equipment}
      titleField="producto"
      subtitleField="codigo"
      imageField="image" // We'll handle this custom
      actions={actions}
      secondaryFields={['marca', 'modelo', 'numero_serie', 'pedimento', 'observaciones']}
      variant="medium"
      {...props}
    >
      {/* Custom image handling */}
      {imageElement && (
        <div style={{ 
          width: 48, 
          height: 48, 
          borderRadius: 'var(--radius-sm)', 
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {imageElement}
        </div>
      )}
    </MobileCard>
  );
}
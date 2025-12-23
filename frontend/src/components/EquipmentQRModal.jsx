import React from 'react';
import { MobileModal } from './MobileModal';
import { QRCodeGenerator } from './QRCodeGenerator';
import styled from '@emotion/styled';

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-color-light);
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: var(--font-weight-medium);
  color: var(--font-color-secondary);
  font-size: var(--font-size-sm);
`;

const Value = styled.span`
  color: var(--font-color-primary);
  font-size: var(--font-size-sm);
  text-align: right;
  max-width: 60%;
`;

const DetailsContainer = styled.div`
  margin-top: var(--space-4);
  background: var(--bg-tertiary);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
`;

export const EquipmentQRModal = ({ isOpen, onClose, equipment }) => {
  if (!equipment) return null;

  return (
    <MobileModal
      isOpen={isOpen}
      onClose={onClose}
      title="Código QR de Equipo"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <QRCodeGenerator equipment={equipment} />
        
        <DetailsContainer>
          <DetailRow>
            <Label>Producto</Label>
            <Value>{equipment.producto}</Value>
          </DetailRow>
          <DetailRow>
            <Label>Marca</Label>
            <Value>{equipment.marca || '-'}</Value>
          </DetailRow>
          <DetailRow>
            <Label>Modelo</Label>
            <Value>{equipment.modelo || '-'}</Value>
          </DetailRow>
          <DetailRow>
            <Label>No. Serie</Label>
            <Value>{equipment.numero_serie}</Value>
          </DetailRow>
          <DetailRow>
            <Label>Código</Label>
            <Value>{equipment.codigo || '-'}</Value>
          </DetailRow>
          <DetailRow>
            <Label>Pedimento</Label>
            <Value>{equipment.pedimento || '-'}</Value>
          </DetailRow>
          <DetailRow>
            <Label>ID Sistema</Label>
            <Value style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{equipment.id}</Value>
          </DetailRow>
        </DetailsContainer>
      </div>
    </MobileModal>
  );
};

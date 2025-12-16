import React from 'react';
import styled from '@emotion/styled';
import { Modal, ImageModal } from './Modal';
import { X } from 'lucide-react';
import pb from '../services/pocketbase';

const DetailRow = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color-light);
  padding: var(--space-3) 0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.div`
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-secondary);
  width: 140px;
  flex-shrink: 0;
`;

const DetailValue = styled.div`
  color: var(--font-color-primary);
  flex-grow: 1;
  word-break: break-word;
`;

const ImageContainer = styled.div`
  margin-bottom: var(--space-4);
  display: flex;
  justify-content: center;
  background: var(--bg-tertiary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  img {
    max-width: 100%;
    max-height: 300px;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-md);
  }
`;

export function EquipmentDetailModal({ isOpen, onClose, equipment }) {
  const [isImageExpanded, setIsImageExpanded] = React.useState(false);

  if (!equipment) return null;

  const mediaRecord = equipment.expand?.media_id;
  const imageUrl = mediaRecord && mediaRecord.file 
    ? pb.files.getURL(mediaRecord, mediaRecord.file) 
    : null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Equipo">
        {imageUrl && (
          <ImageContainer onClick={() => setIsImageExpanded(true)}>
            <img src={imageUrl} alt={equipment.producto} />
          </ImageContainer>
        )}

        <DetailRow>
          <DetailLabel>Producto</DetailLabel>
          <DetailValue>{equipment.producto}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Código</DetailLabel>
          <DetailValue>{equipment.codigo || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Marca</DetailLabel>
          <DetailValue>{equipment.marca || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Modelo</DetailLabel>
          <DetailValue>{equipment.modelo || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>No. Serie</DetailLabel>
          <DetailValue>{equipment.numero_serie}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Pedimento</DetailLabel>
          <DetailValue>{equipment.pedimento || '-'}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Observaciones</DetailLabel>
          <DetailValue>{equipment.observaciones || '-'}</DetailValue>
        </DetailRow>
      </Modal>

      <ImageModal 
        isOpen={isImageExpanded} 
        onClose={() => setIsImageExpanded(false)} 
        imageUrl={imageUrl} 
        altText={equipment.producto}
      />
    </>
  );
}

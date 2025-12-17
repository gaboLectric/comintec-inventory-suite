import React from 'react';
import styled from '@emotion/styled';
import { Modal } from './Modal';
import { ButtonStyled } from './CommonStyled';
import { AlertTriangle } from 'lucide-react';

const ConfirmationContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
  padding: var(--space-2);
`;

const WarningIcon = styled.div`
  color: #f59f00;
  background: rgba(245, 159, 0, 0.1);
  padding: var(--space-3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Message = styled.p`
  color: var(--font-color-primary);
  font-size: var(--font-size-md);
  margin: 0;
  line-height: 1.5;
`;

const DetailText = styled.p`
  color: var(--font-color-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-3);
  width: 100%;
  margin-top: var(--space-2);
`;

const ConfirmButton = styled(ButtonStyled)`
  background-color: var(--brand-red-9);
  color: white;
  flex: 1;
  
  &:hover {
    background-color: var(--brand-red-10);
  }
`;

const CancelButton = styled(ButtonStyled)`
  background-color: var(--bg-tertiary);
  color: var(--font-color-primary);
  flex: 1;
  
  &:hover {
    background-color: var(--border-color-strong);
  }
`;

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, details }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title || "Confirmación"}>
            <ConfirmationContent>
                <WarningIcon>
                    <AlertTriangle size={32} />
                </WarningIcon>
                <Message>{message}</Message>
                {details && <DetailText>{details}</DetailText>}
                
                <ButtonGroup>
                    <CancelButton type="button" onClick={onClose}>
                        Cancelar
                    </CancelButton>
                    <ConfirmButton type="button" onClick={onConfirm}>
                        Confirmar
                    </ConfirmButton>
                </ButtonGroup>
            </ConfirmationContent>
        </Modal>
    );
}

import React from 'react';
import styled from '@emotion/styled';
import { MobileModal } from './MobileModal';
import { ButtonStyled } from './CommonStyled';
import { LogOut } from 'lucide-react';

const LogoutContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
  padding: var(--space-2);
`;

const IconWrapper = styled.div`
  color: var(--brand-blue-9);
  background: var(--bg-transparent-blue);
  padding: var(--space-4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-2);
`;

const Message = styled.p`
  color: var(--font-color-primary);
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
`;

const DetailText = styled.p`
  color: var(--font-color-secondary);
  font-size: var(--font-size-md);
  margin: 0;
  max-width: 280px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-3);
  width: 100%;
  margin-top: var(--space-4);
`;

const ConfirmButton = styled(ButtonStyled)`
  background-color: var(--brand-red-9);
  color: white;
  flex: 1;
  font-weight: 600;
  
  &:hover {
    background-color: var(--brand-red-10);
  }
`;

const CancelButton = styled(ButtonStyled)`
  background-color: var(--bg-tertiary);
  color: var(--font-color-primary);
  flex: 1;
  border: 1px solid var(--border-color);
  
  &:hover {
    background-color: var(--border-color-strong);
  }
`;

export function LogoutModal({ isOpen, onClose, onConfirm }) {
    const actions = (
        <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
                Cancelar
            </CancelButton>
            <ConfirmButton type="button" onClick={onConfirm}>
                Cerrar Sesión
            </ConfirmButton>
        </ButtonGroup>
    );

    return (
        <MobileModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Cerrar Sesión" 
            actions={actions}
        >
            <LogoutContent>
                <IconWrapper>
                    <LogOut size={40} />
                </IconWrapper>
                <Message>¿Estás seguro de que deseas salir?</Message>
                <DetailText>
                    Tendrás que volver a ingresar tus credenciales para acceder al sistema.
                </DetailText>
            </LogoutContent>
        </MobileModal>
    );
}

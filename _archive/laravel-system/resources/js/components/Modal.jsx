import styled from '@emotion/styled';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
`;

const ModalContainerStyled = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-md);
  max-width: ${props => props.$size === 'large' ? '800px' : '500px'};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-super-heavy);
`;

const ModalContainer = styled(ModalContainerStyled, {
  shouldForwardProp: (prop) => !['$size'].includes(prop)
})`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color-strong);
  border-radius: var(--radius-md);
  max-width: ${props => props.$size === 'large' ? '800px' : '500px'};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-super-heavy);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-5);
  border-bottom: 1px solid var(--border-color-strong);
`;

const ModalTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--font-color-secondary);
  cursor: pointer;
  padding: var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--anim-duration-fast);
  
  &:hover {
    color: var(--font-color-primary);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const ModalBody = styled.div`
  padding: var(--space-5);
`;

export function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <Overlay onClick={handleOverlayClick}>
            <ModalContainer $size={size}>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    <CloseButton onClick={onClose}>
                        <X />
                    </CloseButton>
                </ModalHeader>
                <ModalBody>
                    {children}
                </ModalBody>
            </ModalContainer>
        </Overlay>
    );
}

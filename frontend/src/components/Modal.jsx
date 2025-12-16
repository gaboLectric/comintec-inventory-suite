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
  max-width: ${props => {
    if (props.$size === 'large') return '800px';
    if (props.$size === 'xl') return '95vw';
    return '500px';
  }};
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
  max-width: ${props => {
    if (props.$size === 'large') return '800px';
    if (props.$size === 'xl') return '95vw';
    return '500px';
  }};
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

export function ImageModal({ isOpen, onClose, imageUrl, altText }) {
    if (!isOpen) return null;
    
    return (
        <Overlay onClick={onClose}>
            <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', justifyContent: 'center' }}>
                <img 
                    src={imageUrl} 
                    alt={altText || 'Imagen expandida'} 
                    style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-super-heavy)' }} 
                />
                <CloseButton 
                    onClick={onClose} 
                    style={{ position: 'absolute', top: '-40px', right: '0', color: 'white', background: 'rgba(0,0,0,0.5)', borderRadius: '50%' }}
                >
                    <X />
                </CloseButton>
            </div>
        </Overlay>
    );
}


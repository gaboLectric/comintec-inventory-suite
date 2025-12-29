import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: var(--space-4);
  animation: ${fadeIn} var(--transition-normal);
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(8px)) {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const ModalContainer = styled.div`
  background: var(--glass-bg-strong);
  backdrop-filter: blur(var(--glass-blur-strong));
  -webkit-backdrop-filter: blur(var(--glass-blur-strong));
  border: 1px solid var(--glass-border-hover);
  border-radius: var(--radius-xl);
  max-width: ${props => {
    if (props.$size === 'large') return '800px';
    if (props.$size === 'xl') return '95vw';
    return '500px';
  }};
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: var(--glass-shadow-elevated);
  animation: ${scaleIn} var(--transition-normal);
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(24px)) {
    background: var(--bg-secondary);
    border-color: var(--border-color-strong);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-5);
  border-bottom: 1px solid var(--glass-border);
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-tertiary);
    border-bottom-color: var(--border-color-strong);
  }
`;

const ModalTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  background: var(--glass-bg-medium);
  backdrop-filter: blur(var(--glass-blur-medium));
  -webkit-backdrop-filter: blur(var(--glass-blur-medium));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-rounded);
  color: var(--font-color-secondary);
  cursor: pointer;
  padding: var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  width: 36px;
  height: 36px;
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(16px)) {
    background: var(--bg-quaternary);
    border-color: var(--border-color-strong);
  }
  
  &:hover {
    background: var(--glass-bg-strong);
    border-color: var(--glass-border-hover);
    color: var(--font-color-primary);
    transform: scale(1.05);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalBody = styled.div`
  padding: var(--space-5);
  overflow-y: auto;
  max-height: calc(90vh - 120px); /* Account for header height */
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
            <div style={{ 
                position: 'relative', 
                maxWidth: '90vw', 
                maxHeight: '90vh', 
                display: 'flex', 
                justifyContent: 'center',
                animation: `${scaleIn} var(--transition-normal)`
            }}>
                <img 
                    src={imageUrl} 
                    alt={altText || 'Imagen expandida'} 
                    style={{ 
                        maxWidth: '100%', 
                        maxHeight: '90vh', 
                        borderRadius: 'var(--radius-xl)', 
                        boxShadow: 'var(--glass-shadow-elevated)',
                        border: '1px solid var(--glass-border-hover)'
                    }} 
                />
                <CloseButton 
                    onClick={onClose} 
                    style={{ 
                        position: 'absolute', 
                        top: '-50px', 
                        right: '0', 
                        background: 'var(--glass-bg-strong)',
                        backdropFilter: 'blur(var(--glass-blur-strong))',
                        WebkitBackdropFilter: 'blur(var(--glass-blur-strong))',
                        border: '1px solid var(--glass-border-hover)'
                    }}
                >
                    <X />
                </CloseButton>
            </div>
        </Overlay>
    );
}


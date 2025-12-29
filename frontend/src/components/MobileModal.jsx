import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useViewport } from '../hooks/useViewport';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
  z-index: 99999; /* Increased to maximum to ensure it's above everything */
  animation: ${fadeIn} var(--transition-normal);
  
  /* Mobile: Full screen overlay */
  @media (max-width: 767px) {
    padding: 0;
    align-items: flex-end;
  }
  
  /* Desktop: Centered with padding */
  @media (min-width: 768px) {
    padding: var(--space-4);
  }
  
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
  overflow: hidden;
  box-shadow: var(--glass-shadow-elevated);
  display: flex;
  flex-direction: column;
  outline: none;
  
  @media (max-width: 767px) {
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    max-height: 100vh;
    max-height: 100dvh;
    border-radius: 0;
    border: none;
    animation: ${slideUp} var(--transition-normal);
    
    /* Ensure modal fits in short viewports */
    @media (max-height: 599px) {
      height: 100vh;
      height: 100dvh;
      max-height: 100vh;
      max-height: 100dvh;
    }
    
    /* Landscape: ensure content is accessible */
    @media (orientation: landscape) and (max-height: 500px) {
      height: 100vh;
      height: 100dvh;
      max-height: 100vh;
      max-height: 100dvh;
    }
  }
  
  @media (min-width: 768px) {
    border-radius: var(--radius-xl);
    max-width: ${props => {
      if (props.$size === 'large') return '800px';
      if (props.$size === 'xl') return '95vw';
      return '500px';
    }};
    width: 100%;
    max-height: 90vh;
    max-height: 90dvh;
    animation: ${scaleIn} var(--transition-normal);
  }
  
  @supports not (backdrop-filter: blur(24px)) {
    background: var(--bg-secondary);
    border-color: var(--border-color-strong);
  }
  
  @media (prefers-contrast: high) {
    border: 3px solid currentColor;
    background: var(--bg-primary);
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
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
  flex-shrink: 0;
  position: relative;
  z-index: 100; /* Ensure header is above modal content */
  
  /* Mobile: Sticky header with safe area */
  @media (max-width: 767px) {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: var(--space-4);
    padding-top: calc(var(--space-4) + env(safe-area-inset-top, 0px));
  }
  
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
  
  /* Mobile: Slightly smaller title */
  @media (max-width: 767px) {
    font-size: var(--font-size-lg);
  }
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
  
  /* Accessibility: Enhanced focus indicators */
  &:focus-visible {
    outline: 3px solid var(--accent-blue);
    outline-offset: 2px;
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.15);
  }
  
  /* Remove default focus outline for mouse users */
  &:focus:not(:focus-visible) {
    outline: none;
  }
  
  /* Mobile: Larger touch target */
  @media (max-width: 767px) {
    width: 44px;
    height: 44px;
    padding: var(--space-3);
    
    /* Enhanced focus for mobile */
    &:focus-visible {
      outline: 4px solid var(--accent-blue);
      outline-offset: 3px;
    }
  }
  
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
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border: 2px solid currentColor;
    
    &:focus-visible {
      outline: 4px solid currentColor;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:hover {
      transform: none;
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
    
    /* Mobile: Larger icon */
    @media (max-width: 767px) {
      width: 24px;
      height: 24px;
    }
  }
`;

const ModalBody = styled.div`
  padding: var(--space-5);
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scroll */
  flex: 1;
  
  /* Accessibility: Focus management */
  outline: none;
  
  /* Mobile: Full height scrolling with safe area */
  @media (max-width: 767px) {
    padding: var(--space-4);
    padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
    min-height: 0; /* Allow flex child to shrink */
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
    
    /* Landscape: More compact padding to save space */
    @media (orientation: landscape) {
      padding: var(--space-3);
      padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom, 0px));
    }
    
    /* Short viewport: Minimal padding */
    @media (max-height: 599px) {
      padding: var(--space-2);
      padding-bottom: calc(var(--space-2) + env(safe-area-inset-bottom, 0px));
    }
  }
  
  /* Desktop: Limited height with scroll */
  @media (min-width: 768px) {
    max-height: calc(90vh - 120px); /* Account for header height */
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  padding: var(--space-5);
  border-top: 1px solid var(--glass-border);
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  flex-shrink: 0;
  
  /* Mobile: Fixed bottom actions with safe area */
  @media (max-width: 767px) {
    z-index: 10;
    padding: var(--space-4);
    padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
    flex-direction: column;
    
    & > * {
      width: 100%;
      min-height: 44px; /* Touch target minimum */
    }
    
    /* Landscape: Horizontal layout to save vertical space */
    @media (orientation: landscape) {
      flex-direction: row;
      padding: var(--space-3);
      padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom, 0px));
      
      & > * {
        width: auto;
        flex: 1;
      }
    }
    
    /* Short viewport: Minimal padding */
    @media (max-height: 599px) {
      padding: var(--space-2);
      padding-bottom: calc(var(--space-2) + env(safe-area-inset-bottom, 0px));
    }
  }
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-tertiary);
    border-top-color: var(--border-color-strong);
  }
`;

/**
 * Focus trap hook for modal accessibility
 */
const useFocusTrap = (isOpen, containerRef) => {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        // Find close button and trigger click
        const closeButton = container.querySelector('[aria-label*="Cerrar"]');
        closeButton?.click();
      }
    };

    // Focus first element when modal opens
    setTimeout(() => {
      firstElement?.focus();
    }, 100);

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, containerRef]);
};

export function MobileModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions,
  size = 'medium',
  fullScreen = false,
  bottomSheet = false,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy
}) {
  const { isMobile } = useViewport();
  const modalRef = useRef(null);
  
  // Use focus trap for accessibility
  useFocusTrap(isOpen, modalRef);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent background scrolling on mobile
      if (isMobile) {
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Close sidebar if it's open on mobile when modal opens
        const sidebarBackdrop = document.querySelector('div[style*="opacity: 1"]');
        if (sidebarBackdrop) {
          // Dispatch a custom event to close the sidebar
          window.dispatchEvent(new CustomEvent('closeSidebar'));
        }
      }
      
      // Announce modal opening to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `Modal abierto: ${title}`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isOpen, isMobile, title]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isMobile) {
      onClose();
    }
  };

  const handleCloseClick = () => {
    // Announce modal closing to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Modal cerrado';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
    
    onClose();
  };

  // Force full screen on mobile or when explicitly requested
  const shouldUseFullScreen = isMobile || fullScreen;

  const modalContent = (
    <Overlay onClick={handleOverlayClick} style={{ zIndex: 99999, position: 'fixed' }}>
      <ModalContainer 
        ref={modalRef}
        $size={size} 
        $fullScreen={shouldUseFullScreen} 
        $bottomSheet={bottomSheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy || 'modal-title'}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        style={{ zIndex: 99999 }}
      >
        <ModalHeader>
          <ModalTitle id="modal-title">{title}</ModalTitle>
          <CloseButton 
            onClick={handleCloseClick} 
            aria-label={`Cerrar modal: ${title}`}
            type="button"
          >
            <X />
          </CloseButton>
        </ModalHeader>
        <ModalBody role="document" tabIndex={-1}>
          {children}
        </ModalBody>
        {actions && (
          <ModalActions role="group" aria-label="Acciones del modal">
            {actions}
          </ModalActions>
        )}
      </ModalContainer>
    </Overlay>
  );

  // Render modal using portal to ensure it's at the top level of DOM
  return createPortal(modalContent, document.body);
}

export function MobileImageModal({ 
  isOpen, 
  onClose, 
  imageUrl, 
  altText,
  'aria-describedby': ariaDescribedBy 
}) {
  const { isMobile } = useViewport();
  const modalRef = useRef(null);
  
  // Use focus trap for accessibility
  useFocusTrap(isOpen, modalRef);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (isMobile) {
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
      }
      
      // Announce image modal opening to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `Imagen expandida: ${altText || 'Imagen'}`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isOpen, isMobile, altText]);

  if (!isOpen) return null;
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = () => {
    // Announce image modal closing to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Imagen cerrada';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
    
    onClose();
  };

  const modalContent = (
    <Overlay onClick={handleOverlayClick} style={{ zIndex: 99999, position: 'fixed' }}>
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Imagen expandida: ${altText || 'Imagen'}`}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        style={{ 
          position: 'relative', 
          maxWidth: isMobile ? '100vw' : '90vw', 
          maxHeight: isMobile ? '100vh' : '90vh', 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          animation: `${isMobile ? slideUp : scaleIn} var(--transition-normal)`,
          width: isMobile ? '100%' : 'auto',
          height: isMobile ? '100%' : 'auto',
          outline: 'none',
          zIndex: 99999
        }}
      >
        <img 
          src={imageUrl} 
          alt={altText || 'Imagen expandida'} 
          role="img"
          style={{ 
            maxWidth: '100%', 
            maxHeight: isMobile ? '100vh' : '90vh', 
            borderRadius: isMobile ? '0' : 'var(--radius-xl)', 
            boxShadow: 'var(--glass-shadow-elevated)',
            border: isMobile ? 'none' : '1px solid var(--glass-border-hover)',
            objectFit: 'contain'
          }} 
        />
        <CloseButton 
          onClick={handleCloseClick}
          aria-label={`Cerrar imagen: ${altText || 'Imagen'}`}
          type="button"
          style={{ 
            position: 'absolute', 
            top: isMobile ? 'calc(var(--space-4) + env(safe-area-inset-top, 0px))' : '-50px', 
            right: isMobile ? 'var(--space-4)' : '0', 
            background: 'var(--glass-bg-strong)',
            backdropFilter: 'blur(var(--glass-blur-strong))',
            WebkitBackdropFilter: 'blur(var(--glass-blur-strong))',
            border: '1px solid var(--glass-border-hover)',
            width: isMobile ? '44px' : '36px',
            height: isMobile ? '44px' : '36px',
            zIndex: 20
          }}
        >
          <X size={isMobile ? 24 : 20} />
        </CloseButton>
      </div>
    </Overlay>
  );

  // Render modal using portal to ensure it's at the top level of DOM
  return createPortal(modalContent, document.body);
}
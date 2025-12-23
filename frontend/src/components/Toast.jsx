import React, { useEffect, createContext, useContext, useState, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ToastContainer = styled.div`
  position: fixed;
    right: var(--space-5);
    ${props => props.$placement === 'top-right' ? 'top: var(--space-5);' : 'bottom: var(--space-5);'}
  z-index: 2000;
  display: flex;
  flex-direction: column;
    gap: var(--space-3);

  /* Mobile: use full width and safe padding */
  @media (max-width: 767px) {
    left: var(--space-3);
    right: var(--space-3);
    ${props => props.$placement === 'top-right' ? 'top: var(--space-3);' : 'bottom: var(--space-3);'}
    gap: var(--space-2);
    pointer-events: none; /* container doesn't block UI */
  }
`;

const ToastItem = styled.div`
  background: var(--glass-bg-strong);
  backdrop-filter: blur(var(--glass-blur-strong));
  -webkit-backdrop-filter: blur(var(--glass-blur-strong));
  border: 1px solid var(--glass-border);
  border-left: 4px solid ${props => 
    props.$type === 'error' ? 'var(--accent-red)' : 
    props.$type === 'warning' ? 'var(--accent-orange)' : 
    props.$type === 'success' ? 'var(--accent-green)' : 
    'var(--accent-blue)'
  };
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--glass-shadow-elevated);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 320px;
  max-width: 420px;
  animation: slideInGlass var(--transition-normal) ease-out;
  color: var(--font-color-primary);
  transition: all var(--transition-fast);

  @media (max-width: 767px) {
    min-width: 0;
    max-width: none;
    width: 100%;
    padding: var(--space-3);
    pointer-events: auto; /* allow close button */
  }
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(24px)) {
    background: var(--bg-secondary);
    border-color: var(--border-color-strong);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--glass-shadow-elevated), 0 4px 20px rgba(0, 0, 0, 0.1);
    border-color: var(--glass-border-hover);
  }

  @keyframes slideInGlass {
    from { 
      transform: translateX(100%) scale(0.95); 
      opacity: 0; 
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
    }
    to { 
      transform: translateX(0) scale(1); 
      opacity: 1; 
      backdrop-filter: blur(var(--glass-blur-strong));
      -webkit-backdrop-filter: blur(var(--glass-blur-strong));
    }
  }
  
  /* Respect user's motion preferences */
  @media (prefers-reduced-motion: reduce) {
    animation: slideInGlassReduced var(--transition-fast) ease-out;
    
    &:hover {
      transform: none;
    }
    
    @keyframes slideInGlassReduced {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  }
`;

const Message = styled.div`
  flex: 1;
  font-size: var(--font-size-md);
  color: var(--font-color-primary);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-lg);
`;

const CloseBtn = styled.button`
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--glass-blur-light));
  -webkit-backdrop-filter: blur(var(--glass-blur-light));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  color: var(--font-color-secondary);
  cursor: pointer;
  padding: var(--space-1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(10px)) {
    background: var(--bg-tertiary);
  }
  
  &:hover { 
    color: var(--font-color-primary);
    background: var(--glass-bg-medium);
    border-color: var(--glass-border-hover);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  /* Respect user's motion preferences */
  @media (prefers-reduced-motion: reduce) {
    &:hover, &:active {
      transform: none;
    }
  }
`;

const ToastComponent = ({ message, type = 'info', durationMs = 5000, onClose }) => {
    useEffect(() => {
        if (!durationMs || durationMs <= 0) return;
        const timer = setTimeout(() => {
            onClose();
        }, durationMs);
        return () => clearTimeout(timer);
    }, [durationMs, onClose]);

    const getIcon = () => {
        const iconSize = 20;
        const iconColor = type === 'error' ? 'var(--accent-red)' : 
                         type === 'warning' ? 'var(--accent-orange)' : 
                         type === 'success' ? 'var(--accent-green)' : 
                         'var(--accent-blue)';
        
        switch(type) {
            case 'error': return <AlertTriangle size={iconSize} color={iconColor} />;
            case 'warning': return <AlertTriangle size={iconSize} color={iconColor} />;
            case 'success': return <CheckCircle size={iconSize} color={iconColor} />;
            default: return <Info size={iconSize} color={iconColor} />;
        }
    };

    return (
        <ToastItem $type={type}>
            {getIcon()}
            <Message>{message}</Message>
            <CloseBtn onClick={onClose}><X size={16} /></CloseBtn>
        </ToastItem>
    );
};

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
  const lastShownRef = useRef(new Map());

    const addToast = useCallback((message, type = 'info', options = {}) => {
    // De-dupe identical toasts (e.g. network flaps) to keep UI usable.
    const dedupeWindowMs = typeof options?.dedupeWindowMs === 'number' ? options.dedupeWindowMs : 4000;
    const key = `${type}::${String(message)}`;
    const now = Date.now();
    const last = lastShownRef.current.get(key);
    if (last && now - last < dedupeWindowMs) return;
    lastShownRef.current.set(key, now);

        const id = Date.now() + Math.random();
        const placement = options?.placement === 'top-right' ? 'top-right' : 'bottom-right';
        const durationMs = typeof options?.durationMs === 'number' ? options.durationMs : 5000;
        setToasts(prev => [...prev, { id, message, type, placement, durationMs }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer $placement="top-right">
                {toasts.filter(t => t.placement === 'top-right').map(t => (
                    <ToastComponent
                        key={t.id}
                        message={t.message}
                        type={t.type}
                        durationMs={t.durationMs}
                        onClose={() => removeToast(t.id)}
                    />
                ))}
            </ToastContainer>
            <ToastContainer $placement="bottom-right">
                {toasts.filter(t => t.placement !== 'top-right').map(t => (
                    <ToastComponent
                        key={t.id}
                        message={t.message}
                        type={t.type}
                        durationMs={t.durationMs}
                        onClose={() => removeToast(t.id)}
                    />
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

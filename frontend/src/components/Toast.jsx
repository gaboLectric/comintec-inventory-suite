import React, { useEffect, createContext, useContext, useState, useCallback } from 'react';
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
`;

const ToastItem = styled.div`
    background: ${props => (props.$type === 'warning' && props.$important) ? 'var(--brand-yellow-3)' : 'var(--bg-secondary)'};
    border: 1px solid ${props => props.$type === 'error' ? 'var(--brand-red-9)' : props.$type === 'warning' ? 'var(--brand-yellow-9)' : 'var(--brand-green-9)'};
    border-left-width: ${props => props.$important ? '6px' : '4px'};
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  box-shadow: var(--shadow-heavy);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 300px;
  max-width: 400px;
  animation: slideIn 0.3s ease;
    color: ${props => (props.$type === 'warning' && props.$important) ? 'var(--gray-1)' : 'var(--font-color-primary)'};

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

const Message = styled.div`
  flex: 1;
  font-size: var(--font-size-sm);
    color: inherit;
    font-weight: ${props => props.$important ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)'};
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
    color: inherit;
  cursor: pointer;
  padding: 0;
  display: flex;
  &:hover { color: var(--font-color-primary); }
`;

const ToastComponent = ({ message, type = 'info', important = false, durationMs = 5000, onClose }) => {
    useEffect(() => {
        if (!durationMs || durationMs <= 0) return;
        const timer = setTimeout(() => {
            onClose();
        }, durationMs);
        return () => clearTimeout(timer);
    }, [durationMs, onClose]);

    const getIcon = () => {
        const iconSize = important ? 24 : 20;
        switch(type) {
            case 'error': return <AlertTriangle size={iconSize} color="var(--brand-red-9)" />;
            case 'warning': return <AlertTriangle size={iconSize} color={important ? 'var(--gray-1)' : 'var(--brand-yellow-9)'} />;
            case 'success': return <CheckCircle size={iconSize} color="var(--brand-green-9)" />;
            default: return <Info size={iconSize} color="var(--brand-blue-9)" />;
        }
    };

    return (
        <ToastItem $type={type} $important={important}>
            {getIcon()}
            <Message $important={important}>{message}</Message>
            <CloseBtn onClick={onClose}><X size={16} /></CloseBtn>
        </ToastItem>
    );
};

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', options = {}) => {
        const id = Date.now() + Math.random();
        const placement = options?.placement === 'top-right' ? 'top-right' : 'bottom-right';
        const durationMs = typeof options?.durationMs === 'number' ? options.durationMs : 5000;
        const important = Boolean(options?.important);
        setToasts(prev => [...prev, { id, message, type, placement, durationMs, important }]);
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
                        important={t.important}
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
                        important={t.important}
                        durationMs={t.durationMs}
                        onClose={() => removeToast(t.id)}
                    />
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

import React, { useEffect, createContext, useContext, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToastItem = styled.div`
  background: var(--bg-secondary);
  border: 1px solid ${props => props.$type === 'error' ? 'var(--brand-red-9)' : props.$type === 'warning' ? 'var(--brand-yellow-9)' : 'var(--brand-green-9)'};
  border-left-width: 4px;
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  box-shadow: var(--shadow-heavy);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 300px;
  max-width: 400px;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

const Message = styled.div`
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--font-color-primary);
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: var(--font-color-secondary);
  cursor: pointer;
  padding: 0;
  display: flex;
  &:hover { color: var(--font-color-primary); }
`;

const ToastComponent = ({ message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch(type) {
            case 'error': return <AlertTriangle size={20} color="var(--brand-red-9)" />;
            case 'warning': return <AlertTriangle size={20} color="var(--brand-yellow-9)" />;
            case 'success': return <CheckCircle size={20} color="var(--brand-green-9)" />;
            default: return <Info size={20} color="var(--brand-blue-9)" />;
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

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer>
                {toasts.map(t => (
                    <ToastComponent 
                        key={t.id} 
                        message={t.message} 
                        type={t.type} 
                        onClose={() => removeToast(t.id)} 
                    />
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

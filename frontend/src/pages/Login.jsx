import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';
import { GlassButton } from '../components/GlassButton';
import { GlassInput } from '../components/GlassInput';
import { GlassCard } from '../components/GlassCard';
import { useIsMobile } from '../hooks';
import { Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';

// Custom Round Bottom Flask SVG component (same as Layout)
const RoundBottomFlask = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Neck of flask */}
    <path d="M10 2h4" />
    <path d="M10 2v6" />
    <path d="M14 2v6" />
    {/* Round bottom */}
    <circle cx="12" cy="16" r="6" />
    {/* Connection from neck to ball */}
    <path d="M10 8c-2 1-4 3.5-4 8" />
    <path d="M14 8c2 1 4 3.5 4 8" />
  </svg>
);

const Shell = styled.div`
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile browsers */
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-family);
    
    /* Light theme background for login */
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    color: #0f172a;
    
    position: relative;
    overflow: hidden;
    padding: var(--space-4);
    
    /* Mobile optimizations */
    @media (max-width: 767px) {
        padding: var(--space-3);
        align-items: flex-start;
        padding-top: calc(var(--space-8) + env(safe-area-inset-top, 0px));
        
        /* Portrait: center vertically */
        @media (orientation: portrait) {
            align-items: center;
        }
        
        /* Landscape: align to top for keyboard space */
        @media (orientation: landscape) {
            align-items: flex-start;
            padding-top: calc(var(--space-4) + env(safe-area-inset-top, 0px));
        }
    }

    /* Animated background elements */
    &::before {
        content: '';
        position: absolute;
        width: 120%;
        height: 120%;
        background: radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 70% 80%, rgba(255, 107, 53, 0.08) 0%, transparent 50%);
        pointer-events: none;
        animation: float 20s ease-in-out infinite;
    }
    
    &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 80% 30%, rgba(139, 92, 246, 0.06) 0%, transparent 40%);
        pointer-events: none;
        animation: float 25s ease-in-out infinite reverse;
    }
    
    @keyframes float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        33% { transform: translate(-20px, -20px) rotate(1deg); }
        66% { transform: translate(20px, -10px) rotate(-1deg); }
    }
`;

const LoginCard = styled(GlassCard)`
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
    
    /* Light theme glass effect for login */
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.1),
        0 1px 0 rgba(255, 255, 255, 0.5) inset;
    
    /* Mobile optimizations */
    @media (max-width: 767px) {
        max-width: 100%;
        margin: 0;
        
        /* Landscape: more compact */
        @media (orientation: landscape) {
          padding: var(--space-5);
        }
    }
    
    /* Fallback for browsers without backdrop-filter support */
    @supports not (backdrop-filter: blur(20px)) {
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: var(--space-8);
    
    /* Mobile: more compact spacing */
    @media (max-width: 767px) {
        margin-bottom: var(--space-6);
        
        @media (orientation: landscape) {
            margin-bottom: var(--space-4);
        }
    }
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
`;

const LogoIcon = styled.div`
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #FF6B35 0%, #E85A2A 100%);
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 
        0 8px 24px rgba(255, 107, 53, 0.3),
        0 1px 0 rgba(255, 255, 255, 0.2) inset;
    
    /* Mobile: slightly smaller */
    @media (max-width: 767px) {
        width: 48px;
        height: 48px;
        
        svg {
            width: 28px;
            height: 28px;
        }
    }
`;

const Logo = styled.h1`
    font-size: 2.25rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin: 0;
    color: #0f172a;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    
    /* Mobile: smaller size */
    @media (max-width: 767px) {
        font-size: 1.875rem;
        
        @media (orientation: landscape) {
            font-size: 1.5rem;
        }
    }
`;

const Subtitle = styled.p`
    color: #64748b;
    font-size: var(--font-size-md);
    margin: 0;
    font-weight: 500;
    
    /* Mobile: slightly smaller */
    @media (max-width: 767px) {
        font-size: var(--font-size-sm);
    }
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    
    /* Mobile: more compact spacing */
    @media (max-width: 767px) {
        gap: var(--space-4);
        
        @media (orientation: landscape) {
            gap: var(--space-3);
        }
    }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    position: relative;
`;

const Label = styled.label`
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: #374151 !important;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-1);
    
    svg {
        opacity: 0.7;
        color: #6b7280 !important;
    }
`;

const InputContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const StyledInput = styled(GlassInput)`
    /* Light theme input styling - override GlassInput defaults */
    input {
        background: rgba(255, 255, 255, 0.9) !important;
        border: 1px solid rgba(0, 0, 0, 0.15) !important;
        color: #0f172a !important;
        font-size: var(--font-size-md) !important;
        font-family: var(--font-family) !important;
        line-height: 1.5 !important;
        
        &::placeholder {
            color: #9ca3af !important;
            opacity: 1 !important;
        }
        
        &:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            background: rgba(255, 255, 255, 0.95) !important;
            outline: none !important;
        }
        
        &:hover:not(:focus) {
            border-color: rgba(0, 0, 0, 0.25) !important;
        }
        
        &:disabled {
            opacity: 0.6 !important;
            cursor: not-allowed !important;
            background: rgba(255, 255, 255, 0.7) !important;
        }
        
        /* Ensure text is always visible and editable */
        -webkit-text-fill-color: #0f172a !important;
        -webkit-opacity: 1 !important;
        
        /* Remove any conflicting styles */
        -webkit-appearance: none !important;
        appearance: none !important;
        
        /* Ensure proper text selection */
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        user-select: text !important;
        
        /* Fix for some browsers */
        &:-webkit-autofill,
        &:-webkit-autofill:hover,
        &:-webkit-autofill:focus {
            -webkit-text-fill-color: #0f172a !important;
            -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.9) inset !important;
            transition: background-color 5000s ease-in-out 0s !important;
        }
    }
    
    /* Desktop: ensure proper sizing */
    @media (min-width: 768px) {
        input {
            font-size: var(--font-size-md) !important;
            min-height: 48px !important;
            padding: var(--space-3) var(--space-4) !important;
        }
    }
    
    /* Mobile: ensure minimum font size to prevent zoom on iOS */
    @media (max-width: 767px) {
        input {
            font-size: max(16px, var(--font-size-md)) !important;
            min-height: 52px !important;
        }
    }
`;

const PasswordToggle = styled.button`
    position: absolute;
    right: var(--space-3);
    background: none;
    border: none;
    color: #6b7280 !important;
    cursor: pointer;
    padding: var(--space-1);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    
    &:hover {
        color: #374151 !important;
        background: rgba(0, 0, 0, 0.05) !important;
    }
    
    &:focus-visible {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px;
    }
    
    svg {
        width: 18px !important;
        height: 18px !important;
        color: inherit !important;
    }
    
    /* Desktop: proper sizing */
    @media (min-width: 768px) {
        min-width: 40px;
        min-height: 40px;
        right: var(--space-3);
    }
    
    /* Mobile: larger touch target */
    @media (max-width: 767px) {
        min-width: 44px;
        min-height: 44px;
        right: var(--space-2);
    }
`;

const ErrorMessage = styled.div`
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #dc2626;
    padding: var(--space-4);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-4);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: 500;
    
    /* Mobile: more compact */
    @media (max-width: 767px) {
        padding: var(--space-3);
        font-size: var(--font-size-xs);
    }
`;

const LoginButton = styled(GlassButton)`
    margin-top: var(--space-2);
    width: 100%;
    min-height: 48px;
    font-weight: 600;
    font-size: var(--font-size-md);
    
    /* Mobile: larger touch target */
    @media (max-width: 767px) {
        min-height: 52px;
        font-size: max(16px, var(--font-size-md));
    }
`;

const Footer = styled.div`
    margin-top: var(--space-6);
    text-align: center;
    font-size: var(--font-size-xs);
    color: #9ca3af;
    font-weight: 500;
    
    /* Mobile: more compact */
    @media (max-width: 767px) {
        margin-top: var(--space-4);
        font-size: var(--font-size-xxs);
        
        @media (orientation: landscape) {
            margin-top: var(--space-2);
        }
    }
`;

export const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const isMobile = useIsMobile();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username || !password) {
            setError('Por favor ingresa usuario y contraseña.');
            setLoading(false);
            return;
        }

        try {
            const result = await login(username, password);
            if (!result.success) {
                setError(result.error);
            }
        } catch (err) {
            setError('Ocurrió un error inesperado. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Shell>
            <LoginCard variant="light" padding="xl">
                <Header>
                    <LogoContainer>
                        <LogoIcon>
                            <RoundBottomFlask />
                        </LogoIcon>
                        <Logo>COMINTEC</Logo>
                    </LogoContainer>
                    <Subtitle>Inicia sesión para continuar</Subtitle>
                </Header>

                {error && (
                    <ErrorMessage>
                        <AlertCircle size={16} />
                        {error}
                    </ErrorMessage>
                )}

                <StyledForm onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="username">
                            <User size={16} />
                            Usuario
                        </Label>
                        <StyledInput
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ingresa tu usuario"
                            disabled={loading}
                            autoFocus={!isMobile} // Avoid auto-focus on mobile to prevent keyboard popup
                            autoComplete="username"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="password">
                            <Lock size={16} />
                            Contraseña
                        </Label>
                        <InputContainer>
                            <StyledInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingresa tu contraseña"
                                disabled={loading}
                                autoComplete="current-password"
                                style={{ paddingRight: '48px' }}
                            />
                            <PasswordToggle
                                type="button"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                tabIndex={0}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </PasswordToggle>
                        </InputContainer>
                    </FormGroup>

                    <LoginButton 
                        type="submit" 
                        disabled={loading}
                        variant="primary"
                        loading={loading}
                    >
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </LoginButton>
                </StyledForm>

                <Footer>
                    © {new Date().getFullYear()} Comintec - Sistema de Inventario
                </Footer>
            </LoginCard>
        </Shell>
    );
};

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../comintec-design-system/emotion/Button';
import { Input } from '../comintec-design-system/emotion/Input';

const Shell = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-family);
    background: var(--bg-primary);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 50% 0%, rgba(92, 124, 250, 0.15) 0%, transparent 50%);
        pointer-events: none;
    }
`;

const LoginCard = styled.div`
    width: 100%;
    max-width: 400px;
    padding: var(--space-8);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color-light);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-strong);
    position: relative;
    z-index: 1;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: var(--space-8);
`;

const Logo = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin: 0 0 var(--space-2) 0;
    color: var(--font-color-primary);
`;

const Subtitle = styled.p`
    color: var(--font-color-secondary);
    font-size: var(--font-size-sm);
    margin: 0;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
`;

const Label = styled.label`
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--font-color-primary);
`;

const ErrorMessage = styled.div`
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #ef4444;
    padding: var(--space-3);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-4);
    text-align: center;
`;

const Footer = styled.div`
    margin-top: var(--space-6);
    text-align: center;
    font-size: var(--font-size-xs);
    color: var(--font-color-tertiary);
`;

export const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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

    return (
        <Shell>
            <LoginCard>
                <Header>
                    <Logo>COMINTEC</Logo>
                    <Subtitle>Inicia sesión para continuar</Subtitle>
                </Header>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <StyledForm onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="username">Usuario</Label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="usuario"
                            disabled={loading}
                            autoFocus
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </FormGroup>

                    <Button 
                        type="submit" 
                        disabled={loading} 
                        style={{ marginTop: 'var(--space-2)', width: '100%' }}
                    >
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </Button>
                </StyledForm>

                <Footer>
                    © {new Date().getFullYear()} Comintec
                </Footer>
            </LoginCard>
        </Shell>
    );
};

// @vitest-environment jsdom
import { render, screen, act, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { AuthProvider, useAuth } from './AuthContext';
import pb from '../services/pocketbase';
import React from 'react';

expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock PocketBase
vi.mock('../services/pocketbase', () => ({
    default: {
        authStore: {
            model: null,
            onChange: vi.fn(() => () => {}),
            clear: vi.fn(),
            get isValid() { return true; },
            get isSuperuser() { return false; },
            get isAdmin() { return false; }
        },
        collection: vi.fn(() => ({
            authWithPassword: vi.fn()
        })),
        admins: {
            authWithPassword: vi.fn()
        }
    }
}));

// Mock Toast
vi.mock('../components/Toast', () => ({
    useToast: () => ({
        addToast: vi.fn()
    })
}));

const TestComponent = () => {
    const { user, login, logout, isAdmin, loading } = useAuth();
    return (
        <div>
            <div data-testid="user">{user ? user.email : 'No User'}</div>
            <div data-testid="loading">{loading ? 'Loading' : 'Idle'}</div>
            <div data-testid="is-admin">{isAdmin() ? 'Admin' : 'Not Admin'}</div>
            <button onClick={() => login('test@example.com', 'password')}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        pb.authStore.model = null;
        // Reset getters
        Object.defineProperty(pb.authStore, 'isSuperuser', { get: () => false });
        Object.defineProperty(pb.authStore, 'isValid', { get: () => true });
    });

    it('should render children', () => {
        render(
            <AuthProvider>
                <div>Child</div>
            </AuthProvider>
        );
        expect(screen.getByText('Child')).toBeInTheDocument();
    });

    it('should set loading state during login', async () => {
        let resolveLogin;
        const loginPromise = new Promise(resolve => {
            resolveLogin = resolve;
        });
        
        pb.collection().authWithPassword.mockImplementation(() => loginPromise);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Wait for initialization to complete
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Idle');
        });

        const loginBtn = screen.getByText('Login');
        
        // Trigger login
        act(() => {
            loginBtn.click();
        });

        // Should be loading immediately after click
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
        });

        // Resolve the login
        act(() => {
            resolveLogin({});
        });

        // Should return to idle state after login completes
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Idle');
        });
    });

    it('should correctly identify superuser as admin', async () => {
        pb.authStore.model = { email: 'admin@example.com' };
        Object.defineProperty(pb.authStore, 'isSuperuser', { get: () => true });
        Object.defineProperty(pb.authStore, 'isValid', { get: () => true });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Wait for initialization
        await waitFor(() => {
            expect(screen.getByTestId('is-admin')).toHaveTextContent('Admin');
        });
    });
});

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
        pb.collection().authWithPassword.mockImplementation(async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
            return {};
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const loginBtn = screen.getByText('Login');
        
        // Trigger login
        act(() => {
            loginBtn.click();
        });

        // Should be loading immediately -> Children unmounted because of {!loading && children}
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();

        await waitFor(() => {
            // Should reappear
            expect(screen.getByTestId('loading')).toHaveTextContent('Idle');
        });
    });

    it('should correctly identify superuser as admin', () => {
        pb.authStore.model = { email: 'admin@example.com' };
        Object.defineProperty(pb.authStore, 'isSuperuser', { get: () => true });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('is-admin')).toHaveTextContent('Admin');
    });
});

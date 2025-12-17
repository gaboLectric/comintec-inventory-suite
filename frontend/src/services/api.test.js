import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from './api';
import pb from './pocketbase';

const collectionMocks = {
    getFullList: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getList: vi.fn()
};

// Mock PocketBase
vi.mock('./pocketbase', () => ({
    default: {
        collection: vi.fn(() => collectionMocks),
        admins: {
            getFullList: vi.fn().mockResolvedValue([])
        },
        authStore: {
            isSuperuser: false,
            isAdmin: false,
            model: { id: 'user1', user_level: 1 }
        }
    }
}));

// Mock Axios (since api.js currently imports it, we need to mock it to avoid errors during import if we run this before refactor)
vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            interceptors: {
                request: { use: vi.fn() },
                response: { use: vi.fn() }
            },
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn()
        })),
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
}));

describe('API Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetchUsers should call pb.collection("users").getFullList()', async () => {
        const mockUsers = [{ id: 1, name: 'User 1' }];
        collectionMocks.getFullList.mockResolvedValue(mockUsers);

        try {
            const users = await api.fetchUsers();
            expect(pb.collection).toHaveBeenCalledWith('users');
            expect(collectionMocks.getFullList).toHaveBeenCalled();
            expect(users).toEqual([{ id: 1, name: 'User 1', kind: 'user' }]);
        } catch (e) {
            // Expected failure during Red phase
            throw e;
        }
    });

    it('createUser should call pb.collection("users").create()', async () => {
        const newUser = { name: 'New User' };
        const createdUser = { id: 2, ...newUser };
        collectionMocks.create.mockResolvedValue(createdUser);

        try {
            const result = await api.createUser(newUser);
            expect(pb.collection).toHaveBeenCalledWith('users');
            expect(collectionMocks.create).toHaveBeenCalledWith(newUser);
            expect(result).toEqual(createdUser);
        } catch (e) {
            throw e;
        }
    });

    it('fetchDashboardStats should aggregate counts', async () => {
        collectionMocks.getList.mockResolvedValue({ totalItems: 10 });
        // Mock getFullList for checkLowStock
        collectionMocks.getFullList.mockResolvedValue([
            { piezas: 5, stock_deseado: 10 }, // Low stock
            { piezas: 2, stock_deseado: 5 },  // Low stock
            { piezas: 10, stock_deseado: 10 } // OK
        ]);
        
        try {
            const stats = await api.fetchDashboardStats();
            
            expect(pb.collection).toHaveBeenCalledWith('users');
            expect(pb.collection).toHaveBeenCalledWith('equipments');
            expect(pb.collection).toHaveBeenCalledWith('supplies');
            
            expect(stats).toEqual({
                users: 10,
                equipments: 10,
                supplies: 10,
                lowStock: 2 // 2 items match the condition
            });
        } catch (e) {
            throw e;
        }
    });
});

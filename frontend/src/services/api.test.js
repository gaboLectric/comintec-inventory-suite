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
        collection: vi.fn(() => collectionMocks)
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
            expect(users).toEqual(mockUsers);
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
        
        try {
            const stats = await api.fetchDashboardStats();
            
            expect(pb.collection).toHaveBeenCalledWith('users');
            expect(pb.collection).toHaveBeenCalledWith('products');
            expect(pb.collection).toHaveBeenCalledWith('sales');
            expect(stats).toEqual({
                users_count: 10,
                products_count: 10,
                sales_count: 10
            });
        } catch (e) {
            throw e;
        }
    });
});

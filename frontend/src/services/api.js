import pb from './pocketbase';

// --- Equipments ---

export const getEquipments = async (page = 1, perPage = 50, filter = '') => {
    const options = {
        // sort: '-created', // 'created' field might be missing if system fields are disabled
        expand: 'media_id',
        requestKey: null
    };
    if (filter) options.filter = filter;
    
    return await pb.collection('equipments').getList(page, perPage, options);
};

export const getEquipment = async (id) => {
    return await pb.collection('equipments').getOne(id);
};

export const createEquipment = async (data) => {
    return await pb.collection('equipments').create(data);
};

export const updateEquipment = async (id, data) => {
    return await pb.collection('equipments').update(id, data);
};

export const deleteEquipment = async (id) => {
    return await pb.collection('equipments').delete(id);
};

// --- Supplies ---

export const getSupplies = async (page = 1, perPage = 50, filter = '') => {
    const options = {
        // sort: 'nombre', // Sorting seems to cause 400 errors
        requestKey: null
    };
    if (filter) options.filter = filter;

    return await pb.collection('supplies').getList(page, perPage, options);
};

export const getSupply = async (id) => {
    return await pb.collection('supplies').getOne(id);
};

export const createSupply = async (data) => {
    return await pb.collection('supplies').create(data);
};

export const updateSupply = async (id, data) => {
    return await pb.collection('supplies').update(id, data);
};

export const deleteSupply = async (id) => {
    return await pb.collection('supplies').delete(id);
};

// --- Outputs ---

export const getEquipmentOutputs = async (page = 1, perPage = 50, filter = '') => {
    const options = {
        // sort: '-fecha',
        requestKey: null
    };
    if (filter) options.filter = filter;

    return await pb.collection('equipment_outputs').getList(page, perPage, options);
};

export const createEquipmentOutput = async (data) => {
    // data should include equipment object details + output details
    const output = await pb.collection('equipment_outputs').create(data);
    
    // If successful, delete the equipment
    if (output && data.equipment_id) {
        try {
            await pb.collection('equipments').delete(data.equipment_id);
        } catch (error) {
            console.error("Error deleting equipment after output:", error);
        }
    }
    return output;
};

export const getSupplyOutputs = async (page = 1, perPage = 50, filter = '') => {
    const options = {
        // sort: '-fecha',
        requestKey: null
    };
    if (filter) options.filter = filter;

    return await pb.collection('supply_outputs').getList(page, perPage, options);
};

export const createSupplyOutput = async (data) => {
    // 1. Create output
    // We need to fetch supply first to enforce rules
    const supply = await pb.collection('supplies').getOne(data.supply_id);
    
    // Guard: Prevent negative stock (Comment 3)
    const newStock = supply.piezas - data.cantidad;
    if (newStock < 0) {
        throw new Error("Stock insuficiente para realizar la salida");
    }

    // Enforce full withdrawal (Comment 2)
    // We ignore data.cantidad for the update and set stock to 0
    // But we use data.cantidad for the output record, which should match supply.piezas
    
    const output = await pb.collection('supply_outputs').create(data);
    
    // 2. Update supply stock
    if (output && data.supply_id) {
        try {
            // Always set stock to zero (Comment 2)
            await pb.collection('supplies').update(data.supply_id, { piezas: 0 });
        } catch (error) {
            console.error("Error updating supply stock after output:", error);
        }
    }
    return output;
};

// --- Dashboard & Helpers ---

export const checkLowStock = async () => {
    try {
        // PocketBase doesn't support field comparison in filters (e.g. 'piezas < stock_deseado')
        // So we fetch all supplies and filter client-side.
        const allSupplies = await pb.collection('supplies').getFullList({
            requestKey: 'check_low_stock'
        });
        
        return allSupplies.filter(item => item.piezas < item.stock_deseado);
    } catch (error) {
        console.error("Error checking low stock:", error);
        return [];
    }
};

export const fetchDashboardStats = async () => {
    try {
        const userLevel = getUserLevel();
        const showSupplies = userLevel <= 2;

        const [users, equipments, supplies, lowStockItems] = await Promise.all([
            pb.collection('users').getList(1, 1, { requestKey: 'dash_users' }),
            pb.collection('equipments').getList(1, 1, { requestKey: 'dash_equipments' }),
            showSupplies ? pb.collection('supplies').getList(1, 1, { requestKey: 'dash_supplies' }) : Promise.resolve({ totalItems: 0 }),
            showSupplies ? checkLowStock() : Promise.resolve([])
        ]);

        return {
            users: users?.totalItems || 0,
            equipments: equipments?.totalItems || 0,
            supplies: supplies?.totalItems || 0,
            lowStock: lowStockItems.length || 0,
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return { users: 0, equipments: 0, supplies: 0, lowStock: 0 };
    }
};

export const getUserLevel = () => {
    return pb.authStore.model?.user_level || 3; // Default to User
};

export const canAccessSupplies = () => {
    const level = getUserLevel();
    return level <= 2; // Admin(1) or Special(2)
};

export const canCreateOutputs = () => {
    const level = getUserLevel();
    return level <= 2;
};




// Users
export const fetchUsers = async () => {
    // Only fetch from 'users' collection (auth collection)
    // Admins/superusers are managed separately via PocketBase admin UI
    const appUsers = await pb.collection('users').getFullList({ requestKey: null });
    const mappedUsers = appUsers.map((u) => ({ ...u, kind: 'user' }));
    return mappedUsers;
};

export const createUser = async (userData) => {
    return await pb.collection('users').create(userData);
};

export const updateUser = async (userId, userData) => {
    return await pb.collection('users').update(userId, userData);
};

export const deleteUser = async (userId) => {
    await pb.collection('users').delete(userId);
};



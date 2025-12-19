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
    // Business rule: equipment outputs remove the equipment from inventory (move semantics)
    const output = await pb.collection('equipment_outputs').create(data);

    if (data.equipment_id) {
        try {
            await pb.collection('equipments').delete(data.equipment_id);
        } catch (error) {
            console.error('Error deleting equipment after output creation:', error);

            // Best-effort rollback: delete the output we just created
            if (output?.id) {
                try {
                    await pb.collection('equipment_outputs').delete(output.id);
                } catch (rollbackError) {
                    console.error('Rollback failed (could not delete created output):', rollbackError);
                }
            }

            throw new Error('No se pudo mover el equipo a salidas: ' + (error?.message || String(error)));
        }
    }

    return output;
};

// --- Inputs ---

export const getEquipmentInputs = async (page = 1, perPage = 50, filter = '') => {
    const options = {
        sort: '-fecha',
        requestKey: null
    };
    if (filter) options.filter = filter;

    return await pb.collection('equipment_inputs').getList(page, perPage, options);
};

export const createEquipmentInput = async (data) => {
    // 1. Create input record
    const input = await pb.collection('equipment_inputs').create(data);
    
    // 2. Create equipment record automatically
    // We copy relevant fields from the input data
    const equipmentData = {
        codigo: data.codigo,
        producto: data.producto,
        marca: data.marca,
        modelo: data.modelo,
        numero_serie: data.numero_serie,
        pedimento: data.pedimento,
        observaciones: data.observaciones,
        media_id: data.media_id,
        vendido: data.vendido || false
    };
    
    try {
        await pb.collection('equipments').create(equipmentData);
    } catch (error) {
        console.error("Error creating equipment from input:", error);
        // We might want to handle this error, but for now we return the input record
        // Ideally, this should be a transaction or handled more robustly
        throw new Error("Error al crear el equipo en inventario: " + error.message);
    }
    
    return input;
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
    
    // Guard: Prevent negative stock
    const newStock = supply.piezas - data.cantidad;
    if (newStock < 0) {
        throw new Error("Stock insuficiente para realizar la salida");
    }

    const output = await pb.collection('supply_outputs').create(data);
    
    // 2. Update supply stock
    if (output && data.supply_id) {
        try {
            await pb.collection('supplies').update(data.supply_id, { piezas: newStock });
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
    const user = pb.authStore.model;
    
    // If it's a superuser (admin), they don't have user_level field
    // Check collection name or use isSuperuser (new API)
    if (user && (user.collectionName === '_superusers' || pb.authStore.isSuperuser)) {
        return 1; // Superusers are always Admin level
    }
    
    return user?.user_level || 3; // Default to User
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
    // Fetch both superusers (admins) and regular users
    const allUsers = [];
    
    try {
        // Only try to fetch admins if the current user is a superuser
        if (pb.authStore.isSuperuser) {
            // Fetch superusers using PocketBase admins API
            const superusers = await pb.admins.getFullList();
            
            // Map superusers with kind='admin' and adapt structure
            const mappedSuperusers = superusers.map((admin) => ({
                id: admin.id,
                name: admin.email.split('@')[0], // Use email prefix as name
                username: admin.email,
                email: admin.email,
                user_level: 1, // Superusers are always level 1 (Admin)
                status: 1, // Always active
                kind: 'admin',
                created: admin.created,
                updated: admin.updated,
                avatar: admin.avatar || null
            }));
            
            allUsers.push(...mappedSuperusers);
        }
    } catch (error) {
        // If fetching admins fails (not authorized), continue with regular users only
        console.warn('Could not fetch admins:', error);
    }
    
    // Fetch regular users from 'users' collection
    const appUsers = await pb.collection('users').getFullList({ requestKey: null });
    const mappedUsers = appUsers.map((u) => ({ ...u, kind: 'user' }));
    
    allUsers.push(...mappedUsers);
    
    return allUsers;
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



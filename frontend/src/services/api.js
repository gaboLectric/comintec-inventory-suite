import pb from './pocketbase';

// Dashboard
export const fetchDashboardStats = async () => {
    try {
        const adminCountPromise = (pb.authStore.isSuperuser || pb.authStore.isAdmin)
            ? pb.admins.getList(1, 1, { requestKey: 'dashboard_admins' }).catch((err) => {
                console.warn('Admin count failed, ignoring for stats:', err);
                return null;
            })
            : Promise.resolve(null);

        const [users, products, sales, categories, admins] = await Promise.all([
            pb.collection('users').getList(1, 1, { requestKey: 'dashboard_users' }),
            pb.collection('products').getList(1, 1, { requestKey: 'dashboard_products' }),
            pb.collection('sales').getList(1, 1, { requestKey: 'dashboard_sales' }),
            pb.collection('categories').getList(1, 1, { requestKey: 'dashboard_categories' }),
            adminCountPromise,
        ]);

        const adminCount = Number(admins?.totalItems) || 0; // Include superusers when logged-in session has permission

        return {
            users: (Number(users?.totalItems) || 0) + adminCount,
            products: Number(products?.totalItems) || 0,
            sales: Number(sales?.totalItems) || 0,
            categories: Number(categories?.totalItems) || 0,
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return { users: 0, products: 0, sales: 0, categories: 0 };
    }
};

export const fetchTopProducts = async () => {
    // Aggregate sales by product to show best sellers
    const [sales, products] = await Promise.all([
        pb.collection('sales').getFullList({ expand: 'product_id', requestKey: null }),
        pb.collection('products').getFullList({ requestKey: null }),
    ]);

    // Map of productId -> product name for fallback when expand is missing
    const productNameById = new Map(products.map((p) => [p.id, p.name]));

    const totalsByProduct = new Map();

    sales.forEach((sale) => {
        const product = sale.expand?.product_id;
        const productId = product?.id || sale.product_id || 'unknown';
        const name = product?.name || productNameById.get(productId) || 'Producto eliminado';

        const qty = Number(sale.qty) || 0;
        const price = Number(sale.price) || 0; // price per unit
        const total = qty * price; // total revenue for this sale

        const existing = totalsByProduct.get(productId) || { name, totalQty: 0, totalSold: 0 };
        existing.name = name; // refresh in case we had placeholder
        existing.totalQty += qty;
        existing.totalSold += total;
        totalsByProduct.set(productId, existing);
    });

    return Array.from(totalsByProduct.values())
        .sort((a, b) => b.totalQty - a.totalQty)
        .slice(0, 5);
};

export const fetchRecentProducts = async () => {
    const result = await pb.collection('products').getList(1, 5, { sort: '-created', expand: 'categorie_id', requestKey: null });
    return result.items.map(p => ({
        ...p,
        category: p.expand?.categorie_id?.name || 'Sin categoría' // Keep human-readable category
    }));
};

export const fetchRecentSales = async () => {
    const result = await pb.collection('sales').getList(1, 5, { sort: '-created', expand: 'product_id', requestKey: null });
    return result.items.map(s => ({
        id: s.id,
        product: s.expand?.product_id?.name || s.product_id || 'Producto eliminado',
        quantity: s.qty,
        price: (Number(s.price) || 0) * (Number(s.qty) || 0), // total price = unit price * quantity
        date: s.date
    }));
};

export const fetchSalesChart = async () => {
    // Monthly sales totals (sum of price) grouped by month (UTC)
    const sales = await pb.collection('sales').getFullList({ requestKey: null });
    const byMonth = new Map();

    sales.forEach((s) => {
        const date = s.date ? new Date(s.date) : null;
        const key = date ? `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}` : 'sin-fecha';
        const total = (Number(s.price) || 0);
        byMonth.set(key, (byMonth.get(key) || 0) + total);
    });

    const labels = Array.from(byMonth.keys()).sort();
    const values = labels.map((k) => byMonth.get(k));
    return { labels, values };
};

export const fetchProductsByCategory = async () => {
    const products = await pb.collection('products').getFullList({ expand: 'categorie_id', requestKey: null });
    const byCat = new Map();

    products.forEach((p) => {
        const catName = p.expand?.categorie_id?.name || 'Sin categoría';
        byCat.set(catName, (byCat.get(catName) || 0) + 1);
    });

    const labels = Array.from(byCat.keys());
    const values = labels.map((k) => byCat.get(k));
    return { labels, values };
};

export const fetchDailySales = async () => {
    // Daily totals (sum price) for line chart
    const sales = await pb.collection('sales').getFullList({ requestKey: null });
    const byDay = new Map();

    sales.forEach((s) => {
        const date = s.date ? new Date(s.date) : null;
        const key = date ? date.toISOString().slice(0, 10) : 'sin-fecha';
        const total = (Number(s.price) || 0);
        byDay.set(key, (byDay.get(key) || 0) + total);
    });

    const labels = Array.from(byDay.keys()).sort();
    const values = labels.map((k) => byDay.get(k));
    return { labels, values };
};

// Users
export const fetchUsers = async () => {
    const [appUsers, admins] = await Promise.all([
        pb.collection('users').getFullList({ requestKey: null }),
        (pb.authStore.isSuperuser || pb.authStore.isAdmin)
            ? pb.admins.getFullList({ requestKey: null }).catch((err) => {
                console.warn('Admin list failed, ignoring:', err);
                return [];
            })
            : Promise.resolve([]),
    ]);

    const adminAsUsers = admins.map((a) => ({
        id: a.id,
        name: a.name || a.email || a.username || 'Admin',
        username: a.email || a.username || 'admin',
        user_level: 1,
        status: 1,
        kind: 'admin',
    }));

    const mappedUsers = appUsers.map((u) => ({ ...u, kind: 'user' }));

    return [...adminAsUsers, ...mappedUsers];
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

// Products
export const fetchProducts = async () => {
    const products = await pb.collection('products').getFullList({ sort: '-created', expand: 'categorie_id' });
    return products.map(p => ({
        ...p,
        category: p.expand?.categorie_id || null
    }));
};

export const createProduct = async (productData) => {
    return await pb.collection('products').create(productData);
};

export const updateProduct = async (productId, productData) => {
    return await pb.collection('products').update(productId, productData);
};

export const deleteProduct = async (productId) => {
    await pb.collection('products').delete(productId);
};

// Categories
export const fetchCategories = async () => {
    return await pb.collection('categories').getFullList();
};

export const createCategory = async (categoryData) => {
    return await pb.collection('categories').create(categoryData);
};

export const updateCategory = async (categoryId, categoryData) => {
    return await pb.collection('categories').update(categoryId, categoryData);
};

export const deleteCategory = async (categoryId) => {
    await pb.collection('categories').delete(categoryId);
};

// Sales
export const fetchSales = async () => {
    const sales = await pb.collection('sales').getFullList({ expand: 'product_id', requestKey: null });
    return sales.map((s) => ({
        ...s,
        product: s.expand?.product_id || null,
    }));
};

export const createSale = async (saleData) => {
    return await pb.collection('sales').create(saleData);
};

export const updateSale = async (saleId, saleData) => {
    return await pb.collection('sales').update(saleId, saleData);
};

export const deleteSale = async (saleId) => {
    await pb.collection('sales').delete(saleId);
};


import PocketBase from 'pocketbase';

// Polyfill for Node environment if needed (PocketBase SDK uses fetch)
if (!global.fetch) {
    // Node 18+ has global fetch, so this might not be needed unless on old node
    // If needed, we can use 'node-fetch' or similar if installed
    console.warn("Global fetch not found! Tests might fail.");
}

const pb = new PocketBase('http://127.0.0.1:8090');

// Credentials - Replace if known otherwise
const ADMIN_EMAIL = 'tempadmin@example.com';
const ADMIN_PASSWORD = '1234567890'; 

async function runTests() {
    console.log('Starting Integration Tests...');

    // 1. Authentication
    try {
        console.log(`Attempting login as ${ADMIN_EMAIL}...`);
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Login successful (Admin)');
    } catch (err) {
        console.log('⚠️ Admin login failed. Trying to login as regular user or create one...');
        // Try to create a test user if admin fails (maybe we can't if we are not admin, but let's try login)
        try {
             // Try to auth as a known user if any, or just fail
             throw new Error("Admin login failed and no fallback user credentials known.");
        } catch (e) {
            console.error('❌ Authentication failed:', err.message);
            // For the purpose of this test, we might need to stop here if we can't auth.
            // But let's assume for a moment we might have open access or I can fix credentials.
            // I will try to continue only if I can auth.
            process.exit(1);
        }
    }

    // 2. Create Category
    let categoryId;
    try {
        console.log('Creating Category "Test Category"...');
        const category = await pb.collection('categories').create({
            name: 'Test Category ' + Date.now()
        });
        categoryId = category.id;
        console.log(`✅ Category created: ${category.id} (${category.name})`);
    } catch (err) {
        console.error('❌ Category creation failed:', err.message);
    }

    // 3. Create Product
    let productId;
    if (categoryId) {
        try {
            console.log('Creating Product "Test Product"...');
            const product = await pb.collection('products').create({
                name: 'Test Product ' + Date.now(),
                quantity: 100,
                buy_price: 10.50,
                sale_price: 20.00,
                categorie_id: categoryId,
                date: new Date().toISOString()
            });
            productId = product.id;
            console.log(`✅ Product created: ${product.id} (${product.name})`);
        } catch (err) {
            console.error('❌ Product creation failed:', err.message);
        }
    }

    // 4. Create Sale
    if (productId) {
        try {
            console.log('Creating Sale for Product...');
            const sale = await pb.collection('sales').create({
                product_id: productId,
                qty: 5,
                price: 20.00, // unit price
                date: new Date().toISOString()
            });
            console.log(`✅ Sale created: ${sale.id}`);
        } catch (err) {
            console.error('❌ Sale creation failed:', err.message);
        }
    }

    // 5. Verify Dashboard Stats (Read)
    try {
        console.log('Verifying Dashboard Stats...');
        const products = await pb.collection('products').getList(1, 1);
        const sales = await pb.collection('sales').getList(1, 1);
        const categories = await pb.collection('categories').getList(1, 1);
        
        console.log(`Stats: Products=${products.totalItems}, Sales=${sales.totalItems}, Categories=${categories.totalItems}`);
        
        if (products.totalItems > 0 && sales.totalItems > 0) {
            console.log('✅ Data retrieval successful');
        } else {
            console.warn('⚠️ Data retrieval returned empty counts (might be expected if DB was empty before test)');
        }
    } catch (err) {
        console.error('❌ Data retrieval failed:', err.message);
    }

    // Cleanup (Optional)
    // await pb.collection('sales').delete(saleId);
    // await pb.collection('products').delete(productId);
    // await pb.collection('categories').delete(categoryId);
    console.log('Tests completed.');
}

runTests();

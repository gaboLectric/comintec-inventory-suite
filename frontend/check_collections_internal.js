import PocketBase from 'pocketbase';

const pb = new PocketBase('http://inventario-pocketbase:8090');

async function checkCollections() {
    try {
        // Authenticate as admin first
        await pb.admins.authWithPassword('admin@inventario.com', 'admin123456');
        
        const collections = await pb.collections.getFullList();
        console.log('Collections found:', collections.map(c => c.name));
        
        // Check permissions for products
        const products = collections.find(c => c.name === 'products');
        if (products) {
            console.log('Products collection details:', JSON.stringify(products, null, 2));
        } else {
            console.log('Products collection NOT found');
        }

        const sales = collections.find(c => c.name === 'sales');
        if (sales) {
            console.log('Sales collection details:', JSON.stringify(sales, null, 2));
        }

    } catch (err) {
        console.error('Error checking collections:', err);
    }
}

checkCollections();

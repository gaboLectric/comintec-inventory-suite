import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function testLogin() {
    console.log('--- Test 1: admin@inventario.com (pb.collection("_superusers")) ---');
    try {
        const authData = await pb.collection('_superusers').authWithPassword(
            'admin@inventario.com',
            'password123'
        );
        console.log('Login SUCCESS!');
    } catch (error) {
        console.error('Login FAILED:', error.message);
    }

    console.log('\n--- Test 2: test@test.com (pb.collection("_superusers")) ---');
    try {
        const authData = await pb.collection('_superusers').authWithPassword(
            'test@test.com',
            '1234567890'
        );
        console.log('Login SUCCESS!');
    } catch (error) {
        console.error('Login FAILED:', error.message);
    }

    console.log('\n--- Test 3: admin@inventario.com (pb.admins) ---');
    try {
        const authData = await pb.admins.authWithPassword(
            'admin@inventario.com',
            'password123'
        );
        console.log('Login SUCCESS!');
    } catch (error) {
        console.error('Login FAILED:', error.message);
    }
}

testLogin();

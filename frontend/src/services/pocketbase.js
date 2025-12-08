import PocketBase from 'pocketbase';

const url = import.meta.env.VITE_API_URL || 'http://localhost:8090';
const pb = new PocketBase(url);

// Disable auto-cancellation so concurrent dashboard requests don't abort each other
pb.autoCancellation(false);

export default pb;

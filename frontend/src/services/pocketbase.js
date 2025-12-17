import PocketBase from 'pocketbase';

const envUrl = import.meta.env.VITE_API_URL;

// PocketBase SDK automatically prefixes requests with `/api`.
// When deploying behind nginx with a `/api` proxy, use the current origin as base URL
// so requests become `${origin}/api/...` (and avoid `/api/api/...`).
const url = envUrl && envUrl.startsWith('/') ? window.location.origin : (envUrl || 'http://localhost:8090');
const pb = new PocketBase(url);

// Disable auto-cancellation so concurrent dashboard requests don't abort each other
pb.autoCancellation(false);

export default pb;

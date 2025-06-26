// Add runtime config type definition
declare global {
    interface Window {
        RUNTIME_CONFIG?: {
            API_URL: string;
        };
    }
}

const getBaseUrl = () => {
    console.log('getBaseUrl called');
    console.log('typeof window:', typeof window);
    console.log('window.RUNTIME_CONFIG:', typeof window !== 'undefined' ? window.RUNTIME_CONFIG : 'window not available');
    
    // First check runtime configuration (from runtime-config.js)
    if (typeof window !== 'undefined' && window.RUNTIME_CONFIG?.API_URL) {
        console.log('Using runtime config API_URL:', window.RUNTIME_CONFIG.API_URL);
        return window.RUNTIME_CONFIG.API_URL;
    }
    
    // Check if we're in a Codespace
    const codespaceName = process.env.CODESPACE_NAME;
    console.log('process.env.CODESPACE_NAME:', codespaceName);
    if (codespaceName) {
        // Use the same protocol as the current page
        const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
        const protocolToUse = protocol.includes('https') ? 'https' : 'http';
        console.log(`Using Codespace URL with ${protocolToUse} protocol`);
        return `${protocolToUse}://${codespaceName}-3000.app.github.dev`;
    }
    
    // Auto-detect protocol for local development
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
    const protocolToUse = protocol.includes('https') ? 'https' : 'http';
    console.log(`Using default localhost URL with ${protocolToUse} protocol`);
    return `${protocolToUse}://localhost:3000`;
};

export const API_BASE_URL = getBaseUrl();

console.log('Final API_BASE_URL:', API_BASE_URL);

export const api = {
    baseURL: API_BASE_URL,
    endpoints: {
        products: '/api/products',
        suppliers: '/api/suppliers',
        orders: '/api/orders',
        branches: '/api/branches',
        headquarters: '/api/headquarters',
        deliveries: '/api/deliveries',
        orderDetails: '/api/order-details',
        orderDetailDeliveries: '/api/order-detail-deliveries'
    }
};
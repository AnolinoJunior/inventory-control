const API_BASE_URL = 'https://localhost:44340';

async function apiCall(method, url, data = null) {
    const fullUrl = `${API_BASE_URL}${url}`;

    console.log(`API: ${method} ${fullUrl}`);

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    if (data !== null) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) { }
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null;
    }

    return await response.json();
}

async function getProducts() {
    return await apiCall('GET', '/api/products');
}

async function getProduct(id) {
    return await apiCall('GET', `/api/products/${id}`);
}

async function createProduct(data) {
    return await apiCall('POST', '/api/products', data);
}

async function updateProduct(id, data) {
    return await apiCall('PUT', `/api/products/${id}`, data);
}

async function deleteProduct(id) {
    return await apiCall('DELETE', `/api/products/${id}`);
}

async function getRawMaterials() {
    return await apiCall('GET', '/api/rawmaterials');
}

async function getRawMaterial(id) {
    return await apiCall('GET', `/api/rawmaterials/${id}`);
}

async function createRawMaterial(data) {
    return await apiCall('POST', '/api/rawmaterials', data);
}

async function updateRawMaterial(id, data) {
    return await apiCall('PUT', `/api/rawmaterials/${id}`, data);
}

async function deleteRawMaterial(id) {
    return await apiCall('DELETE', `/api/rawmaterials/${id}`);
}

async function getProductRawMaterials() {
    return await apiCall('GET', '/api/productrawmaterials');
}

async function getProductRawMaterial(id) {
    return await apiCall('GET', `/api/productrawmaterials/${id}`);
}

async function createProductRawMaterial(data) {
    return await apiCall('POST', '/api/productrawmaterials', data);
}

async function updateProductRawMaterial(id, data) {
    return await apiCall('PUT', `/api/productrawmaterials/${id}`, data);
}

async function deleteProductRawMaterial(id) {
    return await apiCall('DELETE', `/api/productrawmaterials/${id}`);
}

async function getFeasibleProduction() {
    return await apiCall('GET', '/api/production/suggestion');
}

const api = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getRawMaterials,
    getRawMaterial,
    createRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
    getProductRawMaterials,
    getProductRawMaterial,
    createProductRawMaterial,
    updateProductRawMaterial,
    deleteProductRawMaterial,
    getFeasibleProduction
};
window.api = api;
console.log('✅ API module loaded successfully');
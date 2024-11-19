import { DEFAULT_AVATAR } from '@/constants';

/**
* @param {string} url
* @param {RequestInit} options
* @returns Promise<Response>
*/
async function efetch(url, options = {}) {
    let result = {};
    let json = {};

    try {
        result = await fetch(url, options);
        json = await result.json();
    } catch (error) {
        throw new Error(error.message);
    }

    if (!result.ok || json.status !== 'success') {
        throw new Error(json.message);
    }

    return json.data;
}

function makeProductsService() {
    const baseUrl = '/api/v1/products';

    async function fetchProducts(page, limit = 6, topNewest = false) {
        let url = `${baseUrl}?page=${page}&limit=${limit}`;
        if (topNewest) {
            url += `&topNewest=true`;
        }
        const data = await efetch(url);
        data.products = data.products.map((product) => {
            product.product_Img = product.product_Img ?? DEFAULT_AVATAR
            return product
        });
        
        return data;
    }

    async function fetchProduct(id) {
        const url = `${baseURL}/${id}`;
        const product = await efetch(url);
        product.product_Img = product.product_Img ?? DEFAULT_AVATAR
        return product;
    }
    async function createProduct(product) {
        return efetch(baseUrl, {
            method: 'POST',
            body: product,
        });
    }

    async function deleteAllProduct() {
        return efetch(baseUrl, {
            method: 'DELETE',
        });
    }

    async function updateProduct(id, product) {
        return efetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            body: product,
        });
    }

    async function deleteProduct(id) {
        return efetch(`${baseUrl}/${id}`, {
            method: 'DELETE',
        });
    }

    return {
        fetchProducts,
        fetchProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        deleteAllProduct,
    };
}

export default makeProductsService();
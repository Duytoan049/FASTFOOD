const knex = require('../database/knex');
const Paginator = require('./paginator');
const { unlink } = require('node:fs');

function productsRepository() {
    return knex('products');
}
function readProducts(payload) {
    return {
        product_Name: payload.product_Name,
        product_Price: payload.product_Price,
        product_Img: payload.product_Img,
    };
}

async function createProduct(payload) {
    const product = readProducts(payload);
    const [product_Id] = await productsRepository().insert(product);
    return { product_Id, ...product };
}
async function getAllProducts(query) {
    const { page = 1, limit = 5, topNewest = false } = query; 
    const paginator = new Paginator(page, limit);

    if (topNewest) {
        let results = await productsRepository()
            .select(
                'product_Id',
                'product_Name',
                'product_Price',
                'product_Img'
            )
            .orderBy('product_Id', 'desc')
            .limit(6); 

        return {
            metadata: {
                totalRecords: results.length,
                page: 1,
                limit: 5,
            },
            products: results,
        };
    }

    let results = await productsRepository()
        .select(
            knex.raw('count(product_Id) OVER() AS recordCount'),
            'product_Id',
            'product_Name',
            'product_Price',
            'product_Img',
        )
        .limit(paginator.limit) 
        .offset(paginator.offset); 

    let totalRecords = 0;
    results = results.map((result) => {
        totalRecords = result.recordCount; 
        delete result.recordCount;
        return result;
    });

    return {
        metadata: paginator.getMetadata(totalRecords), 
        products: results, 
    };
    
}
async function getProductById(product_Id) {
    return productsRepository().where('product_Id', product_Id).select('*').first();
}

async function updateProduct(product_Id, payload) {
    const updateProduct = await productsRepository()
        .where('product_Id', product_Id)
        .select('*')
        .first();
    if (!updateProduct) {
        return null;
    }

    const update = readProducts(payload);
    if (!update.product_Img) {
        delete update.product_Img;
    }

    await productsRepository().where('product_Id', product_Id).update(update);

    if (
        update.product_Img &&
        updateProduct.product_Img &&
        update.product_Img !== updateProduct.product_Img &&
        updateProduct.product_Img.startsWith('/public/uploads')
    ){
        unlink(`.${updateProduct.product_Img}`, (err) => {});
    }
    return { ...updateProduct, ...update };
}

async function deleteProduct(product_Id) {
    const deleteProduct = await productsRepository()
        .where('product_Id', product_Id)
        .select('product_Img')
        .first();

    if (!deleteProduct) {
        return null;
    }
    await productsRepository().where('product_Id', product_Id).delete();

    if (
        deleteProduct.product_Img &&
        deleteProduct.product_Img.startsWith('/public/uploads')
    ){
        unlink(`.${deleteProduct.product_Img}`, (err) => {});
    }
    return deleteProduct;
}
module.exports = {
    // Export defined functions
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}
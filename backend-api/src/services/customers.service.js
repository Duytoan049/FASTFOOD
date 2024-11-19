const knex = require('../database/knex');
const Paginator = require('./paginator');
const { unlink } = require('node:fs');

function customerRepository() {
    return knex('customers');
}
function readCustomer(payload) {
    return {
        id : payload.id,
        name: payload.name,
        email: payload.email,
        address: payload.address,
        phone: payload.phone,
        gender: payload.gender,
        avatar: payload.avatar,
    };
}
// Define functions for accessing the database

async function createCustomer(payload) {
    const customer = readCustomer(payload);
    const [id] = await customerRepository().insert(customer);
    return { id, ...customer };
}

async function getAllCustomers(query) {
    const { page = 1, limit = 5 } = query; 
    const paginator = new Paginator(page, limit);

    let results = await customerRepository()
        .select(
            knex.raw('count(id) OVER() AS recordCount'),
            'id',
            'name',
            'email',
            'address',
            'phone',
            'gender',
            'avatar'
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
        customers: results, 
    };
    
}

async function getCustomerById(id) {
    return customerRepository().where('id', id).select('*').first();
}

async function updateCustomer(id, payload) {
    const updateCustomer = await customerRepository()
        .where('id', id)
        .select('*')
        .first();
    if (!updateCustomer) {
        return null;
    }

    const update = readCustomer(payload);
    if (!update.avatar) {
        delete update.avatar;
    }

    await customerRepository().where('id', id).update(update);

    if (
        update.avatar &&
        updateCustomer.avatar &&
        update.avatar !== updateCustomer.avatar &&
        updateCustomer.avatar.startsWith('/public/uploads')
    ){
        unlink(`.${updateCustomer.avatar}`, (err) => {});
    }
    return { ...updateCustomer, ...update };
}

async function deleteCustomer(id) {
    const deletedContact = await customerRepository()
        .where('id', id)
        .select('avatar')
        .first();

    if (!deleteCustomer) {
        return null;
    }
    await customerRepository().where('id', id).delete();

    if (
        deletedContact.avatar &&
        deletedContact.avatar.startsWith('/public/uploads')
    ){
        unlink(`.${deleteCustomer.avatar}`, (err) => {});
    }
    return deleteCustomer;
}


module.exports = {
    // Export defined functions
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
}
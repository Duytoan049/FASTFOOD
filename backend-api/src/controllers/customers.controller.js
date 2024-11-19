const customerService = require('../services/customers.service');
const ApiError = require('../api-error');
const JSend = require('../jsend');

async function createCustomer(req, res, next) {
    if(!req.body?.name || typeof req.body.name !== 'string') {
        return next(new ApiError(400, 'Name should be a non-empty string'));
    }

    try {
        const customer = await customerService.createCustomer({
            ...req.body,
            avatar: req.file ? `/public/uploads/${req.file.filename}` : null,
        });
        return res
            .status(200)
            .set({
                Location: `${req.baseUrl}/${customer.id}`,
            })
            .json(
                JSend.success({
                    customer,
                })
            );
    } catch (error) {
        return next(
            new ApiError(500, 'An error occurred while creating new Customer')
        ); 
    }
}

async function getAllCustomers(req, res, next) {
    let result = {
        customers: [],
        metadata: {
            totalRecords: 0,
            firstPage: 1,
            lastPage: 1,
            page: 1,
            limit: 5,
        },
    };

    try {
        result = await customerService.getAllCustomers(req.query);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, 'An error occurred while retrieving customers')
        );
    }
    return res.json(
        JSend.success({
            customers: result.customers,
            metadata: result.metadata,
        })
    );
}

async function getCustomer(req, res, next) {
    const {id} = req.params;

    try {
        const customer = await customerService.getCustomerById(id);
        if(!customer) {
            return next(new ApiError(404, 'Contact not found'));
        }
        return res.json(
            JSend.success({
                customer,
            })
        );
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving customer with id=${id}`)
        );
    }
}


async function updateCustomer(req, res, next) {
    if(Object.keys(req.body).length == 0 && !req.file){
        return next(new ApiError(400, 'Data to update can not be empty'));
    }

    const {id} = req.params;

    try{
        const update = await customerService.updateCustomer(id, {
            ...req.body,
            avatar: req.file ? `/public/uploads/${req.file.filename}` : null,
        });
        if(!update){
            return next(new ApiError(404, 'Customer not found'));
        }
        return res.json(
            JSend.success({
                customer: update,
            })
        );
    } catch (error){
        console.log(error);
        return next(
            new ApiError(500, `Error updating customer with id=${id}`)
        );
    }
}

async function deleteCustomer(req, res, next) {
    const {id} = req.params;

    try {
        const deleted = await customerService.deleteCustomer(id);
        if(!deleted){
            return next(new ApiError(404, 'Customer not found'));
        }
        return res.json(JSend.success());
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Could not delete customer with id=${id}`)
        );
    } 
}


module.exports = {
    getAllCustomers,
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
};

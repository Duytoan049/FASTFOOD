const orderService = require('../services/orders.service');
const customerService = require('../services/customers.service');
const ApiError = require('../api-error');
const JSend = require('../jsend');

// Order Controller Functions
async function createOrder(req, res, next) {
    try {
        const { id } = req.params;
        const customer = await customerService.getCustomerById(id); // Gọi hàm từ cart.service
        if (!customer) {
            return next(new ApiError(404, 'Customer not found'));
        }

        const order = await orderService.createOrder({
            id: id,
            ...req.body
        });

        return res
            .status(201)
            .set({ Location: `${req.baseUrl}/${order.order_Id}` })
            .json(
                JSend.success({
                    order_Id: order.order_Id, 
                    order,
                }
            ));
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, 'An error occurred while creating new Order'));
    }
}

async function getOrder(req, res, next) {
    const {id} = req.params;

    try {
        const order = await orderService.getOrderById(id);
        if(!order) {
            return next(new ApiError(404, 'Order not found'));
        }
        return res.json(
            JSend.success({
                order,
            })
        );
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving order with id=${id}`)
        );
    }
}


// Order Detail Controller Functions
async function createOrderDetail(req, res, next) {
    try {
        const { order_Id, product_Id } = req.params;
        const orderDetail = await orderService.createOrderDetail({
            order_Id,
            product_Id,
            ...req.body,
        });

        return res.status(201).json(JSend.success({ orderDetail }));
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, 'An error occurred while creating OrderDetail'));
    }
}

async function getOrderDetail(req, res, next) {
    const {order_Id} = req.params;
    try {
        const orderDetail = await orderService.getOrderDetailsByOrderId(order_Id);
        if (orderDetail.length === 0) {
            return next(new ApiError(404, 'Order details not found'));
        }
        return res.json(JSend.success({ orderDetail }));
    } catch (error) {
        console.log('Error details:', error);
        return next(new ApiError(500, `Error retrieving OrderDetails with order_Id=${order_Id}`));
    }
}

async function deleteOrderDetail(req, res, next) {
    const { order_Id, product_Id } = req.params;
    try {
        await orderService.deleteOrderDetail(order_Id, product_Id);
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error deleting OrderDetail with order_Id=${order_Id} and product_Id=${product_Id}`));
    }
}

module.exports = {
    createOrder,
    getOrder,
    getOrderDetail,
    createOrderDetail,
    deleteOrderDetail,
};

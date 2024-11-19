const knex = require('../database/knex');
const Paginator = require('./paginator');
const { unlink } = require('node:fs');

// Order repository and functions
function orderRepository() {
    return knex('orders');
}

function readOrder(payload) {
    return {
        id: payload.id,
        order_Date: payload.order_Date,
        total_Price: payload.total_Price,
    };
}

async function createOrder(payload) {
    const order = readOrder(payload);
    const [order_Id] = await orderRepository().insert(order);
    return { order_Id, ...order };
}


async function getOrderById(id_customer) {
    return orderRepository().where('id', id_customer).select('*');
}

async function updateOrder(order_Id, payload) {
    const order = readOrder(payload);
    
    const sql = `UPDATE orders SET total_Price = ?, order_Date = ? WHERE order_Id = ?`;
    await knex.raw(sql, [order.total_Price, order.order_Date || new Date(), order_Id]);

    return getOrderById(order_Id);
}

// Order detail repository and functions
function orderDetailRepository() {
    return knex('Orderdetail');
}

function readOrderDetail(payload) {
    return {
        order_Id: payload.order_Id,
        product_Id: payload.product_Id,
        quantity: payload.quantity,
        price: payload.price,
    };
}

async function createOrderDetail(payload) {
    const orderDetail = readOrderDetail(payload);
    await orderDetailRepository().insert(orderDetail);
    return orderDetail;
}

async function getOrderDetailsByOrderId(order_Id) {
    return orderDetailRepository()
        .where({ order_Id })
        .select('*');
}

async function updateOrderDetail(order_Id, product_Id, payload) {
    await orderDetailRepository()
        .where({ order_Id, product_Id })
        .update(payload);
    return getOrderDetailsByOrderId(order_Id, product_Id);
}

async function deleteOrderDetail(order_Id, product_Id) {
    await orderDetailRepository()
        .where({ order_Id, product_Id })
        .delete();
}

// Exporting all functions from both services
module.exports = {
    createOrder,
    getOrderById,
    updateOrder,
    createOrderDetail,
    getOrderDetailsByOrderId,
    updateOrderDetail,
    deleteOrderDetail,
};

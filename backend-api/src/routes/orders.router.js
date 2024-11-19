const express = require('express');
const cartController = require('../controllers/orders.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const avatarUpload = require('../middlewares/avatar-upload.middleware');

const router = express.Router();

module.exports.setup = (app) => {
  app.use('/api/v1/cart', router);

  /**
   * @swagger
   * /api/v1/cart/customers/{id}:
   *  post:
   *     summary: Create a new order
   *     description: Create a new order for a customer
   *     parameters:
   *       - $ref: '#/components/parameters/customerIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Order'
   *     tags:
   *       - cart
   *     responses:
   *       201:
   *         description: A new order created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     order:
   *                       $ref: '#/components/schemas/Order'
   *       400:
   *         description: Invalid request body or missing required fields
   *       500:
   *         description: Internal server error
   */
  router.post('/customers/:id', cartController.createOrder);

  /**
   * @swagger
   * /api/v1/cart/customers/{id}:
   *  get:
   *     summary: Get order by ID customer
   *     description: Retrieve order details by customer ID
   *     parameters:
   *       - $ref: '#/components/parameters/customerIdParam'
   *     tags:
   *       - cart
   *     responses:
   *       200:
   *         description: Order details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     order:
   *                       $ref: '#/components/schemas/Order'
   *       404:
   *         description: Order not found
   *       500:
   *         description: Internal server error
   */
  router.get('/customers/:id', cartController.getOrder);


  /**
   * @swagger
   * /api/v1/cart/{order_Id}/details:
   *  get:
   *     summary: Get all order details by order ID
   *     description: Retrieve all order details for a specific order
   *     parameters:
   *       - in: path
   *         name: order_Id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The ID of the order
   *     tags:
   *       - cart
   *     responses:
   *       200:
   *         description: List of order details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   enum: [success]
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/OrderDetail'
   *       404:
   *         description: No order details found for the given order ID
   *       500:
   *         description: Internal server error
   */
  router.get('/:order_Id/details', cartController.getOrderDetail);

  /**
   * @swagger
   * /api/v1/cart/{order_Id}/details/{product_Id}:
   *  post:
   *     summary: Create a new order detail
   *     description: Add a new product to an order
   *     parameters:
   *       - in: path
   *         name: order_Id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The ID of the order
   *       - in: path
   *         name: product_Id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The ID of the product
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OrderDetail'
   *     tags:
   *       - cart
   *     responses:
   *       201:
   *         description: Order detail created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/OrderDetail'
   *       400:
   *         description: Invalid request body or missing required fields
   *       500:
   *         description: Internal server error
   */
  router.post('/:order_Id/details/:product_Id', cartController.createOrderDetail);


  /**
   * @swagger
   * /api/v1/cart/{order_Id}/details/{product_Id}:
   *  delete:
   *     summary: Delete an order detail
   *     description: Remove a product from an order
   *     parameters:
   *       - in: path
   *         name: order_Id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The ID of the order
   *       - in: path
   *         name: product_Id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The ID of the product
   *     tags:
   *       - cart
   *     responses:
   *       204:
   *         description: Order detail deleted successfully
   *       404:
   *         description: Order detail not found
   *       500:
   *         description: Internal server error
   */
  router.delete('/:order_Id/details/:product_Id', cartController.deleteOrderDetail);
};

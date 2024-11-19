const express = require('express');
const customersController  = require('../controllers/customers.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const avatarUpload = require('../middlewares/avatar-upload.middleware');

const router = express.Router();
module.exports.setup = (app) => {
app.use('/api/v1/customers', router);

/**
 * @swagger
 * /api/v1/customers:
 *  get:
 *     summary: Get all customers 
 *     description: Get all customers 
 *     parameters:
 *        - $ref: '#/components/parameters/limitParam'
 *        - $ref: '#/components/parameters/pageParam'
 *     tags:
 *        - customers 
 *     responses:
 *          200:
 *              description: A list of all customers
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  description: The responses status
 *                                  enum: [success]
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      customers:
 *                                          type: array
 *                                          items:
 *                                              $ref: '#/components/schemas/Customer'
 *                                      metadata:
 *                                          $ref: '#/components/schemas/PaginationMetadata'  
 *          400:
 *              description: Invalid query parameters
 *          500:
 *              description: Internal server error   
 */
router.get('/', customersController.getAllCustomers);

/**
 * @swagger
 * /api/v1/customers:
 *  post:
 *     summary: Create a new customer
 *     description: Create a new customer
 *     requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                       $ref: '#/components/schemas/Customer'  
 *     tags:
 *        - customers 
 *     responses:
 *          201:
 *              description: A new customer
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  description: The responses status
 *                                  enum: [success]
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      customers:
 *                                          $ref: '#/components/schemas/Customer'    
 *          400:
 *              description: Invalid request body or missing required fields
 *          415:
 *              description: Unsupported media type, expected multipart/form-data
 *          500:
 *              description: Internal server error   
 */
router.post('/', avatarUpload, customersController.createCustomer);
router.all('/', methodNotAllowed);

/**
 * @swagger
 * /api/v1/customers/{id}:
 *  get:
 *     summary: Get customer by ID
 *     description: Get customer by ID
 *     parameters:
 *        - $ref: '#/components/parameters/customerIdParam'
 *     tags:
 *        - customers 
 *     responses:
 *          200:
 *              description: A  customer
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  description: The responses status
 *                                  enum: [success]
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      customers:
 *                                          $ref: '#/components/schemas/Customer'
 *          400:
 *              description: Invalid ID format
 *          404:
 *              description: Customer not found
 *          500:
 *              description: Internal server error       
 */
router.get('/:id', customersController.getCustomer);

/**
 * @swagger
 * /api/v1/customers/{id}:
 *  put:
 *     summary: Update customer by ID
 *     description: Update customer by ID
 *     parameters:
 *        - $ref: '#/components/parameters/customerIdParam'
 *     requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                       $ref: '#/components/schemas/Customer'
 *     tags:
 *        - customers 
 *     responses:
 *          200:
 *              description: An updated customer
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                                  description: The responses status
 *                                  enum: [success]
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      customers:
 *                                          $ref: '#/components/schemas/Customer'     
 *          400:
 *              description: Invalid request body or parameters
 *          404:
 *              description: Customer not found
 *          415:
 *              description: Unsupported media type, expected multipart/form-data
 *          500:
 *              description: Internal server error  
 */
router.put('/:id', avatarUpload, customersController.updateCustomer);

/**
 * @swagger
 * /api/v1/customers/{id}:
 *  delete:
 *     summary: Delete customer by ID
 *     description: Delete customer by ID
 *     parameters:
 *        - $ref: '#/components/parameters/customerIdParam'
 *     tags:
 *        - customers 
 *     responses:
 *          200:
 *              description: A  customer
 *              $ref: '#/components/schemas/Customer'     
 *          400:
 *              description: Invalid ID format
 *          404:
 *              description: Customer not found
 *          500:
 *              description: Internal server error  
 */
router.delete('/:id', customersController.deleteCustomer);
router.all('/:id', methodNotAllowed);
};
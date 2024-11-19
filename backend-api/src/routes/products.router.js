const express = require('express');
const productsController  = require('../controllers/products.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const avatarUpload = require('../middlewares/avatar-upload.middleware');

const router = express.Router();
module.exports.setup = (app) => {
app.use('/api/v1/products', router);

/**
 * @swagger
 * /api/v1/products:
 *  get:
 *     summary: Get all products 
 *     description: Get all products 
 *     parameters:
 *        - $ref: '#/components/parameters/limitParam'
 *        - $ref: '#/components/parameters/pageParam'
 *     tags:
 *        - products 
 *     responses:
 *          200:
 *              description: A list of all products
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
 *                                      products:
 *                                          type: array
 *                                          items:
 *                                              $ref: '#/components/schemas/Product'
 *                                      metadata:
 *                                          $ref: '#/components/schemas/PaginationMetadata'  
 *          400:
 *              description: Invalid query parameters
 *          500:
 *              description: Internal server error   
 */
router.get('/', productsController.getAllProducts);

/**
 * @swagger
 * /api/v1/products:
 *  post:
 *     summary: Create a new product
 *     description: Create a new product
 *     requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                       $ref: '#/components/schemas/Product'  
 *     tags:
 *        - products 
 *     responses:
 *          201:
 *              description: A new product
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
 *                                      product:
 *                                          $ref: '#/components/schemas/Product'    
 *          400:
 *              description: Invalid request body or missing required fields
 *          415:
 *              description: Unsupported media type, expected multipart/form-data
 *          500:
 *              description: Internal server error   
 */
router.post('/', avatarUpload, productsController.createProduct);
router.all('/', methodNotAllowed);

/**
 * @swagger
 * /api/v1/products/{product_Id}:
 *  get:
 *     summary: Get product by ID
 *     description: Get product by ID
 *     parameters:
 *        - $ref: '#/components/parameters/productIdParam'
 *     tags:
 *        - products 
 *     responses:
 *          200:
 *              description: A product
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
 *                                      products:
 *                                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Invalid ID format
 *          404:
 *              description: Product not found
 *          500:
 *              description: Internal server error       
 */
router.get('/:id', productsController.getProduct);

/**
 * @swagger
 * /api/v1/products/{product_Id}:
 *  put:
 *     summary: Update product by ID
 *     description: Update product by ID
 *     parameters:
 *        - $ref: '#/components/parameters/productIdParam'
 *     requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                       $ref: '#/components/schemas/Product'
 *     tags:
 *        - products 
 *     responses:
 *          200:
 *              description: An updated Product
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
 *                                      products:
 *                                          $ref: '#/components/schemas/Product'     
 *          400:
 *              description: Invalid request body or parameters
 *          404:
 *              description: Product not found
 *          415:
 *              description: Unsupported media type, expected multipart/form-data
 *          500:
 *              description: Internal server error  
 */
router.put('/:id', avatarUpload, productsController.updateProduct);

/**
 * @swagger
 * /api/v1/products/{product_Id}:
 *  delete:
 *     summary: Delete product by ID
 *     description: Delete product by ID
 *     parameters:
 *        - $ref: '#/components/parameters/productIdParam'
 *     tags:
 *        - products 
 *     responses:
 *          200:
 *              description: A  product
 *              $ref: '#/components/schemas/Product'     
 *          400:
 *              description: Invalid ID format
 *          404:
 *              description: Product not found
 *          500:
 *              description: Internal server error  
 */
router.delete('/:id', productsController.deleteProduct);
router.all('/:id', methodNotAllowed);
};
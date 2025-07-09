const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Products retrieved successfully"
 *                 count:
 *                   type: integer
 *                   example: 4
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Fresh Milk"
 *                       unit:
 *                         type: string
 *                         example: "Liter"
 *                       pricePerUnit:
 *                         type: number
 *                         format: float
 *                         example: 2.50
 */
router.get('/', authMiddleware, productController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product retrieved successfully"
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Fresh Milk"
 *                     unit:
 *                       type: string
 *                       example: "Liter"
 *                     pricePerUnit:
 *                       type: number
 *                       format: float
 *                       example: 2.50
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *                 error:
 *                   type: string
 *                   example: "PRODUCT_NOT_FOUND"
 *                 productId:
 *                   type: integer
 *                   example: 999
 */
router.get('/:id', authMiddleware, productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a product (Manager/Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - unit
 *               - pricePerUnit
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: "Fresh Milk"
 *               unit:
 *                 type: string
 *                 description: Unit of measurement (e.g., Liter, Kilogram, Piece)
 *                 example: "Liter"
 *               pricePerUnit:
 *                 type: number
 *                 format: float
 *                 description: Price per unit
 *                 example: 2.50
 *           example:
 *             name: "Fresh Milk"
 *             unit: "Liter"
 *             pricePerUnit: 2.50
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Fresh Milk"
 *                     unit:
 *                       type: string
 *                       example: "Liter"
 *                     pricePerUnit:
 *                       type: number
 *                       format: float
 *                       example: 2.50
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product name is required"
 *                 error:
 *                   type: string
 *                   example: "NAME_REQUIRED"
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Insufficient permissions"
 *                 required:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["MANAGER", "ADMIN"]
 *                 current:
 *                   type: string
 *                   example: "USER"
 */
router.post('/', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (Manager/Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - unit
 *               - pricePerUnit
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: "Premium Fresh Milk"
 *               unit:
 *                 type: string
 *                 description: Unit of measurement
 *                 example: "Liter"
 *               pricePerUnit:
 *                 type: number
 *                 format: float
 *                 description: Price per unit
 *                 example: 3.00
 *           example:
 *             name: "Premium Fresh Milk"
 *             unit: "Liter"
 *             pricePerUnit: 3.00
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Premium Fresh Milk"
 *                     unit:
 *                       type: string
 *                       example: "Liter"
 *                     pricePerUnit:
 *                       type: number
 *                       format: float
 *                       example: 3.00
 *       400:
 *         description: Bad request - validation error
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Product not found
 */
router.put('/:id', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Manager/Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       400:
 *         description: Cannot delete product with associated sales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot delete product with associated sales"
 *                 error:
 *                   type: string
 *                   example: "PRODUCT_HAS_SALES"
 *                 saleCount:
 *                   type: integer
 *                   example: 8
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Product not found
 */
router.delete('/:id', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), productController.deleteProduct);

module.exports = router;

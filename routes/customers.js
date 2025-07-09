const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customers retrieved successfully"
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 customers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       type:
 *                         type: string
 *                         example: "Retail"
 *                       phone:
 *                         type: string
 *                         example: "123-456-7890"
 *                       notes:
 *                         type: string
 *                         example: "Regular customer"
 */
router.get('/', authMiddleware, customerController.getAllCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
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
 *         description: Customer found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer retrieved successfully"
 *                 customer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     type:
 *                       type: string
 *                       example: "Retail"
 *                     phone:
 *                       type: string
 *                       example: "123-456-7890"
 *                     notes:
 *                       type: string
 *                       example: "Regular customer"
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer not found"
 *                 error:
 *                   type: string
 *                   example: "CUSTOMER_NOT_FOUND"
 *                 customerId:
 *                   type: integer
 *                   example: 999
 */
router.get('/:id', authMiddleware, customerController.getCustomerById);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a customer (Manager/Admin only)
 *     tags: [Customers]
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
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: Customer name
 *                 example: "John Doe"
 *               type:
 *                 type: string
 *                 description: Customer type (e.g., Retail, Wholesale, Restaurant)
 *                 example: "Retail"
 *               phone:
 *                 type: string
 *                 description: Customer phone number
 *                 example: "123-456-7890"
 *               notes:
 *                 type: string
 *                 description: Additional notes about the customer
 *                 example: "Regular customer with good payment history"
 *           example:
 *             name: "John Doe"
 *             type: "Retail"
 *             phone: "123-456-7890"
 *             notes: "Regular customer with good payment history"
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer created successfully"
 *                 customer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     type:
 *                       type: string
 *                       example: "Retail"
 *                     phone:
 *                       type: string
 *                       example: "123-456-7890"
 *                     notes:
 *                       type: string
 *                       example: "Regular customer with good payment history"
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer name is required"
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
router.post('/', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), customerController.createCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer (Manager/Admin only)
 *     tags: [Customers]
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
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: Customer name
 *                 example: "John Doe Updated"
 *               type:
 *                 type: string
 *                 description: Customer type
 *                 example: "Wholesale"
 *               phone:
 *                 type: string
 *                 description: Customer phone number
 *                 example: "123-456-7890"
 *               notes:
 *                 type: string
 *                 description: Additional notes about the customer
 *                 example: "Updated customer information"
 *           example:
 *             name: "John Doe Updated"
 *             type: "Wholesale"
 *             phone: "123-456-7890"
 *             notes: "Updated customer information"
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer updated successfully"
 *                 customer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "John Doe Updated"
 *                     type:
 *                       type: string
 *                       example: "Wholesale"
 *                     phone:
 *                       type: string
 *                       example: "123-456-7890"
 *                     notes:
 *                       type: string
 *                       example: "Updated customer information"
 *       400:
 *         description: Bad request - validation error
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Customer not found
 */
router.put('/:id', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), customerController.updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer (Manager/Admin only)
 *     tags: [Customers]
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
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer deleted successfully"
 *       400:
 *         description: Cannot delete customer with associated sales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot delete customer with associated sales"
 *                 error:
 *                   type: string
 *                   example: "CUSTOMER_HAS_SALES"
 *                 saleCount:
 *                   type: integer
 *                   example: 5
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Customer not found
 */
router.delete('/:id', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), customerController.deleteCustomer);

module.exports = router;

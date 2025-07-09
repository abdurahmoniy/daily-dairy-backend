const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sale management
 */

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sales
 */
router.get('/', authMiddleware, saleController.getAllSales);

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Get sale by ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sale found
 *       404:
 *         description: Sale not found
 */
router.get('/:id', authMiddleware, saleController.getSaleById);

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a sale (Manager/Admin only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Sale created
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), saleController.createSale);

/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Update a sale (Manager/Admin only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Sale updated
 *       403:
 *         description: Insufficient permissions
 */
router.put('/:id', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), saleController.updateSale);

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Delete a sale (Manager/Admin only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sale deleted
 *       403:
 *         description: Insufficient permissions
 */
router.delete('/:id', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), saleController.deleteSale);

module.exports = router;

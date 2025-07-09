const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Milk Purchases
 *   description: Milk purchase management
 */

/**
 * @swagger
 * /api/milk-purchases:
 *   get:
 *     summary: Get all milk purchases
 *     tags: [Milk Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of milk purchases
 */
router.get('/', authMiddleware, purchaseController.getAllPurchases);

/**
 * @swagger
 * /api/milk-purchases/{id}:
 *   get:
 *     summary: Get milk purchase by ID
 *     tags: [Milk Purchases]
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
 *         description: Milk purchase found
 *       404:
 *         description: Milk purchase not found
 */
router.get('/:id', authMiddleware, purchaseController.getPurchaseById);

/**
 * @swagger
 * /api/milk-purchases:
 *   post:
 *     summary: Create a milk purchase (Manager/Admin only)
 *     tags: [Milk Purchases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplierId
 *               - date
 *               - quantityLiters
 *               - pricePerLiter
 *             properties:
 *               supplierId:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-09T10:00:00.000Z"
 *               quantityLiters:
 *                 type: number
 *                 example: 100.5
 *               pricePerLiter:
 *                 type: number
 *                 example: 2.5
 *               total:
 *                 type: number
 *                 example: 251.25
 *           example:
 *             supplierId: 1
 *             date: "2024-07-09T10:00:00.000Z"
 *             quantityLiters: 100.5
 *             pricePerLiter: 2.5
 *             total: 251.25
 *     responses:
 *       201:
 *         description: Milk purchase created
 *       400:
 *         description: Bad request - validation error
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), purchaseController.createPurchase);

/**
 * @swagger
 * /api/milk-purchases/{id}:
 *   put:
 *     summary: Update a milk purchase (Manager/Admin only)
 *     tags: [Milk Purchases]
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
 *             properties:
 *               supplierId:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-09T10:00:00.000Z"
 *               quantityLiters:
 *                 type: number
 *                 example: 120.0
 *               pricePerLiter:
 *                 type: number
 *                 example: 2.6
 *               total:
 *                 type: number
 *                 example: 312.0
 *           example:
 *             supplierId: 1
 *             date: "2024-07-09T10:00:00.000Z"
 *             quantityLiters: 120.0
 *             pricePerLiter: 2.6
 *             total: 312.0
 *     responses:
 *       200:
 *         description: Milk purchase updated
 *       400:
 *         description: Bad request - validation error
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Milk purchase not found
 */
router.put('/:id', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), purchaseController.updatePurchase);

/**
 * @swagger
 * /api/milk-purchases/{id}:
 *   delete:
 *     summary: Delete a milk purchase (Manager/Admin only)
 *     tags: [Milk Purchases]
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
 *         description: Milk purchase deleted
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Milk purchase not found
 */
router.delete('/:id', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), purchaseController.deletePurchase);

module.exports = router;

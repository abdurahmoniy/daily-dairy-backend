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
 *     responses:
 *       201:
 *         description: Milk purchase created
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Milk purchase updated
 *       403:
 *         description: Insufficient permissions
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
 *     responses:
 *       200:
 *         description: Milk purchase deleted
 *       403:
 *         description: Insufficient permissions
 */
router.delete('/:id', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), purchaseController.deletePurchase);

module.exports = router;

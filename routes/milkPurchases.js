const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: MilkPurchases
 *   description: Milk purchase management
 */

/**
 * @swagger
 * /api/milk-purchases:
 *   get:
 *     summary: Get all milk purchases
 *     tags: [MilkPurchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchases
 */
router.get('/', authMiddleware, purchaseController.getAllPurchases);

/**
 * @swagger
 * /api/milk-purchases/{id}:
 *   get:
 *     summary: Get purchase by ID
 *     tags: [MilkPurchases]
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
 *         description: Purchase found
 *       404:
 *         description: Purchase not found
 */
router.get('/:id', authMiddleware, purchaseController.getPurchaseById);

/**
 * @swagger
 * /api/milk-purchases:
 *   post:
 *     summary: Create a purchase
 *     tags: [MilkPurchases]
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
 *         description: Purchase created
 */
router.post('/', authMiddleware, purchaseController.createPurchase);

/**
 * @swagger
 * /api/milk-purchases/{id}:
 *   put:
 *     summary: Update a purchase
 *     tags: [MilkPurchases]
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
 *         description: Purchase updated
 */
router.put('/:id', authMiddleware, purchaseController.updatePurchase);

/**
 * @swagger
 * /api/milk-purchases/{id}:
 *   delete:
 *     summary: Delete a purchase
 *     tags: [MilkPurchases]
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
 *         description: Purchase deleted
 */
router.delete('/:id', authMiddleware, purchaseController.deletePurchase);

module.exports = router;

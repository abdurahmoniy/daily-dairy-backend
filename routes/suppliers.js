const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Supplier management
 */

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of suppliers
 */
router.get('/', authMiddleware, supplierController.getAllSuppliers);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get supplier by ID
 *     tags: [Suppliers]
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
 *         description: Supplier found
 *       404:
 *         description: Supplier not found
 */
router.get('/:id', authMiddleware, supplierController.getSupplierById);

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Create a supplier (Manager/Admin only)
 *     tags: [Suppliers]
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
 *         description: Supplier created
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), supplierController.createSupplier);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Update a supplier (Manager/Admin only)
 *     tags: [Suppliers]
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
 *         description: Supplier updated
 *       403:
 *         description: Insufficient permissions
 */
router.put('/:id', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), supplierController.updateSupplier);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier (Manager/Admin only)
 *     tags: [Suppliers]
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
 *         description: Supplier deleted
 *       403:
 *         description: Insufficient permissions
 */
router.delete('/:id', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), supplierController.deleteSupplier);

module.exports = router;

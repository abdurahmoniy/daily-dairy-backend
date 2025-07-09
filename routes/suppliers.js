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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Suppliers retrieved successfully"
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 suppliers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Milk Supplier Co"
 *                       phone:
 *                         type: string
 *                         example: "123-456-7890"
 *                       notes:
 *                         type: string
 *                         example: "Reliable supplier"
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
 *         example: 1
 *     responses:
 *       200:
 *         description: Supplier found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Supplier retrieved successfully"
 *                 supplier:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Milk Supplier Co"
 *                     phone:
 *                       type: string
 *                       example: "123-456-7890"
 *                     notes:
 *                       type: string
 *                       example: "Reliable supplier"
 *       404:
 *         description: Supplier not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Supplier not found"
 *                 error:
 *                   type: string
 *                   example: "SUPPLIER_NOT_FOUND"
 *                 supplierId:
 *                   type: integer
 *                   example: 999
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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Supplier name
 *                 example: "Milk Supplier Co"
 *               phone:
 *                 type: string
 *                 description: Supplier phone number
 *                 example: "123-456-7890"
 *               notes:
 *                 type: string
 *                 description: Additional notes about the supplier
 *                 example: "Reliable supplier with good quality"
 *           example:
 *             name: "Milk Supplier Co"
 *             phone: "123-456-7890"
 *             notes: "Reliable supplier with good quality"
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Supplier created successfully"
 *                 supplier:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Milk Supplier Co"
 *                     phone:
 *                       type: string
 *                       example: "123-456-7890"
 *                     notes:
 *                       type: string
 *                       example: "Reliable supplier with good quality"
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Supplier name is required"
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
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Supplier name
 *                 example: "Updated Milk Supplier Co"
 *               phone:
 *                 type: string
 *                 description: Supplier phone number
 *                 example: "123-456-7890"
 *               notes:
 *                 type: string
 *                 description: Additional notes about the supplier
 *                 example: "Updated reliable supplier"
 *           example:
 *             name: "Updated Milk Supplier Co"
 *             phone: "123-456-7890"
 *             notes: "Updated reliable supplier"
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Supplier updated successfully"
 *                 supplier:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Updated Milk Supplier Co"
 *                     phone:
 *                       type: string
 *                       example: "123-456-7890"
 *                     notes:
 *                       type: string
 *                       example: "Updated reliable supplier"
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Supplier name is required"
 *                 error:
 *                   type: string
 *                   example: "NAME_REQUIRED"
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Supplier not found
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
 *         example: 1
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Supplier deleted successfully"
 *       400:
 *         description: Cannot delete supplier with associated purchases
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot delete supplier with associated purchases"
 *                 error:
 *                   type: string
 *                   example: "SUPPLIER_HAS_PURCHASES"
 *                 purchaseCount:
 *                   type: integer
 *                   example: 3
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Supplier not found
 */
router.delete('/:id', authMiddleware, roleMiddleware(['MANAGER', 'ADMIN']), supplierController.deleteSupplier);

module.exports = router;

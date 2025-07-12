const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard summary
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary
 */
router.get('/summary', authMiddleware, dashboardController.getSummary);

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get comprehensive dashboard analytics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-07-01"
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-07-31"
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Dashboard analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dateRange:
 *                   type: object
 *                   properties:
 *                     from:
 *                       type: string
 *                       format: date
 *                     to:
 *                       type: string
 *                       format: date
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalMilkPurchased:
 *                       type: number
 *                       description: Total milk purchased in liters
 *                     totalMilkSold:
 *                       type: number
 *                       description: Total milk sold in liters
 *                     totalPurchaseCost:
 *                       type: number
 *                       description: Total purchase cost in dollars
 *                     totalSalesRevenue:
 *                       type: number
 *                       description: Total sales revenue in dollars
 *                     grossProfit:
 *                       type: number
 *                       description: Gross profit (revenue - cost)
 *                 purchasesOverTime:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       totalLiters:
 *                         type: number
 *                 salesOverTime:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       totalLiters:
 *                         type: number
 *                 supplierBreakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       supplierId:
 *                         type: integer
 *                       supplierName:
 *                         type: string
 *                       totalLitersSupplied:
 *                         type: number
 *                       totalCost:
 *                         type: number
 *                 customerBreakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       customerId:
 *                         type: integer
 *                       customerName:
 *                         type: string
 *                       totalLitersBought:
 *                         type: number
 *                       totalRevenue:
 *                         type: number
 *                 productBreakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                       productName:
 *                         type: string
 *                       unitsSold:
 *                         type: number
 *                       totalRevenue:
 *                         type: number
 *       400:
 *         description: Invalid date format or range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid or expired token
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, dashboardController.getDashboard);

/**
 * @swagger
 * /api/dashboard/all-time:
 *   get:
 *     summary: Get all-time analytics and lifetime statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All-time analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalMilkPurchased:
 *                       type: number
 *                       description: Total milk purchased in liters (all time)
 *                     totalMilkSold:
 *                       type: number
 *                       description: Total milk sold in liters (all time)
 *                     totalPurchaseCost:
 *                       type: number
 *                       description: Total purchase cost in dollars (all time)
 *                     totalSalesRevenue:
 *                       type: number
 *                       description: Total sales revenue in dollars (all time)
 *                     grossProfit:
 *                       type: number
 *                       description: Gross profit (revenue - cost) (all time)
 *                 supplierBreakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       supplierId:
 *                         type: integer
 *                       supplierName:
 *                         type: string
 *                       totalLitersSupplied:
 *                         type: number
 *                         description: Total liters supplied (all time)
 *                       totalCost:
 *                         type: number
 *                         description: Total cost paid to supplier (all time)
 *                       totalTransactions:
 *                         type: integer
 *                         description: Number of purchase transactions
 *                       averagePricePerLiter:
 *                         type: number
 *                         description: Average price per liter from this supplier
 *                 customerBreakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       customerId:
 *                         type: integer
 *                       customerName:
 *                         type: string
 *                       totalLitersBought:
 *                         type: number
 *                         description: Total liters bought (all time)
 *                       totalRevenue:
 *                         type: number
 *                         description: Total revenue from this customer (all time)
 *                       totalTransactions:
 *                         type: integer
 *                         description: Number of sales transactions
 *                       averagePricePerLiter:
 *                         type: number
 *                         description: Average price per liter sold to this customer
 *                 productBreakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                       productName:
 *                         type: string
 *                       unitsSold:
 *                         type: number
 *                         description: Total units sold (all time)
 *                       totalRevenue:
 *                         type: number
 *                         description: Total revenue from this product (all time)
 *                       totalTransactions:
 *                         type: integer
 *                         description: Number of sales transactions
 *                       averagePricePerUnit:
 *                         type: number
 *                         description: Average price per unit sold
 *                 monthlyTrends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         format: date
 *                         description: Month in YYYY-MM format
 *                       purchases:
 *                         type: number
 *                         description: Total liters purchased in this month
 *                       sales:
 *                         type: number
 *                         description: Total liters sold in this month
 *                       purchaseCost:
 *                         type: number
 *                         description: Total purchase cost in this month
 *                       salesRevenue:
 *                         type: number
 *                         description: Total sales revenue in this month
 *                       profit:
 *                         type: number
 *                         description: Profit for this month
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid or expired token
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Service unavailable - Database connection error
 */
router.get('/all-time', authMiddleware, dashboardController.getAllTimeAnalytics);

module.exports = router;

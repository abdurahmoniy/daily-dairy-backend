const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard analytics and summary endpoints
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary with key metrics and recent activities
 *     description: Returns a comprehensive summary including counts, totals, and recent transactions
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suppliers:
 *                   type: integer
 *                   description: Total number of suppliers
 *                   example: 5
 *                 customers:
 *                   type: integer
 *                   description: Total number of customers
 *                   example: 12
 *                 products:
 *                   type: integer
 *                   description: Total number of products
 *                   example: 8
 *                 milkPurchases:
 *                   type: integer
 *                   description: Total number of milk purchase transactions
 *                   example: 45
 *                 sales:
 *                   type: integer
 *                   description: Total number of sales transactions
 *                   example: 120
 *                 totalRevenue:
 *                   type: number
 *                   format: float
 *                   description: Total revenue from all sales
 *                   example: 125000.50
 *                 totalMilkPurchased:
 *                   type: number
 *                   format: float
 *                   description: Total milk purchased in liters
 *                   example: 2500.75
 *                 recentMilkPurchases:
 *                   type: array
 *                   description: Latest 5 milk purchase transactions
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       supplierId:
 *                         type: integer
 *                         example: 2
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       quantityLiters:
 *                         type: number
 *                         format: float
 *                         example: 50.5
 *                       pricePerLiter:
 *                         type: number
 *                         format: float
 *                         example: 2.50
 *                       total:
 *                         type: number
 *                         format: float
 *                         example: 126.25
 *                       supplier:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           name:
 *                             type: string
 *                             example: "Milk Supplier Co"
 *                           phone:
 *                             type: string
 *                             example: "123-456-7890"
 *                 recentSales:
 *                   type: array
 *                   description: Latest 5 sales transactions
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       customerId:
 *                         type: integer
 *                         example: 3
 *                       productId:
 *                         type: integer
 *                         example: 1
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       quantity:
 *                         type: number
 *                         format: float
 *                         example: 10.0
 *                       pricePerUnit:
 *                         type: number
 *                         format: float
 *                         example: 3.00
 *                       total:
 *                         type: number
 *                         format: float
 *                         example: 30.00
 *                       customer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           type:
 *                             type: string
 *                             example: "Retail"
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Fresh Milk"
 *                           unit:
 *                             type: string
 *                             example: "Liter"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid or expired token
 *       500:
 *         description: Internal server error
 */
router.get('/summary', authMiddleware, dashboardController.getSummary);

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get comprehensive dashboard analytics for a specific date range
 *     description: Returns detailed analytics including summary metrics, time series data, and breakdowns by suppliers, customers, and products. Supports mixed-unit sales data (liters, kg, units).
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Start date in YYYY-MM-DD format (defaults to start of current month)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-31"
 *         description: End date in YYYY-MM-DD format (defaults to end of current month)
 *     responses:
 *       200:
 *         description: Dashboard analytics data for the specified period
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
 *                       example: "2024-01-01"
 *                       description: Start date of the analysis period
 *                     to:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-31"
 *                       description: End date of the analysis period
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalMilkPurchased:
 *                       type: number
 *                       format: float
 *                       description: Total milk purchased in liters
 *                       example: 1250.75
 *                     totalMilkSold:
 *                       type: number
 *                       format: float
 *                       description: Total milk sold in liters (converted from mixed units)
 *                       example: 980.50
 *                     totalPurchaseCost:
 *                       type: number
 *                       format: float
 *                       description: Total purchase cost in UZS
 *                       example: 3126875.00
 *                     totalSalesRevenue:
 *                       type: number
 *                       format: float
 *                       description: Total sales revenue in UZS
 *                       example: 4410000.00
 *                     grossProfit:
 *                       type: number
 *                       format: float
 *                       description: Gross profit (revenue - cost) in UZS
 *                       example: 1283125.00
 *                 purchasesOverTime:
 *                   type: array
 *                   description: Daily milk purchase data over time
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       totalLiters:
 *                         type: number
 *                         format: float
 *                         example: 50.5
 *                 salesOverTime:
 *                   type: array
 *                   description: Daily sales data with mixed units breakdown
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                       totalLiters:
 *                         type: number
 *                         format: float
 *                         description: Total liters sold on this date
 *                         example: 25.5
 *                       totalKg:
 *                         type: number
 *                         format: float
 *                         description: Total kilograms sold on this date
 *                         example: 15.2
 *                       totalUnits:
 *                         type: number
 *                         format: float
 *                         description: Total units sold on this date
 *                         example: 8.0
 *                       totalQuantity:
 *                         type: number
 *                         format: float
 *                         description: Total quantity sold (for chart display)
 *                         example: 48.7
 *                 supplierBreakdown:
 *                   type: array
 *                   description: Breakdown of purchases by supplier
 *                   items:
 *                     type: object
 *                     properties:
 *                       supplierId:
 *                         type: integer
 *                         example: 1
 *                       supplierName:
 *                         type: string
 *                         example: "Milk Supplier Co"
 *                       totalLitersSupplied:
 *                         type: number
 *                         format: float
 *                         example: 500.25
 *                       totalCost:
 *                         type: number
 *                         format: float
 *                         example: 1250625.00
 *                 customerBreakdown:
 *                   type: array
 *                   description: Breakdown of sales by customer
 *                   items:
 *                     type: object
 *                     properties:
 *                       customerId:
 *                         type: integer
 *                         example: 1
 *                       customerName:
 *                         type: string
 *                         example: "John Doe"
 *                       totalLitersBought:
 *                         type: number
 *                         format: float
 *                         example: 150.75
 *                       totalRevenue:
 *                         type: number
 *                         format: float
 *                         example: 675000.00
 *                 productBreakdown:
 *                   type: array
 *                   description: Breakdown of sales by product
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                         example: 1
 *                       productName:
 *                         type: string
 *                         example: "Fresh Milk"
 *                       unitsSold:
 *                         type: number
 *                         format: float
 *                         example: 250.5
 *                       totalRevenue:
 *                         type: number
 *                         format: float
 *                         example: 1125000.00
 *       400:
 *         description: Invalid date format or range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid date format. Use YYYY-MM-DD format"
 *                 error:
 *                   type: string
 *                   example: "INVALID_DATE_FORMAT"
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid or expired token
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Service unavailable - Database connection error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Database connection unavailable. Please check your database configuration."
 *                 error:
 *                   type: string
 *                   example: "DATABASE_CONNECTION_ERROR"
 *                 details:
 *                   type: string
 *                   example: "The dashboard requires database access to generate analytics. Please ensure your database is running and properly configured."
 */
router.get('/', authMiddleware, dashboardController.getDashboard);

/**
 * @swagger
 * /api/dashboard/all-time:
 *   get:
 *     summary: Get all-time analytics and lifetime statistics
 *     description: Returns comprehensive lifetime statistics including summary metrics, detailed breakdowns with transaction counts and averages, and monthly trends for the last 12 months.
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
 *                       format: float
 *                       description: Total milk purchased in liters (all time)
 *                       example: 15000.75
 *                     totalMilkSold:
 *                       type: number
 *                       format: float
 *                       description: Total milk sold in liters (all time)
 *                       example: 12000.50
 *                     totalPurchaseCost:
 *                       type: number
 *                       format: float
 *                       description: Total purchase cost in UZS (all time)
 *                       example: 37500000.00
 *                     totalSalesRevenue:
 *                       type: number
 *                       format: float
 *                       description: Total sales revenue in UZS (all time)
 *                       example: 54000000.00
 *                     grossProfit:
 *                       type: number
 *                       format: float
 *                       description: Gross profit (revenue - cost) in UZS (all time)
 *                       example: 16500000.00
 *                 supplierBreakdown:
 *                   type: array
 *                   description: All-time supplier statistics with transaction counts and averages
 *                   items:
 *                     type: object
 *                     properties:
 *                       supplierId:
 *                         type: integer
 *                         example: 1
 *                       supplierName:
 *                         type: string
 *                         example: "Milk Supplier Co"
 *                       totalLitersSupplied:
 *                         type: number
 *                         format: float
 *                         description: Total liters supplied (all time)
 *                         example: 5000.25
 *                       totalCost:
 *                         type: number
 *                         format: float
 *                         description: Total cost paid to supplier (all time)
 *                         example: 12500000.00
 *                       totalTransactions:
 *                         type: integer
 *                         description: Number of purchase transactions
 *                         example: 45
 *                       averagePricePerLiter:
 *                         type: number
 *                         format: float
 *                         description: Average price per liter from this supplier
 *                         example: 2500.00
 *                 customerBreakdown:
 *                   type: array
 *                   description: All-time customer statistics with transaction counts and averages
 *                   items:
 *                     type: object
 *                     properties:
 *                       customerId:
 *                         type: integer
 *                         example: 1
 *                       customerName:
 *                         type: string
 *                         example: "John Doe"
 *                       totalLitersBought:
 *                         type: number
 *                         format: float
 *                         description: Total liters bought (all time)
 *                         example: 1500.75
 *                       totalRevenue:
 *                         type: number
 *                         format: float
 *                         description: Total revenue from this customer (all time)
 *                         example: 6750000.00
 *                       totalTransactions:
 *                         type: integer
 *                         description: Number of sales transactions
 *                         example: 30
 *                       averagePricePerLiter:
 *                         type: number
 *                         format: float
 *                         description: Average price per liter sold to this customer
 *                         example: 4500.00
 *                 productBreakdown:
 *                   type: array
 *                   description: All-time product statistics with transaction counts and averages
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                         example: 1
 *                       productName:
 *                         type: string
 *                         example: "Fresh Milk"
 *                       unitsSold:
 *                         type: number
 *                         format: float
 *                         description: Total units sold (all time)
 *                         example: 3000.5
 *                       totalRevenue:
 *                         type: number
 *                         format: float
 *                         description: Total revenue from this product (all time)
 *                         example: 13500000.00
 *                       totalTransactions:
 *                         type: integer
 *                         description: Number of sales transactions
 *                         example: 120
 *                       averagePricePerUnit:
 *                         type: number
 *                         format: float
 *                         description: Average price per unit sold
 *                         example: 4500.00
 *                 monthlyTrends:
 *                   type: array
 *                   description: Monthly trends for the last 12 months
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         format: date
 *                         description: Month in YYYY-MM format
 *                         example: "2024-01"
 *                       purchases:
 *                         type: number
 *                         format: float
 *                         description: Total liters purchased in this month
 *                         example: 1250.75
 *                       sales:
 *                         type: number
 *                         format: float
 *                         description: Total liters sold in this month
 *                         example: 980.50
 *                       purchaseCost:
 *                         type: number
 *                         format: float
 *                         description: Total purchase cost in UZS for this month
 *                         example: 3126875.00
 *                       salesRevenue:
 *                         type: number
 *                         format: float
 *                         description: Total sales revenue in UZS for this month
 *                         example: 4410000.00
 *                       profit:
 *                         type: number
 *                         format: float
 *                         description: Profit for this month in UZS
 *                         example: 1283125.00
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid or expired token
 *       500:
 *         description: Internal server error
 *       503:
 *         description: Service unavailable - Database connection error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Database connection unavailable. Please check your database configuration."
 *                 error:
 *                   type: string
 *                   example: "DATABASE_CONNECTION_ERROR"
 *                 details:
 *                   type: string
 *                   example: "The analytics require database access to generate statistics. Please ensure your database is running and properly configured."
 */
router.get('/all-time', authMiddleware, dashboardController.getAllTimeAnalytics);

module.exports = router;

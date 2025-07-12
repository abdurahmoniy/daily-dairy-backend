const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSummary = async (req, res) => {
  try {
    // Counts
    const [suppliers, customers, products, milkPurchases, sales] = await Promise.all([
      prisma.supplier.count(),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.milkPurchase.count(),
      prisma.sale.count()
    ]);

    // Total revenue (sum of all sales total)
    const totalRevenueResult = await prisma.sale.aggregate({
      _sum: { total: true }
    });
    const totalRevenue = totalRevenueResult._sum.total || 0;

    // Total milk purchased (sum of all milkPurchase quantityLiters)
    const totalMilkPurchasedResult = await prisma.milkPurchase.aggregate({
      _sum: { quantityLiters: true }
    });
    const totalMilkPurchased = totalMilkPurchasedResult._sum.quantityLiters || 0;

    // Recent milk purchases (latest 5)
    const recentMilkPurchases = await prisma.milkPurchase.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      include: { supplier: true }
    });

    // Recent sales (latest 5)
    const recentSales = await prisma.sale.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      include: { customer: true, product: true }
    });

    res.json({
      suppliers,
      customers,
      products,
      milkPurchases,
      sales,
      totalRevenue,
      totalMilkPurchased,
      recentMilkPurchases,
      recentSales
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    // Extract date range from query parameters
    const { from, to } = req.query;
    
    // Parse dates or use current month as default
    let startDate, endDate;
    
    if (from && to) {
      startDate = new Date(from);
      endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999); // End of day
    } else {
      // Default to current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ 
        message: 'Invalid date format. Use YYYY-MM-DD format',
        error: 'INVALID_DATE_FORMAT'
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({ 
        message: 'Start date must be before end date',
        error: 'INVALID_DATE_RANGE'
      });
    }

    // TODO: Add organization filtering when organization system is implemented
    // const organizationId = req.user.organizationId;

    // Build date filter
    const dateFilter = {
      date: {
        gte: startDate,
        lte: endDate
      }
    };

    try {
      // 1. Summary Metrics
      const [purchasesSummary, salesSummary] = await Promise.all([
        prisma.milkPurchase.aggregate({
          where: dateFilter,
          _sum: {
            quantityLiters: true,
            total: true
          }
        }),
        prisma.sale.aggregate({
          where: dateFilter,
          _sum: {
            quantity: true,
            total: true
          }
        })
      ]);

      const totalMilkPurchased = purchasesSummary._sum.quantityLiters || 0;
      const totalPurchaseCost = purchasesSummary._sum.total || 0;
      const totalMilkSold = salesSummary._sum.quantity || 0;
      const totalSalesRevenue = salesSummary._sum.total || 0;
      const grossProfit = totalSalesRevenue - totalPurchaseCost;

      // 2. Purchases Over Time (grouped by date)
      const purchasesOverTime = await prisma.milkPurchase.groupBy({
        by: ['date'],
        where: dateFilter,
        _sum: {
          quantityLiters: true
        },
        orderBy: {
          date: 'asc'
        }
      });

      // 3. Sales Over Time (grouped by date)
      const salesOverTime = await prisma.sale.groupBy({
        by: ['date'],
        where: dateFilter,
        _sum: {
          quantity: true
        },
        orderBy: {
          date: 'asc'
        }
      });

      // Get product information for sales to determine units
      const salesWithProducts = await prisma.sale.findMany({
        where: dateFilter,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              unit: true
            }
          }
        }
      });

      // Group sales by date and calculate total quantity by unit type
      const salesByDate = {};
      salesWithProducts.forEach(sale => {
        const dateKey = sale.date.toISOString().split('T')[0];
        if (!salesByDate[dateKey]) {
          salesByDate[dateKey] = {
            totalLiters: 0,
            totalKg: 0,
            totalUnits: 0,
            totalQuantity: 0
          };
        }
        
        // Add to appropriate unit category
        if (sale.product.unit.toLowerCase() === 'liter' || sale.product.unit.toLowerCase() === 'litr') {
          salesByDate[dateKey].totalLiters += sale.quantity;
        } else if (sale.product.unit.toLowerCase() === 'kg' || sale.product.unit.toLowerCase() === 'kilogram') {
          salesByDate[dateKey].totalKg += sale.quantity;
        } else {
          salesByDate[dateKey].totalUnits += sale.quantity;
        }
        
        // Also keep track of total quantity for general display
        salesByDate[dateKey].totalQuantity += sale.quantity;
      });

      // 4. Supplier Breakdown
      const supplierBreakdown = await prisma.milkPurchase.groupBy({
        by: ['supplierId'],
        where: dateFilter,
        _sum: {
          quantityLiters: true,
          total: true
        }
      });

      // Get supplier names for the breakdown
      const supplierIds = supplierBreakdown.map(item => item.supplierId);
      const suppliers = await prisma.supplier.findMany({
        where: { id: { in: supplierIds } },
        select: { id: true, name: true }
      });

      const supplierMap = suppliers.reduce((acc, supplier) => {
        acc[supplier.id] = supplier.name;
        return acc;
      }, {});

      // 5. Customer Breakdown
      const customerBreakdown = await prisma.sale.groupBy({
        by: ['customerId'],
        where: dateFilter,
        _sum: {
          quantity: true,
          total: true
        }
      });

      // Get customer names for the breakdown
      const customerIds = customerBreakdown.map(item => item.customerId);
      const customers = await prisma.customer.findMany({
        where: { id: { in: customerIds } },
        select: { id: true, name: true }
      });

      const customerMap = customers.reduce((acc, customer) => {
        acc[customer.id] = customer.name;
        return acc;
      }, {});

      // 6. Product Breakdown
      const productBreakdown = await prisma.sale.groupBy({
        by: ['productId'],
        where: dateFilter,
        _sum: {
          quantity: true,
          total: true
        }
      });

      // Get product names for the breakdown
      const productIds = productBreakdown.map(item => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, unit: true }
      });

      const productMap = products.reduce((acc, product) => {
        acc[product.id] = { name: product.name, unit: product.unit };
        return acc;
      }, {});

      // Format the response
      const response = {
        dateRange: {
          from: startDate.toISOString().split('T')[0],
          to: endDate.toISOString().split('T')[0]
        },
        summary: {
          totalMilkPurchased,
          totalMilkSold,
          totalPurchaseCost,
          totalSalesRevenue,
          grossProfit
        },
        purchasesOverTime: purchasesOverTime.map(item => ({
          date: item.date.toISOString().split('T')[0],
          totalLiters: item._sum.quantityLiters
        })),
        salesOverTime: Object.entries(salesByDate).map(([date, data]) => ({
          date: date,
          totalLiters: data.totalLiters,
          totalKg: data.totalKg,
          totalUnits: data.totalUnits,
          totalQuantity: data.totalQuantity
        })),
        supplierBreakdown: supplierBreakdown.map(item => ({
          supplierId: item.supplierId,
          supplierName: supplierMap[item.supplierId] || 'Unknown Supplier',
          totalLitersSupplied: item._sum.quantityLiters,
          totalCost: item._sum.total
        })),
        customerBreakdown: customerBreakdown.map(item => ({
          customerId: item.customerId,
          customerName: customerMap[item.customerId] || 'Unknown Customer',
          totalLitersBought: item._sum.quantity,
          totalRevenue: item._sum.total
        })),
        productBreakdown: productBreakdown.map(item => ({
          productId: item.productId,
          productName: productMap[item.productId]?.name || 'Unknown Product',
          productUnit: productMap[item.productId]?.unit || 'Unknown Unit',
          unitsSold: item._sum.quantity,
          totalRevenue: item._sum.total
        }))
      };

      res.json(response);
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // If it's a database connection error, return a helpful message
      if (dbError.message && dbError.message.includes('Can\'t reach database server')) {
        return res.status(503).json({
          message: 'Database connection unavailable. Please check your database configuration.',
          error: 'DATABASE_CONNECTION_ERROR',
          details: 'The dashboard requires database access to generate analytics. Please ensure your database is running and properly configured.'
        });
      }
      
      // For other database errors, return a generic error
      res.status(500).json({ 
        message: 'Database error while generating dashboard',
        error: 'DATABASE_ERROR'
      });
    }
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ 
      message: 'Internal server error while generating dashboard',
      error: 'DASHBOARD_GENERATION_FAILED'
    });
  }
};

exports.getAllTimeAnalytics = async (req, res) => {
  try {
    // TODO: Add organization filtering when organization system is implemented
    // const organizationId = req.user.organizationId;

    try {
      // 1. All-time Summary Metrics
      const [purchasesSummary, salesSummary] = await Promise.all([
        prisma.milkPurchase.aggregate({
          _sum: {
            quantityLiters: true,
            total: true
          }
        }),
        prisma.sale.aggregate({
          _sum: {
            quantity: true,
            total: true
          }
        })
      ]);

      const totalMilkPurchased = purchasesSummary._sum.quantityLiters || 0;
      const totalPurchaseCost = purchasesSummary._sum.total || 0;
      const totalMilkSold = salesSummary._sum.quantity || 0;
      const totalSalesRevenue = salesSummary._sum.total || 0;
      const grossProfit = totalSalesRevenue - totalPurchaseCost;

      // 2. All-time Supplier Breakdown
      const supplierBreakdown = await prisma.milkPurchase.groupBy({
        by: ['supplierId'],
        _sum: {
          quantityLiters: true,
          total: true
        },
        _count: {
          id: true
        }
      });

      // Get supplier names for the breakdown
      const supplierIds = supplierBreakdown.map(item => item.supplierId);
      const suppliers = await prisma.supplier.findMany({
        where: { id: { in: supplierIds } },
        select: { id: true, name: true }
      });

      const supplierMap = suppliers.reduce((acc, supplier) => {
        acc[supplier.id] = supplier.name;
        return acc;
      }, {});

      // 3. All-time Customer Breakdown
      const customerBreakdown = await prisma.sale.groupBy({
        by: ['customerId'],
        _sum: {
          quantity: true,
          total: true
        },
        _count: {
          id: true
        }
      });

      // Get customer names for the breakdown
      const customerIds = customerBreakdown.map(item => item.customerId);
      const customers = await prisma.customer.findMany({
        where: { id: { in: customerIds } },
        select: { id: true, name: true }
      });

      const customerMap = customers.reduce((acc, customer) => {
        acc[customer.id] = customer.name;
        return acc;
      }, {});

      // 4. All-time Product Breakdown
      const productBreakdown = await prisma.sale.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
          total: true
        },
        _count: {
          id: true
        }
      });

      // Get product names for the breakdown
      const productIds = productBreakdown.map(item => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, unit: true }
      });

      const productMap = products.reduce((acc, product) => {
        acc[product.id] = { name: product.name, unit: product.unit };
        return acc;
      }, {});

      // 5. Monthly Trends (last 12 months)
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const monthlyPurchases = await prisma.milkPurchase.groupBy({
        by: ['date'],
        where: {
          date: {
            gte: twelveMonthsAgo
          }
        },
        _sum: {
          quantityLiters: true,
          total: true
        }
      });

      const monthlySales = await prisma.sale.groupBy({
        by: ['date'],
        where: {
          date: {
            gte: twelveMonthsAgo
          }
        },
        _sum: {
          quantity: true,
          total: true
        }
      });

      // Group by month
      const monthlyData = {};
      
      // Process purchases
      monthlyPurchases.forEach(purchase => {
        const monthKey = purchase.date.toISOString().substring(0, 7); // YYYY-MM
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { purchases: 0, sales: 0, purchaseCost: 0, salesRevenue: 0 };
        }
        monthlyData[monthKey].purchases += purchase._sum.quantityLiters || 0;
        monthlyData[monthKey].purchaseCost += purchase._sum.total || 0;
      });

      // Process sales
      monthlySales.forEach(sale => {
        const monthKey = sale.date.toISOString().substring(0, 7); // YYYY-MM
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { purchases: 0, sales: 0, purchaseCost: 0, salesRevenue: 0 };
        }
        monthlyData[monthKey].sales += sale._sum.quantity || 0;
        monthlyData[monthKey].salesRevenue += sale._sum.total || 0;
      });

      // Format the response
      const response = {
        summary: {
          totalMilkPurchased,
          totalMilkSold,
          totalPurchaseCost,
          totalSalesRevenue,
          grossProfit
        },
        supplierBreakdown: supplierBreakdown.map(item => ({
          supplierId: item.supplierId,
          supplierName: supplierMap[item.supplierId] || 'Unknown Supplier',
          totalLitersSupplied: item._sum.quantityLiters,
          totalCost: item._sum.total,
          totalTransactions: item._count.id,
          averagePricePerLiter: item._sum.total / item._sum.quantityLiters
        })),
        customerBreakdown: customerBreakdown.map(item => ({
          customerId: item.customerId,
          customerName: customerMap[item.customerId] || 'Unknown Customer',
          totalLitersBought: item._sum.quantity,
          totalRevenue: item._sum.total,
          totalTransactions: item._count.id,
          averagePricePerLiter: item._sum.total / item._sum.quantity
        })),
        productBreakdown: productBreakdown.map(item => ({
          productId: item.productId,
          productName: productMap[item.productId]?.name || 'Unknown Product',
          productUnit: productMap[item.productId]?.unit || 'Unknown Unit',
          unitsSold: item._sum.quantity,
          totalRevenue: item._sum.total,
          totalTransactions: item._count.id,
          averagePricePerUnit: item._sum.total / item._sum.quantity
        })),
        monthlyTrends: Object.entries(monthlyData).map(([month, data]) => ({
          month,
          purchases: data.purchases,
          sales: data.sales,
          purchaseCost: data.purchaseCost,
          salesRevenue: data.salesRevenue,
          profit: data.salesRevenue - data.purchaseCost
        })).sort((a, b) => a.month.localeCompare(b.month))
      };

      res.json(response);
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // If it's a database connection error, return a helpful message
      if (dbError.message && dbError.message.includes('Can\'t reach database server')) {
        return res.status(503).json({
          message: 'Database connection unavailable. Please check your database configuration.',
          error: 'DATABASE_CONNECTION_ERROR',
          details: 'The analytics require database access to generate statistics. Please ensure your database is running and properly configured.'
        });
      }
      
      // For other database errors, return a generic error
      res.status(500).json({ 
        message: 'Database error while generating analytics',
        error: 'DATABASE_ERROR'
      });
    }
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ 
      message: 'Internal server error while generating analytics',
      error: 'ANALYTICS_GENERATION_FAILED'
    });
  }
};

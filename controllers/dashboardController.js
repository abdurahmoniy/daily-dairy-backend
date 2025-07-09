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

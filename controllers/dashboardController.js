const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSummary = async (req, res) => {
  try {
    const [suppliers, customers, products, milkPurchases, sales] = await Promise.all([
      prisma.supplier.count(),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.milkPurchase.count(),
      prisma.sale.count()
    ]);
    res.json({ suppliers, customers, products, milkPurchases, sales });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

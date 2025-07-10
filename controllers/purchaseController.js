const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await prisma.milkPurchase.findMany({ include: { supplier: true } });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await prisma.milkPurchase.findUnique({
      where: { id: Number(req.params.id) },
      include: { supplier: true }
    });
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPurchase = async (req, res) => {
  try {
    const purchase = await prisma.milkPurchase.create({
      data: req.body,
      include: { supplier: true }
    });
    res.status(201).json(purchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    const purchase = await prisma.milkPurchase.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: { supplier: true }
    });
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    await prisma.milkPurchase.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Purchase deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

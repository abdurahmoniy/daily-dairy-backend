const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({ include: { customer: true, product: true } });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: Number(req.params.id) },
      include: { customer: true, product: true }
    });
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    const sale = await prisma.sale.create({ data: req.body });
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const sale = await prisma.sale.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    await prisma.sale.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Sale deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

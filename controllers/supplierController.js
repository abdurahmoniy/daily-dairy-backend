const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await prisma.supplier.findUnique({ where: { id: Number(req.params.id) } });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const supplier = await prisma.supplier.create({ data: req.body });
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await prisma.supplier.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    await prisma.supplier.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

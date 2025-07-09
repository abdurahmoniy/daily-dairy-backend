const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.json({
      message: 'Suppliers retrieved successfully',
      count: suppliers.length,
      suppliers
    });
  } catch (err) {
    console.error('Get all suppliers error:', err);
    res.status(500).json({ 
      message: 'Internal server error while retrieving suppliers',
      error: 'SUPPLIERS_RETRIEVAL_FAILED'
    });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplierId = Number(req.params.id);
    
    if (isNaN(supplierId)) {
      return res.status(400).json({ 
        message: 'Invalid supplier ID format',
        error: 'INVALID_SUPPLIER_ID'
      });
    }

    const supplier = await prisma.supplier.findUnique({ 
      where: { id: supplierId } 
    });
    
    if (!supplier) {
      return res.status(404).json({ 
        message: 'Supplier not found',
        error: 'SUPPLIER_NOT_FOUND',
        supplierId
      });
    }
    
    res.json({
      message: 'Supplier retrieved successfully',
      supplier
    });
  } catch (err) {
    console.error('Get supplier by ID error:', err);
    res.status(500).json({ 
      message: 'Internal server error while retrieving supplier',
      error: 'SUPPLIER_RETRIEVAL_FAILED'
    });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const { name, phone, notes } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ 
        message: 'Supplier name is required',
        error: 'NAME_REQUIRED'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Supplier name must be at least 2 characters long',
        error: 'NAME_TOO_SHORT'
      });
    }

    const supplier = await prisma.supplier.create({ 
      data: { name: name.trim(), phone, notes } 
    });
    
    res.status(201).json({
      message: 'Supplier created successfully',
      supplier
    });
  } catch (err) {
    console.error('Create supplier error:', err);
    res.status(500).json({ 
      message: 'Internal server error while creating supplier',
      error: 'SUPPLIER_CREATION_FAILED'
    });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const supplierId = Number(req.params.id);
    const { name, phone, notes } = req.body;

    // Validate supplier ID
    if (isNaN(supplierId)) {
      return res.status(400).json({ 
        message: 'Invalid supplier ID format',
        error: 'INVALID_SUPPLIER_ID'
      });
    }

    // Validate required fields
    if (!name) {
      return res.status(400).json({ 
        message: 'Supplier name is required',
        error: 'NAME_REQUIRED'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Supplier name must be at least 2 characters long',
        error: 'NAME_TOO_SHORT'
      });
    }

    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: supplierId }
    });
    
    if (!existingSupplier) {
      return res.status(404).json({ 
        message: 'Supplier not found',
        error: 'SUPPLIER_NOT_FOUND',
        supplierId
      });
    }

    const supplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: { name: name.trim(), phone, notes }
    });
    
    res.json({
      message: 'Supplier updated successfully',
      supplier
    });
  } catch (err) {
    console.error('Update supplier error:', err);
    res.status(500).json({ 
      message: 'Internal server error while updating supplier',
      error: 'SUPPLIER_UPDATE_FAILED'
    });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const supplierId = Number(req.params.id);

    // Validate supplier ID
    if (isNaN(supplierId)) {
      return res.status(400).json({ 
        message: 'Invalid supplier ID format',
        error: 'INVALID_SUPPLIER_ID'
      });
    }

    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: supplierId }
    });
    
    if (!existingSupplier) {
      return res.status(404).json({ 
        message: 'Supplier not found',
        error: 'SUPPLIER_NOT_FOUND',
        supplierId
      });
    }

    // Check if supplier has associated purchases
    const purchaseCount = await prisma.milkPurchase.count({
      where: { supplierId }
    });

    if (purchaseCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete supplier with associated purchases',
        error: 'SUPPLIER_HAS_PURCHASES',
        purchaseCount
      });
    }

    await prisma.supplier.delete({ where: { id: supplierId } });
    res.json({ 
      message: 'Supplier deleted successfully'
    });
  } catch (err) {
    console.error('Delete supplier error:', err);
    res.status(500).json({ 
      message: 'Internal server error while deleting supplier',
      error: 'SUPPLIER_DELETION_FAILED'
    });
  }
};

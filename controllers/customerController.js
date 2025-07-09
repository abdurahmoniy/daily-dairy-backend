const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json({
      message: 'Customers retrieved successfully',
      count: customers.length,
      customers
    });
  } catch (err) {
    console.error('Get all customers error:', err);
    res.status(500).json({ 
      message: 'Internal server error while retrieving customers',
      error: 'CUSTOMERS_RETRIEVAL_FAILED'
    });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customerId = Number(req.params.id);
    
    if (isNaN(customerId)) {
      return res.status(400).json({ 
        message: 'Invalid customer ID format',
        error: 'INVALID_CUSTOMER_ID'
      });
    }

    const customer = await prisma.customer.findUnique({ 
      where: { id: customerId } 
    });
    
    if (!customer) {
      return res.status(404).json({ 
        message: 'Customer not found',
        error: 'CUSTOMER_NOT_FOUND',
        customerId
      });
    }
    
    res.json({
      message: 'Customer retrieved successfully',
      customer
    });
  } catch (err) {
    console.error('Get customer by ID error:', err);
    res.status(500).json({ 
      message: 'Internal server error while retrieving customer',
      error: 'CUSTOMER_RETRIEVAL_FAILED'
    });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, type, phone, notes } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ 
        message: 'Customer name is required',
        error: 'NAME_REQUIRED'
      });
    }

    if (!type) {
      return res.status(400).json({ 
        message: 'Customer type is required',
        error: 'TYPE_REQUIRED'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Customer name must be at least 2 characters long',
        error: 'NAME_TOO_SHORT'
      });
    }

    if (type.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Customer type must be at least 2 characters long',
        error: 'TYPE_TOO_SHORT'
      });
    }

    const customer = await prisma.customer.create({ 
      data: { 
        name: name.trim(), 
        type: type.trim(), 
        phone, 
        notes 
      } 
    });
    
    res.status(201).json({
      message: 'Customer created successfully',
      customer
    });
  } catch (err) {
    console.error('Create customer error:', err);
    res.status(500).json({ 
      message: 'Internal server error while creating customer',
      error: 'CUSTOMER_CREATION_FAILED'
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customerId = Number(req.params.id);
    const { name, type, phone, notes } = req.body;

    // Validate customer ID
    if (isNaN(customerId)) {
      return res.status(400).json({ 
        message: 'Invalid customer ID format',
        error: 'INVALID_CUSTOMER_ID'
      });
    }

    // Validate required fields
    if (!name) {
      return res.status(400).json({ 
        message: 'Customer name is required',
        error: 'NAME_REQUIRED'
      });
    }

    if (!type) {
      return res.status(400).json({ 
        message: 'Customer type is required',
        error: 'TYPE_REQUIRED'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Customer name must be at least 2 characters long',
        error: 'NAME_TOO_SHORT'
      });
    }

    if (type.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Customer type must be at least 2 characters long',
        error: 'TYPE_TOO_SHORT'
      });
    }

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId }
    });
    
    if (!existingCustomer) {
      return res.status(404).json({ 
        message: 'Customer not found',
        error: 'CUSTOMER_NOT_FOUND',
        customerId
      });
    }

    const customer = await prisma.customer.update({
      where: { id: customerId },
      data: { 
        name: name.trim(), 
        type: type.trim(), 
        phone, 
        notes 
      }
    });
    
    res.json({
      message: 'Customer updated successfully',
      customer
    });
  } catch (err) {
    console.error('Update customer error:', err);
    res.status(500).json({ 
      message: 'Internal server error while updating customer',
      error: 'CUSTOMER_UPDATE_FAILED'
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customerId = Number(req.params.id);

    // Validate customer ID
    if (isNaN(customerId)) {
      return res.status(400).json({ 
        message: 'Invalid customer ID format',
        error: 'INVALID_CUSTOMER_ID'
      });
    }

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId }
    });
    
    if (!existingCustomer) {
      return res.status(404).json({ 
        message: 'Customer not found',
        error: 'CUSTOMER_NOT_FOUND',
        customerId
      });
    }

    // Check if customer has associated sales
    const saleCount = await prisma.sale.count({
      where: { customerId }
    });

    if (saleCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete customer with associated sales',
        error: 'CUSTOMER_HAS_SALES',
        saleCount
      });
    }

    await prisma.customer.delete({ where: { id: customerId } });
    res.json({ 
      message: 'Customer deleted successfully'
    });
  } catch (err) {
    console.error('Delete customer error:', err);
    res.status(500).json({ 
      message: 'Internal server error while deleting customer',
      error: 'CUSTOMER_DELETION_FAILED'
    });
  }
};

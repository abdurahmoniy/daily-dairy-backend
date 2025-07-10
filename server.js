const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dairy Management System API',
      version: '1.0.0',
      description: 'API documentation for the Dairy Management System',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
      {
        url: 'https://daily-dairy-backend-production.up.railway.app',
        description: 'Production server'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Dairy Management System Backend Running');
});

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Get all suppliers
 *     responses:
 *       200:
 *         description: List of suppliers
 */
const sessionCheck = require('./middlewares/sessionCheck');
// Mount modular routers for all entities
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', sessionCheck, require('./routes/users'));
app.use('/api/suppliers', sessionCheck, require('./routes/suppliers'));
app.use('/api/customers', sessionCheck, require('./routes/customers'));
app.use('/api/products', sessionCheck, require('./routes/products'));
app.use('/api/milk-purchases', sessionCheck, require('./routes/milkPurchases'));
app.use('/api/sales', sessionCheck, require('./routes/sales'));
app.use('/api/dashboard', sessionCheck, require('./routes/dashboard'));
app.use('/api/session-logs', require('./routes/sessionLogs'));

// Error handling middleware (must be last)
const errorMiddleware = require('./middlewares/errorMiddleware');
app.use(errorMiddleware);

// 404 handler for undefined routes
app.use('/*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    error: 'ROUTE_NOT_FOUND',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

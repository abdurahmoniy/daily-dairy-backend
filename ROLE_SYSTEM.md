# Role-Based Access Control System

This document describes the role system implemented in the Dairy Management System.

## User Roles

The system supports three user roles:

### 1. ADMIN
- **Full system access**
- Can manage all users (view, create, update roles, delete)
- Can perform all operations on all entities
- Can access user management endpoints

### 2. MANAGER
- **Limited administrative access**
- Can create, update, and delete business entities
- Cannot manage users
- Can view all data

### 3. USER
- **Read-only access**
- Can view all data
- Cannot create, update, or delete any entities
- Basic user access

## Role Hierarchy

```
ADMIN > MANAGER > USER
```

## API Endpoints by Role

### Authentication Endpoints
- `POST /api/auth/register` - Register new user (role optional, defaults to USER)
- `POST /api/auth/login` - Login user

### User Management (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/password` - Update user password
- `DELETE /api/users/:id` - Delete user

### Business Entities

#### View Operations (All Authenticated Users)
- `GET /api/suppliers` - View suppliers
- `GET /api/customers` - View customers
- `GET /api/products` - View products
- `GET /api/sales` - View sales
- `GET /api/milk-purchases` - View milk purchases
- `GET /api/dashboard/summary` - View dashboard

#### Create/Update/Delete Operations (Manager/Admin Only)
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/sales` - Create sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale
- `POST /api/milk-purchases` - Create milk purchase
- `PUT /api/milk-purchases/:id` - Update milk purchase
- `DELETE /api/milk-purchases/:id` - Delete milk purchase

## Database Schema

The User model has been updated to include a role field:

```prisma
enum UserRole {
  ADMIN
  MANAGER
  USER
}

model User {
  id            Int      @id @default(autoincrement())
  username      String   @unique
  passwordHash  String
  role          UserRole @default(USER)
}
```

## JWT Token

The JWT token now includes the user's role:

```json
{
  "id": 1,
  "username": "admin",
  "role": "ADMIN"
}
```

## Middleware

### Authentication Middleware
- `authMiddleware` - Verifies JWT token and adds user to request

### Role Middleware
- `roleMiddleware(['ADMIN'])` - Requires ADMIN role
- `roleMiddleware(['MANAGER', 'ADMIN'])` - Requires MANAGER or ADMIN role

## Usage Examples

### Register a new admin user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123",
    "role": "ADMIN"
  }'
```

### Update user role (Admin only)
```bash
curl -X PUT http://localhost:5000/api/users/2/role \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "MANAGER"
  }'
```

### Create a supplier (Manager/Admin only)
```bash
curl -X POST http://localhost:5000/api/suppliers \
  -H "Authorization: Bearer <manager-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Milk Supplier Co",
    "phone": "123-456-7890"
  }'
```

## Migration

To apply the database changes:

1. Ensure database connection is available
2. Run: `node scripts/migrate.js`
3. Or manually run: `npx prisma migrate deploy`

## Security Notes

- Role information is included in JWT tokens
- Role validation happens on every protected endpoint
- Users cannot delete their own accounts
- Password hashing is maintained for security
- All sensitive operations require appropriate role permissions 
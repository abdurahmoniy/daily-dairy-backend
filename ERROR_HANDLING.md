# Error Handling System

This document describes the comprehensive error handling system implemented in the Dairy Management System API.

## HTTP Status Codes

The API uses standard HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **409** - Conflict (duplicate entry)
- **500** - Internal Server Error

## Error Response Format

All error responses follow a consistent format:

```json
{
  "message": "Human-readable error message",
  "error": "ERROR_CODE",
  "details": "Additional information (optional)"
}
```

## Common Error Codes

### Authentication Errors
- `INVALID_CREDENTIALS` - Wrong username/password
- `USERNAME_EXISTS` - Username already taken during registration
- `INVALID_TOKEN` - Invalid JWT token
- `TOKEN_EXPIRED` - JWT token has expired
- `AUTHENTICATION_REQUIRED` - No token provided

### Authorization Errors
- `INSUFFICIENT_PERMISSIONS` - User doesn't have required role
- `SELF_DELETE_NOT_ALLOWED` - Cannot delete own account

### Validation Errors
- `MISSING_REQUIRED_FIELDS` - Required fields not provided
- `NAME_REQUIRED` - Name field is required
- `PASSWORD_REQUIRED` - Password field is required
- `TYPE_REQUIRED` - Type field is required
- `NAME_TOO_SHORT` - Name too short
- `PASSWORD_TOO_SHORT` - Password too short
- `INVALID_ROLE` - Invalid user role
- `INVALID_USER_ID` - Invalid user ID format
- `INVALID_SUPPLIER_ID` - Invalid supplier ID format
- `INVALID_CUSTOMER_ID` - Invalid customer ID format

### Resource Errors
- `USER_NOT_FOUND` - User doesn't exist
- `SUPPLIER_NOT_FOUND` - Supplier doesn't exist
- `CUSTOMER_NOT_FOUND` - Customer doesn't exist
- `PRODUCT_NOT_FOUND` - Product doesn't exist
- `SALE_NOT_FOUND` - Sale doesn't exist
- `PURCHASE_NOT_FOUND` - Purchase doesn't exist
- `ROUTE_NOT_FOUND` - API endpoint doesn't exist

### Database Errors
- `DUPLICATE_ENTRY` - Resource already exists
- `FOREIGN_KEY_CONSTRAINT` - Cannot delete due to related data
- `SUPPLIER_HAS_PURCHASES` - Supplier has associated purchases
- `CUSTOMER_HAS_SALES` - Customer has associated sales

### Operation Errors
- `REGISTRATION_FAILED` - User registration failed
- `LOGIN_FAILED` - User login failed
- `USERS_RETRIEVAL_FAILED` - Failed to get users
- `USER_RETRIEVAL_FAILED` - Failed to get specific user
- `ROLE_UPDATE_FAILED` - Failed to update user role
- `PASSWORD_UPDATE_FAILED` - Failed to update password
- `USER_DELETION_FAILED` - Failed to delete user
- `SUPPLIER_CREATION_FAILED` - Failed to create supplier
- `SUPPLIER_UPDATE_FAILED` - Failed to update supplier
- `SUPPLIER_DELETION_FAILED` - Failed to delete supplier

## Error Handling Examples

### Registration Errors

**Missing Fields:**
```json
{
  "message": "Username and password are required",
  "errors": {
    "username": "Username is required",
    "password": "Password is required"
  }
}
```

**Username Already Exists:**
```json
{
  "message": "Username already exists",
  "error": "USERNAME_EXISTS"
}
```

**Invalid Role:**
```json
{
  "message": "Invalid role",
  "error": "INVALID_ROLE",
  "validRoles": ["ADMIN", "MANAGER", "USER"]
}
```

### Login Errors

**Invalid Credentials:**
```json
{
  "message": "Invalid username or password",
  "error": "INVALID_CREDENTIALS"
}
```

### Resource Not Found

**User Not Found:**
```json
{
  "message": "User not found",
  "error": "USER_NOT_FOUND",
  "userId": 123
}
```

### Permission Errors

**Insufficient Permissions:**
```json
{
  "message": "Insufficient permissions",
  "required": ["ADMIN"],
  "current": "USER"
}
```

### Validation Errors

**Invalid ID Format:**
```json
{
  "message": "Invalid user ID format",
  "error": "INVALID_USER_ID"
}
```

**Cannot Delete with Related Data:**
```json
{
  "message": "Cannot delete supplier with associated purchases",
  "error": "SUPPLIER_HAS_PURCHASES",
  "purchaseCount": 5
}
```

## Middleware Error Handling

### Authentication Middleware
- Validates JWT token presence and format
- Returns 401 for missing or invalid tokens

### Role Middleware
- Checks user permissions before allowing access
- Returns 403 for insufficient permissions

### Validation Middleware
- Validates required fields
- Validates ID formats
- Validates pagination parameters
- Validates date ranges

### Global Error Handler
- Catches unhandled errors
- Formats Prisma database errors
- Handles JWT token errors
- Provides consistent error responses

## Best Practices

1. **Always include error codes** for programmatic handling
2. **Provide human-readable messages** for user display
3. **Include relevant context** (IDs, field names, etc.)
4. **Log errors** for debugging
5. **Use appropriate HTTP status codes**
6. **Validate input** before processing
7. **Check resource existence** before operations
8. **Handle database constraints** gracefully

## Testing Error Scenarios

### Test Cases for Registration
- Missing username/password
- Username too short
- Password too short
- Invalid role
- Duplicate username

### Test Cases for Login
- Missing credentials
- Non-existent user
- Wrong password

### Test Cases for Resource Operations
- Invalid ID format
- Non-existent resource
- Missing required fields
- Insufficient permissions
- Related data constraints

## Error Logging

All errors are logged with:
- Error message
- Stack trace
- Request context
- User information (if available)
- Timestamp

This helps with debugging and monitoring system health. 
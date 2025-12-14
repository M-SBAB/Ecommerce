# User Roles System

## Overview

The system now supports two user roles:

- **admin** - Single administrator with full access
- **user** - Regular users with standard permissions

## How It Works

### 1. First User = Admin

- The **first user** to register will automatically be assigned the **admin** role
- All subsequent users will be assigned the **user** role by default

### 2. User Model

```javascript
{
  username: String (required, unique),
  password: String (required),
  role: String (enum: ['user', 'admin'], default: 'user')
}
```

### 3. Login Response

When a user logs in, they receive their role information:

```json
{
  "user": {
    "_id": "...",
    "username": "john_doe",
    "role": "user",
    "createdAt": "2025-12-14T..."
  }
}
```

### 4. Admin Middleware

Use the `isAdmin` middleware to protect admin-only routes:

```javascript
import { isAdmin } from '../controllers/user.js';

// Protect route with admin check
router.post('/admin-route', isAdmin, yourController);
router.delete('/delete-product/:id', isAdmin, deleteProduct);
```

## Usage Examples

### Protecting Admin Routes

```javascript
// In routes/products.js
import { isAdmin } from '../controllers/user.js';

router.post('/add', isAdmin, addProduct);
router.put('/update/:id', isAdmin, updateProduct);
router.delete('/delete/:id', isAdmin, deleteProduct);
```

### Frontend Role Check

Store user role in localStorage after login:

```javascript
// After successful login
localStorage.setItem('user', JSON.stringify(response.user));

// Check if user is admin
const user = JSON.parse(localStorage.getItem('user'));
if (user.role === 'admin') {
  // Show admin features
}
```

### Conditional UI Rendering

```jsx
const user = JSON.parse(localStorage.getItem('user') || '{}');

return <div>{user.role === 'admin' && <button>Admin Dashboard</button>}</div>;
```

## Important Notes

1. **First Registration**: Make sure to register your admin account FIRST before any other users
2. **Password Security**: Consider adding password hashing (bcrypt) in production
3. **Token Authentication**: Consider implementing JWT tokens for better security
4. **Role Updates**: Currently, roles cannot be changed after creation (by design)

## Testing

### Create Admin (First User)

```bash
POST http://localhost:5000/auth/signup
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response: { "message": "Admin account created successfully!", "role": "admin" }
```

### Create Regular User

```bash
POST http://localhost:5000/auth/signup
Content-Type: application/json

{
  "username": "john",
  "password": "john123"
}

Response: { "message": "User saved!", "role": "user" }
```

### Login

```bash
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response: {
  "user": {
    "_id": "...",
    "username": "admin",
    "role": "admin",
    "createdAt": "..."
  }
}
```

## Future Enhancements

- Add JWT authentication
- Add password hashing with bcrypt
- Add ability to promote users to admin (with existing admin authorization)
- Add more granular permissions
- Add role-based route protection on frontend

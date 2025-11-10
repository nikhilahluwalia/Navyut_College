# JWT Authentication Implementation Guide

## Overview
JWT (JSON Web Token) authentication has been implemented for your registration and login endpoints. This provides secure session management without requiring server-side session storage.

## What's Been Implemented

### 1. Environment Variables (`.env`)
Added JWT configuration:
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANT**: Change `JWT_SECRET` to a strong, random string in production!

### 2. JWT Utility (`utils/jwt.js`)
Created helper functions for:
- `generateToken(payload)` - Creates a JWT token
- `verifyToken(token)` - Verifies and decodes a JWT token
- `decodeToken(token)` - Decodes token without verification (for debugging)

### 3. Authentication Middleware (`middlewares/authMiddleware.js`)
Created three middleware functions:
- `authenticateToken` - Verifies JWT token from Authorization header
- `requireAdmin` - Ensures user has admin role
- `requireRole(allowedRoles)` - Checks if user has any of the specified roles

### 4. Updated Controllers (`controllers/authController.js`)
Both `login` and `register` now return:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

## How to Use

### Client-Side (Frontend)

#### 1. Login/Register
```javascript
// Login or Register
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();

if (data.success) {
  // Store token in localStorage or sessionStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  // Redirect to dashboard
  window.location.href = '/dashboard';
}
```

#### 2. Making Authenticated Requests
```javascript
// Get the token from storage
const token = localStorage.getItem('token');

// Include token in Authorization header
const response = await fetch('http://localhost:3000/api/user/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

#### 3. Handling Token Expiration
```javascript
// Check if token is expired
const response = await fetch('http://localhost:3000/api/user/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

if (response.status === 403) {
  // Token expired or invalid
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

#### 4. Logout
```javascript
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

### Server-Side (Backend)

#### Protecting Routes

**Example 1: Require Authentication**
```javascript
import { authenticateToken } from '../middlewares/authMiddleware.js';

// Only authenticated users can access
router.get('/profile', authenticateToken, (req, res) => {
  // req.user contains: { userId, email, role }
  res.json({
    success: true,
    user: req.user
  });
});
```

**Example 2: Admin Only**
```javascript
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';

// Only admins can access
router.post('/users', authenticateToken, requireAdmin, (req, res) => {
  // Create new user
});
```

**Example 3: Specific Roles**
```javascript
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

// Only managers and career counselors can access
router.get('/staff-data', 
  authenticateToken, 
  requireRole(['manager', 'career_counciler']), 
  (req, res) => {
    // Return staff data
  }
);
```

#### In Your `index.js` or Route Files
```javascript
import protectedRoutes from './routes/protectedRoutes.js';

// Add protected routes
app.use('/api/user', protectedRoutes);
```

## Token Payload Structure
The JWT token contains:
```javascript
{
  userId: 123,
  email: "user@example.com",
  role: "student",
  iat: 1699622400,  // Issued at
  exp: 1700227200   // Expiration
}
```

## Security Best Practices

### 1. Environment Variables
- Never commit `.env` file to version control
- Use strong, random JWT_SECRET in production
- Rotate secrets periodically

### 2. Token Storage (Frontend)
- ✅ Use `httpOnly` cookies (most secure)
- ⚠️ LocalStorage (vulnerable to XSS attacks)
- ⚠️ SessionStorage (better than localStorage, cleared on tab close)

### 3. Token Expiration
- Default is 7 days
- Adjust based on security requirements
- Implement refresh tokens for longer sessions

### 4. HTTPS
- Always use HTTPS in production
- Tokens sent over HTTP can be intercepted

## Testing with Postman/Thunder Client

### 1. Register/Login
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "phoneNumber": "1234567890",
  "password": "password123"
}
```

Response will include `token`.

### 2. Access Protected Route
```
GET http://localhost:3000/api/user/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

## Common Issues & Solutions

### Issue: "Access token required"
**Solution**: Include `Authorization: Bearer <token>` header

### Issue: "Invalid or expired token"
**Solutions**:
- Token has expired (check JWT_EXPIRES_IN)
- Token is malformed
- JWT_SECRET changed
- Clear storage and login again

### Issue: "Admin access required"
**Solution**: User's role is not 'admin'

## Next Steps

1. ✅ Implement refresh token mechanism for better UX
2. ✅ Add logout endpoint to blacklist tokens (if needed)
3. ✅ Update frontend to store and use tokens
4. ✅ Add token refresh before expiration
5. ✅ Implement password reset with JWT tokens

## Example Frontend Integration (React)

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## API Endpoints

### Public Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Protected Routes (require JWT)
- `GET /api/user/profile` - Get current user profile
- `GET /api/admin/*` - Admin-only routes
- `GET /api/staff/*` - Staff-only routes (manager, career_counciler)

---

**Last Updated**: November 10, 2025

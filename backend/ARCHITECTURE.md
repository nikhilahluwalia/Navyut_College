# Backend Architecture Guide

## 📁 Folder Structure

```
backend/
├── config/              # Configuration files
│   └── db.js           # Database connection
├── controllers/         # Business logic
│   └── authController.js
├── middlewares/         # Request processing middlewares
│   ├── validation.js   # Input validation
│   └── errorHandler.js # Error handling
├── routes/              # API routes
│   └── authRoutes.js
├── database/            # Database migrations
│   ├── schema.sql
│   ├── migrate.js
│   └── README.md
├── utils/               # Utility functions
│   └── validators.js   # Reusable validators
└── index.js            # Entry point
```

## 🎯 Architecture Pattern: MVC with Middleware

### Flow of a Request:
```
Request → Routes → Validation Middleware → Controller → Database → Response
```

## 📝 Why This Architecture?

### 1. **Separation of Concerns**
- **Routes** (`routes/`) - Define API endpoints
- **Middlewares** (`middlewares/`) - Validate & process requests
- **Controllers** (`controllers/`) - Handle business logic
- **Utils** (`utils/`) - Reusable helper functions

### 2. **Validation Approach**
✅ **We use Middleware** (not in controllers) because:
- **Reusability**: Same validation for multiple routes
- **Cleaner Code**: Controllers focus on business logic only
- **Early Exit**: Invalid requests rejected before controller
- **Maintainability**: All validations in one place

### 3. **Example Request Flow**

#### Registration Request:
```javascript
POST /api/auth/register
↓
routes/authRoutes.js (validateRegister middleware)
↓
middlewares/validation.js (checks email, password, etc.)
↓ (if valid)
controllers/authController.js (hash password, insert DB)
↓
Response
```

## 🛠️ How to Add New Routes

### 1. Create Validation Middleware (middlewares/validation.js)
```javascript
export const validateNewFeature = (req, res, next) => {
  // Validate inputs
  if (!req.body.field) {
    return res.status(400).json({ message: "Field required" });
  }
  next();
};
```

### 2. Create Controller (controllers/newController.js)
```javascript
export const newFeature = async (req, res) => {
  try {
    // Business logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
```

### 3. Add Route (routes/newRoutes.js)
```javascript
import { validateNewFeature } from '../middlewares/validation.js';
import { newFeature } from '../controllers/newController.js';

router.post("/feature", validateNewFeature, newFeature);
```

### 4. Register in index.js
```javascript
import newRoutes from './routes/newRoutes.js';
app.use("/api/new", newRoutes);
```

## 🔒 Current API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Request Format

**Register:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "9876543210",
  "password": "password123",
  "role": "student" // optional: admin, manager, career_counciler, student
}
```

**Login:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## 📊 Response Format

All responses follow this structure:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {} // optional
}
```

## 🚀 Benefits of This Structure

1. **Scalability**: Easy to add new features
2. **Testability**: Each layer can be tested independently
3. **Maintainability**: Clear organization
4. **Best Practices**: Follows Express.js conventions
5. **Error Handling**: Centralized error management
6. **Validation**: Reusable across routes

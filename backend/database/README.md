# Database Setup

## Running Migrations

To create the database tables, run:

```bash
npm run migrate
```

This will create the following tables:

### 1. **users** table
- `id` - Auto-incrementing primary key
- `name` - User's full name
- `email` - Unique email address
- `phone_number` - Contact number
- `password` - Hashed password (remember to hash before storing!)
- `role` - User role (admin, user, student, staff)
- `is_active` - Account status
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

### 2. **sessions** table (Optional)
For managing user login sessions and JWT tokens

### 3. **password_reset_tokens** table (Optional)
For handling password reset requests

## Manual Setup

If you prefer to run the SQL manually, you can:

1. Open MySQL Workbench or MySQL command line
2. Connect to your database
3. Run the SQL from `database/schema.sql`


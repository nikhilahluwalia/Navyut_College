# API Testing

Test your endpoints using these examples:

## Test Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "password": "password123"
  }'
```

## Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Or use PowerShell:

### Register
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -ContentType "application/json" -Body '{"name":"John Doe","email":"john@example.com","phoneNumber":"9876543210","password":"password123"}'
```

### Login
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"john@example.com","password":"password123"}'
```

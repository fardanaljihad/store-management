# User API Spec

## Login User

Endpoint: POST /api/users/login

Request Body:
```json
{
    "username": "test-user",
    "password": "password"
}
```

Response Body Success:
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "unique-token"
    }
}
```

Response Body Error:
```json
{
    "success": false,
    "message": "Invalid credentials",
    "errors": "Username or password is wrong"
}
```

## Register User

Endpoint: POST /api/users

Headers:
- Authorization: token

Request Body:
```json
{
    "username": "test-user",
    "password": "secret123",
    "role": "MANAGER"
}
```

Response Body Success:
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "username": "test-user",
        "role": "CASHIER"
    }
}
```

Response Body Error:
```json
{
    "success": false,
    "message": "Validation error",
    "errors": "Username already exists"
}
```

## Get All Users

Endpoint: GET /api/users

Headers:
- Authorization: token

Query Params:
- `page` (default: 1)
- `limit` (default: 1)
- `role` (optional)

Response Body Success:
```json
{
    "success": true,
    "message": "Users fetched successfully",
    "data": [
        {
            "username": "johndoe",
            "role": "CASHIER",
            "contact": {
                "first_name": "John",
                "last_name": "Doe",
                "email": "johndoe@example.com",
                "phone": "081234567890"
            }
        },
        {
            "username": "alice",
            "role": "MANAGER",
            "contact": {
                "first_name": "Alice",
                "last_name": "Smith",
                "email": "alice@example.com",
                "phone": "081298765432"
            }
        }
    ],
    "pagination": {
        "total": 2,
        "page": 1,
        "limit": 10
    }
}
```

Response Body Error:
```json
{
    "success": false,
    "message": "Access denied",
    "errors": "Unauthorized"
}
```

## Get User by Username

Endpoint: GET /api/users/{username}

Headers:
- Authorization: token

Response Body Success:
```json
{
    "success": true,
    "message": "User fetched successfully",
    "data": {
        "username": "johndoe",
        "role": "CASHIER",
        "contact": {
            "first_name": "John",
            "last_name": "Doe",
            "email": "johndoe@example.com",
            "phone": "081234567890"
        }
    }
}
```

Response Body Error:
```json
{
    "success": false,
    "message": "Access denied",
    "errors": "Unauthorized"
}
```

## Update User

Endpoint: PATCH /api/users/{username}

Headers:
- Authorization: token

Request Body:
```json
{
    "password": "secret123", // optional
    "role": "MANAGER" // optional
}
```

Response Body Success:
```json
{
    "success": true,
    "message": "User updated successfully",
    "data": {
        "username": "test-user",
        "role": "MANAGER"
    }
}
```

Response Body Error:
```json
{
    "success": false,
    "message": "Validation error",
    "errors": "Password length max 100"
}
```

## Update User

Endpoint: DELETE /api/users/{username}

Headers:
- Authorization: token

Response Body Success:
```json
{
    "success": true,
    "message": "User deleted successfully",
    "data": {
        "username": "test-user",
        "role": "MANAGER"
    }
}
```

Response Body Error:
```json
{
    "success": false,
    "message": "Access denied",
    "errors": "Unauthorized"
}
```

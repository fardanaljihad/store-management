# Contact API Spec

## Create Contact

**Endpoint:** `POST /api/contacts`

**Headers:**
- Authorization: token

**Request Body:**
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@example.com",
    "phone": "081234567890",
    "username": "johndoe"
}
```

**Response Body Success:**
```json
{
    "success": true,
    "message": "Contact created successfully",
    "data": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "johndoe@example.com",
        "phone": "081234567890",
        "username": "johndoe"
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Validation error",
    "errors": "Email already exists"
}
```

---

## Get All Contacts

**Endpoint:** `GET /api/contacts`

**Headers:**
- Authorization: token

**Query Params:**
- `page` (default: 1)
- `limit` (default: 10)

**Response Body Success:**
```json
{
    "success": true,
    "message": "Contacts fetched successfully",
    "data": [
        {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "email": "johndoe@example.com",
            "phone": "081234567890",
            "username": "johndoe"
        },
        {
            "id": 2,
            "first_name": "Alice",
            "last_name": "Smith",
            "email": "alice@example.com",
            "phone": "081298765432",
            "username": "alice"
        }
    ],
    "pagination": {
        "total": 2,
        "page": 1,
        "limit": 10
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Access denied",
    "errors": "Unauthorized"
}
```

---

## Get Contact by Username

**Endpoint:** `GET /api/contacts/{username}`

**Headers:**
- Authorization: token

**Response Body Success:**
```json
{
    "success": true,
    "message": "Contact fetched successfully",
    "data": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "johndoe@example.com",
        "phone": "081234567890",
        "username": "johndoe"
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Contact not found",
    "errors": "No contact with username johndoe"
}
```

---

## Update Contact

**Endpoint:** `PATCH /api/contacts/{username}`

**Headers:**
- Authorization: token

**Request Body:**
```json
{
    "first_name": "Jonathan", // optional
    "last_name": "Doe", // optional
    "email": "jonathan.doe@example.com", // optional
    "phone": "081111111111" // optional
}
```

**Response Body Success:**
```json
{
    "success": true,
    "message": "Contact updated successfully",
    "data": {
        "id": 1,
        "first_name": "Jonathan",
        "last_name": "Doe",
        "email": "jonathan.doe@example.com",
        "phone": "081111111111",
        "username": "johndoe"
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Validation error",
    "errors": "Email format is invalid"
}
```

---

## Delete Contact

**Endpoint:** `DELETE /api/contacts/{username}`

**Headers:**
- Authorization: token

**Response Body Success:**
```json
{
    "success": true,
    "message": "Contact deleted successfully",
    "data": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "johndoe@example.com",
        "phone": "081234567890",
        "username": "johndoe"
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Access denied",
    "errors": "Unauthorized"
}
```

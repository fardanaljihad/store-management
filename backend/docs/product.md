# Product API Spec

## Create Product

**Endpoint:** `POST /api/products`

**Headers:**
- Authorization: token

**Request Body:**
```json
{
    "name": "Indomie Goreng",
    "price": 3500,
    "stock": 100,
    "category_id": 1
}
```

**Response Body Success:**
```json
{
    "success": true,
    "message": "Product created successfully",
    "data": {
        "id": 1,
        "name": "Indomie Goreng",
        "price": 3500,
        "stock": 100,
        "category": {
            "id": 1,
            "name": "Makanan"
        },
        "created_at": "2025-09-22T10:00:00.000Z",
        "updated_at": null
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Validation error",
    "errors": "Category does not exist"
}
```

---

## Get All Products

**Endpoint:** `GET /api/products`

**Headers:**
- Authorization: token

**Query Params:**
- `page` (default: 1)
- `limit` (default: 10)
- `category_id` (optional)
- `name` (optional)

**Response Body Success:**
```json
{
    "success": true,
    "message": "Products fetched successfully",
    "data": [
        {
            "id": 1,
            "name": "Indomie Goreng",
            "price": 3500,
            "stock": 100,
            "category": {
                "id": 1,
                "name": "Makanan"
            }
        },
        {
            "id": 2,
            "name": "Teh Botol Sosro",
            "price": 5000,
            "stock": 50,
            "category": {
                "id": 2,
                "name": "Minuman"
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

**Response Body Error:**
```json
{
    "success": false,
    "errors": "Unauthorized"
}
```

---

## Get Product by ID

**Endpoint:** `GET /api/products/{id}`

**Headers:**
- Authorization: token

**Response Body Success:**
```json
{
    "success": true,
    "message": "Product fetched successfully",
    "data": {
        "id": 1,
        "name": "Indomie Goreng",
        "price": 3500,
        "stock": 100,
        "category": {
            "id": 1,
            "name": "Makanan"
        },
        "created_at": "2025-09-22T10:00:00.000Z",
        "updated_at": null
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Product not found",
    "errors": "No product with id 1"
}
```

---

## Update Product

**Endpoint:** `PATCH /api/products/{id}`

**Headers:**
- Authorization: token

**Request Body:**
```json
{
    "name": "Indomie Goreng Spesial", // optional
    "price": 4000, // optional
    "stock": 120, // optional
    "category_id": 1 // optional
}
```

**Response Body Success:**
```json
{
    "success": true,
    "message": "Product updated successfully",
    "data": {
        "id": 1,
        "name": "Indomie Goreng Spesial",
        "price": 4000,
        "stock": 120,
        "category": {
            "id": 1,
            "name": "Makanan"
        },
        "created_at": "2025-09-22T10:00:00.000Z",
        "updated_at": "2025-09-22T12:00:00.000Z"
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Validation error",
    "errors": "Price must be greater than 0"
}
```

---

## Delete Product

**Endpoint:** `DELETE /api/products/{id}`

**Headers:**
- Authorization: token

**Response Body Success:**
```json
{
    "success": true,
    "message": "Product deleted successfully",
    "data": {
        "id": 1,
        "name": "Indomie Goreng",
        "price": 3500,
        "stock": 100,
        "category": {
            "id": 1,
            "name": "Makanan"
        },
        "created_at": "2025-09-22T10:00:00.000Z",
        "updated_at": null
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

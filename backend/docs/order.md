# Order API Spec

## Create Order

**Endpoint:** `POST /api/users/:username/orders`

**Headers:**
- Authorization: token

**Request Body:**
```json
{
    "username": "johndoe",
    "order_line_items": [
        {
            "product_id": 1,
            "quantity": 2,
            "price": 3500
        },
        {
            "product_id": 2,
            "quantity": 1,
            "price": 5000
        }
    ]
}
```

**Response Body Success:**
```json
{
    "success": true,
    "message": "Order created successfully",
    "data": {
        "id": 1,
        "username": "johndoe",
        "created_at": "2025-09-22T10:00:00.000Z",
        "updated_at": null,
        "order_line_items": [
            {
                "id": 1,
                "product": {
                    "id": 1,
                    "name": "Indomie Goreng",
                    "price": 3500
                },
                "quantity": 2,
                "subtotal": 7000
            },
            {
                "id": 2,
                "product": {
                    "id": 2,
                    "name": "Teh Botol Sosro",
                    "price": 5000
                },
                "quantity": 1,
                "subtotal": 5000
            }
        ],
        "total": 12000
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "errors": "[product_name] does not have enough stock for [quantity]"
}
```

---

## Get All Orders

**Endpoint:** `GET /api/orders`

**Headers:**
- Authorization: token

**Query Params:**
- `page` (default: 1)
- `limit` (default: 10)
- `username` (optional)

**Response Body Success:**
```json
{
    "success": true,
    "message": "Orders fetched successfully",
    "data": [
        {
            "id": 1,
            "username": "johndoe",
            "created_at": "2025-09-22T10:00:00.000Z",
            "updated_at": null,
            "_count.order_line_items": 3,
            "total": 12000
        }
    ],
    "pagination": {
        "total": 1,
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

## Get Order by ID

**Endpoint:** `GET /api/orders/{id}`

**Headers:**
- Authorization: token

**Response Body Success:**
```json
{
    "success": true,
    "message": "Order fetched successfully",
    "data": {
        "id": 1,
        "username": "johndoe",
        "created_at": "2025-09-22T10:00:00.000Z",
        "updated_at": null,
        "order_line_items": [
            {
                "id": 1,
                "product": {
                    "id": 1,
                    "name": "Indomie Goreng",
                    "price": 3500
                },
                "quantity": 2,
                "subtotal": 7000
            },
            {
                "id": 2,
                "product": {
                    "id": 2,
                    "name": "Teh Botol Sosro",
                    "price": 5000
                },
                "quantity": 1,
                "subtotal": 5000
            }
        ],
        "total": 12000
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Order not found",
    "errors": "No order with id 1"
}
```

---

## Update Order

**Endpoint:** `PATCH /api/orders/{id}`

**Headers:**
- Authorization: token

**Request Body:**
```json
{
    "total": 7000
}
```

**Response Body Success:**
```json
{
    "success": true,
    "message": "Order updated successfully",
    "data": {
        "id": 1,
        "total": "7000",
        "updated_at": "2025-09-26T12:37:00.985Z"
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Validation error",
    "errors": "Invalid product id"
}
```

---

## Delete Order

**Endpoint:** `DELETE /api/orders/{id}`

**Headers:**
- Authorization: token

**Response Body Success:**
```json
{
    "success": true,
    "message": "Order deleted successfully",
    "data": {
        "id": 1,
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

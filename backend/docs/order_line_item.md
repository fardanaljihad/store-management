# Order Line Item API Spec

## Create Order Line Item

**Endpoint:** `POST /api/order-line-items`

**Headers:**
- Authorization: token

**Request Body:**
```json
{
    "order_id": 1,
    "product_id": 1,
    "quantity": 2
}
```

**Response Body Success:**
```json
{
    "success": true,
    "message": "Order line item created successfully",
    "data": {
        "id": 1,
        "order_id": 1,
        "product": {
            "id": 1,
            "name": "Indomie Goreng",
            "price": 3500
        },
        "quantity": 2,
        "subtotal": 7000
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Validation error",
    "errors": "Product stock is not enough"
}
```

---

## Get All Order Line Items

**Endpoint:** `GET /api/order-line-items`

**Headers:**
- Authorization: token

**Query Params:**
- `page` (default: 1)
- `limit` (default: 10)
- `order_id` (optional)

**Response Body Success:**
```json
{
    "success": true,
    "message": "Order line items fetched successfully",
    "data": [
        {
            "id": 1,
            "order_id": 1,
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
            "order_id": 1,
            "product": {
                "id": 2,
                "name": "Teh Botol Sosro",
                "price": 5000
            },
            "quantity": 1,
            "subtotal": 5000
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

## Get Order Line Item by ID

**Endpoint:** `GET /api/order-line-items/{id}`

**Headers:**
- Authorization: token

**Response Body Success:**
```json
{
    "success": true,
    "message": "Order line item fetched successfully",
    "data": {
        "id": 1,
        "order_id": 1,
        "product": {
            "id": 1,
            "name": "Indomie Goreng",
            "price": 3500
        },
        "quantity": 2,
        "subtotal": 7000
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Order line item not found",
    "errors": "No order line item with id 1"
}
```

---

## Update Order Line Item

**Endpoint:** `PATCH /api/order-line-items/{id}`

**Headers:**
- Authorization: token

**Request Body:**
```json
{
    "quantity": 3
}
```

**Response Body Success:**
```json
{
    "success": true,
    "message": "Order line item updated successfully",
    "data": {
        "id": 1,
        "order_id": 1,
        "product": {
            "id": 1,
            "name": "Indomie Goreng",
            "price": 3500
        },
        "quantity": 3,
        "subtotal": 10500
    }
}
```

**Response Body Error:**
```json
{
    "success": false,
    "message": "Validation error",
    "errors": "Invalid quantity"
}
```

---

## Delete Order Line Item

**Endpoint:** `DELETE /api/order-line-items/{id}`

**Headers:**
- Authorization: token

**Response Body Success:**
```json
{
    "success": true,
    "message": "Order line item deleted successfully",
    "data": {
        "id": 1,
        "order_id": 1,
        "product": {
            "id": 1,
            "name": "Indomie Goreng",
            "price": 3500
        },
        "quantity": 2,
        "subtotal": 7000
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

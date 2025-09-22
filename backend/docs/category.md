# Category API Spec

## Create Category

Endpoint: **POST** `/api/categories`

Headers:
- Authorization: token

Request Body:
```json
{
  "name": "Beverages"
}
```

Response Body Success:
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 1,
    "name": "Beverages"
  }
}
```

Response Body Error:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": "Category name already exists"
}
```

---

## Get All Categories

Endpoint: **GET** `/api/categories`

Headers:
- Authorization: token

Query Params:
- `page` (default: 1)
- `limit` (default: 10)

Response Body Success:
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Beverages"
    },
    {
      "id": 2,
      "name": "Snacks"
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

---

## Get Category by ID

Endpoint: **GET** `/api/categories/{id}`

Headers:
- Authorization: token

Response Body Success:
```json
{
  "success": true,
  "message": "Category fetched successfully",
  "data": {
    "id": 1,
    "name": "Beverages"
  }
}
```

Response Body Error:
```json
{
  "success": false,
  "message": "Not found",
  "errors": "Category with ID 1 not found"
}
```

---

## Update Category

Endpoint: **PATCH** `/api/categories/{id}`

Headers:
- Authorization: token

Request Body:
```json
{
  "name": "Drinks",
}
```

Response Body Success:
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "name": "Drinks"
  }
}
```

Response Body Error:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": "Category name already exists"
}
```

---

## Delete Category

Endpoint: **DELETE** `/api/categories/{id}`

Headers:
- Authorization: token

Response Body Success:
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "id": 1,
    "name": "Beverages"
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

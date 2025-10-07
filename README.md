# Store Management (POS System)

A full-stack application for managing store operations: products, categories, orders/sales, users, and contacts.

This repository includes the backend (ExpressJS) and frontend (ReactJS) modules of the project.

The backend uses **JWT (JSON Web Token)** for secure authentication and authorization.

The REST API has been thoroughly tested using **Jest**, and its documentation is available [here](https://github.com/fardanaljihad/store-management/tree/main/backend/docs).

## Prerequisites
1. Node.js v22.12.0
2. Node Package Manager v10.9.0
3. MySQL v8.0


## 🚀 How to Run Application

### 1. Clone the Repository

```bash
git clone https://github.com/fardanaljihad/store-management.git
cd store-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy the provided `.env.example` file, rename it to `.env`, and update it with the necessary configuration values.

```bash
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=secret # Or run -> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_EXPIRES_IN=12h
```

Run Prisma migrations.
```bash
npx prisma migrate dev
```

Start the backend server.
```bash
node src/main.js
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Copy the example environment file, rename it to `.env`, and fill in the required values.
```bash
VITE_API_PATH=http://example:port/api
```

Start the frontend application.
```bash
npm run dev
```

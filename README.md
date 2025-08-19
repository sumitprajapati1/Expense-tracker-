
# Expense tracker

An easy-to-use Expense Tracker built with React (Frontend) and Node.js + Express + MongoDB (Backend).
This app allows users to manage their expenses, categorize them, and view summaries month-wise.


## Installation

Install backend and run 

```bash
  cd server
  npm install
  node server.js 
```


Install frontend and run 

```bash
  cd server
  npm install
  npm run dev 
```
    

## .env file need to be add in backend 

MONGO_URI=  (MONGODB_URL)
PORT=5000
JWT_SECRET= (jwt secrekt key )



## Authentication APIs (`/api/auth`)

### 1) Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2) Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3) Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/user \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

---

## Expense APIs (`/api/expenses`)

Note: All expense endpoints require the header `Authorization: Bearer YOUR_JWT_TOKEN`.

### 4) Add Expense
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "amount": 150.5,
    "category": "Food",
    "date": "2024-01-15",
    "description": "Lunch at restaurant"
  }'
```

### 5) Get Monthly Expenses
```bash
curl -X GET "http://localhost:5000/api/expenses?month=2024-01" \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

### 6) Get Category Summary (Monthly)
```bash
curl -X GET "http://localhost:5000/api/expenses/summary?month=2024-01" \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

### 7) Update Expense
```bash
curl -X PUT http://localhost:5000/api/expenses/EXPENSE_ID \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN"" \
  -d '{
    "amount": 200.0,
    "description": "Updated lunch expense"
  }'
```

### 8) Delete Expense
```bash
curl -X DELETE http://localhost:5000/api/expenses/EXPENSE_ID \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

### 9) Export Monthly Expenses (download JSON)
```bash
curl -X GET "http://localhost:5000/api/expenses/export?month=2024-01" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -o expenses-2024-01.json
```

---

## Usage Notes
- Month format: `YYYY-MM` (e.g., `2024-01`).
- Date format: `YYYY-MM-DD`.
- Replace `YOUR_JWT_TOKEN` with the token returned by Login.
- Replace `EXPENSE_ID` with a real ID from your expenses list.
- For Postman, set a `jwt_token` variable and use `Authorization: Bearer {{jwt_token}}`.

# NEXIS TECH — Backend API

Express.js + MongoDB backend for the NEXIS TECH e-commerce store (CodeAlpha Task 1).

## What this covers (Task 1 requirements)

- ✅ Backend: Express.js (Node.js)
- ✅ Database: MongoDB (via Mongoose) — products, users, orders
- ✅ User registration/login — passwords hashed with bcrypt, sessions via JWT
- ✅ Order processing — orders saved to the database, prices verified server-side
- ✅ Product details — GET single product by ID

## 1. Install dependencies

```
npm install
```

## 2. Set up MongoDB

**Option A — Local MongoDB** (if you install MongoDB Community Server on your PC)
Leave `MONGO_URI` as the default local connection string.

**Option B — MongoDB Atlas (free cloud database, easier, no install)**
1. Go to https://www.mongodb.com/cloud/atlas and create a free account
2. Create a free (M0) cluster
3. Under "Database Access," create a user with a password
4. Under "Network Access," allow access from your IP (or 0.0.0.0/0 for testing)
5. Click "Connect" → "Drivers" and copy your connection string

## 3. Configure environment variables

Copy `.env.example` to a new file named `.env`, then fill in:
- `MONGO_URI` — your local or Atlas connection string
- `JWT_SECRET` — any long random string (used to sign login tokens)

**Never commit your real `.env` file to GitHub** — add it to `.gitignore`.

## 4. Seed the products collection

This fills your database with the same products your frontend already shows:

```
npm run seed
```

## 5. Run the server

```
npm run dev
```

Server runs at `http://localhost:5000`. You should see:
```
MongoDB connected successfully
Server running on http://localhost:5000
```

## API Endpoints

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| GET | `/api/products` | No | Get all products |
| GET | `/api/products/:id` | No | Get one product by ID |
| POST | `/api/auth/register` | No | Create account — body: `{ name, email, password }` |
| POST | `/api/auth/login` | No | Login — body: `{ email, password }` |
| POST | `/api/orders` | Yes | Place an order — body: `{ items, shipping, paymentMethod }` |
| GET | `/api/orders/my-orders` | Yes | Get logged-in user's past orders |

**"Auth required" routes** need this header on the request:
```
Authorization: Bearer <token>
```
The token comes back from `/api/auth/register` or `/api/auth/login`.

## Folder structure

```
nexis-backend/
├── config/db.js           MongoDB connection
├── models/                 Mongoose schemas (Product, User, Order)
├── controllers/             Route logic
├── routes/                  API route definitions
├── middleware/authMiddleware.js   JWT verification
├── server.js                 App entry point
├── seed.js                   Populates products collection
└── .env.example               Copy to .env and fill in your values
```

## Next step: connect this to your frontend

Right now your frontend (`script.js`, `checkout.js`, `auth.js`) still uses `localStorage`
for products, cart, and login. The next step is to replace those parts with real
`fetch()` calls to this API — e.g. instead of a hardcoded `products` array, fetch
from `http://localhost:5000/api/products`. Ask Claude to help wire that up next.

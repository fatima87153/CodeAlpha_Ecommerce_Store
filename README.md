NEXIS TECH — Full Stack E-Commerce Store

A complete e-commerce web application built as Task 1 for the CodeAlpha Full Stack Development Internship. Includes product browsing, cart, user authentication, and order processing — backed by a real Express.js + MongoDB API.

🚀 Live Demo

(Add your deployed link here if/when you deploy — otherwise remove this section)

📸 Features


Product listing with dynamic grid (fetched from MongoDB, not hardcoded)
Individual product details page with quantity selector
Shopping cart (add, remove, update quantity) — persists across page refresh
User registration & login with hashed passwords (bcrypt) and JWT-based sessions
Full checkout flow with shipping form, validation, and order confirmation page
Orders saved permanently in MongoDB, with server-side price verification (prevents price tampering from the browser)
Fully responsive design across desktop, tablet, and mobile
About, Products, and Find Us pages with consistent navigation and cart access


🛠 Tech Stack

Frontend: HTML5, CSS3, Vanilla JavaScript (no framework — DOM built dynamically from API data)

Backend: Node.js, Express.js

Database: MongoDB (via Mongoose), hosted on MongoDB Atlas

Auth: bcryptjs (password hashing) + JSON Web Tokens (JWT)

🧠 Technical Concepts Implemented


RESTful API design — separate routes/controllers for products, auth, and orders
JWT authentication — stateless login sessions verified via middleware (authMiddleware.js) on protected routes
Password security — passwords are never stored in plain text; hashed with bcrypt before saving
Server-side price verification — order totals are recalculated from the database on the backend, not trusted from the frontend, to prevent tampering
MongoDB schema design — Product, User, and Order models with Mongoose, including referenced relationships (Order → User, Order items → Product)
Client-server separation — frontend and backend are fully decoupled, communicating only via fetch() calls to a REST API
Environment-based configuration — sensitive values (DB connection string, JWT secret) kept out of source control via .env + .gitignore


📁 Project Structure

CodeAlpha_Ecommerce_Store/
├── nexis-frontend/          Frontend (HTML/CSS/JS)
│   ├── index.html, products.html, about.html, find-us.html
│   ├── checkout.html, order-confirmation.html
│   ├── login.html, signup.html, product-details.html
│   ├── script.js, auth.js, checkout.js, product-details.js
│   └── style.css
│
├── nexis-backend/            Backend (Express + MongoDB)
│   ├── config/db.js               MongoDB connection
│   ├── models/                     Product, User, Order schemas
│   ├── controllers/                 Route logic
│   ├── routes/                       API endpoints
│   ├── middleware/authMiddleware.js  JWT verification
│   ├── server.js                      App entry point
│   └── seed.js                         Populates sample products
│
└── .gitignore

▶ How to Run This Project

Prerequisites


Node.js installed (v18+ recommended)
A free MongoDB Atlas account (or local MongoDB)


1. Clone the repository

git clone https://github.com/fatima87153/CodeAlpha_Ecommerce_Store.git
cd CodeAlpha_Ecommerce_Store

2. Set up the backend

cd nexis-backend
npm install

Create a .env file in nexis-backend (copy .env.example and fill in your own values):

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
PORT=5000

Seed the database with sample products:

npm run seed

Start the backend server:

npm run dev

Server runs at http://localhost:5000. Confirm it works by visiting http://localhost:5000/api/products in your browser — you should see JSON product data.

3. Run the frontend

No build step needed — it's plain HTML/CSS/JS.


Open nexis-frontend/index.html directly in your browser, or
Use VS Code's "Live Server" extension for the smoothest experience (right-click index.html → "Open with Live Server")


Make sure the backend is running first — the frontend fetches live data from http://localhost:5000/api/....

4. Try it out


Browse products on the home page
Click a product to view its details page
Sign up for an account
Add items to your cart
Go to checkout, fill in shipping details, and place an order
See your order confirmation page


🔒 Note on Security

This is a learning/internship project. The JWT secret and database credentials in .env are excluded from this repository via .gitignore for security — you'll need to generate your own when running it locally.

👩‍💻 Author

Ghulam Fatima — Computer Engineering Technology student, IIUI
Built as part of the CodeAlpha Full Stack Development Internship.
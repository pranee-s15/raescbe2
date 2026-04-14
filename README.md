# Raes Boutique

Luxury boutique e-commerce platform built with React, Tailwind CSS, Express, and MongoDB.

## 1. Folder Structure

```text
raescbe/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- data/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   `-- utils/
|   |-- .env.example
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |   |-- admin/
|   |   |   |-- layout/
|   |   |   `-- shared/
|   |   |-- context/
|   |   |-- data/
|   |   |-- hooks/
|   |   `-- pages/
|   |       `-- admin/
|   |-- .env.example
|   `-- package.json
|-- package.json
`-- README.md
```

## 2. Backend

- Express.js API with MongoDB and Mongoose
- JWT user authentication
- bcrypt password hashing
- Role-based admin protection
- Auto-created demo admin on boot
- Seeded sample products for first launch
- Product CRUD, order APIs, wishlist API, analytics API, and CSV bulk upload

## 3. Frontend

- React + Vite + Tailwind CSS
- Luxury boutique responsive storefront
- Sticky offer banner and scroll-reactive navbar
- Home, Collections, Product, Services, Contact, Cart, Wishlist, Checkout, and Order Confirmation pages
- Hidden `/admin-login` route and admin dashboard
- Local cart persistence and backend-backed auth

## 4. Integration

- Frontend calls the backend through `VITE_API_URL`
- Backend allows the frontend origin through `CLIENT_URL`
- Admin routes are protected with JWT plus `role === "admin"`

## 5. Run Instructions

1. Copy the environment templates:
   - `backend/.env.example` -> `backend/.env`
   - `frontend/.env.example` -> `frontend/.env`
2. Set `MONGO_URI` in `backend/.env`
3. Start MongoDB locally or use a cloud connection string
4. Install dependencies:
   - `npm install`
   - `npm --prefix backend install`
   - `npm --prefix frontend install`
5. Start both apps:
   - `npm run dev`
6. Frontend:
   - `http://localhost:5173`
7. Backend:
   - `http://localhost:5000`

## Demo Admin Credentials

- Email: `admin@raesboutique.com`
- Password: `Admin@123`

The backend automatically creates this admin account on server startup if it does not already exist.
